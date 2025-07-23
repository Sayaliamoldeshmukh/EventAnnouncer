// // routes/cron.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendReminderEmail } = require('../utils/emailService');

router.get('/send-reminders', async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const targetDate = `${yyyy}-${mm}-${dd}`;

    const [events] = await db.query(`
      SELECT 
        e.title AS eventName,
        e.date,
        u.name AS studentName,
        u.email
      FROM student_registrations r
      JOIN users u ON u.id = r.student_id
      JOIN events e ON e.id = r.event_id
      WHERE DATE(e.date) = ?
        AND u.role = 'student'
    `, [targetDate]);

    for (const row of events) {
      await sendReminderEmail(
        row.email,
        `⏰ Reminder: ${row.eventName} is Tomorrow!`,
        `
        <h3>Hi ${row.studentName}, 👋</h3>
        <p>This is a reminder that your event <strong>${row.eventName}</strong> is scheduled for <strong>tomorrow</strong>.</p>
        <p>Be sure to be there on time! 😊</p>
        `
      );
    }

    res.send('✅ Reminder emails sent successfully');
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send('❌ Failed to send reminders');
  }
});

module.exports = router;
