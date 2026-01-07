import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Button,
  Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';

import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const Dashboard = () => {
  const today = new Date().toLocaleDateString();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [showAllSessions, setShowAllSessions] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docRes, patRes, appRes, schRes] = await Promise.all([
        fetch('http://localhost:5000/api/doctors'),
        fetch('http://localhost:5000/api/patients'),
        fetch('http://localhost:5000/api/appointments'),
        fetch('http://localhost:5000/api/schedules')
      ]);
      setDoctors(await docRes.json());
      setPatients(await patRes.json());
      setAppointments(await appRes.json());
      setSchedules(await schRes.json());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  const sessionCount = {};
  schedules.forEach(s => {
    const type = s.sessionDetails?.status || 'Other';
    sessionCount[type] = (sessionCount[type] || 0) + 1;
  });

  const pieData = Object.keys(sessionCount).map(key => ({
    name: key,
    value: sessionCount[key]
  }));

  const doctorStats = {};
  schedules.forEach(s => {
    const doctor = s.doctor;
    const status = s.sessionDetails?.status || 'Other';

    if (!doctorStats[doctor]) {
      doctorStats[doctor] = { name: doctor, Pending: 0, Completed: 0 };
    }
    if (status === 'Pending') doctorStats[doctor].Pending++;
    if (status === 'Completed') doctorStats[doctor].Completed++;
  });

  const barData = Object.values(doctorStats);

  const COLORS = ['#FF6347', '#3CB371', '#FFD700', '#4682B4'];

  return (
    <Box sx={{ marginLeft: '250px', p: 3, backgroundColor: 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', width: '60%' }}>
          <TextField placeholder="Search doctor" size="small" fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <Button variant="contained" sx={{ ml: 2 }}>
            Search
          </Button>
        </Box>

        <Box textAlign="center">
          <Typography variant="h6">Today's Date</Typography>
          <Typography>{today} <CalendarTodayIcon /></Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <StatusCard icon={<LocalHospitalIcon />} title="Doctors" value={doctors.length} />
        <StatusCard icon={<PeopleIcon />} title="Patients" value={patients.length} />
        <StatusCard icon={<EventAvailableIcon />} title="New Bookings" value={schedules.length} />
        <StatusCard icon={<ScheduleIcon />} title="Appointments" value={appointments.length} />
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="primary">Appointments</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments
                  .slice(0, showAllAppointments ? appointments.length : 5)
                  .map(app => (
                    <TableRow key={app._id}>
                      <TableCell>{app.patientName}</TableCell>
                      <TableCell>{app.doctor}</TableCell>
                      <TableCell>{app.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={() => setShowAllAppointments(!showAllAppointments)}>
            {showAllAppointments ? 'Show Less' : 'Show All'}
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="primary">Schedules</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules
                  .slice(0, showAllSessions ? schedules.length : 5)
                  .map(s => (
                    <TableRow key={s._id}>
                      <TableCell>{s.doctor}</TableCell>
                      <TableCell>{s.sessionDetails?.date}</TableCell>
                      <TableCell>{s.sessionDetails?.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={() => setShowAllSessions(!showAllSessions)}>
            {showAllSessions ? 'Show Less' : 'Show All'}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Session Status</Typography>
          <ResponsiveContainer height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6">Doctor Workload</Typography>
          <ResponsiveContainer height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pending" fill="#FF9800" />
              <Bar dataKey="Completed" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

const StatusCard = ({ icon, title, value }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center">
          {icon}
          <Typography variant="h6" ml={1}>{title}</Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default Dashboard;
