// Entry point for backend server (CommonJS)
const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/booking.cjs');


const app = express();
// CORS: consenti GitHub Pages e frontend Vercel
const allowedOrigins = [
  'https://dwebcoding.github.io',
  'https://lido-island.vercel.app',
  'https://lido-island-git-main-dwebcoding.vercel.app',
  'https://lido-island-31d5k91hc-dwebcodings-projects.vercel.app'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools
    if (allowedOrigins.some(o => (typeof o === 'string' ? o === origin : o.test(origin)))) {
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