import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './components/AdminDashboard';
import Doctors from './components/Doctors';
import Patients from './components/Patients';
import Sidebar from './components/Sidebar';
import Schedule from './components/Schedule';
import Appointments from './components/Appointments';

const Layout = ({ children }) => {
  const location = useLocation();

  const showSidebar = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex' }}>
      {showSidebar && <Sidebar />}
      <div style={{ flex: 1, padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<Doctors />} />
        <Route path="/admin/patients" element={<Patients />} />
        <Route path="/admin/schedule" element={<Schedule />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
