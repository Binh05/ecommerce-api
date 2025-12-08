# Users API

## Base URL
```
http://localhost:5000/api/users
```

**⚠️ Admin Only:** Most endpoints require admin authentication.

---

## Endpoints

### 1. Get All Users
Get a list of all users (admin only).

```http
GET /api/users
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "_id": "674a...",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user",
      "avatar": "https://...",
      "address": "123 Main St",
      "dob": "1990-01-15T00:00:00Z",
      "isVerified": true,
      "createdAt": "2024-12-08T10:00:00Z",
      "updatedAt": "2024-12-08T10:00:00Z"
    },
    {
      "_id": "674b...",
      "email": "admin@example.com",
      "username": "admin",
      "role": "admin",
      "avatar": "https://...",
      "isVerified": true,
      "createdAt": "2024-12-08T09:00:00Z",
      "updatedAt": "2024-12-08T09:00:00Z"
    }
  ]
}
```

**Notes:**
- Password and refreshToken fields are excluded from response
- Requires admin role
- Returns all users in the system

---

### 2. Get User by ID
Get details of a specific user.

```http
GET /api/users/:id
Authorization: Bearer <admin_access_token>
```

**Parameters:**
- `id` (path, required) - User's MongoDB ObjectId

**Example:**
```http
GET /api/users/674a1b2c3d4e5f...
```

**Success Response (200):**
```json
{
  "code": 200,
  "data": {
    "_id": "674a...",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user",
    "avatar": "https://...",
    "address": "123 Main St",
    "dob": "1990-01-15T00:00:00Z",
    "isVerified": true,
    "createdAt": "2024-12-08T10:00:00Z",
    "updatedAt": "2024-12-08T10:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "code": 400,
  "data": "User not found"
}
```

**Notes:**
- Password and refreshToken are excluded
- Requires admin role

---

### 3. Update User
Update user information (admin only).

```http
PUT /api/users/:id
Authorization: Bearer <admin_access_token>
Content-Type: application/json
```

**Parameters:**
- `id` (path, required) - User's MongoDB ObjectId

**Request Body:**
```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "role": "admin",
  "address": "456 New Street",
  "avatar": "https://newavatar.com/image.jpg",
  "isVerified": true
}
```

**Allowed Fields to Update:**
- `username` (string)
- `email` (string) - must be unique
- `role` (string) - "user" or "admin"
- `address` (string)
- `avatar` (string)
- `dob` (date)
- `isVerified` (boolean)

**Forbidden Fields:**
- `password` - cannot be updated through this endpoint (use separate password change endpoint)
- `refreshToken` - managed by authentication system

**Success Response (200):**
```json
{
  "code": 200,
  "data": {
    "_id": "674a...",
    "email": "newemail@example.com",
    "username": "newusername",
    "role": "admin",
    "avatar": "https://newavatar.com/image.jpg",
    "address": "456 New Street",
    "isVerified": true,
    "updatedAt": "2024-12-08T11:00:00Z"
  }
}
```

**Error Responses:**

User not found:
```json
{
  "code": 400,
  "data": "User not found"
}
```

Email already exists:
```json
{
  "code": 400,
  "data": "Email already in use"
}
```

**Notes:**
- Requires admin role
- Password is automatically excluded from update
- Validators are run on update
- `updatedAt` timestamp is automatically updated

---

### 4. Delete User
Remove a user from the system (admin only).

```http
DELETE /api/users/:id
Authorization: Bearer <admin_access_token>
```

**Parameters:**
- `id` (path, required) - User's MongoDB ObjectId

**Example:**
```http
DELETE /api/users/674a1b2c3d4e5f...
```

**Success Response (200):**
```json
{
  "code": 200,
  "data": "User deleted successfully"
}
```

**Error Response (400):**
```json
{
  "code": 400,
  "data": "User not found"
}
```

**Notes:**
- Requires admin role
- Deletion is permanent
- All user's orders will still reference the deleted user (by ObjectId)

---

## User Roles

### Available Roles
- `"user"` - Regular customer (default)
- `"admin"` - Administrator with elevated permissions

### Role Permissions

