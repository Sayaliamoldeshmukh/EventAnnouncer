const express = require('express');
const router = express.Router();
const db = require('../db');

// GET Club Admin Dashboard Stats + Upcoming Events
router.get('/dashboard-stats', async (req, res) => {
  try {
    const adminId = req.session.user?.id; // Ensure admin is logged in
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    // Get the club_id for logged-in admin
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

    // Active (upcoming) Events
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

module.exports = router;
