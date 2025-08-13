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

        // Get pending requests with name, email, department from users, and reason/year from club_join_requests
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
