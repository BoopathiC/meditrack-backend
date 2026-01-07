import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Doctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    contact: '',
    availability: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/doctors')
      .then(response => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      });
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const handleOpenEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setNewDoctor({
      name: doctor.name,
      specialty: doctor.specialty,
      contact: doctor.contact,
      availability: doctor.availability
    });
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditModalOpen(false);
    setAddModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleAddDoctor = () => {
    axios.post('http://localhost:5000/api/doctors', newDoctor)
      .then(response => {
        setDoctors([...doctors, response.data]);
        handleCloseModal();
      })
      .catch(error => {
        console.error('Error adding new doctor:', error);
      });
  };

  const handleEditDoctor = () => {
    if (selectedDoctor) {
      axios.put(`http://localhost:5000/api/doctors/${selectedDoctor._id}`, newDoctor)
        .then(response => {
          setDoctors(doctors.map(doctor => doctor._id === selectedDoctor._id ? response.data : doctor));
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error updating doctor:', error);
        });
    }
  };

  const handleRemoveDoctor = (id) => {
    axios.delete(`http://localhost:5000/api/doctors/${id}`)
      .then(() => {
        setDoctors(doctors.filter(doctor => doctor._id !== id));
      })
      .catch(error => {
        console.error('Error removing doctor:', error);
      });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ marginLeft: '250px', padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button variant="outlined" color="primary" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5">Doctors</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <TextField variant="outlined" placeholder="Search Doctors" size="small" fullWidth  sx={{ mr: 2 }} value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary"  startIcon={<AddIcon />}
          onClick={() => setAddModalOpen(true)}
        >
          Add New Doctor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialty</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map(doctor => (
              <TableRow key={doctor._id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.specialty}</TableCell>
                <TableCell>{doctor.contact}</TableCell>
                <TableCell>{doctor.availability}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleViewDoctor(doctor)}>
                    View
                  </Button>
                  <Button variant="outlined" color="warning" onClick={() => handleOpenEditModal(doctor)} sx={{ ml: 1 }}>
                    <EditIcon />
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleRemoveDoctor(doctor._id)} sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="view-doctor-title" aria-describedby="view-doctor-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ position: 'relative', backgroundColor: 'white', borderRadius: '8px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '20px', maxWidth: '600px', width: '100%',
        }}>
          <Typography id="view-doctor-title" variant="h6" component="h2">
            Doctor Details
          </Typography>
          {selectedDoctor && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Name: {selectedDoctor.name}</Typography>
              <Typography variant="body1">Specialty: {selectedDoctor.specialty}</Typography>
              <Typography variant="body1">Contact: {selectedDoctor.contact}</Typography>
              <Typography variant="body1">Availability: {selectedDoctor.availability}</Typography>
              <Button variant="contained" color="primary" onClick={handleCloseModal} sx={{ mt: 2 }}>
                Close
              </Button>
            </Box>
          )}
        </Box>
      </Modal>

      <Modal
        open={addModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-doctor-title"
        aria-describedby="add-doctor-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          maxWidth: '600px',
          width: '100%',
        }}>
          <Typography id="add-doctor-title" variant="h6" component="h2">
            Add New Doctor
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={newDoctor.name}
              onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Specialty"
              name="specialty"
              value={newDoctor.specialty}
              onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Contact"
              name="contact"
              value={newDoctor.contact}
              onChange={(e) => setNewDoctor({ ...newDoctor, contact: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Availability"
              name="availability"
              value={newDoctor.availability}
              onChange={(e) => setNewDoctor({ ...newDoctor, availability: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDoctor}
              sx={{ mr: 2 }}
            >
              Add
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={editModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="edit-doctor-title"
        aria-describedby="edit-doctor-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          maxWidth: '600px',
          width: '100%',
        }}>
          <Typography id="edit-doctor-title" variant="h6" component="h2">
            Edit Doctor
          </Typography>
          {selectedDoctor && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Name"
                name="name"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Specialty"
                name="specialty"
                value={newDoctor.specialty}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Contact"
                name="contact"
                value={newDoctor.contact}
                onChange={(e) => setNewDoctor({ ...newDoctor, contact: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Availability"
                name="availability"
                value={newDoctor.availability}
                onChange={(e) => setNewDoctor({ ...newDoctor, availability: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditDoctor}
                sx={{ mr: 2 }}
              >
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Doctors;
