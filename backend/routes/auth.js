const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Setup Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// OTP Generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ===================== EMAIL VERIFICATION FOR SIGNUP =====================
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.query('INSERT INTO email_otps (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expiresAt]);

  const html = `
    <div style="font-family: Arial; text-align: center;">
      <h2 style="color: #6B46C1;">Campus Events Email Verification</h2>
      <p>Use the OTP below to verify your email:</p>
      <h1 style="letter-spacing: 6px;">${otp}</h1>
      <p>This OTP is valid for <strong>15 minutes</strong>.</p>
    </div>
  `;

  await transporter.sendMail({
    to: email,
    subject: 'Verify Your Email - OTP Inside',
    html,
  });

  res.json({ message: 'OTP sent to your email. Check inbox/spam.' });
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const [rows] = await db.query('SELECT * FROM email_otps WHERE email = ? AND otp = ?', [email, otp]);
  if (rows.length === 0 || new Date(rows[0].expires_at) < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  await db.query('DELETE FROM email_otps WHERE email = ?', [email]);
  res.json({ message: 'Email verified successfully' });
});

// ===================== SIGNUP =====================
router.post('/signup', async (req, res) => {
  const { name, email, password, phone, department, role, club_name } = req.body;

  if (!name || !email || !password || !phone || !department || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Confirm that email was verified
  const [otpCheck] = await db.query('SELECT * FROM email_otps WHERE email = ?', [email]);
  if (otpCheck.length > 0) {
    return res.status(400).json({ message: 'Please verify email before signing up.' });
  }

  const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users (name, email, password, phone, department, role, club_name)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, hashedPassword, phone, department, role, club_name || null]
  );

  res.status(201).json({ message: 'User registered successfully' });
});

// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid email' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
      club_name: user.club_name || null,
    };

    res.json({ message: 'Login successful', user: req.session.user });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: 'Login failed. Server error.' });
  }
});

// ===================== WHOAMI + CHECK =====================
router.get('/whoami', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

router.get('/check', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

// ===================== LOGOUT =====================
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('❌ Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// ===================== FORGOT PASSWORD (OTP) =====================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(404).json({ message: 'You are not signed up. Please register first.' });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.query(
    'INSERT INTO password_otps (email, otp, expires_at) VALUES (?, ?, ?)',
    [email, otp, expiresAt]
  );

  const emailHTML = `
    <div style="font-family: Arial; text-align: center;">
      <h2 style="color: #6B46C1;">🔐 Event Announcer Password Reset</h2>
      <p>Use the OTP below to reset your password:</p>
      <h1 style="letter-spacing: 6px;">${otp}</h1>
      <p>This OTP is valid for <strong>15 minutes</strong>.</p>
    </div>
  `;

  await transporter.sendMail({
    to: email,
    subject: '🔐 Reset Your Password - OTP Inside',
    html: emailHTML,
  });

  res.json({ message: 'OTP sent to your email. Check inbox/spam.' });
});

// ===================== RESET PASSWORD WITH OTP =====================
router.post('/reset-password-with-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const [rows] = await db.query(
    'SELECT * FROM password_otps WHERE email = ? AND otp = ?',
    [email, otp]
  );
  if (rows.length === 0 || new Date(rows[0].expires_at) < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
  await db.query('DELETE FROM password_otps WHERE email = ?', [email]);

  res.json({ message: '✅ Password successfully reset.' });
});

module.exports = router;
