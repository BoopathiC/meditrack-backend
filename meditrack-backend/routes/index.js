import express from 'express';
import scheduleRoutes from './ScheduleR.js';
import appointmentRoutes from './AppointmentR.js';
import doctorRoutes from './DoctorR.js';
import patientRoutes from './PatientR.js';

const router = express.Router();

router.use('/schedules', scheduleRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);

export default router;
