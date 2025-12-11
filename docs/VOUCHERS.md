# API Quản Lý Vouchers

## Base URL
```
http://localhost:5000/api/vouchers
```

---

## Danh Sách Endpoints

### 1. Lấy Tất Cả Vouchers
Lấy danh sách tất cả vouchers trong hệ thống (dùng cho admin).

```http
GET /api/vouchers
```

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "_id": "674a...",
      "code": "FLASH50",
      "receiveStartTime": "2025-12-12T11:00:00Z",
      "receiveEndTime": "2025-12-12T12:00:00Z",
      "validityDays": 5,
      "minimumPurchase": 500,
      "discountAmount": 0,
      "discountPercent": 50,
      "maxDiscount": 500,
      "description": "Flash sale 50% off, max $500",
      "totalQuantity": 100,
      "claimedCount": 45,
      "usedCount": 20,
      "isActive": true,
      "createdAt": "2025-12-10T10:00:00Z",
      "updatedAt": "2025-12-11T15:30:00Z"
    },
    {
      "_id": "674b...",
      "code": "NEWYEAR100",
      "receiveStartTime": "2025-12-31T00:00:00Z",
      "receiveEndTime": "2026-01-01T23:59:59Z",
      "validityDays": 7,
      "minimumPurchase": 1000,
      "discountAmount": 100,
      "discountPercent": 0,
      "maxDiscount": 0,
      "description": "New Year discount $100",
      "totalQuantity": 50,
      "claimedCount": 10,
      "usedCount": 5,
      "isActive": true,
      "createdAt": "2025-12-10T10:00:00Z",
      "updatedAt": "2025-12-10T10:00:00Z"
    }
  ]
}
```

---

### 2. Lấy Voucher Theo ID
Lấy thông tin chi tiết của một voucher qua MongoDB ObjectId.

```http
GET /api/vouchers/:id
```

**Tham Số:**
- `id` (path, bắt buộc) - MongoDB ObjectId của voucher

**Ví Dụ:**
```http
GET /api/vouchers/674a1b2c3d4e5f...
```

**Response Thành Công (200):**
```json
{
  "code": 200,
  "data": {
    "_id": "674a...",
    "code": "FLASH50",
    "receiveStartTime": "2025-12-12T11:00:00Z",
    "receiveEndTime": "2025-12-12T12:00:00Z",
    "validityDays": 5,
    "minimumPurchase": 500,
    "discountPercent": 50,
    "maxDiscount": 500,
    "description": "Flash sale 50% off",
    "totalQuantity": 100,
    "claimedCount": 45,
    "usedCount": 20,
    "isActive": true
  }
}
```

**Response Lỗi (400):**
```json
{
  "code": 400,
  "data": "Voucher not found"
}
```

---

### 3. Lấy Voucher Theo Mã Code
Lấy thông tin voucher bằng mã code.

```http
GET /api/vouchers/code/:code
```

**Tham Số:**
- `code` (path, bắt buộc) - Mã voucher (không phân biệt hoa thường)

**Ví Dụ:**
```http
GET /api/vouchers/code/FLASH50
```

**Response Thành Công (200):**
```json
{
  "code": 200,
  "data": {
    "code": "FLASH50",
    "description": "Flash sale 50% off",
    "minimumPurchase": 500,
    "discountPercent": 50,
    "maxDiscount": 500,
    "validityDays": 5,
    "receiveStartTime": "2025-12-12T11:00:00Z",
    "receiveEndTime": "2025-12-12T12:00:00Z",
    // ... other fields
  }
}
```

---

### 4. Lấy Danh Sách Vouchers Có Thể Nhận
Lấy tất cả vouchers đang có thể nhận (available) tại thời điểm hiện tại.

```http
GET /api/vouchers/available
```

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "_id": "674a...",
      "code": "FLASH50",
      "description": "Flash sale 50% off",
      "receiveStartTime": "2025-12-12T11:00:00Z",
      "receiveEndTime": "2025-12-12T12:00:00Z",
      "validityDays": 5,
      "minimumPurchase": 500,
      "discountPercent": 50,
      "maxDiscount": 500,
      "totalQuantity": 100,
      "claimedCount": 45,
      "isActive": true
    }
  ]
}
```

