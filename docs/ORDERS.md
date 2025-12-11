# API Đơn Hàng

## URL Cơ Bản
```
http://localhost:5000/api/orders
```

---

## Các Endpoint

### 1. Lấy Tất Cả Đơn Hàng
Lấy danh sách tất cả các đơn hàng với thông tin chi tiết người dùng và sản phẩm.

```http
GET /api/orders
```

**Phản hồi:**
```json
{
  "code": 200,
  "data": [
    {
      "_id": "674b...",
      "id": "1001",
      "user": {
        "_id": "674a...",
        "username": "john_doe",
        "email": "john@example.com",
        "avatar": "https://..."
      },
      "items": [
        {
          "product": {
            "_id": "674c...",
            "title": "iPhone 15 Pro",
            "thumbnail": "data:image/jpeg;base64,...",
            "price": 999,
            "stock": 48,
            "category": "smartphones"
          },
          "quantity": 2,
          "price": 999
        }
      ],
      "total": 1998,
      "status": "Chờ xác nhận",
      "date": "2024-12-08T12:00:00Z",
      "shippingAddress": "123 Main St, City",
      "paymentMethod": "COD",
      "note": "",
      "createdAt": "2024-12-08T12:00:00Z",
      "updatedAt": "2024-12-08T12:00:00Z"
    }
  ]
}
```

**Ghi chú:**
- Đơn hàng được sắp xếp theo ngày (mới nhất trước)
- Thông tin người dùng được điền đầy đủ (tên người dùng, email, avatar)
- Thông tin sản phẩm được điền đầy đủ (tiêu đề, hình thu nhỏ, giá, tồn kho, danh mục)

---

### 2. Lấy Đơn Hàng Theo ID
Lấy thông tin chi tiết của một đơn hàng cụ thể.

```http
GET /api/orders/:id
```

**Tham số:**
- `id` (đường dẫn, bắt buộc) - ID đơn hàng (chuỗi)

**Ví dụ:**
```http
GET /api/orders/1001
```

**Phản hồi thành công (200):**
```json
{
  "code": 200,
  "data": {
    "id": "1001",
    "user": {
      "_id": "674a...",
      "username": "john_doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "address": "123 Main St"
    },
    "items": [
      {
        "product": {
          "_id": "674c...",
          "title": "iPhone 15 Pro",
          "thumbnail": "data:image/jpeg;base64,...",
          "price": 999,
          "stock": 48
        },
        "quantity": 2,
        "price": 999
      }
    ],
    "total": 1998,
    "status": "Chờ xác nhận",
    "date": "2024-12-08T12:00:00Z",
    "shippingAddress": "123 Main St, City",
    "paymentMethod": "COD",
    "note": "Please call before delivery"
  }
}
```

**Phản hồi lỗi (400):**
```json
{
  "code": 400,
  "data": "Không tìm thấy đơn hàng"
}
```

---

### 3. Tạo Đơn Hàng
Tạo một đơn hàng mới với người dùng và sản phẩm.

```http
POST /api/orders
Content-Type: application/json
```

**Nội dung yêu cầu (Tùy chọn 1 - Sử dụng ID người dùng):**
```json
{
  "userId": "674a1b2c3d4e5f...",
  "items": [
    {
      "productId": "674c1a2b3c4d...",
      "quantity": 2
    },
    {
      "productId": "674c5e6f7g8h...",
      "quantity": 1
    }
  ],
  "shippingAddress": "456 Elm Street, City",
  "paymentMethod": "COD",
  "note": "Please deliver after 5 PM"
}
```

**Nội dung yêu cầu (Tùy chọn 2 - Sử dụng Email người dùng):**
```json
{
  "userEmail": "john@example.com",
  "items": [
    {
      "productId": "1",
      "quantity": 2
    },
    {
      "productId": "2",
      "quantity": 1
    }
  ],
  "shippingAddress": "456 Elm Street, City",
  "paymentMethod": "COD",
  "note": "Call before delivery"
}
```

**Trường bắt buộc:**
- `userId` (chuỗi ObjectId) HOẶC `userEmail` (chuỗi) - Người dùng đặt hàng
- `items` (mảng) - Mảng các sản phẩm đặt hàng (tối thiểu 1 sản phẩm)
  - `productId` (chuỗi ObjectId HOẶC số) - ID sản phẩm (hỗ trợ cả MongoDB _id và id tùy chỉnh)
  - `quantity` (số) - Số lượng đặt hàng (phải > 0)

