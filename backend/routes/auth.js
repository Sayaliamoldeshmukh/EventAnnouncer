const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db'); // mysql2/promise connection
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

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
    if (rows.length === 0) return res.status(401).json({ message: 'User not found' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

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
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'Email not registered' });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' }); // expires in 15 mins

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset - Campus Events',
      html: `<p>Click below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>This link is valid for 15 minutes.</p>`
    });

    res.json({ message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error('❌ Forgot Password error:', error);
    res.status(500).json({ message: 'Server error. Try again later.' });
  }
});
// Step 2: Reset Password using Token
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) return res.status(400).json({ message: 'Password is required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query('UPDATE users SET password = ? WHERE email = ?', [
      hashedPassword,
      decoded.email
    ]);

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('❌ Reset token error:', err);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
});

module.exports = router;
