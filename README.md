# KohKong Bán Hàng - Hệ Thống Đăng Nhập

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### Bước 1: Cài đặt Node.js packages
```bash
npm install
```

### Bước 2: Khởi động server
```bash
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

---

## 📱 Cấu Hình Telegram Bot

### Bot đã cấu hình:
- **Username**: @KohKongBanHang_bot
- **Token**: 8034408024:AAHnNscm-phyT2YOM7KZIxFyescXxcN_n2k

### Cách sử dụng:

#### Phương pháp 1: Telegram Login Widget (Tự động)
1. Click nút "Login with Telegram" 
2. Xác nhận trong Telegram
3. Tự động đăng nhập

#### Phương pháp 2: Nhập thủ công
1. Mở Telegram, tìm @KohKongBanHang_bot
2. Gửi lệnh `/start` để kích hoạt bot
3. Nhập username Telegram của bạn (VD: @yourname hoặc ID số)
4. Click "Gửi Mã Xác Minh"
5. Nhận mã từ bot và nhập vào form
6. Đăng nhập

---

## 🔧 Cấu Trúc Files

```
├── index.html           # Giao diện đăng nhập
├── styles.css          # CSS styling
├── server.js           # Backend API server
├── telegram-auth.js    # Telegram authentication logic
├── package.json        # Dependencies
└── README.md          # Hướng dẫn này
```

---

## 📝 API Endpoints

### POST `/api/send-verification`
Gửi mã xác minh đến Telegram user
```json
{
  "telegram": "@username hoặc ID"
}
```

### POST `/api/verify-code`
Xác minh mã code
```json
{
  "telegram": "@username",
  "code": "123456"
}
```

### POST `/api/login`
Đăng nhập
```json
{
  "username": "tên_đăng_nhập",
  "password": "mật_khẩu",
  "telegram_id": "telegram_user_id"
}
```

---

## ⚙️ Troubleshooting

### Lỗi: "Cannot find module express"
```bash
npm install
```

### Lỗi: "Failed to send message"
- Đảm bảo bạn đã `/start` bot @KohKongBanHang_bot
- Kiểm tra username Telegram chính xác
- Nếu dùng ID số, phải là chat_id của bạn

### Lỗi: "Cannot connect to server"
- Chạy `npm start` để khởi động server
- Kiểm tra port 3000 có đang được sử dụng không

---

## 🔒 Bảo Mật

- Token bot được lưu trong server (KHÔNG public)
- Mã xác minh hết hạn sau 5 phút
- Sử dụng HTTPS trong production
- Không lưu password dạng plaintext

---

## 📞 Hỗ Trợ

Telegram Bot: @KohKongBanHang_bot
