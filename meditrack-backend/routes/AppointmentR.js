import express from 'express';
import Appointment from '../models/Appointment.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    const saved = await appointment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  const data = await Appointment.find().sort({ createdAt: -1 });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
