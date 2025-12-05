const express = require('express');
const router = express.Router();

// In-memory analytics storage (for demo - use database in production)
let analytics = {
  pageViews: 0,
  contactFormSubmissions: 0,
  projectViews: {},
  visitors: new Set(),
  lastReset: new Date()
};

// GET /api/analytics - Get analytics data
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      pageViews: analytics.pageViews,
      contactFormSubmissions: analytics.contactFormSubmissions,
      projectViews: analytics.projectViews,
      uniqueVisitors: analytics.visitors.size,
      lastReset: analytics.lastReset
    }
  });
});

// POST /api/analytics/pageview - Track page view
router.post('/pageview', (req, res) => {
  const { page, visitorId } = req.body;
  
  analytics.pageViews++;
  
  if (visitorId) {
    analytics.visitors.add(visitorId);
  }
  
  res.json({
    success: true,
    message: 'Page view tracked',
    totalViews: analytics.pageViews
  });
});

// POST /api/analytics/project-view - Track project view
router.post('/project-view', (req, res) => {
  const { projectId, projectTitle } = req.body;
  
  if (!analytics.projectViews[projectId]) {
    analytics.projectViews[projectId] = {
      title: projectTitle,
      views: 0
    };
  }
  
  analytics.projectViews[projectId].views++;
  
  res.json({
    success: true,
    message: 'Project view tracked',
    projectViews: analytics.projectViews[projectId].views
  });
});

// POST /api/analytics/contact-submission - Track contact form submission
router.post('/contact-submission', (req, res) => {
  analytics.contactFormSubmissions++;
  
  res.json({
    success: true,
    message: 'Contact submission tracked',
    total: analytics.contactFormSubmissions
  });
});

// POST /api/analytics/reset - Reset analytics (admin only - add auth in production)
router.post('/reset', (req, res) => {
  analytics = {
    pageViews: 0,
    contactFormSubmissions: 0,
    projectViews: {},
    visitors: new Set(),
    lastReset: new Date()
  };
  
  res.json({
    success: true,
    message: 'Analytics reset successfully'
  });
});

module.exports = router;
