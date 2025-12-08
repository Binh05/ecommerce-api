# Orders API

## Base URL
```
http://localhost:5000/api/orders
```

---

## Endpoints

### 1. Get All Orders
Get a list of all orders with populated user and product details.

```http
GET /api/orders
```

**Response:**
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

**Notes:**
- Orders are sorted by date (newest first)
- User details are populated (username, email, avatar)
- Product details are populated (title, thumbnail, price, stock, category)

---

### 2. Get Order by ID
Get details of a specific order.

```http
GET /api/orders/:id
```

**Parameters:**
- `id` (path, required) - Order ID (string)

**Example:**
```http
GET /api/orders/1001
```

**Success Response (200):**
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

**Error Response (400):**
```json
{
  "code": 400,
  "data": "Order not found"
}
```

---

### 3. Create Order
Create a new order with user and products.

```http
POST /api/orders
Content-Type: application/json
```

**Request Body (Option 1 - Using User ID):**
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

**Request Body (Option 2 - Using User Email):**
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

**Required Fields:**
- `userId` (ObjectId string) OR `userEmail` (string) - User placing the order
- `items` (array) - Array of order items (minimum 1 item)
  - `productId` (ObjectId string OR number) - Product ID (supports both MongoDB _id and custom id)
  - `quantity` (number) - Quantity to order (must be > 0)

**Optional Fields:**
- `shippingAddress` (string) - Shipping address (defaults to user's saved address or "N/A")
- `paymentMethod` (string) - Payment method (defaults to "COD")
- `note` (string) - Order notes/special instructions

**Success Response (201):**
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

**Server Console Output:**
```
✅ Order 1002 created successfully for user john@example.com
📦 Products: iPhone 15 Pro (x2), AirPods Pro (x1)
💰 Total: $2247
```

**Error Responses:**

Missing user identifier:
```json
{
  "code": 400,
  "data": "userId or userEmail is required"
}
```

User not found:
```json
{
  "code": 400,
  "data": "User not found"
}
```

No items provided:
```json
{
  "code": 400,
  "data": "Items are required"
}
```

Invalid item structure:
```json
{
  "code": 400,
  "data": "Each item must have productId and quantity"
}
```

Invalid quantity:
```json
{
  "code": 400,
  "data": "Quantity must be greater than 0"
}
```

Product not found:
```json
{
  "code": 400,
  "data": "Product with ID 674c... not found"
}
```

Insufficient stock:
```json
{
  "code": 400,
  "data": "Insufficient stock for \"iPhone 15 Pro\". Available: 1, Requested: 2"
}
```

**Important Notes:**
- Order ID is auto-generated (sequential: "1", "2", "3", ...)
- Total price is calculated automatically from current product prices
- Product stock is automatically decreased when order is created
- Price is saved at time of purchase (won't change if product price changes later)
- Default order status is "Chờ xác nhận"
- Validates that user exists before creating order
- Validates that all products exist and have sufficient stock

---

### 4. Update Order Status
Update the status of an existing order.

```http
PUT /api/orders/:id
Content-Type: application/json
```

**Parameters:**
- `id` (path, required) - Order ID to update

**Request Body:**
```json
{
  "status": "Đã xác nhận"
}
```

**Valid Status Values:**
- `"Chờ xác nhận"` - Pending confirmation (default)
- `"Đã xác nhận"` - Confirmed
- `"Đang giao"` - In delivery
- `"Đã giao"` - Delivered
- `"Đã hủy"` - Cancelled

**Success Response (200):**
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

**Error Responses:**

Missing status field:
```json
{
  "code": 400,
  "data": "Status is required"
}
```

Order not found:
```json
{
  "code": 400,
  "data": "Order not found"
}
```

**Notes:**
- Only the `status` field can be updated
- Other order details (items, total, user) cannot be modified
- Order details are populated in the response
- Server logs: `Error updating order:` if update fails

---

### 5. Delete Order
Remove an order from the database.

```http
DELETE /api/orders/:id
```

**Parameters:**
- `id` (path, required) - Order ID to delete

**Example:**
```http
DELETE /api/orders/1001
```

**Success Response (200):**
```json
{
  "code": 200,
  "data": "Order deleted successfully"
}
```

**Error Response (400):**
```json
{
  "code": 400,
  "data": "Order not found"
}
```

**Important Notes:**
- Product stock is restored if order was not cancelled
- If order status is "Đã hủy", stock is NOT restored
- Deletion is permanent
- Server logs: `Error deleting order:` if deletion fails

**Stock Restoration Logic:**
```javascript
// Example: Order had 2x iPhone (stock before order: 50)
// After order created: stock = 48
// After order deleted (status != "Đã hủy"): stock = 50 (restored)
// After order deleted (status = "Đã hủy"): stock = 48 (not restored)
```

---

## Order Status Flow

```
Chờ xác nhận (Pending)
    ↓
Đã xác nhận (Confirmed)
    ↓
Đang giao (In Delivery)
    ↓
Đã giao (Delivered)

OR

Chờ xác nhận (Pending)
    ↓
Đã hủy (Cancelled)
```

---

## Frontend Integration Examples

### Example 1: Create Order from Shopping Cart

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

// Usage
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

### Example 2: Quick Buy Single Product

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

// Usage
quickBuy("1", 1, "customer@example.com")
  .then(order => {
    alert(`Order placed! ID: ${order.id}`);
  })
  .catch(error => {
    alert(error.message);
  });
```

---

### Example 3: Handle Stock Validation

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

// Usage
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

### Example 4: Admin Updates Order Status

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

// Usage - Confirm order
updateOrderStatus("1001", "Đã xác nhận")
  .then(result => {
    if (result.success) {
      console.log('Order confirmed:', result.order);
    }
  });

// Mark as delivered
updateOrderStatus("1001", "Đã giao")
  .then(result => {
    if (result.success) {
      console.log('Order delivered:', result.order);
    }
  });
```

---

### Example 5: Using Axios in React

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

## Complete Order Workflow

### 1. Customer Places Order
```http
POST /api/orders
{
  "userEmail": "customer@example.com",
  "items": [{"productId": "1", "quantity": 2}]
}
```

### 2. Admin Views All Orders
```http
GET /api/orders
```

### 3. Admin Confirms Order
```http
PUT /api/orders/1001
{
  "status": "Đã xác nhận"
}
```

### 4. Order Ships
```http
PUT /api/orders/1001
{
  "status": "Đang giao"
}
```

### 5. Order Delivered
```http
PUT /api/orders/1001
{
  "status": "Đã giao"
}
```

### Or Cancel Order
```http
PUT /api/orders/1001
{
  "status": "Đã hủy"
}
```
