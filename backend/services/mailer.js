const nodemailer = require('nodemailer');
const bookingEmailTemplate = require('./template.cjs');

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

async function sendBookingEmail(booking) {
  // Replace placeholders in the template with booking data
  let html = bookingEmailTemplate;
  for (const [key, value] of Object.entries(booking)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  await transporter.sendMail({
    from: 'Isola Lido <noreply@isolalido.it>',
    to: 'proprietario@isolalido.it',
    subject: 'Nuova prenotazione Isola Lido',
    html
  });
}

module.exports = { sendBookingEmail };
