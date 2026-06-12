const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...configuredOrigins,
]);

// Middleware
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include health checks and server-to-server calls.
    if (!origin || allowedOrigins.has(origin.replace(/\/+$/, ''))) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Chat App server is running' });
});

app.use((err, req, res, next) => {
  if (err.message?.includes('is not allowed by CORS')) {
    return res.status(403).json({ message: err.message });
  }
  return next(err);
});

// In production (split deployment), the frontend is hosted separately on Vercel
// This server only handles API requests. Non-API routes return 404.
if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.json({ message: 'ANPA AI API is running. Frontend is hosted separately.' });
  });
}

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
