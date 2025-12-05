# 🚀 Quick Start Guide - Authentication

## Access Points

### 🔑 Login Page
```
http://localhost:5000/login.html
```

### 📊 Admin Dashboard  
```
http://localhost:5000/dashboard.html
```
*(Redirects to login if not authenticated)*

## Default Credentials

```
Username: admin
Password: Admin@123
```

## Quick Commands

### Start Backend Server
```bash
cd portfolio-backend
npm run dev
```

### Test Authentication
```bash
# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Use token for protected request
curl http://localhost:5000/api/admin/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Browser Console Commands

### Check if logged in
```javascript
localStorage.getItem('adminToken')
```

### Manual logout
```javascript
localStorage.removeItem('adminToken');
window.location.href = '/login.html';
```

### Decode token (to see expiry)
```javascript
const token = localStorage.getItem('adminToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));
```

## Common Issues

### ❌ "Access denied. No token provided"
**Solution**: Login at `/login.html` first

### ❌ "Invalid or expired token"  
**Solution**: Token expired (24h), login again

### ❌ Dashboard keeps redirecting to login
**Solution**: Check token in localStorage, verify backend is running

### ❌ 401 errors on all API calls
**Solution**: Restart backend server after adding authentication

## File Structure

```
portfolio-backend/
├── middleware/
│   └── auth.js              # JWT verification
├── routes/
│   ├── auth.js              # Login/logout endpoints
│   └── admin.js             # Protected CRUD routes
├── public/
│   ├── login.html           # Login page
│   └── dashboard.html       # Admin dashboard (protected)
├── .env                     # Admin credentials + JWT secret
└── server.js                # Routes with authMiddleware
```

## Environment Variables

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
JWT_SECRET=your-secret-key-change-this-in-production-mishrilal-portfolio-2024
```

**⚠️ Change these before production!**

## Token Lifespan

- **Expiration**: 24 hours
- **Storage**: localStorage
- **Format**: Bearer token
- **Header**: `Authorization: Bearer {token}`

## Pages

| Page | URL | Auth Required |
|------|-----|---------------|
| Login | `/login.html` | ❌ No |
| Dashboard | `/dashboard.html` | ✅ Yes |
| Health Check | `/api/health` | ❌ No |
| Contact API | `/api/contact` | ❌ No |
| Admin API | `/api/admin/*` | ✅ Yes |

## Development Workflow

1. Start backend: `npm run dev`
2. Open login: `http://localhost:5000/login.html`
3. Login with `admin` / `Admin@123`
4. Access dashboard to manage projects/skills
5. Logout when done

## Production Checklist

- [ ] Change `ADMIN_USERNAME` in `.env`
- [ ] Change `ADMIN_PASSWORD` to strong password
- [ ] Generate new `JWT_SECRET` (64+ chars random)
- [ ] Update `API_URL` in dashboard.html
- [ ] Enable HTTPS
- [ ] Remove default credentials from login page
- [ ] Set `NODE_ENV=production`

---

**For detailed documentation, see:**
- `AUTHENTICATION_GUIDE.md` - Complete auth system guide
- `README.md` - Full backend documentation
- `SETUP.md` - Initial setup instructions
