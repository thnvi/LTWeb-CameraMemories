const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

const app = express();

app.use(
  cors({
    // Dev-friendly CORS: allow localhost on any port, plus explicit origins via CLIENT_ORIGIN (comma-separated)
    origin: (origin, callback) => {
      const allowList = new Set(
        (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      );

      // Allow requests with no origin (e.g., curl, Postman)
      if (!origin) return callback(null, true);

      // Allow any localhost/127.0.0.1 port in dev
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);

      if (allowList.has(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
