require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'metro.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 23383,  // ✅ Railway port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Test connection
pool.getConnection()
  .then(() => console.log('✅ Connected to Railway MySQL'))
  .catch((err) => console.error('❌ DB connection failed:', err.message));

module.exports = pool;
