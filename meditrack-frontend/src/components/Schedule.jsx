import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  IconButton
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate } from 'react-router-dom';

const Schedule = () => {
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  const [formData, setFormData] = useState({
    number: '',
    patientName: '',
    doctor: '',
    date: '',
    time: '',
    description: '',
    location: '',
    status: 'Pending'
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/schedules');
      const data = await res.json();
      setSchedules(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleAddSchedule = async () => {
    const payload = {
      number: Number(formData.number),
      patientName: formData.patientName,
      doctor: formData.doctor,
      sessionDetails: {
        date: formData.date,
        time: formData.time,
        description: formData.description || 'N/A',
        location: formData.location || 'N/A',
        status: formData.status
      }
    };

    try {
      const res = await fetch('http://localhost:5000/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Add failed');

      await fetchSchedules();
      setOpenAdd(false);
      resetForm();
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/schedules/${id}`, {
        method: 'DELETE'
      });
      fetchSchedules();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      number: '',
      patientName: '',
      doctor: '',
      date: '',
      time: '',
      description: '',
      location: '',
      status: 'Pending'
    });
  };

  return (
    <Box sx={{ p: 3, ml: '240px' }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h5">Schedule Manager</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Schedule
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No schedules found
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.number}</TableCell>
                  <TableCell>{s.patientName}</TableCell>
                  <TableCell>{s.doctor}</TableCell>
                  <TableCell>
                    {new Date(s.sessionDetails?.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{s.sessionDetails?.time}</TableCell>
                  <TableCell>{s.sessionDetails?.status}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(s._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
        <Box sx={{
          bgcolor: '#fff',
          p: 3,
          width: 400,
          mx: 'auto',
          mt: '10%',
          borderRadius: 2
        }}>
          <Typography variant="h6" mb={2}>
            Add Schedule
          </Typography>

          <TextField label="Number" fullWidth margin="dense"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          />
          <TextField label="Patient Name" fullWidth margin="dense"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
          />
          <TextField label="Doctor" fullWidth margin="dense"
            value={formData.doctor}
            onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
          />
          <TextField type="date" fullWidth margin="dense"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <TextField label="Time" fullWidth margin="dense"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
          <TextField label="Description" fullWidth margin="dense"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField label="Location" fullWidth margin="dense"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleAddSchedule}>
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Schedule;
