const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db'); // mysql2/promise connection
const crypto = require('crypto');
const nodemailer = require('nodemailer');


// ===== SIGNUP =====
router.post('/signup', async (req, res) => {
  const { name, email, password, phone, department, role, club_name } = req.body;

  if (!name || !email || !password || !phone || !department || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
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
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    res.status(500).json({ message: 'Signup failed. Server error.' });
  }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
   if (rows.length === 0) return res.status(401).json({ message: 'Invalid email' });


    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) return res.status(401).json({ message: 'Wrong password' });


    // ✅ Store session
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

// ===== WHOAMI (Debug/Session Check) =====
router.get('/whoami', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});
// routes/auth.js
router.get('/check', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

// ===== LOGOUT =====
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('❌ Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('session_cookie_name'); // adjust this to match your session cookie name
    res.json({ message: 'Logged out successfully' });
  });
});
// Step 1: Send Reset Link
// Setup transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(404).json({ message: 'You are not signed up. Please register first.' });
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Store in password_resets table
  await db.query(
    'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
    [email, token, expiresAt]
  );

  // Create reset link
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  // Send email
  await transporter.sendMail({
    to: email,
    subject: '🔐 Reset Your Password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  });

  res.json({ message: 'Reset link sent to your email.Check your spam or inbox' });
});

// Step 2: Reset Password using Token
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Check token validity
  const [rows] = await db.query('SELECT * FROM password_resets WHERE token = ?', [token]);
  if (rows.length === 0 || new Date(rows[0].expires_at) < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }

  const email = rows[0].email;

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user's password
  await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

  // Delete used token
  await db.query('DELETE FROM password_resets WHERE token = ?', [token]);

  res.json({ message: '✅ Password successfully reset.' });
});


module.exports = router;
