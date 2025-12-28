const express = require('express');
const router = express.Router();
const Joi = require('joi');
const axios = require('axios');

// Validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(3).max(200).optional(),
  message: Joi.string().min(10).max(2000).required()
});

// Email verification schema
const emailVerifySchema = Joi.object({
  email: Joi.string().email().required()
});

// In-memory storage for contact messages (use database in production)
let contactMessages = [];

// Health check route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Contact API is working',
    version: '3.0.0',
    note: 'Email handling is done via EmailJS on frontend'
  });
});

// POST /api/contact/verify-email - Verify if email exists (free method)
router.post('/verify-email', async (req, res) => {
  try {
    const { error, value } = emailVerifySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Invalid email format'
      });
    }

    const { email } = value;

    // Basic validation checks
    const emailLower = email.toLowerCase();
    
    // 1. Check for common disposable email domains
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', '10minutemail.com', 
      'throwaway.email', 'mailinator.com', 'trashmail.com',
      'temp-mail.org', 'fakeinbox.com', 'yopmail.com'
    ];
    
    const domain = emailLower.split('@')[1];
    if (disposableDomains.includes(domain)) {
      return res.json({
        success: true,
        valid: false,
        message: 'Disposable email addresses are not allowed',
        reason: 'disposable'
      });
    }

    // 2. Check for common typos in popular domains
    const commonDomains = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gamil.com', 'gmal.com'],
      'yahoo.com': ['yaho.com', 'yahooo.com', 'yhoo.com'],
      'hotmail.com': ['hotmal.com', 'hotmial.com', 'hotmali.com'],
      'outlook.com': ['outlok.com', 'outloo.com']
    };

    for (const [correct, typos] of Object.entries(commonDomains)) {
      if (typos.includes(domain)) {
        return res.json({
          success: true,
          valid: false,
          message: `Did you mean ${emailLower.replace(domain, correct)}?`,
          suggestion: emailLower.replace(domain, correct),
          reason: 'typo'
        });
      }
    }

    // 3. Check if domain has MX records (DNS validation) - Best free option
    try {
      const dns = require('dns').promises;
      const mxRecords = await dns.resolveMx(domain);
      
      if (!mxRecords || mxRecords.length === 0) {
        return res.json({
          success: true,
          valid: false,
          message: 'Email domain does not exist or cannot receive emails',
          reason: 'no-mx-records'
        });
      }

      // Email passes all checks
      return res.json({
        success: true,
        valid: true,
        message: 'Email appears to be valid',
        domain: domain
      });

    } catch (dnsError) {
      // DNS lookup failed - domain doesn't exist
      return res.json({
        success: true,
        valid: false,
        message: 'Email domain does not exist',
        reason: 'invalid-domain'
      });
    }

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      valid: false,
      message: 'Verification failed',
      error: error.message
    });
  }
});

// POST /api/contact - Store contact form submission
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const { name, email, subject, message } = value;

    // Store message
    const contactMessage = {
      id: Date.now(),
      name,
      email,
      subject: subject || 'No subject',
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    contactMessages.push(contactMessage);

    // Log the message
    console.log('📧 New contact message received:', {
      from: name,
      email: email,
      subject: subject || 'No subject'
    });

    res.json({
      success: true,
      message: 'Message received successfully! Email sent via EmailJS.',
      data: {
        id: contactMessage.id,
        timestamp: contactMessage.timestamp
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// GET /api/contact/messages - Get all messages (for admin)
router.get('/messages', (req, res) => {
  res.json({
    success: true,
    data: [...contactMessages].reverse(), // Latest first, create copy
    count: contactMessages.length
  });
});

// DELETE /api/contact/messages/:id - Delete a message
router.delete('/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = contactMessages.findIndex(msg => msg.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Message not found'
    });
  }
  
  contactMessages.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Message deleted successfully'
  });
});

module.exports = router;
