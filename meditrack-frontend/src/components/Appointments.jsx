import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, IconButton, Modal, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const appointmentTypes = [
  'Consultation',
  'Follow-up',
  'Routine Check-up',
  'Emergency',
  'Surgery',
  'Therapy',
  'Other'
];

const statusOptions = ['Pending', 'Confirmed', 'Cancelled'];

const Appointments = () => {
  const today = new Date().toLocaleDateString();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    type: '',
    status: 'Pending'
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/appointments')
      .then(response => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      });
  }, []);

const filteredAppointments = appointments.filter(appointment =>
  (
    appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor?.toLowerCase().includes(searchTerm.toLowerCase())
  ) &&
  (statusFilter === '' || appointment.status === statusFilter)
);


  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleCancelAppointment = (id) => {
    axios.delete(`http://localhost:5000/api/appointments/${id}`)
      .then(() => {
        setAppointments(appointments.filter(appointment => appointment._id !== id));
      })
      .catch(error => {
        console.error('Error canceling appointment:', error);
      });
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setNewAppointment({
      patient: '',
      doctor: '',
      date: '',
      time: '',
      type: '',
      status: 'Pending'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleAddAppointment = () => {
  axios.post('http://localhost:5000/api/appointments', {
    ...newAppointment,
    date: new Date(newAppointment.date) // ✅ FIX
  })
  .then(response => {
    setAppointments([...appointments, response.data]);
    handleCloseAddModal();
  })
  .catch(error => {
    console.error('Error adding new appointment:', error);
  });
};


  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ marginLeft: '250px', padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button variant="outlined" color="primary" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} >
          Back
        </Button>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5">Appointments</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '60%' }}>
          <TextField variant="outlined" placeholder="Search Appointments" size="small" fullWidth sx={{ mr: 2 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }} />
          <FormControl variant="outlined" size="small">
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="">All</MenuItem>
              {statusOptions.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <IconButton color="primary" onClick={handleOpenAddModal}>
            <AddIcon />
          </IconButton>
          <IconButton color="primary">
            <FilterListIcon />
          </IconButton>
          <IconButton color="primary">
            <CalendarTodayIcon />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
      <TableBody>
  {filteredAppointments.length > 0 ? (
    filteredAppointments.map((appointment) => (
      <TableRow key={appointment._id}>
        <TableCell>{appointment.patient?.name}</TableCell>
        <TableCell>{appointment.doctor}</TableCell>
        <TableCell>
          {appointment.date
            ? new Date(appointment.date).toLocaleDateString()
            : '-'}
        </TableCell>
        <TableCell>{appointment.time || '-'}</TableCell>
        <TableCell>{appointment.type || '-'}</TableCell>
        <TableCell>{appointment.status}</TableCell>
        <TableCell align="right">
          <Button onClick={() => handleViewAppointment(appointment)}>
            View
          </Button>
          <Button color="secondary"
            onClick={() => handleCancelAppointment(appointment._id)}
            sx={{ ml: 1 }}
          >
            Cancel
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} align="center">
        No appointments found
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24, borderRadius: '10px' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Appointment Details
          </Typography>
          {selectedAppointment && (
            <Box>
              <Typography><strong>Patient:</strong> {selectedAppointment.patient?.name}</Typography>
              <Typography><strong>Doctor:</strong> {selectedAppointment.doctor}</Typography>
              <Typography><strong>Date:</strong> {selectedAppointment.date}</Typography>
              <Typography><strong>Time:</strong> {selectedAppointment.time}</Typography>
              <Typography><strong>Type:</strong> {selectedAppointment.type}</Typography>
              <Typography><strong>Status:</strong> {selectedAppointment.status}</Typography>
            </Box>
          )}
        </Box>
      </Modal>

      <Modal open={addModalOpen} onClose={handleCloseAddModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24, borderRadius: '10px' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Appointment
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField label="Patient" name="patient" value={newAppointment.patient} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Doctor" name="doctor" value={newAppointment.doctor} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Date" name="date" value={newAppointment.date} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Time" name="time" value={newAppointment.time} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select name="type" value={newAppointment.type} onChange={handleInputChange} label="Type">
                {appointmentTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={newAppointment.status} onChange={handleInputChange} label="Status">
                {statusOptions.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleAddAppointment} fullWidth>
              Add Appointment
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Appointments;
