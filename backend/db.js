require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.host || 'metro.proxy.rlwy.net',
  port: process.env.port || 44571, // ✅ Railway port
  user: process.env.user || 'root',
  password: process.env.password || '',
  database: process.env.database || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Test connection
pool.getConnection()
  .then(() => console.log('✅ Connected to Railway MySQL'))
  .catch((err) => console.error('❌ DB connection failed:', err.message));

module.exports = pool;
