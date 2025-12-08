# Products API

## Base URL
```
http://localhost:5000/api/products
```

---

## Endpoints

### 1. Get All Products
Get a list of all products in the database.

```http
GET /api/products
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
      "description": "Latest iPhone model with A17 Pro chip",
      "brand": "Apple",
      "category": "smartphones",
      "price": 999,
      "discountPercentage": 10,
      "rating": 4.5,
      "stock": 50,
      "availabilityStatus": "In Stock",
      "sku": "IPHONE15PRO",
      "thumbnail": "data:image/jpeg;base64,...",
      "images": ["url1", "url2"],
      "tags": ["smartphone", "apple", "5G"],
      "weight": 221,
      "dimensions": {
        "width": 71.6,
        "height": 146.6,
        "depth": 8.25
      },
      "meta": {
        "createdAt": "2024-12-08T10:00:00Z",
        "updatedAt": "2024-12-08T10:00:00Z",
        "barcode": "1234567890",
        "qrCode": "QR123"
      },
      "reviews": [
        {
          "rating": 5,
          "comment": "Excellent phone!",
          "reviewerName": "John Doe"
        }
      ]
    }
  ]
}
```

---

### 2. Get Product by ID
Get details of a specific product.

```http
GET /api/products/:id
```

**Parameters:**
- `id` (path, required) - Product ID (number)

**Example:**
```http
GET /api/products/1
```

**Success Response (200):**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "iPhone 15 Pro",
    "description": "Latest iPhone model",
    "price": 999,
    "stock": 50,
    "thumbnail": "data:image/jpeg;base64,...",
    // ... other fields
  }
}
```

**Error Response (400):**
```json
{
  "code": 400,
  "data": "Product not found"
}
```

---

### 3. Create Product
Add a new product to the database.

```http
POST /api/products
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Samsung Galaxy S24",
  "description": "Latest Samsung flagship with AI features",
  "brand": "Samsung",
  "category": "smartphones",
  "price": 899,
  "discountPercentage": 5,
  "stock": 100,
  "availabilityStatus": "In Stock",
  "sku": "GALAXYS24",
  "thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "images": [
    "data:image/jpeg;base64,...",
    "data:image/jpeg;base64,..."
  ],
  "tags": ["android", "5G", "samsung"],
  "rating": 4.3,
  "weight": 168,
  "dimensions": {
    "width": 70.6,
    "height": 147,
    "depth": 7.6
  },
  "warrantyInformation": "2 year warranty",
  "shippingInformation": "Ships in 1-2 business days",
  "returnPolicy": "30 days return policy"
}
```

**Required Fields:**
- `title` (string) - Product name
- `price` (number) - Product price

**Optional Fields:**
- `description` (string) - Product description
- `brand` (string) - Brand name
- `category` (string) - Product category
- `stock` (number) - Available stock
- `discountPercentage` (number) - Discount percentage
- `rating` (number) - Product rating (0-5)
- `thumbnail` (string) - Base64 encoded image (max 10MB)
- `images` (array) - Array of image URLs or base64 strings
- `tags` (array) - Product tags
- `weight` (number) - Product weight in grams
- `dimensions` (object) - Product dimensions
  - `width` (number)
  - `height` (number)
  - `depth` (number)
- `sku`, `availabilityStatus`, `minimumOrderQuantity`, `returnPolicy`, `warrantyInformation`, `shippingInformation`

**Success Response (201):**
```json
{
  "code": 201,
  "data": {
    "id": 2,
    "title": "Samsung Galaxy S24",
    "price": 899,
    "stock": 100,
    "thumbnail": "data:image/jpeg;base64,...",
    "meta": {
      "createdAt": "2024-12-08T10:30:00Z",
      "updatedAt": "2024-12-08T10:30:00Z"
    }
    // ... other fields
  }
}
```

**Error Response (400):**
```json
{
  "code": 400,
  "data": "Title and price are required"
}
```

**Notes:**
- Product ID is auto-generated (sequential)
- Images should be base64 encoded with proper prefix
- Total payload must not exceed 10MB
- Metadata timestamps are automatically generated
- Server logs: `Error creating product:` if validation fails

---

### 4. Update Product
Update an existing product.

```http
PUT /api/products/:id
Content-Type: application/json
```

**Parameters:**
- `id` (path, required) - Product ID to update

**Request Body:**
```json
{
  "title": "iPhone 15 Pro Max",
  "price": 1199,
  "stock": 30,
  "discountPercentage": 15,
  "thumbnail": "data:image/jpeg;base64,...",
  "availabilityStatus": "Low Stock"
}
```

**Required Fields:**
- `title` (string) - Product name
- `price` (number) - Product price

**Optional Fields:**
- Any product field you want to update

**Success Response (200):**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "iPhone 15 Pro Max",
    "price": 1199,
    "stock": 30,
    "discountPercentage": 15,
    "meta": {
      "createdAt": "2024-12-08T10:00:00Z",
      "updatedAt": "2024-12-08T11:30:00Z"
    }
    // ... updated fields
  }
}
```

