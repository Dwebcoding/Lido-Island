import express from 'express';
import { createBooking, getAllBookings } from '../models/booking.js';
import { sendBookingEmail } from '../services/mailer.js';

const router = express.Router();

// Crea prenotazione
router.post('/', async (req, res) => {
  const { nome, email, telefono, data, persone, messaggio } = req.body;
  if (!nome || !email || !data) {
    return res.status(400).json({ error: 'Dati obbligatori mancanti' });
  }
  try {
    const id = await createBooking({ nome, email, telefono, data, persone, messaggio });
    await sendBookingEmail({ nome, email, telefono, data, persone, messaggio });
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Errore server' });
  }
});

// Lista prenotazioni (admin)
router.get('/', async (req, res) => {
  try {
    const rows = await getAllBookings();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Errore server' });
  }
});

export default router;
