const express = require('express');
const router = express.Router();
const Joi = require('joi');
const axios = require('axios');

// Validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(3).max(200).required(),
  message: Joi.string().min(10).max(2000).required()
});

// Brevo API configuration - Production-grade HTTP API (No SMTP timeouts)
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// Verify Brevo API key on startup
if (!BREVO_API_KEY) {
  console.error('⚠️ BREVO_API_KEY not found in environment variables');
  console.error('⚠️ Email service will not work until BREVO_API_KEY is configured');
} else {
  console.log('✅ Brevo Email API configured and ready');
}

// Health check route
router.get('/', (req, res) => {
  res.json({
    message: 'Contact API is working',
    version: '2.0.0',
    method: 'Brevo HTTP API (No SMTP)'
  });
});

// POST /api/contact - Send contact form email via Brevo HTTP API
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

    // Check if API key is configured
    if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY is not configured');
      return res.status(500).json({
        success: false,
        error: 'Email service not configured',
        message: 'The email service is currently unavailable. Please try again later.'
      });
    }

    // Email to portfolio owner
    const ownerEmailPayload = {
      sender: {
        name: 'Portfolio Contact Form',
        email: process.env.EMAIL_USER || 'noreply@portfolio.com'
      },
      to: [
        {
          email: process.env.RECIPIENT_EMAIL,
          name: 'Mishrilal Parihar'
        }
      ],
      replyTo: {
        email: email,
        name: name
      },
      subject: `Portfolio Contact: ${subject}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
            .value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="footer">
                <p>Received: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Auto-reply to sender
    const autoReplyPayload = {
      sender: {
        name: 'Mishrilal Parihar',
        email: process.env.EMAIL_USER || 'noreply@portfolio.com'
      },
      to: [
        {
          email: email,
          name: name
        }
      ],
      subject: 'Thank you for contacting me! - Mishrilal Parihar',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You, ${name}! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
              
              <p><strong>Your message:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 5px; border-left: 3px solid #667eea;">
                ${message.replace(/\n/g, '<br>')}
              </p>
              
              <p>In the meantime, feel free to:</p>
              <ul>
                <li>Check out my <a href="https://github.com/Mishrilal01">GitHub</a> for my latest projects</li>
                <li>Connect with me on <a href="https://www.linkedin.com/in/mis-p/">LinkedIn</a></li>
                <li>Follow me on <a href="https://x.com/MishrilalP61951">Twitter</a></li>
              </ul>
              
              <p>Best regards,<br><strong>Mishrilal Parihar</strong><br>Data Analyst | Aspiring Data Scientist</p>
              
              <div class="footer">
                <p>This is an automated response. I'll reply personally soon!</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send both emails via Brevo HTTP API with proper timeout (fail fast)
    const axiosConfig = {
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      timeout: 10000 // 10 seconds timeout - fail fast, no 60s hangs
    };

    console.log(`📧 Sending email from ${name} (${email})...`);

    // Send email to portfolio owner
    const ownerEmailResponse = await axios.post(BREVO_API_URL, ownerEmailPayload, axiosConfig);
    
    if (ownerEmailResponse.status !== 201) {
      throw new Error(`Failed to send owner email: ${ownerEmailResponse.status}`);
    }

    console.log(`✅ Owner email sent - Message ID: ${ownerEmailResponse.data.messageId}`);

    // Send auto-reply to sender (non-critical)
    try {
      const autoReplyResponse = await axios.post(BREVO_API_URL, autoReplyPayload, axiosConfig);
      
      if (autoReplyResponse.status === 201) {
        console.log(`✅ Auto-reply sent - Message ID: ${autoReplyResponse.data.messageId}`);
      }
    } catch (autoReplyError) {
      // Auto-reply failure is non-critical
      console.warn('⚠️ Auto-reply failed but owner email sent successfully');
      console.warn('⚠️', autoReplyError.message);
    }

    // Success response
    res.status(200).json({
      success: true,
      message: 'Message sent successfully! You will receive a confirmation email shortly.'
    });

  } catch (error) {
    console.error('❌ Contact form error:', error.message);
    
    let errorMessage = 'An error occurred while sending your message. Please try again later.';
    let statusCode = 500;
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Email service timeout. Please try again.';
      console.error('❌ Brevo API timeout (10s)');
    } else if (error.response) {
      // Brevo API error response
      console.error('❌ Brevo API Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        errorMessage = 'Email service authentication failed.';
        console.error('❌ Invalid BREVO_API_KEY - Please check your API key');
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid email request. Please check your input.';
        console.error('❌ Bad request to Brevo API');
      } else if (error.response.status === 429) {
        errorMessage = 'Too many requests. Please try again in a few minutes.';
        console.error('❌ Brevo API rate limit exceeded');
      }
      
      statusCode = error.response.status;
    } else if (error.request) {
      console.error('❌ No response from Brevo API');
      errorMessage = 'Email service unavailable. Please try again later.';
    }
    
    res.status(statusCode).json({
      success: false,
      error: 'Failed to send message',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