**Trường tùy chọn:**
- `shippingAddress` (chuỗi) - Địa chỉ giao hàng (mặc định là địa chỉ đã lưu của người dùng hoặc "N/A")
- `paymentMethod` (chuỗi) - Phương thức thanh toán (mặc định là "COD")
- `note` (chuỗi) - Ghi chú đơn hàng/yêu cầu đặc biệt

**Phản hồi thành công (201):**
```json
{
  "code": 201,
  "data": {
    "id": "1002",
    "user": {
      "_id": "674a...",
      "username": "john_doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "address": "123 Main St"
    },
    "items": [
      {
        "product": {
          "_id": "674c...",
          "title": "iPhone 15 Pro",
          "thumbnail": "data:image/jpeg;base64,...",
          "price": 999,
          "stock": 48,
          "category": "smartphones"
        },
        "quantity": 2,
        "price": 999
      },
      {
        "product": {
          "_id": "674d...",
          "title": "AirPods Pro",
          "thumbnail": "data:image/jpeg;base64,...",
          "price": 249,
          "stock": 99,
          "category": "audio"
        },
        "quantity": 1,
        "price": 249
      }
    ],
    "total": 2247,
    "status": "Chờ xác nhận",
    "date": "2024-12-08T13:00:00Z",
    "shippingAddress": "456 Elm Street, City",
    "paymentMethod": "COD",
    "note": "Call before delivery",
    "createdAt": "2024-12-08T13:00:00Z",
    "updatedAt": "2024-12-08T13:00:00Z"
  }
}
```

**Kết quả Console Máy chủ:**
```
✅ Đơn hàng 1002 được tạo thành công cho người dùng john@example.com
📦 Sản phẩm: iPhone 15 Pro (x2), AirPods Pro (x1)
💰 Tổng: $2247
```

**Các phản hồi lỗi:**

Thiếu định danh người dùng:
```json
{
  "code": 400,
  "data": "userId hoặc userEmail là bắt buộc"
}
```

Không tìm thấy người dùng:
```json
{
  "code": 400,
  "data": "Không tìm thấy người dùng"
}
```

Không có sản phẩm:
```json
{
  "code": 400,
  "data": "Sản phẩm là bắt buộc"
}
```

Cấu trúc sản phẩm không hợp lệ:
```json
{
  "code": 400,
  "data": "Mỗi sản phẩm phải có productId và quantity"
}
```

Số lượng không hợp lệ:
```json
{
  "code": 400,
  "data": "Số lượng phải lớn hơn 0"
}
```

Không tìm thấy sản phẩm:
```json
{
  "code": 400,
  "data": "Không tìm thấy sản phẩm có ID 674c..."
}
```

Không đủ hàng:
```json
{
  "code": 400,
  "data": "Không đủ hàng cho \"iPhone 15 Pro\". Có sẵn: 1, Yêu cầu: 2"
}
```

**Ghi chú quan trọng:**
- ID đơn hàng được tự động tạo (tuần tự: "1", "2", "3", ...)
- Tổng giá được tính tự động từ giá sản phẩm hiện tại
- Tồn kho sản phẩm tự động giảm khi đơn hàng được tạo
- Giá được lưu tại thời điểm mua (sẽ không thay đổi nếu giá sản phẩm thay đổi sau này)
- Trạng thái đơn hàng mặc định là "Chờ xác nhận"
- Xác thực người dùng tồn tại trước khi tạo đơn hàng
- Xác thực tất cả sản phẩm tồn tại và có đủ hàng

---

### 4. Cập Nhật Trạng Thái Đơn Hàng
Cập nhật trạng thái của một đơn hàng hiện có.

```http
PUT /api/orders/:id
Content-Type: application/json
```

**Tham số:**
- `id` (đường dẫn, bắt buộc) - ID đơn hàng cần cập nhật

**Nội dung yêu cầu:**
```json
{
  "status": "Đã xác nhận"
}
```

**Các giá trị trạng thái hợp lệ:**
- `"Chờ xác nhận"` - Chờ xác nhận (mặc định)
- `"Đã xác nhận"` - Đã xác nhận
- `"Đang giao"` - Đang giao hàng
- `"Đã giao"` - Đã giao hàng
- `"Đã hủy"` - Đã hủy

