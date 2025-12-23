# Portfolio Backend API

Backend server for Mishrilal Parihar's portfolio website with contact form, email functionality, analytics, and **secure admin dashboard**.

## 🚀 Features

- **Contact Form API**: Handle contact form submissions with email notifications
- **Email Service**: Production-grade **Brevo HTTP API** (no SMTP timeouts)
- **Analytics Tracking**: Track page views, project views, and form submissions
- **🔐 Admin Dashboard**: Manage projects and skills with secure JWT authentication
- **🔒 Authentication**: JWT-based authentication for protected routes
- **Security**: Helmet.js, CORS, rate limiting, bcrypt password hashing
- **Input Validation**: Joi schema validation
- **Error Handling**: Comprehensive error handling and logging
- **Cloud-Native**: Optimized for Render, Vercel, Railway, etc.

## 📋 Prerequisites

- Node.js (v14 or higher)
- Brevo account (free tier available)
- npm or yarn

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
cd portfolio-backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

# Brevo Email API (Production-grade, no SMTP timeouts)
BREVO_API_KEY=xkeysib-your-actual-api-key-here

# Email Configuration
EMAIL_USER=mishrilalparihar30221@gmail.com
RECIPIENT_EMAIL=mishrilalparihar30221@gmail.com

# CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
JWT_SECRET=your-secret-key-change-this-in-production
```

> ⚠️ **IMPORTANT**: Change `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `JWT_SECRET` before deploying to production!

### 3. Get Brevo API Key

1. Sign up at [Brevo](https://app.brevo.com) (free tier available)
2. Navigate to: **Settings** → **SMTP & API** → **API Keys**
3. Click **Generate a new API key**
4. Copy the API key (starts with `xkeysib-...`)
5. Add to `BREVO_API_KEY` in `.env`

📖 **Full Deployment Guide**: See [BREVO_DEPLOYMENT_GUIDE.md](./BREVO_DEPLOYMENT_GUIDE.md)

### 4. Run the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on `http://localhost:5000`

### 5. Access Admin Dashboard

1. Navigate to `http://localhost:5000/login.html`
2. Login with credentials:
   - **Username**: `admin` (or your custom username from .env)
   - **Password**: `Admin@123` (or your custom password from .env)
3. After login, you'll be redirected to the dashboard

📖 **Full Authentication Guide**: See [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for complete documentation.

## 📡 API Endpoints

### Public Endpoints

#### Health Check
```http
GET /api/health
```

#### Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project..."
}
```

#### Analytics
```http
GET /api/analytics
POST /api/analytics/pageview
POST /api/analytics/project-view
POST /api/analytics/contact-submission
POST /api/analytics/reset
```

### Protected Endpoints (Require Authentication)

#### Authentication
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123"
}

# Response includes JWT token
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "username": "admin" }
}
```

#### Admin - Projects Management
```http
# All requests require: Authorization: Bearer YOUR_TOKEN

GET    /api/admin/projects          # List all projects
GET    /api/admin/projects/:id      # Get single project
POST   /api/admin/projects          # Create project
PUT    /api/admin/projects/:id      # Update project
DELETE /api/admin/projects/:id      # Delete project
```

#### Admin - Skills Management
```http
# All requests require: Authorization: Bearer YOUR_TOKEN

GET    /api/admin/skills            # List all skills
POST   /api/admin/skills            # Create skill
DELETE /api/admin/skills/:id        # Delete skill
```

#### Admin - Dashboard
```http
GET /api/admin/dashboard
Authorization: Bearer YOUR_TOKEN

# Returns stats (total projects, skills, etc.)
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication (24h expiration)
- **bcrypt**: Password hashing with salt rounds
- **Protected Routes**: Middleware-based route protection
- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Prevents spam (5 requests per 15 minutes)
- **Input Validation**: Joi schema validation
- **Environment Variables**: Secure credential management

## 🛠️ Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Nodemailer**: Email sending
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Joi**: Input validation
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logging
- **Joi**: Input validation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting
- **Morgan**: HTTP request logger

## 📝 Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Validation Error",
  "details": "Email is required"
}
```

## 🚀 Deployment

### Deploy to Heroku

```bash
heroku create portfolio-backend
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set RECIPIENT_EMAIL=mishrilalparihar30221@gmail.com
heroku config:set FRONTEND_URL=https://your-portfolio-url.com
git push heroku main
```

### Deploy to Railway

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically

### Deploy to Render

1. Create new Web Service
2. Connect GitHub repository
3. Add environment variables
4. Deploy

## 📊 Monitoring

Check server health:
```bash
curl http://localhost:5000/api/health
```

View analytics:
```bash
curl http://localhost:5000/api/analytics
```

## 🐛 Troubleshooting

**Email not sending:**
- Verify Gmail App Password is correct
- Check if 2-Step Verification is enabled
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set in `.env`

**CORS errors:**
- Update `FRONTEND_URL` in `.env` to match your frontend URL
- Ensure frontend is running on the correct port

**Rate limit issues:**
- Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env`
- Wait 15 minutes and try again

## 📞 Support

For issues or questions:
- Email: mishrilalparihar30221@gmail.com
- GitHub: [@Mishrilal01](https://github.com/Mishrilal01)

## 📄 License

MIT License - feel free to use this for your own portfolio!
