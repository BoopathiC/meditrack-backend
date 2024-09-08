import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  patientName: { type: String, required: true },
  doctor: { type: String, required: true },
  sessionDetails: {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  },
});

export const Schedule = mongoose.model('Schedule', scheduleSchema);
