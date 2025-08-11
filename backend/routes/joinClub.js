// const express = require('express');
// const router = express.Router();
// const pool = require('../db'); // ✅ correct the path if it's different

// // Prevent duplicate joins by enforcing UNIQUE constraint
// router.post('/', async (req, res) => {
//   const { student_id, club_id } = req.body;

//   try {
//     const [result] = await pool.query(
//       'INSERT INTO club_requests (student_id, club_id) VALUES (?, ?)',
//       [student_id, club_id]
//     );
//     res.status(201).json({ message: 'Joined club successfully' });
//   } catch (err) {
//     if (err.code === 'ER_DUP_ENTRY') {
//       res.status(400).json({ message: 'Already joined this club' });
//     } else {
//       console.error(err);
//       res.status(500).json({ message: 'Something went wrong' });
//     }
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// Student sends join request
router.post('/join-request', async (req, res) => {
  const { student_id, club_id } = req.body;

  try {
    // Check if already pending
    const [exists] = await db.query(
      "SELECT * FROM club_join_requests WHERE student_id=? AND club_id=? AND status='pending'",
      [student_id, club_id]
    );
    if (exists.length > 0) {
      return res.status(400).json({ message: 'You already have a pending request for this club.' });
    }

    // Check if already joined
    const [joined] = await db.query(
      "SELECT * FROM joined_clubs WHERE student_id=? AND club_id=?",
      [student_id, club_id]
    );
    if (joined.length > 0) {
      return res.status(400).json({ message: 'You are already a member of this club.' });
    }

    // Insert request
    await db.query(
      "INSERT INTO club_join_requests (student_id, club_id) VALUES (?, ?)",
      [student_id, club_id]
    );

    res.status(201).json({ message: 'Join request sent to the club admin.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Club admin views pending requests for their club
router.get('/pending-requests/:club_id', async (req, res) => {
  const { club_id } = req.params;

  try {
    const [requests] = await db.query(`
      SELECT cjr.id, u.name AS student_name, u.email, u.prn, cjr.status, cjr.created_at
      FROM club_join_requests cjr
      JOIN users u ON cjr.student_id = u.id
      WHERE cjr.club_id=? AND cjr.status='pending'
    `, [club_id]);

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Club admin approves/rejects request
router.post('/update-request', async (req, res) => {
  const { request_id, status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  try {
    // Get request info
    const [[request]] = await db.query(
      "SELECT student_id, club_id FROM club_join_requests WHERE id=?",
      [request_id]
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Update status
    await db.query(
      "UPDATE club_join_requests SET status=? WHERE id=?",
      [status, request_id]
    );

    // If approved, insert into joined_clubs
    if (status === 'approved') {
      await db.query(
        "INSERT INTO joined_clubs (student_id, club_id) VALUES (?, ?)",
        [request.student_id, request.club_id]
      );
    }

    res.json({ message: `Request ${status} successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;

