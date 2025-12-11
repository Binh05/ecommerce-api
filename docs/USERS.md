# API Người Dùng

## URL Cơ Bản
```
http://localhost:5000/api/users
```

**⚠️ Chỉ Dành Cho Admin:** Hầu hết các endpoint yêu cầu xác thực admin.

---

## Các Endpoint

### 1. Lấy Tất Cả Người Dùng
Lấy danh sách tất cả người dùng (chỉ admin).

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

**Ghi Chú:**
- Các trường password và refreshToken được loại trừ khỏi response
- Yêu cầu quyền admin
- Trả về tất cả người dùng trong hệ thống

---

### 2. Lấy Người Dùng Theo ID
Lấy thông tin chi tiết của một người dùng cụ thể.

```http
GET /api/users/:id
Authorization: Bearer <admin_access_token>
```

**Tham Số:**
- `id` (đường dẫn, bắt buộc) - MongoDB ObjectId của người dùng

**Ví Dụ:**
```http
GET /api/users/674a1b2c3d4e5f...
```

**Response Thành Công (200):**
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

**Response Lỗi (400):**
```json
{
  "code": 400,
  "data": "User not found"
}
```

**Ghi Chú:**
- Password và refreshToken được loại trừ
- Yêu cầu quyền admin

---

### 3. Cập Nhật Người Dùng
Cập nhật thông tin người dùng (chỉ admin).

```http
PUT /api/users/:id
Authorization: Bearer <admin_access_token>
Content-Type: application/json
```

**Tham Số:**
- `id` (đường dẫn, bắt buộc) - MongoDB ObjectId của người dùng

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

**Các Trường Được Phép Cập Nhật:**
- `username` (chuỗi)
- `email` (chuỗi) - phải là duy nhất
- `role` (chuỗi) - "user" hoặc "admin"
- `address` (chuỗi)
- `avatar` (chuỗi)
- `dob` (ngày tháng)
- `isVerified` (boolean)

**Các Trường Bị Cấm:**
- `password` - không thể cập nhật qua endpoint này (sử dụng endpoint thay đổi mật khẩu riêng)
- `refreshToken` - được quản lý bởi hệ thống xác thực

**Response Thành Công (200):**
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

**Các Response Lỗi:**

Không tìm thấy người dùng:
```json
{
  "code": 400,
  "data": "User not found"
}
```

Email đã tồn tại:
```json
{
  "code": 400,
  "data": "Email already in use"
}
```

**Ghi Chú:**
- Yêu cầu quyền admin
- Password tự động được loại trừ khỏi cập nhật
- Các validator được chạy khi cập nhật
- Timestamp `updatedAt` được tự động cập nhật

---

### 4. Xóa Người Dùng
Xóa một người dùng khỏi hệ thống (chỉ admin).

```http
DELETE /api/users/:id
Authorization: Bearer <admin_access_token>
```

**Tham Số:**
- `id` (đường dẫn, bắt buộc) - MongoDB ObjectId của người dùng

**Ví Dụ:**
```http
DELETE /api/users/674a1b2c3d4e5f...
```

**Response Thành Công (200):**
```json
{
  "code": 200,
  "data": "User deleted successfully"
}
```

**Response Lỗi (400):**
```json
{
  "code": 400,
  "data": "User not found"
}
```

**Ghi Chú:**
- Yêu cầu quyền admin
- Việc xóa là vĩnh viễn
- Tất cả đơn hàng của người dùng vẫn sẽ tham chiếu đến người dùng đã xóa (theo ObjectId)

---

## Các Vai Trò Người Dùng

### Các Vai Trò Có Sẵn
- `"user"` - Khách hàng thông thường (mặc định)
- `"admin"` - Quản trị viên với quyền nâng cao

### Quyền Hạn Theo Vai Trò

**Vai Trò User:**
- Xem sản phẩm
- Tạo đơn hàng
- Xem đơn hàng của riêng mình
- Cập nhật hồ sơ của riêng mình

**Vai Trò Admin:**
- Tất cả quyền của user
- Quản lý tất cả người dùng (CRUD)
- Quản lý tất cả sản phẩm (CRUD)
- Quản lý tất cả đơn hàng (xem, cập nhật trạng thái)
- Xem thống kê dashboard

---

## Ví Dụ Tích Hợp Frontend

### Ví Dụ 1: Lấy Tất Cả Người Dùng (Admin Dashboard)

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

### Ví Dụ 2: Cập Nhật Vai Trò Người Dùng

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

### Ví Dụ 3: Component Quản Lý Người Dùng

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

### Ví Dụ 4: Lọc Người Dùng Theo Vai Trò

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

## Middleware Admin

Tất cả các endpoint quản lý người dùng được bảo vệ bởi middleware `verifyRoles(ROLE.ADMIN)`.

**Cách hoạt động:**
1. Client gửi request với access token trong header Authorization
2. Server xác minh token và trích xuất thông tin người dùng
3. Middleware kiểm tra xem người dùng có vai trò admin không
4. Nếu không phải admin, trả về 403 Forbidden
5. Nếu là admin, tiếp tục đến controller

**Ví Dụ Response Cho Người Dùng Không Phải Admin:**
```json
{
  "code": 403,
  "data": "Access denied. Admin role required."
}
```

---

## Schema Model Người Dùng

```javascript
{
  email: String (bắt buộc, duy nhất),
  username: String (bắt buộc),
  password: String (bắt buộc, đã mã hóa),
  dob: Date,
  address: String,
  role: String (enum: ["admin", "user"], mặc định: "user"),
  avatar: String (mặc định: default_image_url),
  refreshToken: String,
  isVerified: Boolean (mặc định: true),
  createdAt: Date (tự động),
  updatedAt: Date (tự động)
}
```

---

## Ghi Chú Bảo Mật

1. **Bảo Vệ Mật Khẩu:**
   - Mật khẩu được mã hóa bằng bcrypt trước khi lưu trữ
   - Mật khẩu không bao giờ được trả về trong API responses
   - Mật khẩu không thể được cập nhật qua PUT /users/:id

2. **Truy Cập Admin:**
   - Tất cả các endpoint yêu cầu xác thực admin
   - Sử dụng JWT tokens với thông tin vai trò
   - Tokens hết hạn sau 15 phút (access) hoặc 7 ngày (refresh)

3. **Xác Thực Dữ Liệu:**
   - Email phải là duy nhất
   - Role phải là "user" hoặc "admin"
   - Tất cả cập nhật đều chạy validators

4. **Các Phương Pháp Tốt Nhất:**
   - Luôn xác minh vai trò admin trên frontend trước khi hiển thị UI
   - Xử lý lỗi 403 một cách mượt mà
   - Không hiển thị quản lý người dùng cho người dùng không phải admin
