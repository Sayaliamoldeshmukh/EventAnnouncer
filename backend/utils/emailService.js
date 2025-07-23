// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Transporter verification failed:", error);
//   } else {
//     console.log("✅ Mail transporter is ready");
//   }
// });

// const sendRegistrationEmail = async (toEmail, userName, eventName, eventDate, eventTime, location, posterUrl) => {
//   try {
//     await transporter.sendMail({
//       from: `"Event Manager" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: `🎉 You're Registered for ${eventName}!`,
//       html: `
//         <div style="font-family: Arial, sans-serif; color: #333;">
//           <h2>👋 Hello ${userName},</h2>
//           <p>✅ You’ve successfully registered for the event:</p>
//           <h3 style="color: #007BFF;">🎯 <b>${eventName}</b></h3>
          
//           <p><b>📅 Date:</b> ${new Date(eventDate).toLocaleDateString()}</p>
//           <p><b>⏰ Time:</b> ${eventTime}</p>
//           <p><b>📍 Location:</b> ${location}</p>
          
//           ${
//             posterUrl
//               ? `<div style="margin-top: 20px;">
//                   <img src="${posterUrl}" alt="Event Poster" style="max-width: 100%; height: auto; border-radius: 8px;" />
//                 </div>`
//               : ''
//           }
          
//           <p style="margin-top: 20px;">🙌 We’re excited to see you there!</p>
//           <p style="font-size: 14px; color: #555;">🎫 Don’t forget to check your email or our website for any updates.</p>
          
//           <hr style="margin: 20px 0;" />
//           <p style="font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} Event Manager | Powered by SortUs</p>
//         </div>
//       `,
//     });
//   } catch (error) {
//     console.error("❌ Error sending registration email:", error);
//     throw error;
//   }
// };


// const sendReminderEmail = async (toEmail, userName, eventName, eventDate) => {
//   try {
//     await transporter.sendMail({
//       from: `"Event Manager" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: `Reminder: ${eventName} is Tomorrow!`,
//       html: `<h3>Hello ${userName},</h3>
//              <p>This is a reminder that <b>${eventName}</b> is scheduled for <b>${new Date(eventDate).toLocaleDateString()}</b>.</p>
//              <p>Don't miss it!</p>`,
//     });
//   } catch (error) {
//     console.error("❌ Error sending reminder email:", error);
//   }
// };

// module.exports = {
//   sendRegistrationEmail,
//   sendReminderEmail,
// };
// utils/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Registration email
const sendRegistrationEmail = async (toEmail, userName, eventName, eventDate, eventTime, location, posterUrl) => {
  try {
    await transporter.sendMail({
      from: `"Event Manager" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "✅ Registration Successful 🎉",
      html: `
        <h3>👋 Hello ${userName},</h3>
        <p>You've successfully registered for <strong>${eventName}</strong>!</p>
        <p><strong>📅 Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
        <p><strong>⏰ Time:</strong> ${eventTime}</p>
        <p><strong>📍 Location:</strong> ${location}</p>
        ${posterUrl ? `<img src="${posterUrl}" alt="Event Poster" style="max-width: 100%; height: auto;" />` : ''}
        <p>Thanks for joining! 🎊</p>
      `,
    });
  } catch (error) {
    console.error("❌ Registration Email Error:", error);
    throw error;
  }
};

// ✅ Reminder email
const sendReminderEmail = async (toEmail, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"Event Manager" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("❌ Reminder Email Error:", error);
    throw error;
  }
};

module.exports = { sendRegistrationEmail, sendReminderEmail };
