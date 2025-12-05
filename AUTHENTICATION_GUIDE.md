# 🔐 Authentication System Guide

## Overview
Your portfolio backend now has a complete JWT-based authentication system to secure the admin dashboard and API endpoints.

## 📋 Features

### ✅ Implemented
- **JWT Authentication**: Secure token-based authentication with 24-hour expiration
- **Protected Routes**: All admin API endpoints require valid JWT token
- **Login Page**: Beautiful gradient UI at `/login.html`
- **Auto-Redirect**: Unauthorized users redirected to login
- **Session Management**: Token stored in localStorage
- **Logout Functionality**: Clear token and return to login
- **Error Handling**: Token expiration and invalid token detection

## 🔑 Default Credentials

**Username**: `admin`  
**Password**: `Admin@123`

> ⚠️ **IMPORTANT**: Change these credentials in `.env` file before deployment!

## 📁 Files Modified

### 1. **`.env`** - Environment Configuration
```env
# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
JWT_SECRET=your-secret-key-change-this-in-production-mishrilal-portfolio-2024
```

### 2. **`middleware/auth.js`** - JWT Verification Middleware
- Extracts Bearer token from Authorization header
- Verifies token using `JWT_SECRET`
- Returns 401 for missing/invalid tokens
- Sets `req.user` with decoded token payload

### 3. **`routes/auth.js`** - Authentication Routes
```javascript
POST /api/auth/login      // Login and get JWT token
GET  /api/auth/verify     // Verify token validity
POST /api/auth/logout     // Logout endpoint
```

### 4. **`server.js`** - Main Server
- Added `authRoutes` and `authMiddleware` imports
- Protected admin routes: `app.use('/api/admin', authMiddleware, adminRoutes)`
- Added `/api/auth` routes

### 5. **`public/login.html`** - Login Page
- Beautiful gradient purple design
- Form validation
- localStorage token storage
- Auto-redirect if already logged in
- Error handling with shake animation
- Loading states

### 6. **`public/dashboard.html`** - Admin Dashboard
- Auth check on page load
- Logout button in header
- `authenticatedFetch()` wrapper for all API calls
- Auto-redirect on 401 responses
- Token included in all admin API requests

## 🚀 How It Works

### Login Flow
```
1. User visits http://localhost:5000/login.html
2. Enters username and password
3. Frontend POSTs to /api/auth/login
4. Backend validates credentials against .env
5. Backend generates JWT token (24h expiration)
6. Token stored in localStorage
7. User redirected to /dashboard.html
```

### Dashboard Access Flow
```
1. Dashboard loads, checks for token in localStorage
2. If no token → redirect to /login.html
3. If token exists → include in all API requests
4. All requests use: Authorization: Bearer {token}
5. Backend middleware verifies token
6. If valid → proceed with request
7. If invalid/expired → return 401, frontend redirects to login
```

### API Request Example
```javascript
// All admin API calls now use this wrapper
async function authenticatedFetch(url, options = {}) {
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        // Session expired
        localStorage.removeItem('adminToken');
        window.location.href = '/login.html';
        return null;
    }

    return response;
}
```

## 🔒 Security Features

1. **JWT Tokens**: Cryptographically signed, tamper-proof
2. **24-Hour Expiration**: Tokens automatically expire
3. **Bearer Token**: Industry-standard authorization header
4. **Password Validation**: Credentials checked against environment variables
5. **Protected Routes**: All `/api/admin/*` endpoints require authentication
6. **Auto-Logout**: Invalid/expired tokens trigger automatic logout
7. **Secure Storage**: Tokens stored in localStorage (cleared on logout)

## 📝 API Endpoints

### Public Endpoints (No Auth Required)
```
GET  /api/health           - Health check
POST /api/contact          - Contact form submission
GET  /api/analytics        - View analytics (currently public)
POST /api/auth/login       - Login
```

### Protected Endpoints (Require JWT)
```
GET    /api/admin/dashboard        - Dashboard stats
GET    /api/admin/projects         - List all projects
GET    /api/admin/projects/:id     - Get single project
POST   /api/admin/projects         - Create project
PUT    /api/admin/projects/:id     - Update project
DELETE /api/admin/projects/:id     - Delete project
GET    /api/admin/skills           - List all skills
POST   /api/admin/skills           - Create skill
DELETE /api/admin/skills/:id       - Delete skill
```

