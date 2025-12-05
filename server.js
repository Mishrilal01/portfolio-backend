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
const analyticsRoutes = require('./routes/analytics');
const healthRoutes = require('./routes/health');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

// Import middleware
const authMiddleware = require('./middleware/auth');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to allow inline scripts
})); // Security headers
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from public directory

// CORS Configuration - Allow all origins in development
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};
app.use(cors(corsOptions));

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // increased to 100 for testing
  message: 'Too many contact form submissions, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/contact', contactRoutes); // Rate limiter temporarily removed
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', authMiddleware, adminRoutes); // AUTH ENABLED

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Backend API',
    version: '1.0.0',
    author: 'Mishrilal Parihar',
    adminDashboard: '/admin.html',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact',
      analytics: '/api/analytics',
      admin: '/api/admin'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   Portfolio Backend Server Running     ║
  ║   Port: ${PORT}                           ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}        ║
  ╚════════════════════════════════════════╝
  `);
});

module.exports = app;
