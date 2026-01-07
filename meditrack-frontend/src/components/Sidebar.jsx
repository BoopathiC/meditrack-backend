import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, Box, Typography, Avatar, Button, ListItemIcon } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/admin/doctors' },
    { text: 'Schedule', icon: <ScheduleIcon />, path: '/admin/schedule' },
    { text: 'Appointments', icon: <CalendarTodayIcon />, path: '/admin/appointments' },
    { text: 'Patients', icon: <PeopleIcon />, path: '/admin/patients' },
  ];

  return (
    <Box sx={{ width: 250, background: '#f0f0f0', height: '100vh', position: 'fixed', top: 0, left: 0, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <Avatar sx={{ width: 56, height: 56 }}>
          <AccountCircleIcon sx={{ width: '100%', height: '100%' }} />
        </Avatar>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Administrator
        </Typography>
        <Typography variant="body2" color="textSecondary">
          admin@example.com
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogout}>
          Logout
        </Button>
        <hr style={{ width: '100%', marginTop: '20px' }} />
      </Box>

      <List component="nav" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{ backgroundColor: location.pathname === item.path ? '#e0e0e0' : 'inherit', '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ marginTop: 'auto', padding: '20px', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '30px' }}>
          <span style={{ color: '#1976d2' }}>M</span> 
          <span style={{ color: 'primary.main' }}>ed</span>
          <span style={{ color: '#1976d2' }}>T</span> 
          <span style={{ color: 'primary.main' }}>rack</span> 
          <i className="fa-solid fa-heart-pulse" style={{ marginLeft: '10px', fontSize: '30px', color: '#1976d2' }}></i>
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
