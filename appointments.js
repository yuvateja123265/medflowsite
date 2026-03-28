const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/appointments - Get appointments based on role
router.get('/', protect, async (req, res) => {
  try {
    let appointments;
    if (req.user.role === 'admin') {
      appointments = await Appointment.find().sort({ createdAt: -1 });
    } else if (req.user.role === 'doctor') {
      appointments = await Appointment.find({ doctor: req.user._id }).sort({ date: 1 });
    } else {
      appointments = await Appointment.find({ patient: req.user._id }).sort({ date: 1 });
    }
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/appointments - Book appointment
router.post('/', protect, async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      patient: req.user._id,
      patientName: req.user.name
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/appointments/:id - Update status
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/appointments/:id - Cancel appointment
router.delete('/:id', protect, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
