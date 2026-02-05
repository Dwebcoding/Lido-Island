// Entry point for backend server (CommonJS)
const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/booking.cjs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/prenotazioni', bookingRoutes);

// Route di default per root e favicon
app.get('/', (req, res) => {
  res.send('API Isola Lido attiva');
});
app.get('/favicon.ico', (req, res) => res.status(204).end());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Catch-all per 404
app.use((req, res, next) => {
  if (req.path === '/favicon.ico') {
    // Già gestito sopra, ma per sicurezza
    return res.status(204).end();
  }
  res.status(404).json({ error: 'Not found' });
});