**Error Responses:**
```json
// Missing required fields
{
  "code": 400,
  "data": "Title and price are required"
}

// Product not found
{
  "code": 400,
  "data": "Product not found"
}
```

**Notes:**
- `meta.updatedAt` is automatically updated
- Only provided fields are updated
- Product ID cannot be changed
- Server logs: `Error updating product:` if update fails

---

### 5. Delete Product
Remove a product from the database.

```http
DELETE /api/products/:id
```

**Parameters:**
- `id` (path, required) - Product ID to delete

**Example:**
```http
DELETE /api/products/5
```

**Success Response (200):**
```json
{
  "code": 200,
  "data": "Product deleted successfully"
}
```

**Error Response (400):**
```json
{
  "code": 400,
  "data": "Product not found"
}
```

**Notes:**
- Deletion is permanent
- Returns success even if product doesn't exist (idempotent)

---

## Image Upload Guide

### Base64 Encoding
Products support base64 encoded images for the `thumbnail` and `images` fields.

**Format:**
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

### Size Limits
- Maximum single image: ~7.5MB (after base64 encoding)
- Maximum total payload: 10MB
- Recommended image size: 1-2MB for optimal performance

### JavaScript Example:
```javascript
// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Usage
const imageFile = document.querySelector('input[type="file"]').files[0];
const base64Image = await fileToBase64(imageFile);

// Create product with image
const productData = {
  title: "New Product",
  price: 299,
  thumbnail: base64Image
};

fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
});
```

---

## Example Use Cases

### Get all products and display
```javascript
fetch('http://localhost:5000/api/products')
  .then(res => res.json())
  .then(data => {
    if (data.code === 200) {
      const products = data.data;
      products.forEach(product => {
        console.log(`${product.title} - $${product.price}`);
      });
    }
  });
```

### Create a new product
```javascript
const newProduct = {
  title: "MacBook Pro M3",
  description: "Professional laptop with M3 chip",
  brand: "Apple",
  category: "laptops",
  price: 2499,
  stock: 20,
  thumbnail: "data:image/jpeg;base64,...",
  tags: ["laptop", "apple", "professional"]
};

fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newProduct)
})
  .then(res => res.json())
  .then(data => {
    if (data.code === 201) {
      console.log('Product created:', data.data);
    } else {
      console.error('Error:', data.data);
    }
  });
```

### Update product price
```javascript
fetch('http://localhost:5000/api/products/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "iPhone 15 Pro",
    price: 899  // Updated price
  })
})
  .then(res => res.json())
  .then(data => console.log('Updated:', data.data));
```

### Delete a product
```javascript
fetch('http://localhost:5000/api/products/5', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data.data)); // "Product deleted successfully"
```

---

## Error Handling

Always check the `code` field in the response:

```javascript
const handleProductRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (result.code === 200 || result.code === 201) {
      // Success
      return { success: true, data: result.data };
    } else {
      // Error from API
      return { success: false, error: result.data };
    }
  } catch (error) {
    // Network error
    return { success: false, error: 'Network error' };
  }
};
```
