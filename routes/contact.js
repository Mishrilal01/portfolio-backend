const express = require('express');
const router = express.Router();
const Joi = require('joi');
const nodemailer = require('nodemailer');

// Validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(3).max(200).required(),
  message: Joi.string().min(10).max(2000).required()
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('✓ Email server is ready to send messages');
  }
});
router.get('/', (req, res) => {
  res.json({
    message: 'Contact API is working',  
    version: '1.0.0'}); });

// POST /api/contact - Send contact form email
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

    // Email to portfolio owner
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `Portfolio Contact: ${subject}`,
      html: `
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
                <p>Received from Mishrilal Parihar's Portfolio | ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Received: ${new Date().toLocaleString()}
      `
    };

    // Auto-reply to sender
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me! - Mishrilal Parihar',
      html: `
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

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

    // Log success
    console.log(`✓ Contact form submission from ${name} (${email})`);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! You will receive a confirmation email shortly.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    let errorMessage = 'An error occurred while sending your message. Please try again later.';
    
    if (error.code === 'ESOCKET' || error.code === 'ECONNRESET') {
      errorMessage = 'Email service connection failed. Please check your email configuration.';
    } else if (error.responseCode === 535) {
      errorMessage = 'Email authentication failed. Please check EMAIL_USER and EMAIL_PASSWORD in .env file.';
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
