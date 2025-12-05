# Backend Setup Guide

## Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd portfolio-backend
npm install
```

### Step 2: Create .env File
```bash
cp .env.example .env
```

### Step 3: Get Gmail App Password

1. **Enable 2-Step Verification:**
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification" and follow setup

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update .env:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Paste app password here
RECIPIENT_EMAIL=mishrilalparihar30221@gmail.com
```

### Step 4: Start Backend Server
```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║   Portfolio Backend Server Running     ║
║   Port: 5000                           ║
║   Environment: development             ║
║   Frontend: http://localhost:3000      ║
╚════════════════════════════════════════╝
✓ Email server is ready to send messages
```

### Step 5: Test It!

1. **Start React frontend** (in another terminal):
```bash
cd portfolio-react
npm start
```

2. **Go to Contact page** and send a test message

3. **Check your email** - you should receive the message!

## 🎉 Done!

Your portfolio now has a fully functional backend with:
- ✅ Real email sending
- ✅ Auto-reply to users
- ✅ Beautiful HTML emails
- ✅ Analytics tracking
- ✅ Rate limiting (anti-spam)
- ✅ Security features

## Troubleshooting

**"Email configuration error":**
- Make sure you created an App Password (not your regular Gmail password)
- Check that 2-Step Verification is enabled
- Verify EMAIL_USER and EMAIL_PASSWORD in .env

**"Connection refused on port 5000":**
- Make sure no other app is using port 5000
- Try changing PORT in .env to 5001

**"Network error" in frontend:**
- Ensure backend is running (`npm run dev`)
- Check that frontend is calling `http://localhost:5000`
- Verify CORS settings in backend

## Production Deployment

See README.md for deployment instructions to:
- Heroku
- Railway
- Render
- Vercel
