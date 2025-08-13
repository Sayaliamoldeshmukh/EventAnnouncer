const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// GET dashboard data
router.get('/dashboard', async (req, res) => {
    try {
        // 1. Get total approved members
        const [membersResult] = await db.query(
            `SELECT COUNT(*) AS total_members 
             FROM members 
             WHERE status = 'approved'`
        );

        // 2. Get pending join requests
        const [pendingResult] = await db.query(
            `SELECT COUNT(*) AS pending_requests 
             FROM club_join_requests 
             WHERE status = 'pending'`
        );

        // 3. Get active events (where date is today or in the future)
        const [eventsResult] = await db.query(
            `SELECT * 
             FROM events 
             WHERE date >= CURDATE() 
             ORDER BY date ASC`
        );

        res.json({
            total_members: membersResult[0].total_members,
            pending_requests: pendingResult[0].pending_requests,
            active_events: eventsResult.length, // count of active events
            events_list: eventsResult           // full list of active events
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
