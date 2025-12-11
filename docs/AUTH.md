# API Xác Thực

## URL Cơ Bản
```
http://localhost:5000/api/auth
```

---

## Các Endpoint

### 1. Đăng Ký Người Dùng Mới
Tạo tài khoản người dùng mới.

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

**Các Trường Bắt Buộc:**
- `email` (string) - Địa chỉ email hợp lệ (phải là duy nhất)
- `username` (string) - Tên hiển thị của người dùng
- `password` (string) - Mật khẩu của người dùng (sẽ được mã hóa)

**Các Trường Tùy Chọn:**
- `dob` (date) - Ngày sinh (định dạng ISO 8601)
- `address` (string) - Địa chỉ của người dùng
- `avatar` (string) - URL avatar (mặc định là ảnh mặc định)

**Phản Hồi Thành Công (201):**
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

**Ghi Chú:**
- Mật khẩu được tự động mã hóa bằng bcrypt
- Vai trò mặc định là "user"
- Avatar mặc định được cung cấp nếu không chỉ định
- Token được trả về để đăng nhập ngay sau khi đăng ký

---

### 2. Đăng Nhập
Xác thực người dùng và nhận access token.

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

**Các Trường Bắt Buộc:**
- `email` (string) - Email của người dùng
- `password` (string) - Mật khẩu của người dùng

**Phản Hồi Thành Công (200):**
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

**Phản Hồi Lỗi:**

Thông tin đăng nhập không hợp lệ:
```json
{
  "code": 401,
  "data": "Invalid email or password"
}
```

**Ghi Chú:**
- Access token hết hạn sau 15 phút
- Refresh token hết hạn sau 7 ngày
- Refresh token cũng được lưu trong cơ sở dữ liệu
- Mật khẩu không được trả về trong phản hồi

---

### 3. Làm Mới Token
Lấy access token mới bằng refresh token.

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

**Các Trường Bắt Buộc:**
- `refreshToken` (string) - Refresh token hợp lệ

**Phản Hồi Thành Công (200):**
```json
{
  "code": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Phản Hồi Lỗi:**

Thiếu refresh token:
```json
{
  "code": 401,
  "data": "Refresh token required"
}
```

Refresh token không hợp lệ:
```json
{
  "code": 403,
  "data": "Invalid refresh token"
}
```

**Ghi Chú:**
- Cả access token và refresh token mới đều được trả về
- Refresh token cũ sẽ bị vô hiệu hóa
- Sử dụng khi access token hết hạn

---

### 4. Đăng Xuất
Vô hiệu hóa refresh token của người dùng.

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

**Các Trường Bắt Buộc:**
- `userId` (string) - ID của người dùng

**Phản Hồi Thành Công (200):**
```json
{
  "code": 200,
  "data": "Logged out successfully"
}
```

**Ghi Chú:**
- Xóa refresh token khỏi cơ sở dữ liệu
- Client cũng nên xóa các token đã lưu

---

## Luồng Xác Thực

### Quy Trình Xác Thực Hoàn Chỉnh

**1. Đăng Ký hoặc Đăng Nhập:**
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

**2. Thực Hiện Các Request Đã Xác Thực:**
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

  // Nếu token hết hạn (401), làm mới nó
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Thử lại request với token mới
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

**3. Làm Mới Token Khi Hết Hạn:**
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
    // Làm mới thất bại - đăng xuất người dùng
    logout();
    return null;
  }
};
```

**4. Đăng Xuất:**
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

## Ví Dụ React với Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm access token vào requests
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

// Xử lý làm mới token khi gặp lỗi 401
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
        // Làm mới thất bại - đăng xuất
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

**Cách Sử Dụng:**
```javascript
import api from './api';

// Đăng nhập
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

// Đăng ký
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

// Đăng xuất
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

## Thông Tin Token

### Access Token
- **Thời Gian Sống:** 15 phút
- **Mục Đích:** Xác thực các API request
- **Lưu Trữ:** localStorage hoặc sessionStorage
- **Header:** `Authorization: Bearer <accessToken>`

### Refresh Token
- **Thời Gian Sống:** 7 ngày
- **Mục Đích:** Lấy access token mới
- **Lưu Trữ:** localStorage (bền vững hơn) hoặc httpOnly cookie (an toàn hơn)
- **Ghi Chú:** Được lưu trong cơ sở dữ liệu, bị vô hiệu hóa khi đăng xuất

---

## Các Phương Pháp Bảo Mật Tốt Nhất

1. **Luôn sử dụng HTTPS trong môi trường production**
2. **Lưu trữ token một cách an toàn:**
   - Cân nhắc sử dụng httpOnly cookies cho refresh token
   - Sử dụng lưu trữ an toàn trên ứng dụng di động
3. **Triển khai token rotation**
4. **Đặt thời gian hết hạn token phù hợp**
5. **Xác thực token ở mọi request**
6. **Triển khai rate limiting trên các endpoint xác thực**
7. **Mã hóa mật khẩu bằng bcrypt (đã được triển khai)**
8. **Không bao giờ để lộ mật khẩu trong phản hồi (đã được triển khai)**
