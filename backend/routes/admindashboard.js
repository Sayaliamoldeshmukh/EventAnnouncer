const express = require('express');
const router = express.Router();
const db = require('../db');

// ------------------------
// GET Club Admin Dashboard Stats + Upcoming Events
// ------------------------
router.get('/join/dashboard/stats', async (req, res) => {
  try {
    const adminId = req.session.user?.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const [[club]] = await db.query(
      "SELECT c.id FROM clubs c JOIN users u ON c.name = u.club_name WHERE u.id = ?",
      [adminId]
    );
    if (!club) return res.status(404).json({ message: 'Club not found for this admin.' });

    const clubId = club.id;

    // Total Members
    const [[{ total_members }]] = await db.query(
      "SELECT COUNT(*) AS total_members FROM joined_clubs WHERE club_id = ?",
      [clubId]
    );

    // Pending Requests
    const [[{ pending_requests }]] = await db.query(
      "SELECT COUNT(*) AS pending_requests FROM club_join_requests WHERE club_id = ? AND status = 'pending'",
      [clubId]
    );

    // Active Events
    const [[{ active_events }]] = await db.query(
      "SELECT COUNT(*) AS active_events FROM events WHERE club_id = ? AND event_date >= CURDATE()",
      [clubId]
    );

    // Upcoming events list
    const [upcoming_events] = await db.query(
      "SELECT id, title, event_date, location FROM events WHERE club_id = ? AND event_date >= CURDATE() ORDER BY event_date ASC LIMIT 5",
      [clubId]
    );

    res.json({
      totalMembers: total_members,
      pendingRequests: pending_requests,
      activeEvents: active_events,
      upcomingEvents: upcoming_events
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ------------------------
// GET Pending Join Requests
// ------------------------
router.get('/join/pending-requests', async (req, res) => {
  try {
    const adminId = req.session.user?.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const [[club]] = await db.query(
      "SELECT c.id FROM clubs c JOIN users u ON c.name = u.club_name WHERE u.id = ?",
      [adminId]
    );
    if (!club) return res.status(404).json({ message: 'Club not found for this admin.' });

    const clubId = club.id;

    const [requests] = await db.query(
      "SELECT id AS request_id, student_name AS name, email, status FROM club_join_requests WHERE club_id = ? AND status = 'pending'",
      [clubId]
    );

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ------------------------
// POST Update Join Request Status
// ------------------------
router.post('/join/update-request', async (req, res) => {
  try {
    const adminId = req.session.user?.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const { request_id, status } = req.body;
    if (!request_id || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Verify the request belongs to this admin's club
    const [[club]] = await db.query(
      "SELECT c.id FROM clubs c JOIN users u ON c.name = u.club_name WHERE u.id = ?",
      [adminId]
    );
    if (!club) return res.status(404).json({ message: 'Club not found for this admin.' });

    const clubId = club.id;

    const [[request]] = await db.query(
      "SELECT * FROM club_join_requests WHERE id = ? AND club_id = ?",
      [request_id, clubId]
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Update request status
    await db.query(
      "UPDATE club_join_requests SET status = ? WHERE id = ?",
      [status, request_id]
    );

    // If approved, optionally add to joined_clubs table
    if (status === 'approved') {
      await db.query(
        "INSERT INTO joined_clubs (club_id, student_id) VALUES (?, ?)",
        [clubId, request.student_id]
      );
    }

    res.json({ message: `Request ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});
// ------------------------
// GET Members List
// ------------------------
router.get('/join/members', async (req, res) => {
  try {
    const adminId = req.session.user?.id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const [[club]] = await db.query(
      "SELECT c.id FROM clubs c JOIN users u ON c.name = u.club_name WHERE u.id = ?",
      [adminId]
    );
    if (!club) return res.status(404).json({ message: 'Club not found for this admin.' });

    const clubId = club.id;

    const [members] = await db.query(
      `SELECT j.id, u.name, u.email, j.joined_at 
       FROM joined_clubs j
       JOIN users u ON j.student_id = u.id
       WHERE j.club_id = ?`,
      [clubId]
    );

    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});


module.exports = router;
