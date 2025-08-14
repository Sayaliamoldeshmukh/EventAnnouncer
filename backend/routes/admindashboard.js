
// const express = require('express');
// const router = express.Router();
// const db = require('../db'); // MySQL connection

// // GET dashboard stats for a specific club admin
// router.get('/dashboard/stats', async (req, res) => {
//     try {
//         const adminId = req.session.user?.id;
//         if (!adminId) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         // Get club_id for this admin
//         const [[club]] = await db.query(
//             `SELECT c.id 
//              FROM clubs c 
//              JOIN users u ON c.name = u.club_name 
//              WHERE u.id = ?`,
//             [adminId]
//         );

//         if (!club) {
//             return res.status(404).json({ message: 'Club not found for this admin.' });
//         }

//         const clubId = club.id;

//         // Total approved members
//         const [[membersResult]] = await db.query(
//             `SELECT COUNT(*) AS total_members 
//              FROM joined_clubs 
//              WHERE club_id = ? AND status = 'approved'`,
//             [clubId]
//         );

//         // Pending join requests
//         const [[pendingResult]] = await db.query(
//             `SELECT COUNT(*) AS pending_requests 
//              FROM club_join_requests 
//              WHERE club_id = ? AND status = 'pending'`,
//             [clubId]
//         );

//         // Active events count
//         const [[activeEventsResult]] = await db.query(
//             `SELECT COUNT(*) AS active_events 
//              FROM events 
//              WHERE club_id = ? AND date >= CURDATE()`,
//             [clubId]
//         );

//         // Upcoming events (next 5)
//         const [upcomingEvents] = await db.query(
//             `SELECT id, title, date, location 
//              FROM events 
//              WHERE club_id = ? AND date >= CURDATE() 
//              ORDER BY date ASC 
//              LIMIT 5`,
//             [clubId]
//         );

//         res.json({
//             totalMembers: membersResult.total_members,
//             pendingRequests: pendingResult.pending_requests,
//             activeEvents: activeEventsResult.active_events,
//             upcomingEvents
//         });

//     } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// // GET pending join requests with user details
// router.get('/dashboard/pending-requests', async (req, res) => {
//     try {
//         const adminId = req.session.user?.id;
//         if (!adminId) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         // Get club_id for this admin
//         const [[club]] = await db.query(
//             `SELECT c.id 
//              FROM clubs c 
//              JOIN users u ON c.name = u.club_name 
//              WHERE u.id = ?`,
//             [adminId]
//         );

//         if (!club) {
//             return res.status(404).json({ message: 'Club not found for this admin.' });
//         }

//         const clubId = club.id;

//         // Pending requests with user details and reason/year
//         const [pendingRequests] = await db.query(
//             `SELECT r.id, u.name, u.email, u.department, r.reason, r.year
//              FROM club_join_requests r
//              JOIN users u ON r.user_id = u.id
//              WHERE r.club_id = ? AND r.status = 'pending'`,
//             [clubId]
//         );

//         res.json(pendingRequests);

//     } catch (error) {
//         console.error('Error fetching pending requests:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require('../db'); // MySQL connection
const nodemailer = require("nodemailer");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Get pending requests with name, email, department, year, reason
router.get("/pending-requests/:clubId", async (req, res) => {
  const { clubId } = req.params;
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        cjr.id AS request_id,
        u.name,
        u.email,
        u.department,
        cjr.year,
        cjr.reason
      FROM club_join_requests cjr
      JOIN users u ON cjr.user_id = u.id
      WHERE cjr.club_id = ? AND cjr.status = 'pending'
      ORDER BY cjr.created_at DESC
      `,
      [clubId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Approve request
router.post("/approve-request/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {
    // Get request + user details
    const [[request]] = await pool.query(
      `
      SELECT cjr.*, u.name, u.email
      FROM club_join_requests cjr
      JOIN users u ON cjr.user_id = u.id
      WHERE cjr.id = ?
      `,
      [requestId]
    );

    if (!request) return res.status(404).json({ error: "Request not found" });

    // Update status
    await pool.query(`UPDATE club_join_requests SET status = 'approved' WHERE id = ?`, [requestId]);

    // Add to joined_clubs if not exists
    await pool.query(
      `
      INSERT IGNORE INTO joined_clubs (club_id, user_id)
      VALUES (?, ?)
      `,
      [request.club_id, request.user_id]
    );

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: request.email,
      subject: "Club Membership Approved",
      text: `Hello ${request.name},\n\nYour request to join the club has been approved!\n\nWelcome aboard!`,
    });

    res.json({ success: true, message: "Request approved" });
  } catch (err) {
    console.error("Error approving request:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Reject request
router.post("/reject-request/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {
    // Get request + user details
    const [[request]] = await pool.query(
      `
      SELECT cjr.*, u.name, u.email
      FROM club_join_requests cjr
      JOIN users u ON cjr.user_id = u.id
      WHERE cjr.id = ?
      `,
      [requestId]
    );

    if (!request) return res.status(404).json({ error: "Request not found" });

    // Update status
    await pool.query(`UPDATE club_join_requests SET status = 'rejected' WHERE id = ?`, [requestId]);

    // Send rejection email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: request.email,
      subject: "Club Membership Rejected",
      text: `Hello ${request.name},\n\nUnfortunately, your request to join the club has been rejected.\n\nThank you for your interest.`,
    });

    res.json({ success: true, message: "Request rejected" });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
