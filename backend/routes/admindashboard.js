const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// GET dashboard data for a specific club admin
router.get('/dashboard', async (req, res) => {
    try {
        const adminId = req.session.user?.id; // Logged-in admin ID
        if (!adminId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // 1. Get the club_id for the logged-in admin
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

        // 2. Total approved members
        const [membersResult] = await db.query(
            `SELECT COUNT(*) AS total_members 
             FROM joined_clubs 
             WHERE club_id = ? AND status = 'approved'`,
            [clubId]
        );

        // 3. Pending join requests
        const [pendingResult] = await db.query(
            `SELECT COUNT(*) AS pending_requests 
             FROM club_join_requests 
             WHERE club_id = ? AND status = 'pending'`,
            [clubId]
        );

        // 4. Active events count
        const [activeEventsResult] = await db.query(
            `SELECT COUNT(*) AS active_events 
             FROM events 
             WHERE club_id = ? AND date >= CURDATE()`,
            [clubId]
        );

        // 5. Upcoming events list (next 5)
        const [upcomingEvents] = await db.query(
            `SELECT id, title, date, location 
             FROM events 
             WHERE club_id = ? AND date >= CURDATE() 
             ORDER BY date ASC 
             LIMIT 5`,
            [clubId]
        );

        // 6. Send final response
        res.json({
            total_members: membersResult[0].total_members,
            pending_requests: pendingResult[0].pending_requests,
            active_events: activeEventsResult[0].active_events,
            upcoming_events: upcomingEvents
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
