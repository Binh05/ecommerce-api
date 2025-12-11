# API Sản phẩm

## URL Cơ bản
```
http://localhost:5000/api/products
```

---

## Các Điểm cuối (Endpoints)

### 1. Lấy Tất cả Sản phẩm
Lấy danh sách tất cả sản phẩm trong cơ sở dữ liệu.

```http
GET /api/products
```

**Phản hồi:**
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

### 2. Lấy Sản phẩm theo ID
Lấy thông tin chi tiết của một sản phẩm cụ thể.

```http
GET /api/products/:id
```

**Tham số:**
- `id` (đường dẫn, bắt buộc) - ID Sản phẩm (số)

**Ví dụ:**
```http
GET /api/products/1
```

**Phản hồi Thành công (200):**
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

**Phản hồi Lỗi (400):**
```json
{
  "code": 400,
  "data": "Không tìm thấy sản phẩm"
}
```

---

### 3. Tạo Sản phẩm
Thêm một sản phẩm mới vào cơ sở dữ liệu.

```http
POST /api/products
Content-Type: application/json
```

**Nội dung Yêu cầu:**
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

**Trường Bắt buộc:**
- `title` (chuỗi) - Tên sản phẩm
- `price` (số) - Giá sản phẩm

**Trường Tùy chọn:**
- `description` (chuỗi) - Mô tả sản phẩm
- `brand` (chuỗi) - Tên thương hiệu
- `category` (chuỗi) - Danh mục sản phẩm
- `stock` (số) - Số lượng tồn kho
- `discountPercentage` (số) - Phần trăm giảm giá
- `rating` (số) - Đánh giá sản phẩm (0-5)
- `thumbnail` (chuỗi) - Hình ảnh mã hóa Base64 (tối đa 10MB)
- `images` (mảng) - Mảng các URL hình ảnh hoặc chuỗi base64
- `tags` (mảng) - Thẻ sản phẩm
- `weight` (số) - Trọng lượng sản phẩm tính bằng gram
- `dimensions` (đối tượng) - Kích thước sản phẩm
  - `width` (số)
  - `height` (số)
  - `depth` (số)
- `sku`, `availabilityStatus`, `minimumOrderQuantity`, `returnPolicy`, `warrantyInformation`, `shippingInformation`

**Phản hồi Thành công (201):**
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

**Phản hồi Lỗi (400):**
```json
{
  "code": 400,
  "data": "Tiêu đề và giá là bắt buộc"
}
```

**Lưu ý:**
- ID Sản phẩm được tự động tạo (tuần tự)
- Hình ảnh phải được mã hóa base64 với tiền tố phù hợp
- Tổng dung lượng không được vượt quá 10MB
- Dấu thời gian siêu dữ liệu được tạo tự động
- Nhật ký máy chủ: `Error creating product:` nếu xác thực thất bại

---

### 4. Cập nhật Sản phẩm
Cập nhật một sản phẩm hiện có.

```http
PUT /api/products/:id
Content-Type: application/json
```

**Tham số:**
- `id` (đường dẫn, bắt buộc) - ID Sản phẩm cần cập nhật

**Nội dung Yêu cầu:**
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

**Trường Bắt buộc:**
- `title` (chuỗi) - Tên sản phẩm
- `price` (số) - Giá sản phẩm

**Trường Tùy chọn:**
- Bất kỳ trường sản phẩm nào bạn muốn cập nhật

**Phản hồi Thành công (200):**
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

**Phản hồi Lỗi:**
```json
// Thiếu trường bắt buộc
{
  "code": 400,
  "data": "Tiêu đề và giá là bắt buộc"
}

// Không tìm thấy sản phẩm
{
  "code": 400,
  "data": "Không tìm thấy sản phẩm"
}
```

**Lưu ý:**
- `meta.updatedAt` được tự động cập nhật
- Chỉ các trường được cung cấp mới được cập nhật
- ID Sản phẩm không thể thay đổi
- Nhật ký máy chủ: `Error updating product:` nếu cập nhật thất bại

---

### 5. Xóa Sản phẩm
Xóa một sản phẩm khỏi cơ sở dữ liệu.

```http
DELETE /api/products/:id
```

**Tham số:**
- `id` (đường dẫn, bắt buộc) - ID Sản phẩm cần xóa

**Ví dụ:**
```http
DELETE /api/products/5
```

**Phản hồi Thành công (200):**
```json
{
  "code": 200,
  "data": "Xóa sản phẩm thành công"
}
```

**Phản hồi Lỗi (400):**
```json
{
  "code": 400,
  "data": "Không tìm thấy sản phẩm"
}
```

**Lưu ý:**
- Việc xóa là vĩnh viễn
- Trả về thành công ngay cả khi sản phẩm không tồn tại (bất biến)

---

## Hướng dẫn Tải lên Hình ảnh

### Mã hóa Base64
Sản phẩm hỗ trợ hình ảnh được mã hóa base64 cho các trường `thumbnail` và `images`.

**Định dạng:**
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

### Giới hạn Kích thước
- Hình ảnh đơn tối đa: ~7.5MB (sau khi mã hóa base64)
- Tổng dung lượng tối đa: 10MB
- Kích thước hình ảnh khuyến nghị: 1-2MB để có hiệu suất tối ưu

### Ví dụ JavaScript:
```javascript
// Chuyển đổi tệp sang base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Sử dụng
const imageFile = document.querySelector('input[type="file"]').files[0];
const base64Image = await fileToBase64(imageFile);

// Tạo sản phẩm với hình ảnh
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

## Ví dụ Trường hợp Sử dụng

### Lấy tất cả sản phẩm và hiển thị
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

### Tạo một sản phẩm mới
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

### Cập nhật giá sản phẩm
```javascript
fetch('http://localhost:5000/api/products/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "iPhone 15 Pro",
    price: 899  // Giá đã cập nhật
  })
})
  .then(res => res.json())
  .then(data => console.log('Updated:', data.data));
```

### Xóa một sản phẩm
```javascript
fetch('http://localhost:5000/api/products/5', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data.data)); // "Xóa sản phẩm thành công"
```

---

## Xử lý Lỗi

Luôn kiểm tra trường `code` trong phản hồi:

```javascript
const handleProductRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (result.code === 200 || result.code === 201) {
      // Thành công
      return { success: true, data: result.data };
    } else {
      // Lỗi từ API
      return { success: false, error: result.data };
    }
  } catch (error) {
    // Lỗi mạng
    return { success: false, error: 'Lỗi mạng' };
  }
};
```
