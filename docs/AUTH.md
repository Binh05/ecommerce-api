# Authentication API

## Base URL
```
http://localhost:5000/api/auth
```

---

## Endpoints

### 1. Register New User
Create a new user account.

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "username": "johndoe",
  "password": "SecurePassword123",
  "dob": "1990-01-15",
  "address": "123 Main Street, City",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Required Fields:**
- `email` (string) - Valid email address (must be unique)
- `username` (string) - User's display name
- `password` (string) - User's password (will be hashed)

**Optional Fields:**
- `dob` (date) - Date of birth (ISO 8601 format)
- `address` (string) - User's address
- `avatar` (string) - Avatar URL (defaults to default image)

**Success Response (201):**
```json
{
  "code": 201,
  "data": {
    "user": {
      "_id": "674a...",
      "email": "newuser@example.com",
      "username": "johndoe",
      "role": "user",
      "avatar": "https://...",
      "isVerified": true,
      "createdAt": "2024-12-08T10:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Notes:**
- Password is automatically hashed using bcrypt
- Default role is "user"
- Default avatar is provided if not specified
- Tokens are returned for immediate login after registration

---

### 2. Login
Authenticate a user and receive access tokens.

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Required Fields:**
- `email` (string) - User's email
- `password` (string) - User's password

**Success Response (200):**
```json
{
  "code": 200,
  "data": {
    "user": {
      "_id": "674a...",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user",
      "avatar": "https://...",
      "address": "123 Main St"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

Invalid credentials:
```json
{
  "code": 401,
  "data": "Invalid email or password"
}
```

**Notes:**
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Refresh token is also stored in the database
- Password is not returned in the response

---

### 3. Refresh Token
Get a new access token using refresh token.

```http
POST /api/auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Required Fields:**
- `refreshToken` (string) - Valid refresh token

**Success Response (200):**
```json
{
  "code": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

Missing refresh token:
```json
{
  "code": 401,
  "data": "Refresh token required"
}
```

Invalid refresh token:
```json
{
  "code": 403,
  "data": "Invalid refresh token"
}
```

**Notes:**
- Both new access token and refresh token are returned
- Old refresh token is invalidated
- Use this when access token expires

---

### 4. Logout
Invalidate user's refresh token.

```http
POST /api/auth/logout
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "674a1b2c3d4e5f..."
}
```

**Required Fields:**
- `userId` (string) - User's ID

**Success Response (200):**
```json
{
  "code": 200,
  "data": "Logged out successfully"
}
```

**Notes:**
- Removes refresh token from database
- Client should also delete stored tokens

---

## Authentication Flow

### Complete Authentication Workflow

**1. Register or Login:**
```javascript
// Register
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'johndoe',
    password: 'password123'
  })
});

// Or Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await response.json();
const { accessToken, refreshToken, user } = data;

// Store tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('user', JSON.stringify(user));
```

**2. Make Authenticated Requests:**
```javascript
const makeAuthRequest = async (url, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  });

  // If token expired (401), refresh it
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry request with new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`
        }
      });
    }
  }

  return response;
};
```

**3. Refresh Token When Expired:**
```javascript
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    const { data } = await response.json();
    
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.accessToken;
    }
  } catch (error) {
    // Refresh failed - logout user
    logout();
    return null;
  }
};
```

**4. Logout:**
```javascript
const logout = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user?._id) {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id })
    });
  }

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  window.location.href = '/login';
};
```

---

## React Example with Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add access token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

**Usage:**
```javascript
import api from './api';

// Login
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    throw error.response?.data?.data || 'Login failed';
  }
};

// Register
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { accessToken, refreshToken, user } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    throw error.response?.data?.data || 'Registration failed';
  }
};

// Logout
const logout = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user?._id) {
    await api.post('/auth/logout', { userId: user._id });
  }
  
  localStorage.clear();
  window.location.href = '/login';
};
```

---

## Token Information

### Access Token
- **Lifetime:** 15 minutes
- **Purpose:** Authenticate API requests
- **Storage:** localStorage or sessionStorage
- **Header:** `Authorization: Bearer <accessToken>`

### Refresh Token
- **Lifetime:** 7 days
- **Purpose:** Get new access token
- **Storage:** localStorage (more persistent) or httpOnly cookie (more secure)
- **Note:** Stored in database, invalidated on logout

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Store tokens securely:**
   - Consider httpOnly cookies for refresh tokens
   - Use secure storage on mobile apps
3. **Implement token rotation**
4. **Set appropriate token expiration times**
5. **Validate tokens on every request**
6. **Implement rate limiting on auth endpoints**
7. **Hash passwords with bcrypt (already implemented)**
8. **Never expose passwords in responses (already implemented)**
