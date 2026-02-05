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

// API disponibilità per una data
router.get('/availability', async (req, res) => {
  try {
    const date = req.query.date;
    if (!date) {
      return res.status(400).json({ error: 'Missing date parameter' });
    }
    // Recupera tutte le prenotazioni per la data
    const bookings = await Booking.getAll();
    let tablesBooked = 0;
    let chairsBooked = 0;
    bookings.forEach(b => {
      if (b.booking_date === date) {
        tablesBooked += Number(b.tables_count) || 0;
        chairsBooked += Number(b.chairs_count) || 0;
      }
    });
    // Configurazione massimali
    const TABLES_TOTAL = 110;
    const CHAIRS_TOTAL = 65;
    res.json({
      date,
      tables: {
        total: TABLES_TOTAL,
        booked: tablesBooked,
        available: Math.max(0, TABLES_TOTAL - tablesBooked)
      },
      chairs: {
        total: CHAIRS_TOTAL,
        booked: chairsBooked,
        available: Math.max(0, CHAIRS_TOTAL - chairsBooked)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