## 🧪 Testing the Authentication

### 1. Test Login
```bash
# Open browser and navigate to:
http://localhost:5000/login.html

# Enter credentials:
Username: admin
Password: Admin@123

# Should redirect to dashboard
```

### 2. Test Protected API (Using curl)
```bash
# Login first to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Response will include token:
# {"success":true,"token":"eyJhbGc...","user":{"username":"admin"}}

# Use token for protected requests
curl http://localhost:5000/api/admin/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Test Without Token (Should Fail)
```bash
# Try accessing admin endpoint without token
curl http://localhost:5000/api/admin/projects

# Expected Response:
# {"success":false,"error":"Access denied. No token provided"}
```

### 4. Test Dashboard Direct Access
```bash
# Clear localStorage in browser console:
localStorage.removeItem('adminToken')

# Try to access dashboard:
http://localhost:5000/dashboard.html

# Should automatically redirect to login page
```

## 🔧 Customization

### Change Admin Credentials
Edit `.env` file:
```env
ADMIN_USERNAME=your_custom_username
ADMIN_PASSWORD=YourStrongPassword123!
```

### Change JWT Secret (REQUIRED for Production)
```env
JWT_SECRET=your-very-strong-random-secret-key-min-32-characters
```

Generate a strong secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or online generator:
# https://randomkeygen.com/
```

### Change Token Expiration
Edit `routes/auth.js`:
```javascript
const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: '7d'  // Change from 24h to 7 days
});
```

## 🚨 Production Checklist

Before deploying to production:

- [ ] Change `ADMIN_USERNAME` to non-default value
- [ ] Change `ADMIN_PASSWORD` to strong password (min 12 chars, mixed case, numbers, symbols)
- [ ] Change `JWT_SECRET` to cryptographically random 64+ character string
- [ ] Update `API_URL` in dashboard.html to production backend URL
- [ ] Enable HTTPS (required for secure authentication)
- [ ] Update CORS settings for production frontend domain
- [ ] Re-enable rate limiting
- [ ] Set `NODE_ENV=production`
- [ ] Remove default credentials display from login.html
- [ ] Add password reset functionality (optional)
- [ ] Add multi-factor authentication (optional)
- [ ] Use environment-specific .env files
- [ ] Set secure cookie flags if using cookies

## 🐛 Troubleshooting

### "Access denied. No token provided"
- Token not being sent in Authorization header
- Check `authenticatedFetch()` is being used
- Verify token exists in localStorage

### "Invalid or expired token"
- Token has expired (24h limit)
- Token was tampered with
- JWT_SECRET mismatch
- Solution: Login again

### Infinite redirect loop
- Check token is being saved to localStorage after login
- Verify checkAuth() function in dashboard.html
- Check browser console for errors

### 401 errors on all admin API calls
- Ensure backend server restarted after adding auth
- Check authMiddleware is applied to routes
- Verify token format: `Bearer YOUR_TOKEN_HERE`

## 📚 Code Examples

### Frontend - Making Authenticated Request
```javascript
// Get token from localStorage
const token = localStorage.getItem('adminToken');

// Make authenticated request
const response = await fetch('http://localhost:5000/api/admin/projects', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

const data = await response.json();
```

### Backend - Accessing Authenticated User
```javascript
// In any protected route
app.get('/api/admin/something', authMiddleware, (req, res) => {
    // req.user contains decoded token
    console.log('Authenticated user:', req.user.username);
    
    // Your route logic here
    res.json({ success: true, user: req.user });
});
```

## 🔗 Related Documentation

- **SETUP.md** - Initial backend setup guide
- **README.md** - Complete backend documentation
- **package.json** - Dependencies (bcryptjs, jsonwebtoken)

## 📞 Support

If you encounter issues:
1. Check backend logs for errors
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure backend server is running
5. Test with curl/Postman to isolate issues

---

**Created**: November 30, 2025  
**Last Updated**: November 30, 2025  
**Version**: 1.0.0  
**Author**: Mishrilal Parihar Portfolio Backend
