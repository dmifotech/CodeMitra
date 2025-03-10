require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on load
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID', connection.threadId);
  connection.release(); // Release connection after checking
});

// Keeping the pool active
setInterval(() => {
  pool.query('SELECT 1', (err) => {
    if (err) {
      console.error('Error keeping the connection alive:', err);
    }
  });
}, 5000);

module.exports = pool;