**Phản hồi thành công (200):**
```json
{
  "code": 200,
  "data": {
    "id": "1001",
    "status": "Đã xác nhận",
    "user": {
      "username": "john_doe",
      "email": "john@example.com",
      "avatar": "https://..."
    },
    "items": [
      {
        "product": {
          "title": "iPhone 15 Pro",
          "thumbnail": "...",
          "price": 999
        },
        "quantity": 2,
        "price": 999
      }
    ],
    "total": 1998,
    // ... other fields
  }
}
```

**Các phản hồi lỗi:**

Thiếu trường trạng thái:
```json
{
  "code": 400,
  "data": "Trạng thái là bắt buộc"
}
```

Không tìm thấy đơn hàng:
```json
{
  "code": 400,
  "data": "Không tìm thấy đơn hàng"
}
```

**Ghi chú:**
- Chỉ có trường `status` có thể được cập nhật
- Các chi tiết đơn hàng khác (sản phẩm, tổng, người dùng) không thể sửa đổi
- Chi tiết đơn hàng được điền đầy đủ trong phản hồi
- Nhật ký máy chủ: `Lỗi khi cập nhật đơn hàng:` nếu cập nhật thất bại

---

### 5. Xóa Đơn Hàng
Xóa một đơn hàng khỏi cơ sở dữ liệu.

```http
DELETE /api/orders/:id
```

**Tham số:**
- `id` (đường dẫn, bắt buộc) - ID đơn hàng cần xóa

**Ví dụ:**
```http
DELETE /api/orders/1001
```

**Phản hồi thành công (200):**
```json
{
  "code": 200,
  "data": "Xóa đơn hàng thành công"
}
```

**Phản hồi lỗi (400):**
```json
{
  "code": 400,
  "data": "Không tìm thấy đơn hàng"
}
```

**Ghi chú quan trọng:**
- Tồn kho sản phẩm được khôi phục nếu đơn hàng chưa bị hủy
- Nếu trạng thái đơn hàng là "Đã hủy", tồn kho KHÔNG được khôi phục
- Việc xóa là vĩnh viễn
- Nhật ký máy chủ: `Lỗi khi xóa đơn hàng:` nếu xóa thất bại

**Logic Khôi Phục Tồn Kho:**
```javascript
// Ví dụ: Đơn hàng có 2x iPhone (tồn kho trước đơn hàng: 50)
// Sau khi tạo đơn hàng: tồn kho = 48
// Sau khi xóa đơn hàng (trạng thái != "Đã hủy"): tồn kho = 50 (đã khôi phục)
// Sau khi xóa đơn hàng (trạng thái = "Đã hủy"): tồn kho = 48 (không khôi phục)
```

---

## Luồng Trạng Thái Đơn Hàng

```
Chờ xác nhận (Chờ xác nhận)
    ↓
Đã xác nhận (Đã xác nhận)
    ↓
Đang giao (Đang giao hàng)
    ↓
Đã giao (Đã giao hàng)

HOẶC

Chờ xác nhận (Chờ xác nhận)
    ↓
Đã hủy (Đã hủy)
```

---

## Ví Dụ Tích Hợp Frontend

### Ví dụ 1: Tạo Đơn Hàng Từ Giỏ Hàng

```javascript
const createOrder = async (cartItems, userEmail, shippingInfo) => {
  try {
    const orderData = {
      userEmail: userEmail,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      })),
      shippingAddress: shippingInfo.address,
      paymentMethod: shippingInfo.paymentMethod || "COD",
      note: shippingInfo.deliveryNote || ""
    };

    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    
    if (result.code === 201) {
      console.log('Order created:', result.data);
      return result.data;
    } else {
      throw new Error(result.data);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Sử dụng
const cartItems = [
  { id: "1", name: "iPhone 15 Pro", quantity: 1, price: 999 },
  { id: "2", name: "AirPods Pro", quantity: 2, price: 249 }
];

const shippingInfo = {
  address: "123 Main Street, City, Country",
  paymentMethod: "COD",
  deliveryNote: "Please call before delivery"
};

createOrder(cartItems, "user@example.com", shippingInfo)
  .then(order => {
    alert(`Order ${order.id} created! Total: $${order.total}`);
    window.location.href = `/orders/${order.id}`;
  })
  .catch(error => {
    alert(`Failed to create order: ${error.message}`);
  });
```

