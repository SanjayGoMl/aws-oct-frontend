# Crisis Journalist AI - Authentication Setup

## 🎯 Overview

This application now includes a complete authentication system that integrates with your backend API. Users must register/login before accessing the dashboard and creating news articles.

## 🔐 Authentication Features

### ✅ Implemented Features

- **User Registration** - Create new accounts with email, password, and full name
- **User Login** - Secure authentication with JWT tokens
- **Protected Routes** - Dashboard and Create News pages require authentication
- **User Profile Display** - Shows user initials and ID in sidebar
- **Logout Functionality** - Secure logout with token cleanup
- **Beautiful UI** - Lottie animations on login/register pages
- **Form Validation** - Client-side validation for all inputs
- **Error Handling** - Clear error messages for API failures
- **Auto-login** - Users stay logged in after registration
- **Token Storage** - JWT tokens stored securely in localStorage

## 📁 New Files Created

```
crisis-journalist-ai/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          ✨ NEW - Login page
│   │   └── Register.jsx       ✨ NEW - Registration page
│   ├── components/
│   │   └── LottieCarousel.jsx ✨ NEW - Animated carousel for auth pages
│   └── services/
│       └── authService.js     ✨ NEW - Authentication API service
```

## 🔄 Modified Files

```
crisis-journalist-ai/
├── .env.example               ✏️ UPDATED - Added auth config
├── src/
│   ├── App.jsx                ✏️ UPDATED - Added auth routing
│   ├── components/
│   │   └── Navbar.jsx         ✏️ UPDATED - Added user profile & logout
│   └── pages/
│       ├── Dashboard.jsx      ✏️ UPDATED - Uses user_id from auth
│       └── CreateNews.jsx     ✏️ UPDATED - Uses user_id from auth
```

## 🚀 Quick Start

### 1. Update Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
# API Configuration
VITE_API_BASE_URL=http://0.0.0.0:8000
VITE_AUTH_API_BASE_URL=http://0.0.0.0:8000

# JWT Token Storage Keys
VITE_TOKEN_STORAGE_KEY=crisis_journalist_auth_token
VITE_USER_STORAGE_KEY=crisis_journalist_user_data

# Other configurations...
VITE_API_TIMEOUT=120000
VITE_API_UPLOAD_TIMEOUT=300000
VITE_MAX_UPLOAD_SIZE=104857600
```

### 2. Ensure Backend is Running

Make sure your backend API is running on `http://0.0.0.0:8000` with the following endpoints available:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### 3. Install Dependencies (if needed)

The required packages are already in your `package.json`:

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Test Authentication

1. Navigate to `http://localhost:5173`
2. You'll see the **Login** page by default
3. Click "Sign up" to create a new account
4. After registration, you'll be automatically logged in
5. Your user ID will be displayed in the sidebar

## 📋 API Integration

### Registration API

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "user_id": "de7d5a17c3d9",
    "email": "user@example.com",
    "full_name": "John Doe",
    "initials": "JD",
    "last_login": "2025-10-23T06:09:54.714960Z"
  }
}
```

### Login API

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "user_id": "de7d5a17c3d9",
    "email": "user@example.com",
    "full_name": "John Doe",
    "initials": "JD",
    "last_login": "2025-10-23T06:09:54.714960Z"
  }
}
```

## 🎨 UI Components

### Login Page

- **Left Side:** Lottie animation carousel
  - User Profile.json
  - Startup and teamwork concept web banner.json
  - Company employees sharing thoughts and ideas.json
- **Right Side:** Login form with email/password fields
- **Features:** 
  - Form validation
  - Error messages
  - Loading states
  - Link to registration

### Register Page

- **Left Side:** Lottie animation carousel (same animations)
- **Right Side:** Registration form
- **Fields:**
  - Full Name (min 2 characters)
  - Email (valid email format)
  - Password (min 6 characters)
  - Confirm Password (must match)
- **Features:**
  - Real-time validation
  - Error messages
  - Success feedback
  - Link to login

### Navbar Enhancement

