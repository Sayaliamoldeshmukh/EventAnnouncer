const cron = require('node-cron');
const db = require('../db');
const { sendReminderEmail } = require('../utils/emailService');

// Cron job: runs every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  try {
    console.log('🕙 Running reminder job at 11:00 AM...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const targetDate = `${yyyy}-${mm}-${dd}`; // Format: YYYY-MM-DD

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
        `<p>Dear ${row.studentName},<br>Your event <b>${row.eventName}</b> is scheduled for tomorrow.<br>See you there!</p>`
      );
      console.log(`✅ Email sent to ${row.email}`);
    }

    if (events.length === 0) {
      console.log('📭 No events to remind at this time.');
    }
  } catch (err) {
    console.error('❌ Cron job error:', err);
  }
});
