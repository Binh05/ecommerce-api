# Tài Liệu API

## Base URL
```
http://localhost:5000/api
```

## Các API Có Sẵn

- 📦 [**Products API**](./PRODUCTS.md) - Quản lý sản phẩm (CRUD)
- 🛒 [**Orders API**](./ORDERS.md) - Tạo và quản lý đơn hàng
- 🎟️ [**Vouchers API**](./VOUCHERS.md) - Hệ thống voucher (nhận, áp dụng giảm giá)
- 👥 [**Users API**](./USERS.md) - Quản lý người dùng (chỉ admin)
- 🔐 [**Authentication API**](./AUTH.md) - Đăng nhập, đăng ký, làm mới token

## Bắt Đầu Nhanh

1. **Khởi động server:**
   ```bash
   cd ecommerce-api
   npm run dev
   ```

2. **Test API:**
   ```bash
   # Lấy tất cả sản phẩm
   curl http://localhost:5000/api/products
   
   # Tạo đơn hàng
   curl -X POST http://localhost:5000/api/orders \
     -H "Content-Type: application/json" \
     -d '{"userEmail": "user@example.com", "items": [{"productId": "1", "quantity": 2}]}'
   ```

## Định Dạng Response Chung

### Response Thành Công
```json
{
  "code": 200,
  "data": { /* dữ liệu trả về */ }
}
```

### Response Lỗi
```json
{
  "code": 400,
  "data": "Thông báo lỗi"
}
```

## Mã Trạng Thái

- `200` - Thành công
- `201` - Đã tạo
- `400` - Yêu cầu không hợp lệ
- `401` - Chưa xác thực
- `404` - Không tìm thấy
- `500` - Lỗi máy chủ

## Lưu Ý

- Tất cả timestamps dùng định dạng ISO 8601
- ObjectId: chuỗi hex 24 ký tự
- Kích thước payload tối đa: 10MB (cho upload ảnh)
- Ảnh base64 phải có prefix: `data:image/jpeg;base64,` hoặc `data:image/png;base64,`