**Lưu Ý:**
- Chỉ trả về các vouchers thỏa mãn:
  - `isActive` = true
  - Thời gian hiện tại nằm trong khoảng `receiveStartTime` đến `receiveEndTime`
  - `claimedCount < totalQuantity` (còn hàng)
- Sắp xếp theo `receiveEndTime` (sắp hết hạn nhận trước)

---

### 5. Tạo Voucher Mới
Tạo một voucher mới (chỉ admin).

```http
POST /api/vouchers
Content-Type: application/json
```

**Request Body (Lựa Chọn 1 - Giảm Giá Cố Định):**
```json
{
  "code": "NEWYEAR100",
  "receiveStartTime": "2025-12-31T00:00:00Z",
  "receiveEndTime": "2026-01-01T23:59:59Z",
  "validityDays": 7,
  "minimumPurchase": 1000,
  "discountAmount": 100,
  "description": "Giảm $100 mừng năm mới",
  "totalQuantity": 50
}
```

**Request Body (Lựa Chọn 2 - Giảm Giá Theo Phần Trăm):**
```json
{
  "code": "FLASH50",
  "receiveStartTime": "2025-12-12T11:00:00Z",
  "receiveEndTime": "2025-12-12T12:00:00Z",
  "validityDays": 5,
  "minimumPurchase": 500,
  "discountPercent": 50,
  "maxDiscount": 500,
  "description": "Flash sale giảm 50%, tối đa $500",
  "totalQuantity": 100
}
```

**Trường Bắt Buộc:**
- `code` (string) - Mã voucher duy nhất (tự động chuyển sang chữ HOA)
- `receiveStartTime` (date) - Thời gian bắt đầu cho phép nhận voucher
- `receiveEndTime` (date) - Thời gian kết thúc nhận voucher
- `validityDays` (number) - Số ngày voucher có hiệu lực sau khi nhận
- `totalQuantity` (number) - Tổng số lượng voucher có sẵn

**Trường Giảm Giá (phải có MỘT trong hai):**
- `discountAmount` (number) - Số tiền giảm cố định (đơn vị $)
- `discountPercent` (number) - Phần trăm giảm giá (0-100)
  - Nếu dùng phần trăm, có thể set `maxDiscount` để giới hạn

**Trường Tùy Chọn:**
- `minimumPurchase` (number) - Giá trị đơn hàng tối thiểu để dùng voucher (mặc định: 0)
- `maxDiscount` (number) - Giảm giá tối đa khi dùng phần trăm (mặc định: 0 = không giới hạn)
- `description` (string) - Mô tả voucher

**Response Thành Công (201):**
```json
{
  "code": 201,
  "data": {
    "_id": "674a...",
    "code": "FLASH50",
    "receiveStartTime": "2025-12-12T11:00:00Z",
    "receiveEndTime": "2025-12-12T12:00:00Z",
    "validityDays": 5,
    "minimumPurchase": 500,
    "discountPercent": 50,
    "maxDiscount": 500,
    "description": "Flash sale 50% off",
    "totalQuantity": 100,
    "claimedCount": 0,
    "usedCount": 0,
    "isActive": true,
    "createdAt": "2025-12-11T10:00:00Z",
    "updatedAt": "2025-12-11T10:00:00Z"
  }
}
```

**Console Log Khi Tạo Thành Công:**
```
✅ Voucher created: FLASH50
📅 Receive: 2025-12-12T11:00:00Z to 2025-12-12T12:00:00Z
⏱️ Valid for: 5 days
💰 Discount: 50% (max $500)
```

**Các Lỗi Có Thể Gặp:**

Thiếu trường bắt buộc:
```json
{
  "code": 400,
  "data": "Missing required fields"
}
```

Mã code đã tồn tại:
```json
{
  "code": 400,
  "data": "Voucher code already exists"
}
```

Khoảng thời gian không hợp lệ:
```json
{
  "code": 400,
  "data": "receiveEndTime must be after receiveStartTime"
}
```

Cấu hình giảm giá không hợp lệ:
```json
{
  "code": 400,
  "data": "Voucher must have either discountAmount or discountPercent"
}
```

---

### 6. Cập Nhật Voucher
Cập nhật thông tin voucher đã có (chỉ admin).

```http
PUT /api/vouchers/:id
Content-Type: application/json
```

**Tham Số:**
- `id` (path, bắt buộc) - MongoDB ObjectId của voucher

