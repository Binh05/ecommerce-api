# API Documentation - Products & Orders

## Base URL
```
http://localhost:5000/api
```

---

## 📦 PRODUCTS API

### 1. Get All Products
```http
GET /products
```

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "_id": "674a...",
      "id": 1,
      "title": "iPhone 15 Pro",
      "description": "Latest iPhone model",
      "brand": "Apple",
      "category": "smartphones",
      "price": 999,
      "discountPercentage": 10,
      "rating": 4.5,
      "stock": 50,
      "thumbnail": "data:image/jpeg;base64,...",
      "images": ["url1", "url2"],
      "meta": {
        "createdAt": "2024-12-08T10:00:00Z",
        "updatedAt": "2024-12-08T10:00:00Z"
      }
    }
  ]
}
```

---

### 2. Get Product by ID
```http
GET /products/:id
```

**Parameters:**
- `id` (path) - Product ID (number)

**Example:**
```http
GET /products/1
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "iPhone 15 Pro",
    "price": 999,
    "stock": 50,
    // ... other fields
  }
}
```

---

### 3. Create Product
```http
POST /products
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Samsung Galaxy S24",
  "description": "Latest Samsung flagship",
  "brand": "Samsung",
  "category": "smartphones",
  "price": 899,
  "discountPercentage": 5,
  "stock": 100,
  "thumbnail": "data:image/jpeg;base64,...",
  "images": ["url1", "url2"],
  "tags": ["android", "5G"],
  "rating": 4.3
}
```

**Required Fields:**
- `title` (string) - Product name
- `price` (number) - Product price

**Optional Fields:**
- `description`, `brand`, `category`, `stock`, `thumbnail`, `images`, `tags`, `rating`, `discountPercentage`

**Response:**
```json
{
  "code": 201,
  "data": {
    "id": 2,
    "title": "Samsung Galaxy S24",
    "price": 899,
    "meta": {
      "createdAt": "2024-12-08T10:30:00Z",
      "updatedAt": "2024-12-08T10:30:00Z"
    }
    // ... other fields
  }
}
```

**Notes:**
- ID is auto-generated
- Image must be base64 encoded (max 10MB payload)
- Metadata timestamps are auto-generated

---

### 4. Update Product
```http
PUT /products/:id
Content-Type: application/json
```

**Parameters:**
- `id` (path) - Product ID to update

**Request Body:**
```json
{
  "title": "iPhone 15 Pro Max",
  "price": 1199,
  "stock": 30,
  "thumbnail": "data:image/jpeg;base64,..."
}
```

**Required Fields:**
- `title` (string)
- `price` (number)

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "iPhone 15 Pro Max",
    "price": 1199,
    "meta": {
      "updatedAt": "2024-12-08T11:00:00Z"
    }
    // ... updated fields
  }
}
```

**Notes:**
- `meta.updatedAt` is automatically updated

---

### 5. Delete Product
```http
DELETE /products/:id
```

**Parameters:**
- `id` (path) - Product ID to delete

**Example:**
```http
DELETE /products/5
```

**Response:**
```json
{
  "code": 200,
  "data": "Product deleted successfully"
}
```

---

## 🛒 ORDERS API

### 1. Get All Orders
```http
GET /orders
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
            "price": 999
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
      "createdAt": "2024-12-08T12:00:00Z",
      "updatedAt": "2024-12-08T12:00:00Z"
    }
  ]
}
```

**Notes:**
- Orders are sorted by date (newest first)
- User and product details are populated

---

### 2. Get Order by ID
```http
GET /orders/:id
```

**Parameters:**
- `id` (path) - Order ID (string)

**Example:**
```http
GET /orders/1001
```

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "1001",
    "user": {
      "username": "john_doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "address": "123 Main St"
    },
    "items": [
      {
        "product": {
          "title": "iPhone 15 Pro",
          "thumbnail": "...",
          "price": 999,
          "stock": 48
        },
        "quantity": 2,
        "price": 999
      }
    ],
    "total": 1998,
    "status": "Chờ xác nhận",
    // ... other fields
  }
}
```

---

### 3. Create Order
```http
POST /orders
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
- `items` (array) - Array of order items (at least 1 item required)
  - `productId` (ObjectId string OR number) - Product being ordered (supports both MongoDB _id and custom id)
  - `quantity` (number) - Quantity to order (must be > 0)

