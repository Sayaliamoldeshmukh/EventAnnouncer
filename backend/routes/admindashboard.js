const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection
const nodemailer = require('nodemailer');

// Email setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Approve join request
router.post('/dashboard/pending-requests/:id/approve', async (req, res) => {
    try {
        const requestId = req.params.id;

        // Update request status to approved
        const [[request]] = await db.query(
            `SELECT user_id, club_id FROM club_join_requests WHERE id = ?`,
            [requestId]
        );

        if (!request) return res.status(404).json({ message: 'Request not found' });

        await db.query(`UPDATE club_join_requests SET status='approved' WHERE id=?`, [requestId]);
        await db.query(`INSERT INTO joined_clubs (user_id, club_id, status) VALUES (?, ?, 'approved')`, [request.user_id, request.club_id]);

        // Send email to user
        const [[user]] = await db.query(`SELECT name, email FROM users WHERE id = ?`, [request.user_id]);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Club Membership Approved',
            text: `Hello ${user.name},\n\nYour membership request has been approved. Welcome to the club!`
        });

        res.json({ message: 'Request approved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Action failed' });
    }
});

// Reject join request
router.post('/dashboard/pending-requests/:id/reject', async (req, res) => {
    try {
        const requestId = req.params.id;
        const [[request]] = await db.query(`SELECT user_id FROM club_join_requests WHERE id = ?`, [requestId]);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        await db.query(`UPDATE club_join_requests SET status='rejected' WHERE id=?`, [requestId]);

        const [[user]] = await db.query(`SELECT name, email FROM users WHERE id = ?`, [request.user_id]);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Club Membership Rejected',
            text: `Hello ${user.name},\n\nYour membership request has been rejected.`
        });

        res.json({ message: 'Request rejected successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Action failed' });
    }
});

// Fetch pending requests with department and year
router.get('/dashboard/pending-requests', async (req, res) => {
    try {
        const adminId = req.session.user?.id;
        if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

        const [[club]] = await db.query(
            `SELECT c.id 
             FROM clubs c 
             JOIN users u ON c.name = u.club_name 
             WHERE u.id = ?`,
            [adminId]
        );

        if (!club) return res.status(404).json({ message: 'Club not found' });
        const clubId = club.id;

        const [pendingRequests] = await db.query(
            `SELECT r.id, u.name, u.email, u.department, r.reason, r.year
             FROM club_join_requests r
             JOIN users u ON r.user_id = u.id
             WHERE r.club_id = ? AND r.status = 'pending'`,
            [clubId]
        );

        const [[count]] = await db.query(
            `SELECT COUNT(*) as pendingCount FROM club_join_requests WHERE club_id=? AND status='pending'`,
            [clubId]
        );

        res.json({ pendingRequests, pendingCount: count.pendingCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
