const express = require("express");
const router = express.Router();
const pool = require("../db");
const nodemailer = require("nodemailer");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to check club admin session
function requireClubSession(req, res, next) {
  if (!req.session || !req.session.clubId) {
    return res.status(401).json({ error: "Unauthorized: No club session" });
  }
  next();
}

// Get pending requests
router.get("/pending-requests", requireClubSession, async (req, res) => {
  const clubId = req.session.clubId;
  try {
    const [rows] = await pool.query(
      `SELECT 
        cjr.id AS request_id,
        u.name,
        u.email,
        u.department,
        cjr.year,
        cjr.reason
       FROM club_join_requests cjr
       JOIN users u ON cjr.user_id = u.id
       WHERE cjr.club_id=? AND cjr.status='pending'
       ORDER BY cjr.created_at DESC`,
      [clubId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Approve request
router.post("/approve-request/:requestId", requireClubSession, async (req, res) => {
  const { requestId } = req.params;
  try {
    const [[request]] = await pool.query(
      `SELECT cjr.*, u.name, u.email FROM club_join_requests cjr
       JOIN users u ON cjr.user_id=u.id WHERE cjr.id=?`,
      [requestId]
    );
    if (!request) return res.status(404).json({ error: "Request not found" });

    await pool.query(`UPDATE club_join_requests SET status='approved' WHERE id=?`, [requestId]);
    await pool.query(`INSERT IGNORE INTO joined_clubs (club_id, user_id) VALUES (?, ?)`,
      [request.club_id, request.user_id]);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: request.email,
      subject: "Club Membership Approved",
      text: `Hello ${request.name},\n\nYour request has been approved!`,
    });

    res.json({ success: true, message: "Request approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Reject request
router.post("/reject-request/:requestId", requireClubSession, async (req, res) => {
  const { requestId } = req.params;
  try {
    const [[request]] = await pool.query(
      `SELECT cjr.*, u.name, u.email FROM club_join_requests cjr
       JOIN users u ON cjr.user_id=u.id WHERE cjr.id=?`,
      [requestId]
    );
    if (!request) return res.status(404).json({ error: "Request not found" });

    await pool.query(`UPDATE club_join_requests SET status='rejected' WHERE id=?`, [requestId]);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: request.email,
      subject: "Club Membership Rejected",
      text: `Hello ${request.name},\n\nYour request has been rejected.`,
    });

    res.json({ success: true, message: "Request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Dashboard stats
router.get("/dashboard/stats", requireClubSession, async (req, res) => {
  const clubId = req.session.clubId;
  try {
    const [[totalMembers]] = await pool.query(
      "SELECT COUNT(*) AS total FROM joined_clubs WHERE club_id=?",
      [clubId]
    );
    const [[pendingRequests]] = await pool.query(
      "SELECT COUNT(*) AS total FROM club_join_requests WHERE club_id=? AND status='pending'",
      [clubId]
    );
    const [activeEvents] = await pool.query(
      "SELECT * FROM events WHERE club_id=? AND date >= CURDATE()",
      [clubId]
    );

    res.json({
      totalMembers: totalMembers.total || 0,
      pendingRequests: pendingRequests.total || 0,
      activeEvents: activeEvents.length || 0,
      upcomingEvents: activeEvents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
