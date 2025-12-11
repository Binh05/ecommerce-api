# Vouchers API

## Base URL
```
http://localhost:5000/api/vouchers
```

---

## Endpoints

### 1. Get All Vouchers
Get a list of all vouchers in the system.

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

### 2. Get Voucher by ID
Get details of a specific voucher by MongoDB ObjectId.

```http
GET /api/vouchers/:id
```

**Parameters:**
- `id` (path, required) - Voucher's MongoDB ObjectId

**Example:**
```http
GET /api/vouchers/674a1b2c3d4e5f...
```

**Success Response (200):**
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

**Error Response (400):**
```json
{
  "code": 400,
  "data": "Voucher not found"
}
```

---

### 3. Get Voucher by Code
Get voucher details using the voucher code.

```http
GET /api/vouchers/code/:code
```

**Parameters:**
- `code` (path, required) - Voucher code (case insensitive)

**Example:**
```http
GET /api/vouchers/code/FLASH50
```

**Success Response (200):**
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

### 4. Get Available Vouchers
Get all vouchers that are currently available for claiming.

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

**Notes:**
- Only returns vouchers where:
  - `isActive` is true
  - Current time is between `receiveStartTime` and `receiveEndTime`
  - `claimedCount < totalQuantity`
- Sorted by `receiveEndTime` (ending soonest first)

---

### 5. Create Voucher
Create a new voucher (admin only).

```http
POST /api/vouchers
Content-Type: application/json
```

**Request Body (Option 1 - Fixed Amount Discount):**
```json
{
  "code": "NEWYEAR100",
  "receiveStartTime": "2025-12-31T00:00:00Z",
  "receiveEndTime": "2026-01-01T23:59:59Z",
  "validityDays": 7,
  "minimumPurchase": 1000,
  "discountAmount": 100,
  "description": "New Year discount $100",
  "totalQuantity": 50
}
```

**Request Body (Option 2 - Percentage Discount):**
```json
{
  "code": "FLASH50",
  "receiveStartTime": "2025-12-12T11:00:00Z",
  "receiveEndTime": "2025-12-12T12:00:00Z",
  "validityDays": 5,
  "minimumPurchase": 500,
  "discountPercent": 50,
  "maxDiscount": 500,
  "description": "Flash sale 50% off, max $500",
  "totalQuantity": 100
}
```

**Required Fields:**
- `code` (string) - Unique voucher code (will be uppercased)
- `receiveStartTime` (date) - When users can start claiming
- `receiveEndTime` (date) - When claiming period ends
- `validityDays` (number) - Number of days voucher is valid after claiming
- `totalQuantity` (number) - Total number of vouchers available

**Discount Fields (must have ONE):**
- `discountAmount` (number) - Fixed discount amount in dollars
- `discountPercent` (number) - Percentage discount (0-100)
  - If using percentage, can optionally set `maxDiscount`

**Optional Fields:**
- `minimumPurchase` (number) - Minimum order total to use voucher (default: 0)
- `maxDiscount` (number) - Maximum discount when using percentage (default: 0 = unlimited)
- `description` (string) - Voucher description

**Success Response (201):**
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

**Server Console Output:**
```
✅ Voucher created: FLASH50
📅 Receive: 2025-12-12T11:00:00Z to 2025-12-12T12:00:00Z
⏱️ Valid for: 5 days
💰 Discount: 50% (max $500)
```

**Error Responses:**

Missing required fields:
```json
{
  "code": 400,
  "data": "Missing required fields"
}
```

Code already exists:
```json
{
  "code": 400,
  "data": "Voucher code already exists"
}
```

Invalid time range:
```json
{
  "code": 400,
  "data": "receiveEndTime must be after receiveStartTime"
}
```

Invalid discount configuration:
```json
{
  "code": 400,
  "data": "Voucher must have either discountAmount or discountPercent"
}
```

---

### 6. Update Voucher
Update an existing voucher (admin only).

```http
PUT /api/vouchers/:id
Content-Type: application/json
```

**Parameters:**
- `id` (path, required) - Voucher's MongoDB ObjectId

