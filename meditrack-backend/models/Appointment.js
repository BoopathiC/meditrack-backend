import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: { type: String, required: true },
  doctor: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled'], 
    default: 'Pending',
    required: true 
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
