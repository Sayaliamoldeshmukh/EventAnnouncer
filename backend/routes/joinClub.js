const express = require('express');
const router = express.Router();
const pool = require('../db'); // ✅ correct the path if it's different

// Prevent duplicate joins by enforcing UNIQUE constraint
router.post('/', async (req, res) => {
  const { student_id, club_id } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO club_requests (student_id, club_id) VALUES (?, ?)',
      [student_id, club_id]
    );
    res.status(201).json({ message: 'Joined club successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Already joined this club' });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
});

module.exports = router;
