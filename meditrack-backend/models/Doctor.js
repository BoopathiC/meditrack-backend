import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  availability: {
    type: String, // You can change this to an array of strings or a more complex structure if needed
    required: true,
    trim: true
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