**Request Body:**
```json
{
  "description": "Updated description",
  "totalQuantity": 150,
  "isActive": false
}
```

**Allowed Fields to Update:**
- All voucher fields except `claimedCount` and `usedCount`

**Success Response (200):**
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

**Notes:**
- `claimedCount` and `usedCount` are automatically managed
- Code will be uppercased if provided

---

### 7. Delete Voucher
Remove a voucher from the system (admin only).

```http
DELETE /api/vouchers/:id
```

**Parameters:**
- `id` (path, required) - Voucher's MongoDB ObjectId

**Success Response (200):**
```json
{
  "code": 200,
  "data": "Voucher deleted successfully"
}
```

**Error Response (400):**
```json
{
  "code": 400,
  "data": "Voucher not found"
}
```

---

### 8. Claim Voucher
User claims a voucher to add it to their account.

```http
POST /api/vouchers/:id/claim
Content-Type: application/json
```

**Parameters:**
- `id` (path, required) - Voucher's MongoDB ObjectId

**Request Body:**
```json
{
  "userId": "674a1b2c3d4e5f..."
}
```

**Required Fields:**
- `userId` (string) - User's MongoDB ObjectId

**Success Response (200):**
```json
{
  "code": 200,
  "data": {
    "message": "Voucher claimed successfully",
    "voucher": {
      "_id": "674a...",
      "code": "FLASH50",
      "description": "Flash sale 50% off",
      "validityDays": 5,
      "minimumPurchase": 500,
      "discountPercent": 50,
      "maxDiscount": 500
    },
    "expiresAt": "2025-12-17T11:00:00Z"
  }
}
```

**Server Console Output:**
```
✅ User johndoe claimed voucher FLASH50
```

**Error Responses:**

User not found:
```json
{
  "code": 400,
  "data": "User not found"
}
```

Voucher not active:
```json
{
  "code": 400,
  "data": "Voucher is not active"
}
```

Voucher out of stock:
```json
{
  "code": 400,
  "data": "Voucher is out of stock"
}
```

Not in claiming period:
```json
{
  "code": 400,
  "data": "Voucher is not available for claiming at this time"
}
```

Already claimed:
```json
{
  "code": 400,
  "data": "You have already claimed this voucher"
}
```

**Notes:**
- Voucher is added to user's `vouchers` array
- `claimedAt` timestamp is recorded
- Voucher's `claimedCount` is incremented
- Voucher expires after `validityDays` from claim date

---

### 9. Get User's Vouchers
Get all valid vouchers for a specific user.

```http
GET /api/vouchers/user/:userId
```

**Parameters:**
- `userId` (path, required) - User's MongoDB ObjectId

**Example:**
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
        "description": "New Year discount",
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

**Notes:**
- Only returns vouchers that are:
  - Not yet used (`isUsed: false`)
  - Still valid (not expired based on `claimedAt + validityDays`)
- Voucher details are populated

---

## Using Vouchers in Orders

When creating an order, you can apply vouchers:

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
    // ... other order fields
  }
}
```

**What happens:**
1. Validates user has claimed these vouchers
2. Checks vouchers are still valid (not expired)
3. Verifies order total meets minimum purchase requirements
4. Calculates discount for each voucher
5. Marks vouchers as used in user's account
6. Increments `usedCount` for each voucher
7. Saves applied vouchers in order record

---

## Voucher Types

### Fixed Amount Discount
```json
{
  "code": "SAVE100",
  "discountAmount": 100,
  "minimumPurchase": 500
}
```
- User saves exactly $100
- Order must be at least $500

### Percentage Discount (Unlimited)
```json
{
  "code": "PERCENT20",
  "discountPercent": 20,
  "minimumPurchase": 0
}
```
- User saves 20% of order total
- No maximum discount cap

### Percentage Discount (Capped)
```json
{
  "code": "FLASH50",
  "discountPercent": 50,
  "maxDiscount": 500,
  "minimumPurchase": 500
}
```
- User saves 50% of order total
- Maximum discount is $500
- Order must be at least $500

**Example calculations:**
- Order $1000: saves $500 (50% = $500, capped at $500)
- Order $2000: saves $500 (50% = $1000, but capped at $500)
- Order $400: saves $0 (below minimum purchase)

---

## Voucher Lifecycle

### 1. Admin Creates Voucher
```
POST /api/vouchers
code: FLASH50
receiveStartTime: 2025-12-12 11:00
receiveEndTime: 2025-12-12 12:00
validityDays: 5
```

### 2. User Claims Voucher
```
POST /api/vouchers/{id}/claim
userId: 674a...

