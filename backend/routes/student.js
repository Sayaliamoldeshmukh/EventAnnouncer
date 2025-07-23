const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendRegistrationEmail } = require('../utils/emailService');

// ✅ Middleware: Only allow logged-in students
const isStudent = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'student') {
    return res.status(401).json({ message: 'You must log in as a student' });
  }
  next();
};

// // ✅ Register for event
router.post('/register/:eventId', isStudent, async (req, res) => {
  const studentId = req.session.user.id;
  const eventId = req.params.eventId;

  try {
    // Check if already registered
    const [existing] = await db.query(
      'SELECT * FROM student_registrations WHERE student_id = ? AND event_id = ?',
      [studentId, eventId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Already registered' });
    }

    // Fetch student and event before inserting
    const [[student]] = await db.query('SELECT name, email FROM users WHERE id = ?', [studentId]);
   const [[event]] = await db.query(
  `SELECT title, date, location, poster_url FROM events WHERE id = ?`,
  [eventId]
);


    // Insert after validation succeeds
    await db.query(
      'INSERT INTO student_registrations (student_id, event_id) VALUES (?, ?)',
      [studentId, eventId]
    );

    // Send email but don’t block response if it fails
    sendRegistrationEmail(student.email, student.name, event.title)
      .catch((emailError) => {
        console.error('❌ Email failed (but registration success):', emailError);
      });

    res.status(200).json({
      message: `✅ Registered successfully for ${event.title}. 📧 Confirmation email sent.`,
    });

  } catch (err) {
    console.error('❌ Error in register route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Send test email
router.get('/test-email', async (req, res) => {
  try {
    await sendRegistrationEmail('deshmukhsayali080804@gmail.com', 'Test User', 'Test Event');
    res.send('Test email sent!');
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).send('Failed to send test email');
  }
});

// ✅ Get unique club names
router.get('/clubs', async (req, res) => {
  try {
    const [clubs] = await db.query('SELECT DISTINCT club_name FROM events');
    res.json(clubs.map(c => c.club_name));
  } catch (err) {
    console.error('❌ Error fetching club names:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Events registered by the student
router.get('/registered', isStudent, async (req, res) => {
  try {
    const studentId = req.session.user.id;

    const [rows] = await db.query(
      `SELECT e.* FROM student_registrations sr
       JOIN events e ON sr.event_id = e.id
       WHERE sr.student_id = ?
       ORDER BY e.date ASC`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error('❌ Error in /registered route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Get all events for logged-in student
router.get('/events/all', isStudent, async (req, res) => {
  try {
    const [events] = await db.query('SELECT * FROM events ORDER BY date ASC');
    res.json(events);
  } catch (err) {
    console.error('Error fetching all events:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
