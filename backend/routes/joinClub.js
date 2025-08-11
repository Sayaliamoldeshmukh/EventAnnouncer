const express = require('express');
const router = express.Router();
const db = require('../db');

// Student sends join request
router.post('/join-request', async (req, res) => {
  const { student_id, club_id } = req.body;
  try {
    const [exists] = await db.query(
      "SELECT * FROM club_join_requests WHERE student_id=? AND club_id=? AND status='pending'",
      [student_id, club_id]
    );
    if (exists.length > 0) return res.status(400).json({ message: 'You already have a pending request.' });

    const [joined] = await db.query(
      "SELECT * FROM joined_clubs WHERE student_id=? AND club_id=?",
      [student_id, club_id]
    );
    if (joined.length > 0) return res.status(400).json({ message: 'You are already a member of this club.' });

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

// Club admin views pending requests for their own club
router.get('/pending-requests', async (req, res) => {
  try {
    const adminId = req.session.user?.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const [[club]] = await db.query(
      "SELECT c.id FROM clubs c JOIN users u ON c.name = u.club_name WHERE u.id = ?",
      [adminId]
    );
    if (!club) return res.json([]);

    const [requests] = await db.query(`
      SELECT cjr.id, u.name AS student_name, u.email, cjr.status, cjr.created_at
      FROM club_join_requests cjr
      JOIN users u ON cjr.student_id = u.id
      WHERE cjr.club_id=? AND cjr.status='pending'
    `, [club.id]);

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
    const [[request]] = await db.query(
      "SELECT student_id, club_id FROM club_join_requests WHERE id=?",
      [request_id]
    );
    if (!request) return res.status(404).json({ message: 'Request not found.' });

    await db.query("UPDATE club_join_requests SET status=? WHERE id=?", [status, request_id]);

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
