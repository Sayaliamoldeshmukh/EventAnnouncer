const express = require('express');
const router = express.Router();
const pool = require('../db'); // Your DB connection

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clubs');
    
    const clubs = rows.map(row => ({
      ...row,
      achievements: (() => {
        if (!row.achievements) return [];
        try {
          const parsed = JSON.parse(row.achievements);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return row.achievements
            .split('.')
            .map(item => item.trim())
            .filter(Boolean);
        }
      })(),
    }));

    res.json(clubs);
  } catch (err) {
    console.error('Error fetching clubs:', err);
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

module.exports = router;
