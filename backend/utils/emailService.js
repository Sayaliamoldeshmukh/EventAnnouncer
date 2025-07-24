const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Transporter verification failed:", error);
  } else {
    console.log("✅ Mail transporter is ready");
  }
});

// ✅ Registration Email
// const sendRegistrationEmail = async (toEmail, userName, event) => {
//   const formattedDate = event.date
//     ? new Date(event.date).toLocaleDateString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric',
//       })
//     : "Not specified";

//   const formattedTime = event.time ? event.time.substring(0, 5) : "Not specified";

//   // Replace with your actual base URL
//   const baseURL = 'https://eventannouncer.onrender.com';

//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; color: #333;">
//       <h2>👋 Hello ${userName},</h2>
//       <p>✅ You’ve successfully registered for the event:</p>
//       <h3 style="color: #007BFF;">🎯 <b>${event.title || 'Untitled Event'}</b></h3>
      
//       <p><b>📅 Date:</b> ${formattedDate}</p>
//       <p><b>⏰ Time:</b> ${formattedTime}</p>
//       <p><b>📍 Location:</b> ${event.location || 'Not specified'}</p>
      
//       ${
//         event.poster_url
//           ? `<div style="margin-top: 20px;">
//               <img src="${baseURL}${event.poster_url}" alt="Event Poster" style="max-width: 100%; height: auto; border-radius: 8px;" />
//             </div>`
//           : ''
//       }

//       <p style="margin-top: 20px;">🙌 We’re excited to see you there!</p>
//       <p style="font-size: 14px; color: #555;">🎫 Don’t forget to check your email or our website for any updates.</p>
      
//       <hr style="margin: 20px 0;" />
//       <p style="font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} Event Manager | Powered by SortUs</p>
//     </div>
//   `;

//   try {
//     await transporter.sendMail({
//       from: `"Event Manager" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: `🎉 You're Registered for ${event.title || 'an event'}!`,
//       html: htmlContent,
//     });
//   } catch (error) {
//     console.error("❌ Error sending registration email:", error);
//     throw error;
//   }
// };
const sendRegistrationEmail = async (toEmail, userName, event) => {
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Not specified';

  const formattedTime = event.time ? event.time.substring(0, 5) : 'Not specified';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #fff; color: #333; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">👋 Hello <span style="text-transform: capitalize;">${userName}</span>,</h2>
      <p>You have successfully registered for the event:</p>

      <h3 style="color: #007BFF;">🎯 <strong>${event.title || 'Untitled Event'}</strong></h3>

      <p style="margin: 8px 0;"><strong>📅 Date:</strong> ${formattedDate}</p>
      <p style="margin: 8px 0;"><strong>⏰ Time:</strong> ${formattedTime}</p>
      <p style="margin: 8px 0;"><strong>📍 Location:</strong> ${event.location || 'Not specified'}</p>

      ${
        event.poster_url
          ? `<div style="margin: 20px 0;">
              <img src="https://eventannouncer.onrender.com${event.poster_url}" alt="Event Poster" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px;" />
            </div>`
          : ''
      }

      <p style="margin-top: 30px;">🙌 Thank you for joining!</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 12px; color: #888;">© ${new Date().getFullYear()} Event Manager | Powered by SortUs</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Event Manager" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `🎉 You're Registered for ${event.title || 'an event'}!`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("❌ Error sending registration email:", error);
    throw error;
  }
};

// ✅ Reminder Email
const sendReminderEmail = async (toEmail, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"Event Manager" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("❌ Error sending reminder email:", error);
    throw error;
  }
};

module.exports = {
  sendRegistrationEmail,
  sendReminderEmail,
};
