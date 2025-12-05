const express = require('express');
const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
  };

  try {
    res.status(200).json({
      success: true,
      ...healthCheck
    });
  } catch (error) {
    healthCheck.message = error.message;
    res.status(503).json({
      success: false,
      ...healthCheck
    });
  }
});

module.exports = router;
