# Shopping Cart with Session - Hệ thống Giỏ hàng với Session

## 📋 Mô tả dự án

Dự án này minh họa việc sử dụng Session để xử lý giỏ hàng trong trang web thương mại điện tử. Khách hàng có thể:
- Xem danh sách sản phẩm
- Thêm sản phẩm vào giỏ hàng (lưu trong Session)
- Xem và quản lý giỏ hàng
- Cập nhật số lượng, xóa sản phẩm

**Lưu ý:** Dữ liệu giỏ hàng chỉ lưu tạm thời trong Session (Server memory). Khi tắt server hoặc hết timeout, dữ liệu sẽ mất.

## 🏗️ Kiến trúc hệ thống

### Backend (Node.js + Express + MongoDB)
- **Database:** MongoDB với collection `Product`
- **Session:** express-session để quản lý giỏ hàng
- **APIs:**
  - `GET /api/products` - Lấy danh sách sản phẩm
  - `GET /api/products/:id` - Lấy chi tiết sản phẩm
  - `POST /api/cart/add` - Thêm vào giỏ hàng
  - `GET /api/cart` - Xem giỏ hàng
  - `PUT /api/cart/update/:productId` - Cập nhật số lượng
  - `DELETE /api/cart/remove/:productId` - Xóa khỏi giỏ hàng
  - `DELETE /api/cart/clear` - Xóa toàn bộ giỏ hàng

### Frontend (Angular)
- **ProductListComponent** - Hiển thị danh sách sản phẩm
- **CartComponent** - Quản lý giỏ hàng
- **ProductService** - Service gọi APIs

## 🚀 Cài đặt và Chạy

### 1. Khởi động MongoDB
```bash
# Windows
mongod
```

### 2. Chạy Backend Server
```bash
cd my-serve-mongodb
npm install
node index.js
```
Server sẽ chạy tại: http://localhost:3002

### 3. Chạy Frontend Angular
```bash
cd my-exer
npm install
ng serve
```
Frontend sẽ chạy tại: http://localhost:4200

## 📦 Dữ liệu mẫu

Hệ thống tự động tạo 8 sản phẩm mẫu khi khởi động lần đầu:
1. iPhone 15 Pro Max - 29,990,000 đ
2. Samsung Galaxy S24 Ultra - 27,990,000 đ
3. MacBook Pro M3 - 42,990,000 đ
4. iPad Air M2 - 16,990,000 đ
5. Apple Watch Series 9 - 10,990,000 đ
6. AirPods Pro Gen 2 - 5,990,000 đ
7. Sony WH-1000XM5 - 8,990,000 đ
8. Dell XPS 13 - 32,990,000 đ

## 🎯 Tính năng chính

### 1. Xem danh sách sản phẩm
- Hiển thị grid sản phẩm với hình ảnh, tên, giá
- Nút "ADD TO CART" để thêm vào giỏ
- Badge hiển thị số lượng sản phẩm trong giỏ

### 2. Quản lý giỏ hàng
- ✅ Hiển thị danh sách sản phẩm đã chọn
- ✅ Checkbox để chọn sản phẩm cần xóa
- ✅ Tăng/giảm số lượng sản phẩm
- ✅ Xóa sản phẩm đã chọn
- ✅ Cập nhật giỏ hàng
- ✅ Xóa toàn bộ giỏ hàng
- ✅ Tiếp tục mua sắm (quay về trang sản phẩm)
- ✅ Hiển thị tổng tiền

## 🔐 Session Configuration

```javascript
app.use(session({
    secret: "Shh, its a secret!",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
```

**Cấu trúc dữ liệu Session Cart:**
```javascript
req.session.cart = [
  {
    productId: "id1",
    name: "iPhone 15 Pro Max",
    price: 29990000,
    quantity: 2,
    image: "url"
  }
]
```

## 📸 Screenshots

### Trang danh sách sản phẩm
- Grid layout responsive
- Hiển thị hình ảnh, tên, giá, mô tả
- Nút ADD TO CART
- Badge số lượng giỏ hàng

### Trang giỏ hàng
- Bảng danh sách sản phẩm
- Checkbox để chọn xóa
- Input để thay đổi số lượng
- Các nút: Xóa, Cập nhật, Tiếp tục mua sắm
- Tổng kết đơn hàng

## 🔄 Luồng hoạt động

1. **Khách hàng xem sản phẩm** → GET /api/products
2. **Click "ADD TO CART"** → POST /api/cart/add → Lưu vào req.session.cart
3. **Xem giỏ hàng** → GET /api/cart → Lấy từ req.session.cart
4. **Cập nhật số lượng** → PUT /api/cart/update/:productId → Update session
5. **Xóa sản phẩm** → DELETE /api/cart/remove/:productId → Remove from session
6. **Thanh toán** → Có thể lưu vào database (optional)

## ⚠️ Lưu ý quan trọng

1. **Session chỉ lưu tạm thời:**
   - Restart server → mất dữ liệu
   - Timeout → mất dữ liệu
   - Mỗi user có session riêng (dựa vào cookie)

2. **Không lưu database:**
   - Giỏ hàng chỉ trong Session
   - Chỉ lưu DB khi khách thanh toán

3. **Bảo mật:**
   - Session ID được lưu trong cookie
   - Server quản lý session data
   - Không lộ thông tin nhạy cảm

## 🛠️ Technologies

**Backend:**
- Node.js
- Express.js
- MongoDB + MongoClient
- express-session
- cookie-parser
- cors
- body-parser

**Frontend:**
- Angular 18
- TypeScript
- RxJS
- HttpClient

## 📝 TODO (Mở rộng)

- [ ] Lưu giỏ hàng vào database khi checkout
- [ ] Tích hợp payment gateway
- [ ] Lưu "incomplete orders" vào database
- [ ] Email nhắc nhở khách hàng
- [ ] Session store với Redis
- [ ] Xử lý concurrent requests

## 👨‍💻 Tác giả

Bài tập Advanced Business Web Development
Vietnam National University Ho Chi Minh City
University of Economics and Law

---

**Port:**
- Backend: http://localhost:3002
- Frontend: http://localhost:4200
- MongoDB: mongodb://127.0.0.1:27017
