const express = require('express');
const router = express.Router();
const { sendBookingEmail } = require('../services/mailer.cjs');
const Booking = require('../models/booking.cjs');

router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    await sendBookingEmail(booking);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
