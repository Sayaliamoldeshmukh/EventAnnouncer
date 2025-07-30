//  const nodemailer = require('nodemailer');
// require('dotenv').config();

// // Create transporter using Gmail
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Verify the transporter
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Transporter verification failed:", error);
//   } else {
//     console.log("✅ Mail transporter is ready");
//   }
// });

// // ✅ Registration Email
// // const sendRegistrationEmail = async (toEmail, userName, event) => {
// //   const htmlContent = `
// //     <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #fff; color: #333; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
// //       <h2 style="color: #333;">👋 Hello <span style="text-transform: capitalize;">${userName}</span>,</h2>
// //       <p>You have successfully registered for the event: <strong>${event.title || 'Untitled Event'}</strong>.</p>
// //       <p style="margin-top: 20px;">Thank you for joining!</p>
// //       <p style="margin-top: 30px;">Visit our website for more details.</p>
// //     </div>
// //   `;

// //   try {
// //     await transporter.sendMail({
// //       from: `"Event Manager" <${process.env.EMAIL_USER}>`,
// //       to: toEmail,
// //       subject: `🎉 You're Registered for ${event.title || 'an event'}!`,
// //       html: htmlContent,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error sending registration email:", error);
// //     throw error;
// //   }
// // };
// const sendRegistrationEmail = async (toEmail, userName, event) => {
//   const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   });

//   const formattedTime = event.time ? event.time.substring(0, 5) : 'TBD';

//   const htmlContent = `
//     <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #fff; color: #333; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//       <h2>👋 Hello <span style="text-transform: capitalize;">${userName}</span>,</h2>
//       <p>You have successfully registered for the event: <strong>${event.title}</strong>.</p>
//       <p><b>📅 Date:</b> ${formattedDate}</p>
//       <p><b>⏰ Time:</b> ${formattedTime}</p>
//       <p><b>📍 Location:</b> ${event.location}</p>

//       ${event.description ? `<p><b>📝 Description:</b> ${event.description}</p>` : ''}

//       ${
//         event.poster_url
//           ? `<img src="${event.poster_url}" alt="Event Poster" style="max-width: 100%; border-radius: 8px; margin-top: 15px;" />`
//           : ''
//       }

//       <p style="margin-top: 20px;">Looking forward to seeing you there!</p>
//       <hr style="margin-top: 30px;" />
//       <p style="font-size: 12px; color: #999;">This is an automated confirmation from Event Manager.</p>
//     </div>
//   `;

//   try {
//     await transporter.sendMail({
//       from: `"Event Manager" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: `✅ Registered for ${event.title}`,
//       html: htmlContent,
//     });
//   } catch (error) {
//     console.error("❌ Error sending registration email:", error);
//     throw error;
//   }
// };

// // ✅ Reminder Email
// const sendReminderEmail = async (toEmail, subject, htmlContent) => {
//   try {
//     await transporter.sendMail({
//       from: `"Event Manager" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject,
//       html: htmlContent,
//     });
//   } catch (error) {
//     console.error("❌ Error sending reminder email:", error);
//     throw error;
//   }
// };

// // ✅ Event Announcement Email to All Students
// const sendEventAnnouncementEmail = async (toEmail, studentName, event) => {
//   const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   });

//   const formattedTime = event.time ? event.time.substring(0, 5) : 'TBD';

//   const htmlContent = `
//     <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; color: #333; border-radius: 10px;">
//       <h2>🎉 New Event: <span style="color: #007BFF;">${event.title}</span></h2>
//       <p>Hi <strong>${studentName}</strong>,</p>
//       <p>You're invited to a new event organized by the <strong>${event.club_name}</strong> club!</p>
//       <p><b>📅 Date:</b> ${formattedDate}</p>
//       <p><b>⏰ Time:</b> ${formattedTime}</p>
//       <p><b>📍 Location:</b> ${event.location}</p>
//       <p><b>📝 Description:</b> ${event.description}</p>

//       ${
//         event.poster
//           ? `<img src="${event.poster}" alt="Event Poster" style="max-width: 100%; border-radius: 8px; margin-top: 15px;" />`
//           : ''
//       }

//       <p style="margin-top: 20px;">Visit the event platform to register and learn more.</p>
//       <hr style="margin-top: 30px;" />
//       <p style="font-size: 12px; color: #999;">This is an automated notification from Event Manager.</p>
//     </div>
//   `;

//   try {
//     await transporter.sendMail({
//       from: `"Event Manager" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: `📢 New Event: ${event.title} by ${event.club_name}`,
//       html: htmlContent,
//     });
//   } catch (error) {
//     console.error("❌ Error sending event announcement email:", error);
//     throw error;
//   }
// };

// module.exports = {
//   sendRegistrationEmail,
//   sendReminderEmail,
//   sendEventAnnouncementEmail,
// };
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Send Registration Email
const sendRegistrationEmail = async (toEmail, userName, event) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = event.time ? event.time.substring(0, 5) : 'TBD';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #fff; color: #333; border-radius: 10px;">
      <h2>👋 Hello <span style="text-transform: capitalize;">${userName}</span>,</h2>
      <p>You have successfully registered for the event: <strong>${event.title}</strong>.</p>
      <p><b>📅 Date:</b> ${formattedDate}</p>
      <p><b>⏰ Time:</b> ${formattedTime}</p>
      <p><b>📍 Location:</b> ${event.location}</p>
      ${event.description ? `<p><b>📝 Description:</b> ${event.description}</p>` : ''}
      ${event.poster_url ? `<img src="${event.poster_url}" alt="Event Poster" style="max-width: 100%; border-radius: 8px;" />` : ''}
      <p style="margin-top: 20px;">Looking forward to seeing you there!</p>
      <hr style="margin-top: 30px;" />
      <p style="font-size: 12px; color: #999;">This is an automated confirmation from Event Manager.</p>
    </div>
  `;

  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `✅ Registered for ${event.title}`,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Registration email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Error sending registration email:', error);
    throw error;
  }
};

// ✅ Send Reminder Email
const sendReminderEmail = async (toEmail, subject, htmlContent) => {
  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Reminder email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Error sending reminder email:', error);
    throw error;
  }
};

// ✅ Event Announcement Email
const sendEventAnnouncementEmail = async (toEmail, studentName, event) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = event.time ? event.time.substring(0, 5) : 'TBD';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; color: #333; border-radius: 10px;">
      <h2>🎉 New Event: <span style="color: #007BFF;">${event.title}</span></h2>
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>You're invited to a new event organized by the <strong>${event.club_name}</strong> club!</p>
      <p><b>📅 Date:</b> ${formattedDate}</p>
      <p><b>⏰ Time:</b> ${formattedTime}</p>
      <p><b>📍 Location:</b> ${event.location}</p>
      <p><b>📝 Description:</b> ${event.description}</p>
      ${event.poster ? `<img src="${event.poster}" alt="Event Poster" style="max-width: 100%; border-radius: 8px;" />` : ''}
      <p style="margin-top: 20px;">Visit the event platform to register and learn more.</p>
      <hr style="margin-top: 30px;" />
      <p style="font-size: 12px; color: #999;">This is an automated notification from Event Manager.</p>
    </div>
  `;

  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `📢 New Event: ${event.title} by ${event.club_name}`,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Event announcement email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Error sending announcement email:', error);
    throw error;
  }
};

module.exports = {
  sendRegistrationEmail,
  sendReminderEmail,
  sendEventAnnouncementEmail,
};
