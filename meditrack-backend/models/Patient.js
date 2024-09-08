import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,  // Ensure `id` is unique if you use this field
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true  // Ensure `contactNumber` is unique
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
