// Entry point for backend server (CommonJS)
const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/booking.cjs');



const app = express();
// Forza header CORS su tutte le risposte (test rapido)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://dwebcoding.github.io');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});
// CORS: deve essere il PRIMO middleware
const allowedOrigins = [
  'https://dwebcoding.github.io',
  'https://lido-island.vercel.app',
  'https://lido-island-git-main-dwebcoding.vercel.app',
  'https://lido-island-31d5k91hc-dwebcodings-projects.vercel.app',
  'https://lido-island-production.up.railway.app'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use('/api/prenotazioni', bookingRoutes);

// Route di default per root e favicon
app.get('/', (req, res) => {
  res.send('API Isola Lido attiva');
});
app.get('/favicon.ico', (req, res) => res.status(204).end());


// Export per Vercel serverless
module.exports = app;

// Catch-all per 404
app.use((req, res, next) => {
  if (req.path === '/favicon.ico') {
    // Già gestito sopra, ma per sicurezza
    return res.status(204).end();
  }
  res.status(404).json({ error: 'Not found' });
});