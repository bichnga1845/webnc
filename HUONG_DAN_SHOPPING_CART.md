# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG GIỎ HÀNG VỚI SESSION

## 📚 MỤC LỤC
1. [Giới thiệu](#giới-thiệu)
2. [Cấu trúc dự án](#cấu-trúc-dự-án)
3. [Cài đặt](#cài-đặt)
4. [Chạy ứng dụng](#chạy-ứng-dụng)
5. [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
6. [Chi tiết kỹ thuật](#chi-tiết-kỹ-thuật)

---

## 🎯 GIỚI THIỆU

Bài tập minh họa cách sử dụng **Session** để quản lý giỏ hàng tạm thời trong hệ thống thương mại điện tử.

### Đặc điểm chính:
- ✅ Session lưu trữ giỏ hàng trên server (không phải database)
- ✅ Dữ liệu tạm thời, mất khi restart server hoặc timeout
- ✅ Mỗi user có session riêng biệt
- ✅ Chỉ lưu vào database khi khách hàng thanh toán

---

## 📁 CẤU TRÚC DỰ ÁN

```
On_Class/
├── my-serve-mongodb/          # Backend Server
│   ├── index.js               # Main server file
│   ├── package.json
│   └── node_modules/
│
└── my-exer/                   # Frontend Angular
    ├── src/
    │   └── app/
    │       ├── product-list/  # Component danh sách sản phẩm
    │       │   ├── product-list.ts
    │       │   ├── product-list.html
    │       │   └── product-list.css
    │       │
    │       ├── cart/          # Component giỏ hàng
    │       │   ├── cart.ts
    │       │   ├── cart.html
    │       │   └── cart.css
    │       │
    │       └── myservices/    # Services
    │           └── product.service.ts
    │
    ├── angular.json
    └── package.json
```

---

## 🔧 CÀI ĐẶT

### Bước 1: Cài đặt MongoDB (nếu chưa có)
```bash
# Windows: Download và cài đặt từ mongodb.com
# Hoặc sử dụng MongoDB Atlas (cloud)
```

### Bước 2: Cài đặt dependencies cho Backend
```bash
cd my-serve-mongodb
npm install
```

**Packages đã cài:**
- express
- mongodb
- cors
- body-parser
- morgan
- bcrypt
- express-session ✨
- cookie-parser ✨

### Bước 3: Cài đặt dependencies cho Frontend
```bash
cd my-exer
npm install
```

---

## 🚀 CHẠY ỨNG DỤNG

### 1. Khởi động MongoDB
```bash
# Windows
mongod

# Hoặc nếu đã cài service
net start MongoDB
```

### 2. Khởi động Backend Server
```bash
cd my-serve-mongodb
node index.js
```

**Output mong đợi:**
```
Server is running on http://localhost:3002
Database connected successfully
Sample products inserted successfully
```

### 3. Khởi động Frontend
```bash
cd my-exer
ng serve
```

**Truy cập:** http://localhost:4200

---

## 📖 HƯỚNG DẪN SỬ DỤNG

### BƯỚC 1: Đăng nhập
1. Mở trình duyệt: http://localhost:4200
2. Đăng nhập (hoặc đăng ký tài khoản mới)
3. Sau khi đăng nhập, bạn sẽ thấy menu chính

### BƯỚC 2: Xem danh sách sản phẩm
1. Click menu **"🛒 Shopping Cart"** → **"📦 Products"**
2. Hoặc truy cập: http://localhost:4200/product-list

**Giao diện hiển thị:**
- Grid sản phẩm với hình ảnh
- Tên sản phẩm, danh mục
- Mô tả chi tiết
- Giá bán (VNĐ)
- Số lượng còn lại
- Nút **"ADD TO CART"**
- Badge số lượng giỏ hàng ở góc phải trên

### BƯỚC 3: Thêm sản phẩm vào giỏ hàng
1. Click nút **"ADD TO CART"** ở sản phẩm bạn muốn
2. Thông báo: "Đã thêm sản phẩm vào giỏ hàng!"
3. Badge giỏ hàng tăng số lượng

**Lưu ý:** Mỗi lần click sẽ thêm 1 sản phẩm. Nếu sản phẩm đã có trong giỏ, số lượng sẽ được cộng dồn.

### BƯỚC 4: Xem giỏ hàng
1. Click nút **"🛒 Giỏ hàng"** (góc phải trên)
2. Hoặc menu **"🛒 Shopping Cart"** → **"🛒 My Cart"**
3. Hoặc truy cập: http://localhost:4200/cart

**Giao diện giỏ hàng hiển thị:**

📦 **Bảng danh sách sản phẩm:**
| ☑️ | Sản phẩm | Đơn giá | Số lượng | Thành tiền |
|----|----------|---------|----------|------------|
| ☑️ | [Hình] iPhone... | 29,990,000 đ | [- 2 +] | 59,980,000 đ |

💡 **Tổng đơn hàng:**
- Tổng sản phẩm: 3
- Tổng số lượng: 5
- **Tổng tiền: 100,000,000 đ**

### BƯỚC 5: Quản lý giỏ hàng

#### A. Cập nhật số lượng sản phẩm
**Cách 1:** Click nút **+** hoặc **-**
**Cách 2:** Nhập số lượng trực tiếp vào ô input

#### B. Xóa sản phẩm khỏi giỏ
1. Tick vào checkbox ☑️ của sản phẩm cần xóa
2. Click nút **"🗑️ Xóa (n)"** (n là số sản phẩm đã chọn)
3. Xác nhận xóa

**Hoặc:**
- Click checkbox ở tiêu đề để chọn tất cả
- Click **"Xóa tất cả"** để xóa toàn bộ giỏ hàng

#### C. Cập nhật giỏ hàng
- Click nút **"♻️ Cập nhật giỏ hàng"** để refresh dữ liệu

#### D. Tiếp tục mua sắm
- Click nút **"← Tiếp tục mua sắm"** để quay về trang sản phẩm

#### E. Thanh toán (Future)
- Click nút **"Thanh toán →"** (chức năng này có thể mở rộng sau)

---

## 🔬 CHI TIẾT KỸ THUẬT

### 1. SESSION CONFIGURATION

**File:** `my-serve-mongodb/index.js`

```javascript
const session = require('express-session');

app.use(session({
    secret: "Shh, its a secret!",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
```

**Giải thích:**
- `secret`: Mã hóa session ID
- `resave: false`: Không lưu session nếu không thay đổi
- `saveUninitialized: true`: Lưu session ngay cả khi trống
- `cookie.maxAge`: Session hết hạn sau 24 giờ

### 2. CẤU TRÚC SESSION CART

```javascript
req.session.cart = [
  {
    productId: "67890abcdef",
    name: "iPhone 15 Pro Max",
    price: 29990000,
    quantity: 2,
    image: "https://..."
  },
  {
    productId: "12345abcdef",
    name: "MacBook Pro M3",
    price: 42990000,
    quantity: 1,
    image: "https://..."
  }
]
```

### 3. BACKEND APIs

#### 3.1. GET /api/products
**Mục đích:** Lấy danh sách tất cả sản phẩm

**Response:**
```json
{
  "success": true,
  "count": 8,
  "products": [
    {
      "_id": "67890...",
      "name": "iPhone 15 Pro Max",
      "price": 29990000,
      "image": "https://...",
      "description": "...",
      "category": "Smartphone",
      "stock": 50,
      "createdAt": "2026-03-05..."
    }
  ]
}
```

#### 3.2. POST /api/cart/add
**Mục đích:** Thêm sản phẩm vào giỏ hàng (Session)

**Request Body:**
```json
{
  "productId": "67890abcdef",
  "quantity": 1
}
```

**Xử lý:**
1. Lấy thông tin product từ MongoDB
2. Kiểm tra product có tồn tại không
3. Khởi tạo `req.session.cart = []` nếu chưa có
4. Kiểm tra product đã có trong cart chưa
   - Có: Cộng dồn số lượng
   - Chưa: Thêm mới vào cart
5. Trả về cart và cartCount

**Response:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "cart": [...],
  "cartCount": 3
}
```

#### 3.3. GET /api/cart
**Mục đích:** Lấy giỏ hàng từ Session

**Response:**
```json
{
  "success": true,
  "cart": [
    {
      "productId": "...",
      "name": "iPhone 15 Pro Max",
      "price": 29990000,
      "quantity": 2,
      "image": "..."
    }
  ],
  "cartCount": 1,
  "total": 59980000
}
```

#### 3.4. PUT /api/cart/update/:productId
**Mục đích:** Cập nhật số lượng sản phẩm

**Request Body:**
```json
{
  "quantity": 5
}
```

**Xử lý:**
- Nếu quantity <= 0: Xóa sản phẩm khỏi cart
- Nếu quantity > 0: Cập nhật số lượng

#### 3.5. DELETE /api/cart/remove/:productId
**Mục đích:** Xóa sản phẩm khỏi giỏ hàng

#### 3.6. DELETE /api/cart/clear
**Mục đích:** Xóa toàn bộ giỏ hàng

### 4. FRONTEND SERVICE

**File:** `my-exer/src/app/myservices/product.service.ts`

```typescript
export class ProductService {
  private apiUrl = 'http://localhost:3002/api';

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, {
      productId,
      quantity
    });
  }

  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart`);
  }

  // ... các methods khác
}
```

### 5. FRONTEND COMPONENTS

#### 5.1. ProductListComponent
**Chức năng:**
- Hiển thị danh sách sản phẩm
- Nút ADD TO CART
- Badge số lượng giỏ hàng

**Key Methods:**
- `loadProducts()`: Lấy danh sách sản phẩm
- `addToCart(productId)`: Thêm vào giỏ
- `viewCart()`: Navigate đến trang giỏ hàng

#### 5.2. CartComponent
**Chức năng:**
- Hiển thị giỏ hàng
- Quản lý số lượng
- Xóa sản phẩm
- Tính tổng tiền

**Key Methods:**
- `loadCart()`: Lấy giỏ hàng
- `updateQuantity(productId, quantity)`: Cập nhật số lượng
- `removeSelected()`: Xóa các item đã chọn
- `clearCart()`: Xóa toàn bộ

---

## 🎨 SCREENSHOTS

### 1. Trang danh sách sản phẩm
```
┌─────────────────────────────────────────────┐
│  Danh sách sản phẩm    🛒 Giỏ hàng (3)     │
├─────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐   │
│  │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │   │
│  │      │  │      │  │      │  │      │   │
│  │iPhone│  │Galaxy│  │MacBk │  │ iPad │   │
│  │29.9M │  │27.9M │  │42.9M │  │16.9M │   │
│  │[ADD] │  │[ADD] │  │[ADD] │  │[ADD] │   │
│  └──────┘  └──────┘  └──────┘  └──────┘   │
└─────────────────────────────────────────────┘
```

### 2. Trang giỏ hàng
```
┌─────────────────────────────────────────────┐
│  🛒 Giỏ hàng của bạn                        │
├─────────────────────────────────────────────┤
│  ☑ │ Sản phẩm         │ Giá    │ SL │ TT  │
│  ☑ │ [IMG] iPhone... │ 29.9M  │[-2+]│59.8M│
│  ☐ │ [IMG] MacBook.. │ 42.9M  │[-1+]│42.9M│
├─────────────────────────────────────────────┤
│  [🗑 Xóa (1)] [Xóa tất cả]  [♻ Cập nhật]   │
├─────────────────────────────────────────────┤
│                          ┌─────────────────┐│
│                          │ Tổng đơn hàng   ││
│                          │ Số SP:  2       ││
│                          │ Số lượng: 3     ││
│                          │ Tổng: 102.7M đ  ││
│                          │ [← Mua tiếp]    ││
│                          │ [Thanh toán →]  ││
│                          └─────────────────┘│
└─────────────────────────────────────────────┘
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Về Session
- ❌ **KHÔNG lưu vĩnh viễn:** Restart server → mất data
- ⏱️ **Timeout:** Mặc định 24 giờ
- 🔐 **Session ID:** Lưu trong cookie client
- 👤 **Mỗi user:** Có session riêng biệt

### 2. Về Database
- Giỏ hàng KHÔNG lưu trong database
- Chỉ Product data mới lưu trong MongoDB
- Có thể mở rộng: Lưu "incomplete orders" vào DB

### 3. Về Bảo mật
- Session ID được mã hóa
- Server quản lý toàn bộ session data
- Cookie có thể set `httpOnly`, `secure` trong production

### 4. Production Considerations
```javascript
// Nên dùng session store như Redis
const RedisStore = require('connect-redis')(session);
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // HTTPS only
    httpOnly: true,      // Không truy cập từ JS
    maxAge: 3600000      // 1 hour
  }
}));
```

---

## 🚀 MỞ RỘNG

### Feature có thể thêm:
1. **Checkout & Payment:**
   - Lưu order vào database
   - Tích hợp payment gateway (MoMo, VNPay)
   - Send email xác nhận

2. **Incomplete Orders:**
   - Lưu giỏ hàng chưa hoàn thành vào DB
   - Nhắc nhở khách hàng sau X ngày
   - Dashboard cho admin xem orders

3. **Wishlist:**
   - Lưu sản phẩm yêu thích
   - Có thể lưu DB hoặc Session

4. **Product Variants:**
   - Màu sắc, kích thước
   - Giá theo variant

5. **Stock Management:**
   - Kiểm tra số lượng tồn kho
   - Reserve khi add to cart

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Cannot connect to MongoDB"
```bash
# Kiểm tra MongoDB đang chạy
mongosh

# Nếu không, khởi động
mongod
```

### Lỗi: "CORS error"
- Kiểm tra backend có `app.use(cors())`
- Kiểm tra port đúng: 3002

### Giỏ hàng bị mất
- Session timeout → Đăng nhập lại
- Server restart → Dữ liệu mất (đúng như mong đợi)

### Badge không cập nhật
- Check DevTools Console có lỗi không
- Reload trang

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. MongoDB đang chạy: `mongosh`
2. Backend đang chạy: http://localhost:3002
3. Frontend đang chạy: http://localhost:4200
4. Console có lỗi không: F12 → Console

---

**Chúc bạn thành công! 🎉**
