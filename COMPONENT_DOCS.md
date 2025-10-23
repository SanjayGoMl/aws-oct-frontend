# Component Documentation

## Authentication Components

### 🔐 Login Component (`src/pages/Login.jsx`)

**Purpose:** Handles user authentication and login

**Props:**
- `onLoginSuccess(userData)` - Callback function called after successful login
- `onShowRegister()` - Callback to switch to registration page

**Features:**
- Email/password input with icons
- Form validation
- Error message display
- Loading states with spinner
- Lottie animation carousel on left side
- Responsive design (50/50 split)

**Usage:**
```jsx
<Login 
  onLoginSuccess={(user) => {
    console.log('User logged in:', user);
    // Handle successful login
  }}
  onShowRegister={() => {
    // Switch to register page
  }}
/>
```

---

### 📝 Register Component (`src/pages/Register.jsx`)

**Purpose:** Handles new user registration

**Props:**
- `onRegisterSuccess(userData)` - Callback function called after successful registration
- `onShowLogin()` - Callback to switch to login page

**Features:**
- Full name, email, password, confirm password inputs
- Real-time form validation
- Validation error messages per field
- Success message after registration
- Auto-login after registration
- Lottie animation carousel on left side

**Validations:**
- Full name: min 2 characters
- Email: valid email format
- Password: min 6 characters
- Confirm password: must match password

**Usage:**
```jsx
<Register 
  onRegisterSuccess={(user) => {
    console.log('User registered:', user);
    // Handle successful registration
  }}
  onShowLogin={() => {
    // Switch to login page
  }}
/>
```

---

### 🎠 LottieCarousel Component (`src/components/LottieCarousel.jsx`)

**Purpose:** Displays rotating Lottie animations with dot indicators

**Props:**
- `animations` - Array of animation file paths (required)
- `autoPlay` - Boolean to enable auto-rotation (default: true)
- `interval` - Time in ms between slides (default: 5000)

**Features:**
- Auto-advances through animations
- Smooth transitions
- Dot indicators showing current slide
- Clickable dots for manual navigation
- Responsive design

**Usage:**
```jsx
<LottieCarousel 
  animations={[
    '/User Profile.json',
    '/Startup and teamwork concept web banner.json',
    '/Company employees sharing thoughts and ideas.json'
  ]}
  autoPlay={true}
  interval={5000}
/>
```

---

### 🔧 AuthService (`src/services/authService.js`)

**Purpose:** Handles all authentication API calls and token management

**Methods:**

#### `register(userData)`
Register a new user

**Parameters:**
```javascript
{
  email: 'user@example.com',
  password: 'password123',
  full_name: 'John Doe'
}
```

**Returns:** Promise with response data including token and user info

