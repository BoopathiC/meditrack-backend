import express from 'express';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    const { name, specialty, contact, availability } = req.body;
    if (!name || !specialty || !contact || !availability) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const saved = await new Doctor(req.body).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  const doctors = await Doctor.find().sort({ createdAt: -1 });
  res.json(doctors);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const updated = await Doctor.findByIdAndUpdate(
    req.params.id, req.body, { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Doctor deleted' });
});

export default router;