- **User Profile Card:**
  - Circular avatar with initials
  - User's full name
  - User ID display
- **Logout Button:**
  - Red-themed button
  - Clears tokens and redirects to login

## 🔒 Security Features

### ✅ What's Secure

1. **JWT Tokens:** Stored in localStorage (configurable key)
2. **Password Requirements:** Minimum 6 characters (enforced by backend)
3. **Token Expiry:** 24 hours (configurable in backend)
4. **Protected Routes:** Automatic redirect to login if not authenticated
5. **Error Handling:** No sensitive data exposed in error messages
6. **Email Validation:** Client and server-side validation

### ⚠️ Important Security Notes

- Tokens are stored in **localStorage** (not sessionStorage)
- For production, consider implementing:
  - HTTPS for all API calls
  - Refresh token mechanism
  - Token expiry refresh
  - CSRF protection
  - Rate limiting

## 📊 User Flow

```
1. User visits app → Redirected to Login
                        ↓
2. User clicks "Sign up" → Register Page
                        ↓
3. User fills form → Validates → API Call
                        ↓
4. Registration success → Token stored → Auto-login
                        ↓
5. Redirected to Dashboard → Shows user's projects (by user_id)
                        ↓
6. User creates news → Uploads associated with their user_id
                        ↓
7. User clicks Logout → Token cleared → Back to Login
```

## 🎯 Key Changes Summary

### Before Authentication
- **User ID:** Hardcoded as `'101'` for all users
- **Access:** Anyone could access dashboard
- **Data:** All projects shared across sessions

### After Authentication
- **User ID:** Unique per user (from registration)
- **Access:** Login required for all pages
- **Data:** Each user sees only their own projects
- **Profile:** User info displayed in sidebar

## 🧪 Testing

### Test Registration

```bash
curl -X 'POST' \
  'http://0.0.0.0:8000/api/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "full_name": "Test User"
  }'
```

### Test Login

```bash
curl -X 'POST' \
  'http://0.0.0.0:8000/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

## 🐛 Troubleshooting

### Issue: "Network error: Unable to reach server"
**Solution:** Ensure backend is running on `http://0.0.0.0:8000`

### Issue: "Email already registered"
**Solution:** Use a different email or login with existing account

### Issue: "Invalid email or password"
**Solution:** Double-check credentials, passwords are case-sensitive

### Issue: User ID not showing in Dashboard
**Solution:** Logout and login again to refresh user data

### Issue: Lottie animations not loading
**Solution:** Ensure JSON files exist in `/public` directory

## 📝 Environment Variables Reference

```bash
# Backend API URL
VITE_API_BASE_URL=http://0.0.0.0:8000
VITE_AUTH_API_BASE_URL=http://0.0.0.0:8000

# LocalStorage Keys (customize if needed)
VITE_TOKEN_STORAGE_KEY=crisis_journalist_auth_token
VITE_USER_STORAGE_KEY=crisis_journalist_user_data

# API Timeouts
VITE_API_TIMEOUT=120000
VITE_API_UPLOAD_TIMEOUT=300000

# File Upload
VITE_MAX_UPLOAD_SIZE=104857600

# CORS
VITE_API_WITH_CREDENTIALS=false

# Environment
VITE_NODE_ENV=development
```

## 🎉 Success!

Your Crisis Journalist AI app now has:

✅ Complete authentication system  
✅ Beautiful login/register pages with Lottie animations  
✅ Protected routes (no unauthorized access)  
✅ User-specific data isolation  
✅ Profile display with user initials  
✅ Secure logout functionality  
✅ Form validation and error handling  
✅ Integration with your existing backend API  

## 📚 Additional Resources

- **Backend Auth Docs:** Check `AUTHENTICATION_DOCUMENTATION.md` in `AWS_October/`
- **API Quick Ref:** See `AUTH_QUICK_REFERENCE.md` in `AWS_October/`
- **Frontend Config:** Review `.env.example` for all options

---

**Last Updated:** October 23, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready for Production
