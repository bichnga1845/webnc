# MoMo Payment Integration Project

Dự án tích hợp MoMo Payment Gateway vào Web Application.

## 📁 Cấu trúc dự án

```
On_Class/
├── my-server-payment/          # Backend Server (Node.js + Express)
├── my-exer/                    # Frontend (Angular)
├── my-app/                     # Angular App
├── my-server/                  # Server khác
├── my-server-mongodb/          # MongoDB Server
└── HUONG_DAN_MOMO_PAYMENT.md   # Tài liệu hướng dẫn chi tiết
```

## 🚀 Hướng dẫn chạy

### Backend (MoMo Payment Server)
```powershell
cd my-server-payment
npm install
node index.js
```
Server chạy tại: http://localhost:3003

### Frontend (Angular)
```powershell
cd my-exer
npm install
ng serve
```
App chạy tại: http://localhost:4200

## 📚 Tài liệu

Xem file [HUONG_DAN_MOMO_PAYMENT.md](HUONG_DAN_MOMO_PAYMENT.md) để biết chi tiết về:
- Hướng dẫn tích hợp MoMo Payment
- Giải thích code
- Test và debug
- Xử lý lỗi

## 🔐 Bảo mật

- **KHÔNG** commit secretKey lên Git
- Sử dụng environment variables cho production
- Luôn verify signature từ MoMo

## 📧 Liên hệ

- MoMo Support: merchant.care@momo.vn
- Developer Email: itc.payment@mservice.com.vn
