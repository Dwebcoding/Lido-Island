import nodemailer from 'nodemailer';
import { bookingEmailTemplate } from './template.js';

// Configurazione SMTP (modifica con i tuoi dati reali)
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 465,
  secure: true,
  auth: {
    user: 'user@example.com',
    pass: 'password'
  }
});

export async function sendBookingEmail(booking) {
  const html = bookingEmailTemplate(booking);
  await transporter.sendMail({
    from: 'Isola Lido <noreply@isolalido.it>',
    to: 'proprietario@isolalido.it',
    subject: 'Nuova prenotazione Isola Lido',
    html
  });
}