→ Added to user's vouchers
→ claimedAt: 2025-12-12 11:30
→ expiresAt: 2025-12-17 11:30 (5 days later)
```

### 3. User Uses Voucher
```
POST /api/orders
voucherCodes: ["FLASH50"]

→ Voucher marked as used
→ Removed from user's available vouchers
→ Saved in order's appliedVouchers
```

### 4. Voucher Expiration
- Voucher expires `validityDays` after `claimedAt`
- Expired vouchers won't show in user's available vouchers
- Cannot be used in orders after expiration

---

## Frontend Integration Examples

### Example 1: Display Available Vouchers

```javascript
const fetchAvailableVouchers = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/vouchers/available');
    const result = await response.json();
    
    if (result.code === 200) {
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching vouchers:', error);
  }
};

// Usage
fetchAvailableVouchers().then(vouchers => {
  vouchers.forEach(v => {
    console.log(`${v.code}: ${v.description}`);
    console.log(`Claim before: ${new Date(v.receiveEndTime)}`);
    console.log(`Available: ${v.totalQuantity - v.claimedCount}`);
  });
});
```

---

### Example 2: Claim Voucher

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
      alert(`Voucher ${result.data.voucher.code} claimed!`);
      console.log(`Expires: ${result.data.expiresAt}`);
      return result.data;
    } else {
      alert(`Error: ${result.data}`);
    }
  } catch (error) {
    console.error('Claim failed:', error);
  }
};
```

---

### Example 3: Display User's Vouchers

```javascript
const fetchUserVouchers = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/vouchers/user/${userId}`);
    const result = await response.json();
    
    if (result.code === 200) {
      return result.data;
    }
  } catch (error) {
    console.error('Error:', error);
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
      <h2>My Vouchers</h2>
      {vouchers.map((v, i) => (
        <div key={i}>
          <h3>{v.voucher.code}</h3>
          <p>{v.voucher.description}</p>
          <p>Claimed: {new Date(v.claimedAt).toLocaleDateString()}</p>
          <p>Min purchase: ${v.voucher.minimumPurchase}</p>
          {v.voucher.discountAmount > 0 && (
            <p>Save: ${v.voucher.discountAmount}</p>
          )}
          {v.voucher.discountPercent > 0 && (
            <p>Save: {v.voucher.discountPercent}% (max ${v.voucher.maxDiscount})</p>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

### Example 4: Apply Voucher at Checkout

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
      console.log(`Order created: ${order.id}`);
      console.log(`Original: $${order.originalTotal}`);
      console.log(`Discount: $${order.discount}`);
      console.log(`Final: $${order.total}`);
      return order;
    } else {
      alert(`Error: ${result.data}`);
    }
  } catch (error) {
    console.error('Checkout failed:', error);
  }
};

// Usage
checkout(
  "674a...",
  [{ productId: "1", quantity: 2 }],
  ["FLASH50", "NEWYEAR100"]
);
```

---

## Validation Rules

1. **Code Format:**
   - Automatically converted to uppercase
   - Must be unique

2. **Time Validation:**
   - `receiveEndTime` must be after `receiveStartTime`
   - Voucher only claimable during this period

3. **Discount Validation:**
   - Must have either `discountAmount` OR `discountPercent` (not both)
   - `discountPercent` must be between 0-100
   - `maxDiscount` only applies when using percentage

4. **Claim Validation:**
   - User can only claim once
   - Must be within claiming period
   - Voucher must have stock available

5. **Usage Validation:**
   - Order total must meet `minimumPurchase`
   - Voucher must not be expired
   - Voucher must not already be used
