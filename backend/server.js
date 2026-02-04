const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- SECURITY -------------------- */
app.use(helmet());

/* -------------------- RATE LIMITING -------------------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

/* -------------------- CORS (FIXED & PRODUCTION SAFE) -------------------- */
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

/* -------------------- BODY PARSERS -------------------- */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

/* -------------------- LOGGING -------------------- */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* -------------------- ROUTES -------------------- */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

/* -------------------- HEALTH CHECKS -------------------- */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'PrimeTrade API is live 🚀'
  });
});

/* -------------------- 404 HANDLER -------------------- */
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

module.exports = app;