**Request Body:**
```json
{
  "description": "Mô tả đã cập nhật",
  "totalQuantity": 150,
  "isActive": false
}
```

**Các Trường Có Thể Update:**
- Tất cả các trường voucher trừ `claimedCount` và `usedCount`

**Response Thành Công (200):**
```json
{
  "code": 200,
  "data": {
    "_id": "674a...",
    "code": "FLASH50",
    "description": "Updated description",
    "totalQuantity": 150,
    "isActive": false,
    // ... other fields
  }
}
```

**Lưu Ý:**
- `claimedCount` và `usedCount` được quản lý tự động, không thể update thủ công
- `code` sẽ tự động chuyển sang chữ HOA nếu được cập nhật

---

### 7. Xóa Voucher
Xóa một voucher khỏi hệ thống (chỉ admin).

```http
DELETE /api/vouchers/:id
```

**Tham Số:**
- `id` (path, bắt buộc) - MongoDB ObjectId của voucher

**Response Thành Công (200):**
```json
{
  "code": 200,
  "data": "Voucher deleted successfully"
}
```

**Response Lỗi (400):**
```json
{
  "code": 400,
  "data": "Voucher not found"
}
```

---

### 8. Nhận Voucher (Claim)
User nhận voucher để thêm vào tài khoản của mình.

```http
POST /api/vouchers/:id/claim
Content-Type: application/json
```

**Tham Số:**
- `id` (path, bắt buộc) - MongoDB ObjectId của voucher

**Request Body:**
```json
{
  "userId": "674a1b2c3d4e5f..."
}
```

**Trường Bắt Buộc:**
- `userId` (string) - MongoDB ObjectId của user

**Response Thành Công (200):**
```json
{
  "code": 200,
  "data": {
    "message": "Voucher claimed successfully",
    "voucher": {
      "_id": "674a...",
      "code": "FLASH50",
      "description": "Flash sale giảm 50%",
      "validityDays": 5,
      "minimumPurchase": 500,
      "discountPercent": 50,
      "maxDiscount": 500
    },
    "expiresAt": "2025-12-17T11:00:00Z"
  }
}
```

**Console Log:**
```
✅ User johndoe claimed voucher FLASH50 (46/100)
```

**Các Lỗi Có Thể Gặp:**

Không tìm thấy user:
```json
{
  "code": 400,
  "data": "User not found"
}
```

Voucher không active:
```json
{
  "code": 400,
  "data": "Voucher is not active"
}
```

Voucher hết hàng:
```json
{
  "code": 400,
  "data": "Voucher is out of stock"
}
```

Chưa đến hoặc quá thời gian nhận:
```json
{
  "code": 400,
  "data": "Voucher is not available for claiming at this time"
}
```

Đã nhận voucher này rồi:
```json
{
  "code": 400,
  "data": "You have already claimed this voucher"
}
```

**Điều Gì Xảy Ra Khi Claim:**
- Voucher được thêm vào mảng `vouchers` của user
- Ghi lại thời điểm `claimedAt`
- Tăng `claimedCount` của voucher lên 1
- **TỰ ĐỘNG SET `isActive = false`** nếu `claimedCount >= totalQuantity` (hết hàng)
- Voucher hết hạn sau `validityDays` ngày kể từ khi nhận

---

### 9. Lấy Danh Sách Vouchers Của User
Lấy tất cả vouchers còn hiệu lực của một user cụ thể.

```http
GET /api/vouchers/user/:userId
```

**Tham Số:**
- `userId` (path, bắt buộc) - MongoDB ObjectId của user

