require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());

// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://eventannouncer.vercel.app'
];

// ✅ CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // Allow requests with no origin (like mobile apps or curl)
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With'
  ]
};

// ✅ Apply CORS first
app.use(cors(corsOptions));

// ✅ Explicitly handle preflight for all routes
app.options('*', cors(corsOptions));

// ✅ Serve static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MySQL session store
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// ✅ Session Middleware
app.use(
  session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// ✅ Import routes
const authRoutes = require('./routes/auth');
const clubAdminRoutes = require('./routes/clubAdmin');
const studentRoutes = require('./routes/student');
const eventRoutes = require('./routes/events');

app.use('/api/auth', authRoutes);
app.use('/api/clubAdmin', clubAdminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/events', eventRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is live on Render with MySQL session!');
});

// ✅ Global error handler for CORS errors
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS Error: Origin not allowed' });
  }
  next(err);
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
