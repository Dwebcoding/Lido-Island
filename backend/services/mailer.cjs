// Nodemailer mailer using CommonJS
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const templatePath = path.join(__dirname, 'template.html');
const bookingEmailTemplate = fs.readFileSync(templatePath, 'utf8');


require('dotenv').config();
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function renderTemplate(template, data) {
  let html = template;
  for (const key in data) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key] ?? '');
  }
  return html;
}

/**
 * Invia una email di prenotazione
 * @param {Object} booking - dati della prenotazione
 */
async function sendBookingEmail(booking) {
  const html = renderTemplate(bookingEmailTemplate, booking);
  const mailOptions = {
    from: 'Isola Lido <d.webcoding@gmail.com>',
    to: 'd.webcoding@gmail.com', // mail di test, da sostituire in produzione
    subject: `Nuova Prenotazione - ${booking.customer_name}`,
    html
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email inviata con successo a d.webcoding@gmail.com');
  } catch (err) {
    console.error('Errore invio email:', err);
    throw err;
  }
}

module.exports = {
  sendBookingEmail
};