---

### Ví dụ 2: Mua Nhanh Một Sản Phẩm

```javascript
const quickBuy = async (productId, quantity, userEmail) => {
  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: userEmail,
        items: [{ productId: productId, quantity: quantity }],
        paymentMethod: "COD"
      })
    });

    const result = await response.json();
    
    if (result.code === 201) {
      return result.data;
    } else {
      throw new Error(result.data);
    }
  } catch (error) {
    console.error('Quick buy failed:', error);
    throw error;
  }
};

// Sử dụng
quickBuy("1", 1, "customer@example.com")
  .then(order => {
    alert(`Order placed! ID: ${order.id}`);
  })
  .catch(error => {
    alert(error.message);
  });
```

---

### Ví dụ 3: Xử Lý Xác Thực Tồn Kho

```javascript
const createOrderWithValidation = async (orderData) => {
  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    
    if (result.code === 201) {
      return { success: true, order: result.data };
    } else {
      const errorMsg = result.data;
      
      if (errorMsg.includes('Insufficient stock')) {
        return { success: false, error: 'stock', message: errorMsg };
      } else if (errorMsg.includes('not found')) {
        return { success: false, error: 'not_found', message: errorMsg };
      } else {
        return { success: false, error: 'general', message: errorMsg };
      }
    }
  } catch (error) {
    return { success: false, error: 'network', message: 'Network error' };
  }
};

// Sử dụng
const orderData = {
  userEmail: "user@example.com",
  items: [
    { productId: "1", quantity: 5 },
    { productId: "2", quantity: 2 }
  ]
};

createOrderWithValidation(orderData).then(result => {
  if (result.success) {
    alert(`Order ${result.order.id} created! Total: $${result.order.total}`);
  } else {
    switch (result.error) {
      case 'stock':
        alert(`Sorry! ${result.message}`);
        break;
      case 'not_found':
        alert('Some products are no longer available.');
        break;
      default:
        alert(`Error: ${result.message}`);
    }
  }
});
```

---

### Ví dụ 4: Quản Trị Viên Cập Nhật Trạng Thái Đơn Hàng

```javascript
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    const result = await response.json();
    
    if (result.code === 200) {
      return { success: true, order: result.data };
    } else {
      return { success: false, error: result.data };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Sử dụng - Xác nhận đơn hàng
updateOrderStatus("1001", "Đã xác nhận")
  .then(result => {
    if (result.success) {
      console.log('Đơn hàng đã xác nhận:', result.order);
    }
  });

// Đánh dấu đã giao
updateOrderStatus("1001", "Đã giao")
  .then(result => {
    if (result.success) {
      console.log('Đơn hàng đã giao:', result.order);
    }
  });
```

---

### Ví dụ 5: Sử Dụng Axios Trong React

```javascript
import axios from 'axios';
import { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const CheckoutButton = ({ cartItems, userEmail }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      const orderData = {
        userEmail: userEmail,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: "User's address",
        paymentMethod: "COD"
      };

      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      
      if (response.data.code === 201) {
        const order = response.data.data;
        alert(`Order ${order.id} created successfully!`);
        // Navigate to order confirmation page
        // navigate(`/orders/${order.id}`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.data || error.message;
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Processing...' : 'Place Order'}
    </button>
  );
};
```

---

## Quy Trình Đơn Hàng Hoàn Chỉnh

### 1. Khách Hàng Đặt Hàng
```http
POST /api/orders
{
  "userEmail": "customer@example.com",
  "items": [{"productId": "1", "quantity": 2}]
}
```

### 2. Quản Trị Viên Xem Tất Cả Đơn Hàng
```http
GET /api/orders
```

### 3. Quản Trị Viên Xác Nhận Đơn Hàng
```http
PUT /api/orders/1001
{
  "status": "Đã xác nhận"
}
```

### 4. Đơn Hàng Được Vận Chuyển
```http
PUT /api/orders/1001
{
  "status": "Đang giao"
}
```

### 5. Đơn Hàng Đã Giao
```http
PUT /api/orders/1001
{
  "status": "Đã giao"
}
```

### Hoặc Hủy Đơn Hàng
```http
PUT /api/orders/1001
{
  "status": "Đã hủy"
}
```
