import express from 'express';
import { Schedule } from '../models/Schedule.js';

const router = express.Router();

// GET all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new schedule
router.post('/', async (req, res) => {
  try {
    const {
      number,
      patientName,
      doctor,
      sessionDetails
    } = req.body;

    if (
      !number ||
      !patientName ||
      !doctor ||
      !sessionDetails?.date ||
      !sessionDetails?.time ||
      !sessionDetails?.description
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newSchedule = new Schedule({
      number,
      patientName,
      doctor,
      sessionDetails
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// PUT (edit) an existing schedule by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a schedule by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSchedule = await Schedule.findByIdAndDelete(id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
