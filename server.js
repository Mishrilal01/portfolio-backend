const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const contactRoutes = require('./routes/contact');
const healthRoutes = require('./routes/health');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Import middleware
const authMiddleware = require('./middleware/auth');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to allow inline scripts
})); // Security headers

// Strapi-style Morgan logging
morgan.token('status-color', (req, res) => {
  const status = res.statusCode;
  const color = status >= 500 ? '\x1b[31m' : // red
               status >= 400 ? '\x1b[33m' : // yellow
               status >= 300 ? '\x1b[36m' : // cyan
               status >= 200 ? '\x1b[32m' : // green
               '\x1b[0m'; // default
  return color + status + '\x1b[0m';
});

const strapiFormat = '[:date[iso]] \x1b[36m:method\x1b[0m :url :status-color :response-time ms - :res[content-length]';
app.use(morgan(strapiFormat)); // Strapi-style logging

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from public directory

// CORS Configuration - Production ready with dynamic origin
const allowedOrigins = [
  'https://mishrilal1112-portfolio.vercel.app',
  'https://mishrilal-portfolio-backend.onrender.com/',
  'https://mishrilal-portfolio.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // 5 requests per window
  message: 'Too many contact form submissions, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// Root endpoint
app.use(express.static('public'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[' + new Date().toISOString() + '] \x1b[31m[error]\x1b[0m', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] \x1b[32m[info]\x1b[0m Server started successfully`);
  console.log(`[${timestamp}] \x1b[36m[info]\x1b[0m Port: ${PORT}`);
  console.log(`[${timestamp}] \x1b[36m[info]\x1b[0m Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[${timestamp}] \x1b[36m[info]\x1b[0m Frontend URL: ${process.env.FRONTEND_URL || 'https://mishrilal1112-portfolio.vercel.app'}`);
  console.log(`[${timestamp}] \x1b[32m[info]\x1b[0m ✓ Server ready at http://localhost:${PORT}\n`);
});

module.exports = app;
