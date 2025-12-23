const express = require('express');
const router = express.Router();
const Joi = require('joi');

// Validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(3).max(200).optional(),
  message: Joi.string().min(10).max(2000).required()
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