**User Role:**
- View products
- Create orders
- View own orders
- Update own profile

**Admin Role:**
- All user permissions
- Manage all users (CRUD)
- Manage all products (CRUD)
- Manage all orders (view, update status)
- View dashboard statistics

---

## Frontend Integration Examples

### Example 1: Get All Users (Admin Dashboard)

```javascript
import api from './api'; // Axios instance with auth interceptor

const fetchAllUsers = async () => {
  try {
    const response = await api.get('/users');
    
    if (response.data.code === 200) {
      const users = response.data.data;
      return users;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response?.data?.data || 'Failed to fetch users';
  }
};

// Usage in React
const UsersList = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch(error => alert(error));
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user._id}>
          <img src={user.avatar} alt={user.username} />
          <h3>{user.username}</h3>
          <p>{user.email}</p>
          <span>Role: {user.role}</span>
        </div>
      ))}
    </div>
  );
};
```

---

### Example 2: Update User Role

```javascript
const updateUserRole = async (userId, newRole) => {
  try {
    const response = await api.put(`/users/${userId}`, {
      role: newRole
    });
    
    if (response.data.code === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw error.response?.data?.data || 'Failed to update user';
  }
};

// Usage - Make user an admin
updateUserRole('674a...', 'admin')
  .then(updatedUser => {
    console.log('User is now admin:', updatedUser);
  })
  .catch(error => {
    alert(`Error: ${error}`);
  });
```

---

### Example 3: User Management Component

```javascript
import { useState } from 'react';
import api from './api';

const UserManagement = ({ user }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    role: user.role,
    address: user.address
  });

  const handleUpdate = async () => {
    try {
      const response = await api.put(`/users/${user._id}`, formData);
      
      if (response.data.code === 200) {
        alert('User updated successfully!');
        setEditing(false);
      }
    } catch (error) {
      alert(error.response?.data?.data || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete user ${user.username}?`)) return;
    
    try {
      await api.delete(`/users/${user._id}`);
      alert('User deleted successfully!');
      // Refresh user list
    } catch (error) {
      alert(error.response?.data?.data || 'Delete failed');
    }
  };

  return (
    <div>
      {editing ? (
        <div>
          <input
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <input
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h3>{user.username}</h3>
          <p>{user.email}</p>
          <span>Role: {user.role}</span>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};
```

---

### Example 4: Filter Users by Role

```javascript
const filterUsersByRole = (users, role) => {
  return users.filter(user => user.role === role);
};

// Usage
const allUsers = await fetchAllUsers();
const adminUsers = filterUsersByRole(allUsers, 'admin');
const regularUsers = filterUsersByRole(allUsers, 'user');

console.log(`Admins: ${adminUsers.length}`);
console.log(`Users: ${regularUsers.length}`);
```

---

## Admin Middleware

All user management endpoints are protected by the `verifyRoles(ROLE.ADMIN)` middleware.

**How it works:**
1. Client sends request with access token in Authorization header
2. Server verifies token and extracts user info
3. Middleware checks if user has admin role
4. If not admin, returns 403 Forbidden
5. If admin, proceeds to controller

**Example Response for Non-Admin:**
```json
{
  "code": 403,
  "data": "Access denied. Admin role required."
}
```

---

## User Model Schema

```javascript
{
  email: String (required, unique),
  username: String (required),
  password: String (required, hashed),
  dob: Date,
  address: String,
  role: String (enum: ["admin", "user"], default: "user"),
  avatar: String (default: default_image_url),
  refreshToken: String,
  isVerified: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Security Notes

1. **Password Protection:**
   - Passwords are hashed with bcrypt before storage
   - Passwords are never returned in API responses
   - Passwords cannot be updated through PUT /users/:id

2. **Admin Access:**
   - All endpoints require admin authentication
   - Use JWT tokens with role information
   - Tokens expire after 15 minutes (access) or 7 days (refresh)

3. **Data Validation:**
   - Email must be unique
   - Role must be "user" or "admin"
   - All updates run validators

4. **Best Practices:**
   - Always verify admin role on frontend before showing UI
   - Handle 403 errors gracefully
   - Don't expose user management to non-admin users
