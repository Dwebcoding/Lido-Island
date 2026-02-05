const db = require('../config/db.cjs');

const Booking = {
  create: (data) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`INSERT INTO bookings (customer_name, customer_email, customer_phone, booking_date, tables_count, tables_price, chairs_count, chairs_price, booking_notes, total_price, booking_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      stmt.run(
        data.customer_name,
        data.customer_email,
        data.customer_phone,
        data.booking_date,
        data.tables_count,
        data.tables_price,
        data.chairs_count,
        data.chairs_price,
        data.booking_notes,
        data.total_price,
        data.booking_id,
        function (err) {
          if (err) return reject(err);
          resolve({ ...data, id: this.lastID });
        }
      );
      stmt.finalize();
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM bookings', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};

module.exports = Booking;
