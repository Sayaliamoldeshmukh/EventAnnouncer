const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// GET dashboard stats for a specific club admin
router.get('/dashboard/stats', async (req, res) => {
    try {
        const adminId = req.session.user?.id;
        if (!adminId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Get club_id for this admin
        const [[club]] = await db.query(
            `SELECT c.id 
             FROM clubs c 
             JOIN users u ON c.name = u.club_name 
             WHERE u.id = ?`,
            [adminId]
        );

        if (!club) {
            return res.status(404).json({ message: 'Club not found for this admin.' });
        }

        const clubId = club.id;

        // Total approved members
        const [[membersResult]] = await db.query(
            `SELECT COUNT(*) AS total_members 
             FROM joined_clubs 
             WHERE club_id = ? AND status = 'approved'`,
            [clubId]
        );

        // Pending join requests
        const [[pendingResult]] = await db.query(
            `SELECT COUNT(*) AS pending_requests 
             FROM club_join_requests 
             WHERE club_id = ? AND status = 'pending'`,
            [clubId]
        );

        // Active events count
        const [[activeEventsResult]] = await db.query(
            `SELECT COUNT(*) AS active_events 
             FROM events 
             WHERE club_id = ? AND date >= CURDATE()`,
            [clubId]
        );

        // Upcoming events (next 5)
        const [upcomingEvents] = await db.query(
            `SELECT id, title, date, location 
             FROM events 
             WHERE club_id = ? AND date >= CURDATE() 
             ORDER BY date ASC 
             LIMIT 5`,
            [clubId]
        );

        res.json({
            totalMembers: membersResult.total_members,
            pendingRequests: pendingResult.pending_requests,
            activeEvents: activeEventsResult.active_events,
            upcomingEvents
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET pending join requests with user details
router.get('/dashboard/pending-requests', async (req, res) => {
    try {
        const adminId = req.session.user?.id;
        if (!adminId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Get club_id for this admin
        const [[club]] = await db.query(
            `SELECT c.id 
             FROM clubs c 
             JOIN users u ON c.name = u.club_name 
             WHERE u.id = ?`,
            [adminId]
        );

        if (!club) {
            return res.status(404).json({ message: 'Club not found for this admin.' });
        }

        const clubId = club.id;

        // Pending requests with user details and reason/year
        const [pendingRequests] = await db.query(
            `SELECT r.id, u.name, u.email, u.department, r.reason, r.year
             FROM club_join_requests r
             JOIN users u ON r.user_id = u.id
             WHERE r.club_id = ? AND r.status = 'pending'`,
            [clubId]
        );

        res.json(pendingRequests);

    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