**Optional Fields:**
- `shippingAddress` (string) - Defaults to user's address or "N/A"
- `paymentMethod` (string) - Defaults to "COD"
- `note` (string) - Order notes/instructions

**Response:**
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

**Notes:**
- Order ID is auto-generated (sequential)
- Total is calculated automatically from current product prices
- Product stock is automatically decreased when order is created
- Supports finding user by either `userId` (MongoDB ObjectId) or `userEmail`
- Supports finding products by either MongoDB `_id` or custom `id` field
- Validates user exists and products have sufficient stock
- Price is saved at time of purchase (won't change if product price changes later)
- Order status defaults to "Chờ xác nhận"

**Server Console Output:**
```
✅ Order 1002 created successfully for user john@example.com
📦 Products: iPhone 15 Pro (x2), AirPods Pro (x1)
💰 Total: $2247
```

**Error Responses:**
```json
// Missing user identifier
{
  "code": 400,
  "data": "userId or userEmail is required"
}

// User not found
{
  "code": 400,
  "data": "User not found"
}

// No items provided
{
  "code": 400,
  "data": "Items are required"
}

// Invalid item structure
{
  "code": 400,
  "data": "Each item must have productId and quantity"
}

// Invalid quantity
{
  "code": 400,
  "data": "Quantity must be greater than 0"
}

// Product not found
{
  "code": 400,
  "data": "Product with ID 674c... not found"
}

// Insufficient stock
{
  "code": 400,
  "data": "Insufficient stock for \"iPhone 15 Pro\". Available: 1, Requested: 2"
}
```

---

### 4. Update Order Status
```http
PUT /orders/:id
Content-Type: application/json
```

**Parameters:**
- `id` (path) - Order ID to update

**Request Body:**
```json
{
  "status": "Đã xác nhận"
}
```

**Valid Status Values:**
- `"Chờ xác nhận"` (default)
- `"Đã xác nhận"`
- `"Đang giao"`
- `"Đã giao"`
- `"Đã hủy"`

**Response:**
```json
{
  "code": 200,
  "data": {
    "id": "1001",
    "status": "Đã xác nhận",
    "user": { /* user details */ },
    "items": [ /* items with product details */ ],
    // ... other fields
  }
}
```

**Notes:**
- Only status field can be updated
- Order details are populated in response

---

### 5. Delete Order
```http
DELETE /orders/:id
```

**Parameters:**
- `id` (path) - Order ID to delete

**Example:**
```http
DELETE /orders/1001
```

**Response:**
```json
{
  "code": 200,
  "data": "Order deleted successfully"
}
```

**Notes:**
- Product stock is restored if order was not cancelled
- Permanently removes order from database

---

## 🔧 Common Response Formats

### Success Response
```json
{
  "code": 200,  // or 201 for creation
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "code": 400,  // or 404, 500
  "data": "Error message"
}
```

---

## 📝 Example Use Cases

### Complete Order Flow

**1. Get available products:**
```http
GET /products
```

**2. Create order with selected products:**
```http
POST /orders
{
  "userId": "674a...",
  "items": [
    { "productId": "674c...", "quantity": 2 }
  ],
  "shippingAddress": "123 Street",
  "paymentMethod": "COD"
}
```

**3. Admin confirms order:**
```http
PUT /orders/1001
{
  "status": "Đã xác nhận"
}
```

**4. Update order status to shipping:**
```http
PUT /orders/1001
{
  "status": "Đang giao"
}
```

**5. Mark as delivered:**
```http
PUT /orders/1001
{
  "status": "Đã giao"
}
```

---

### Frontend Integration Examples

#### Example 1: Create Order from Shopping Cart

**Scenario:** User has items in cart and clicks "Place Order"

```javascript
// Frontend - React/Vue/Angular
const createOrder = async (cartItems, userEmail, shippingInfo) => {
  try {
    const orderData = {
      userEmail: userEmail, // or userId if you have it
      items: cartItems.map(item => ({
        productId: item.id, // Can use either MongoDB _id or custom id
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
      // Clear cart, show success message, redirect to order confirmation
      return result.data;
    } else {
      console.error('Order failed:', result.data);
      // Show error message to user
      throw new Error(result.data);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Usage
const cartItems = [
  { id: "674c1a2b3c4d...", name: "iPhone 15 Pro", quantity: 1, price: 999 },
  { id: "674d5e6f7g8h...", name: "AirPods Pro", quantity: 2, price: 249 }
];

const shippingInfo = {
  address: "123 Main Street, City, Country",
  paymentMethod: "COD",
  deliveryNote: "Please call before delivery"
};

createOrder(cartItems, "user@example.com", shippingInfo)
  .then(order => {
    alert(`Order ${order.id} created successfully! Total: $${order.total}`);
    // Redirect to order confirmation page
    window.location.href = `/orders/${order.id}`;
  })
  .catch(error => {
    alert(`Failed to create order: ${error.message}`);
  });
```

---

#### Example 2: Quick Buy - Single Product

**Scenario:** User clicks "Buy Now" on a product page

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
        items: [
          {
            productId: productId,
            quantity: quantity
          }
        ],
        paymentMethod: "COD"
        // shippingAddress will default to user's saved address
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
    console.log('Order placed:', order);
  })
  .catch(error => {
    alert(error.message);
  });
