// Renamed to server.cjs for CommonJS compatibility
import express from 'express';
import cors from 'cors';
import { initBookingModel } from './models/booking.js';
import bookingRoutes from './routes/booking.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Inizializza DB e modelli
initBookingModel();

// Rotte API
app.use('/api/prenotazioni', bookingRoutes);

app.get('/', (req, res) => {
  res.send('Isola Lido backend API attiva');
});

app.listen(PORT, () => {
  console.log(`Isola Lido backend in ascolto su http://localhost:${PORT}`);
});
