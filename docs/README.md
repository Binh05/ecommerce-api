# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Available APIs

- 📦 [**Products API**](./PRODUCTS.md) - Manage products (CRUD operations)
- 🛒 [**Orders API**](./ORDERS.md) - Create and manage orders
- 🎟️ [**Vouchers API**](./VOUCHERS.md) - Voucher system (claim, apply discounts)
- 👥 [**Users API**](./USERS.md) - User management (admin only)
- 🔐 [**Authentication API**](./AUTH.md) - Login, register, token refresh

## Quick Start

1. **Start the server:**
   ```bash
   cd ecommerce-api
   npm run dev
   ```

2. **Test the API:**
   ```bash
   # Get all products
   curl http://localhost:5000/api/products
   
   # Create an order
   curl -X POST http://localhost:5000/api/orders \
     -H "Content-Type: application/json" \
     -d '{"userEmail": "user@example.com", "items": [{"productId": "1", "quantity": 2}]}'
   ```

## Common Response Format

### Success Response
```json
{
  "code": 200,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "code": 400,
  "data": "Error message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Notes

- All timestamps use ISO 8601 format
- ObjectId format: 24-character hex string
- Maximum payload size: 10MB (for image uploads)
- Base64 images must include proper prefix: `data:image/jpeg;base64,` or `data:image/png;base64,`