**Ví Dụ:**
```http
GET /api/vouchers/user/674a1b2c3d4e5f...
```

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "voucher": {
        "_id": "674a...",
        "code": "FLASH50",
        "description": "Flash sale 50% off",
        "minimumPurchase": 500,
        "discountPercent": 50,
        "maxDiscount": 500,
        "validityDays": 5
      },
      "claimedAt": "2025-12-12T11:30:00Z",
      "isUsed": false
    },
    {
      "voucher": {
        "_id": "674b...",
        "code": "NEWYEAR100",
        "description": "Giảm giá năm mới",
        "minimumPurchase": 1000,
        "discountAmount": 100,
        "validityDays": 7
      },
      "claimedAt": "2025-12-10T09:00:00Z",
      "isUsed": false
    }
  ]
}
```

**Lưu Ý:**
- Chỉ trả về các vouchers thỏa mãn:
  - Chưa sử dụng (`isUsed: false`)
  - Chưa hết hạn (tính từ `claimedAt + validityDays`)
- Thông tin voucher được populate đầy đủ

---

## Sử Dụng Vouchers Trong Đơn Hàng

Khi tạo đơn hàng, bạn có thể áp dụng vouchers:

```http
POST /api/orders
Content-Type: application/json
```

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "items": [
    { "productId": "1", "quantity": 2 }
  ],
  "voucherCodes": ["FLASH50", "NEWYEAR100"],
  "shippingAddress": "123 Main St",
  "paymentMethod": "COD"
}
```

**Response:**
```json
{
  "code": 201,
  "data": {
    "id": "1001",
    "originalTotal": 2000,
    "discount": 600,
    "total": 1400,
    "appliedVouchers": [
      {
        "voucher": { "code": "FLASH50", "description": "..." },
        "code": "FLASH50",
        "discountAmount": 500
      },
      {
        "voucher": { "code": "NEWYEAR100", "description": "..." },
        "code": "NEWYEAR100",
        "discountAmount": 100
      }
    ],
    // ... các trường khác của order
  }
}
```

**Quy Trình Xử Lý:**
1. Kiểm tra user đã nhận các vouchers này chưa
2. Kiểm tra vouchers còn hiệu lực (chưa hết hạn)
3. Xác minh tổng đơn hàng đạt minimum purchase
4. Tính toán giảm giá cho từng voucher
5. Đánh dấu vouchers là đã sử dụng trong tài khoản user
6. Tăng `usedCount` cho mỗi voucher
7. Lưu thông tin vouchers đã áp dụng vào order

---

## Các Loại Voucher

### Giảm Giá Cố Định
```json
{
  "code": "SAVE100",
  "discountAmount": 100,
  "minimumPurchase": 500
}
```
- User được giảm đúng $100
- Đơn hàng phải tối thiểu $500

### Giảm Giá Theo Phần Trăm (Không Giới Hạn)
```json
{
  "code": "PERCENT20",
  "discountPercent": 20,
  "minimumPurchase": 0
}
```
- User được giảm 20% tổng đơn hàng
- Không có giới hạn giảm tối đa

### Giảm Giá Theo Phần Trăm (Có Giới Hạn)
```json
{
  "code": "FLASH50",
  "discountPercent": 50,
  "maxDiscount": 500,
  "minimumPurchase": 500
}
```
- User được giảm 50% tổng đơn hàng
- Giảm tối đa là $500
- Đơn hàng phải tối thiểu $500

**Ví dụ tính toán:**
- Đơn hàng $1000: giảm $500 (50% = $500, không vượt quá giới hạn)
- Đơn hàng $2000: giảm $500 (50% = $1000, nhưng bị giới hạn ở $500)
- Đơn hàng $400: giảm $0 (chưa đạt minimum purchase)

---

## Vòng Đời Voucher

### 1. Admin Tạo Voucher
```
POST /api/vouchers
code: FLASH50
receiveStartTime: 2025-12-12 11:00
receiveEndTime: 2025-12-12 12:00
validityDays: 5
totalQuantity: 100
```

### 2. User Nhận Voucher (Claim)
```
POST /api/vouchers/{id}/claim
userId: 674a...

→ Được thêm vào vouchers của user
→ claimedAt: 2025-12-12 11:30
→ expiresAt: 2025-12-17 11:30 (sau 5 ngày)
→ claimedCount tăng lên (46/100)
→ Nếu hết hàng (100/100): isActive tự động = false
```

### 3. User Sử Dụng Voucher
```
POST /api/orders
voucherCodes: ["FLASH50"]

→ Voucher được đánh dấu là đã sử dụng
→ Xóa khỏi danh sách vouchers available của user
→ Lưu vào appliedVouchers của order
→ usedCount tăng lên
```

### 4. Voucher Hết Hạn
- Voucher hết hạn sau `validityDays` ngày kể từ `claimedAt`
- Vouchers hết hạn không hiển trong danh sách available
- Không thể sử dụng trong order sau khi hết hạn

---

## Ví Dụ Tích Hợp Frontend

