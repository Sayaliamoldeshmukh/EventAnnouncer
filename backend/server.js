const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./cron/emailRemainder');

const db = require('./db');
const authRoutes = require('./routes/auth');
const clubAdminRoutes = require('./routes/clubAdmin');
const eventRoutes = require('./routes/events');
const studentRoutes = require('./routes/student');
const clubDetailRoutes = require('./routes/club_detail');
const joinClubRoutes = require('./routes/joinClub');
//const joinRequestRoutes = require('./routes/joinrequest'); // ✅ NEW
const cronRoutes = require('./routes/cron');

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ✅ CORS
app.use(
  cors({
    origin: 'https://event-announcer1.vercel.app',
    credentials: true
  })
);

app.use(express.json());

// ✅ MySQL Session Store
const sessionStore = new MySQLStore({
  host: process.env.host || 'metro.proxy.rlwy.net',
  port: process.env.port || 44571,
  user: process.env.user || 'root',
  password: process.env.password || '',
  database: process.env.database || 'railway',
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000
});

// ✅ Session Middleware
app.use(
  session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60
    }
  })
);

// ✅ Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clubAdmin', clubAdminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/clubs', clubDetailRoutes);
app.use('/api/join', joinClubRoutes);
//app.use('/api/join-requests', joinRequestRoutes); // ✅ NEW
app.use('/api/cron', cronRoutes);

// ✅ Dashboard Route
app.get('/api/dashboard', (req, res) => {
  if (req.session.user) {
    res.json({
      message: `Welcome ${req.session.user.name}`,
      role: req.session.user.role
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// ✅ Root
app.get('/', (req, res) => {
  res.send('🌐 Campus Events API is running with Railway DB!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