**Usage:**
```javascript
try {
  const response = await authService.register({
    email: 'user@example.com',
    password: 'password123',
    full_name: 'John Doe'
  });
  console.log('Token:', response.token);
  console.log('User:', response.user);
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

---

#### `login(credentials)`
Login existing user

**Parameters:**
```javascript
{
  email: 'user@example.com',
  password: 'password123'
}
```

**Returns:** Promise with response data including token and user info

**Usage:**
```javascript
try {
  const response = await authService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  console.log('Logged in:', response.user);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

---

#### `logout()`
Clear user session and tokens

**Usage:**
```javascript
authService.logout();
// User is now logged out
```

---

#### `getToken()`
Get stored JWT token

**Returns:** String (token) or null

**Usage:**
```javascript
const token = authService.getToken();
if (token) {
  console.log('User has token');
}
```

---

#### `getUser()`
Get stored user data

**Returns:** Object (user data) or null

**Usage:**
```javascript
const user = authService.getUser();
if (user) {
  console.log('User ID:', user.user_id);
  console.log('Email:', user.email);
  console.log('Name:', user.full_name);
  console.log('Initials:', user.initials);
}
```

---

#### `isAuthenticated()`
Check if user is logged in

**Returns:** Boolean

**Usage:**
```javascript
if (authService.isAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('User needs to login');
}
```

---

#### `getAuthHeader()`
Get Authorization header for API requests

**Returns:** Object with Authorization header

**Usage:**
```javascript
const headers = authService.getAuthHeader();
// { Authorization: 'Bearer eyJhbGci...' }

// Use in API calls
fetch('/api/some-endpoint', {
  headers: {
    ...authService.getAuthHeader(),
    'Content-Type': 'application/json'
  }
});
```

---

## Updated Components

### 📊 Dashboard Component (`src/pages/Dashboard.jsx`)

**New Props:**
- `user` - User object from authentication

**Changes:**
- Now uses `user.user_id` instead of hardcoded '101'
- Displays only projects belonging to authenticated user
- Fetches projects specific to the user

**Usage:**
```jsx
<Dashboard user={user} />
```

---

### ✍️ CreateNews Component (`src/pages/CreateNews.jsx`)

**New Props:**
- `user` - User object from authentication

**Changes:**
- Now uses `user.user_id` for uploads
- Projects are associated with authenticated user
- User-specific project creation

**Usage:**
```jsx
<CreateNews user={user} />
```

---

### 🧭 Navbar Component (`src/components/Navbar.jsx`)

**New Props:**
- `user` - User object from authentication
- `onLogout()` - Callback for logout action

**New Features:**
- User profile card with avatar
- Displays user initials and ID
- Logout button

**Usage:**
```jsx
<Navbar 
  user={user} 
  onLogout={() => {
    authService.logout();
    // Redirect to login
  }} 
/>
```

---

## Data Structures

### User Object
```javascript
{
  user_id: 'de7d5a17c3d9',      // 12-char unique ID
  email: 'user@example.com',     // User's email
  full_name: 'John Doe',         // User's full name
  initials: 'JD',                // Calculated initials
  last_login: '2025-10-23T06:09:54Z' // ISO timestamp
}
```

### Auth Response
```javascript
{
  message: 'Login successful',
  token: 'eyJhbGci...',           // JWT token
  token_type: 'bearer',
  expires_in: 86400,              // Seconds (24 hours)
  user: {
    user_id: 'de7d5a17c3d9',
    email: 'user@example.com',
    full_name: 'John Doe',
    initials: 'JD',
    last_login: '2025-10-23T06:09:54Z'
  }
}
```

---

## Styling

All authentication components use **inline styles** to avoid dependency on external CSS libraries. This ensures:

- ✅ No additional CSS framework needed
- ✅ Self-contained components
- ✅ Easy to customize
- ✅ Consistent styling
- ✅ Framer Motion for animations

### Color Palette

**Login Page:**
- Gradient: `#1e40af → #7c3aed → #06b6d4` (Blue → Purple → Cyan)

**Register Page:**
- Gradient: `#7c3aed → #ec4899 → #1e40af` (Purple → Pink → Blue)

**Buttons:**
- Primary: Linear gradient matching page theme
- Hover: Slightly darker gradient
- Disabled: Gray (`#9ca3af`)

**Logout Button:**
- Background: `rgba(239, 68, 68, 0.1)` (Red tint)
- Hover: `rgba(239, 68, 68, 0.2)`
- Color: `#fca5a5` (Light red)

---

## Environment Configuration

### Required Environment Variables

```bash
# API URLs
VITE_API_BASE_URL=http://0.0.0.0:8000
VITE_AUTH_API_BASE_URL=http://0.0.0.0:8000

# Storage Keys
VITE_TOKEN_STORAGE_KEY=crisis_journalist_auth_token
VITE_USER_STORAGE_KEY=crisis_journalist_user_data
```

### Optional Environment Variables

```bash
# API Timeouts
VITE_API_TIMEOUT=120000
VITE_API_UPLOAD_TIMEOUT=300000

# File Upload
VITE_MAX_UPLOAD_SIZE=104857600

# CORS
VITE_API_WITH_CREDENTIALS=false
```

---

## Integration Example

### Complete App.jsx Structure

```jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import authService from './services/authService';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateNews from './pages/CreateNews';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth on mount
    const authenticated = authService.isAuthenticated();
    const userData = authService.getUser();
    setIsAuthenticated(authenticated);
    setUser(userData);
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </Router>
    );
  }

  // Show main app if authenticated
  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/create-news" element={<CreateNews user={user} />} />
      </Routes>
    </Router>
  );
}
```

---

## Error Handling

### Common Errors and Solutions

**Network Error:**
```javascript
try {
  await authService.login(credentials);
} catch (error) {
  if (error.message.includes('Network error')) {
    // Backend is not running
    alert('Cannot connect to server. Please ensure backend is running.');
  }
}
```

**Invalid Credentials:**
```javascript
try {
  await authService.login(credentials);
} catch (error) {
  if (error.message.includes('Invalid')) {
    // Wrong email/password
    setError('Invalid email or password');
  }
}
```

**Email Already Registered:**
```javascript
try {
  await authService.register(userData);
} catch (error) {
  if (error.message.includes('already registered')) {
    setError('This email is already registered. Please login instead.');
  }
}
```

---

## Testing

### Manual Testing Checklist

- [ ] Register a new user
- [ ] Verify initials are displayed correctly
- [ ] Login with registered credentials
- [ ] Check user ID in sidebar matches registration
- [ ] Create a news article (should use user_id)
- [ ] Logout and verify redirect to login
- [ ] Login again and verify projects are loaded
- [ ] Test form validation on register page
- [ ] Test error messages on invalid login

---

**Last Updated:** October 23, 2025  
**Version:** 1.0.0