### Ví Dụ 1: Hiển Thị Vouchers Có Sẵn

```javascript
const fetchAvailableVouchers = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/vouchers/available');
    const result = await response.json();
    
    if (result.code === 200) {
      return result.data;
    }
  } catch (error) {
    console.error('Lỗi khi lấy vouchers:', error);
  }
};

// Sử dụng
fetchAvailableVouchers().then(vouchers => {
  vouchers.forEach(v => {
    console.log(`${v.code}: ${v.description}`);
    console.log(`Nhận trước: ${new Date(v.receiveEndTime)}`);
    console.log(`Còn lại: ${v.totalQuantity - v.claimedCount}`);
  });
});
```

---

### Ví Dụ 2: Nhận Voucher

```javascript
const claimVoucher = async (voucherId, userId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/vouchers/${voucherId}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const result = await response.json();
    
    if (result.code === 200) {
      alert(`Đã nhận voucher ${result.data.voucher.code}!`);
      console.log(`Hết hạn: ${result.data.expiresAt}`);
      return result.data;
    } else {
      alert(`Lỗi: ${result.data}`);
    }
  } catch (error) {
    console.error('Nhận voucher thất bại:', error);
  }
};
```

---

### Ví Dụ 3: Hiển Thị Vouchers Của User

```javascript
const fetchUserVouchers = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/vouchers/user/${userId}`);
    const result = await response.json();
    
    if (result.code === 200) {
      return result.data;
    }
  } catch (error) {
    console.error('Lỗi:', error);
  }
};

// React component
const UserVouchers = ({ userId }) => {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    fetchUserVouchers(userId).then(setVouchers);
  }, [userId]);

  return (
    <div>
      <h2>Vouchers Của Tôi</h2>
      {vouchers.map((v, i) => (
        <div key={i}>
          <h3>{v.voucher.code}</h3>
          <p>{v.voucher.description}</p>
          <p>Đã nhận: {new Date(v.claimedAt).toLocaleDateString()}</p>
          <p>Đơn tối thiểu: ${v.voucher.minimumPurchase}</p>
          {v.voucher.discountAmount > 0 && (
            <p>Giảm: ${v.voucher.discountAmount}</p>
          )}
          {v.voucher.discountPercent > 0 && (
            <p>Giảm: {v.voucher.discountPercent}% (tối đa ${v.voucher.maxDiscount})</p>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

### Ví Dụ 4: Áp Dụng Voucher Khi Thanh Toánoán

```javascript
const checkout = async (userId, items, voucherCodes) => {
  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        items,
        voucherCodes
      })
    });

    const result = await response.json();
    
    if (result.code === 201) {
      const order = result.data;
      console.log(`Đơn hàng đã tầo: ${order.id}`);
      console.log(`Gốc: $${order.originalTotal}`);
      console.log(`Giảm giá: $${order.discount}`);
      console.log(`Tổng: $${order.total}`);
      return order;
    } else {
      alert(`Lỗi: ${result.data}`);
    }
  } catch (error) {
    console.error('Thanh toán thất bại:', error);
  }
};

// Sử dụng
checkout(
  "674a...",
  [{ productId: "1", quantity: 2 }],
  ["FLASH50", "NEWYEAR100"]
);
```

---

## Quy Tắc Validation

1. **Định Dạng Mã Code:**
   - Tự động chuyển thành chữ HOA
   - Phải là duy nhất

2. **Validation Thời Gian:**
   - `receiveEndTime` phải sau `receiveStartTime`
   - Voucher chỉ có thể nhận trong khoảng thời gian này

3. **Validation Giảm Giá:**
   - Phải có `discountAmount` HOẶC `discountPercent` (không được cả hai)
   - `discountPercent` phải từ 0-100
   - `maxDiscount` chỉ áp dụng khi dùng phần trăm

4. **Validation Khi Nhận (Claim):**
   - User chỉ có thể nhận mỗi voucher một lần
   - Phải trong khoảng thời gian cho phép
   - Voucher phải còn hàng (claimedCount < totalQuantity)
   - **Tự động disable nếu hết hàng**

5. **Validation Khi Sử Dụng:**
   - Tổng đơn hàng phải đạt `minimumPurchase`
   - Voucher không được hết hạn
   - Voucher chưa được sử dụng