```

---

#### Example 3: Handle Stock Validation Errors

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
      // Success
      return { success: true, order: result.data };
    } else {
      // Error - parse the message
      const errorMsg = result.data;
      
      if (errorMsg.includes('Insufficient stock')) {
        // Extract product name and available quantity
        return {
          success: false,
          error: 'stock',
          message: errorMsg
        };
      } else if (errorMsg.includes('not found')) {
        return {
          success: false,
          error: 'not_found',
          message: errorMsg
        };
      } else {
        return {
          success: false,
          error: 'general',
          message: errorMsg
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'network',
      message: 'Network error. Please try again.'
    };
  }
};

// Usage with error handling
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
        // Prompt user to reduce quantity or remove item
        break;
      case 'not_found':
        alert('Some products are no longer available.');
        // Remove invalid items from cart
        break;
      default:
        alert(`Error: ${result.message}`);
    }
  }
});
```

---

#### Example 4: Using Axios (Recommended for React)

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

// Create order function
const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return { success: true, data: response.data.data };
  } catch (error) {
    const errorMessage = error.response?.data?.data || error.message;
    return { success: false, error: errorMessage };
  }
};

// React component example
const CheckoutButton = ({ cartItems, userEmail }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    const orderData = {
      userEmail: userEmail,
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      shippingAddress: "User's address",
      paymentMethod: "COD"
    };

    const result = await createOrder(orderData);
    
    if (result.success) {
      // Success - navigate to order confirmation
      navigate(`/orders/${result.data.id}`);
      toast.success(`Order ${result.data.id} created successfully!`);
    } else {
      // Error - show error message
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Processing...' : 'Place Order'}
    </button>
  );
};
```

---

### Product Management

**1. Add new product:**
```http
POST /products
{
  "title": "MacBook Pro M3",
  "price": 2499,
  "brand": "Apple",
  "category": "laptops",
  "stock": 20,
  "thumbnail": "data:image/jpeg;base64,..."
}
```

**2. Update product price and stock:**
```http
PUT /products/3
{
  "title": "MacBook Pro M3",
  "price": 2299,
  "stock": 15
}
```

**3. Check specific product:**
```http
GET /products/3
```

**4. Remove product:**
```http
DELETE /products/3
```

---

## 🔒 Notes

- All timestamps use ISO 8601 format
- ObjectId format: 24-character hex string
- Base64 images: Use `data:image/jpeg;base64,` or `data:image/png;base64,` prefix
- Maximum payload size: 10MB (for image uploads)
- Stock is automatically managed when orders are created/deleted
- Price in orders is saved at time of purchase (not affected by future product price changes)
