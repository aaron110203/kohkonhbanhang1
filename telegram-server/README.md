# Telegram Bot Server - KohKong Shop

## 🚀 Cài Đặt và Chạy

### Bước 1: Cài đặt Node.js
1. Tải Node.js: https://nodejs.org (phiên bản LTS)
2. Cài đặt Node.js
3. Kiểm tra: Mở Terminal/CMD và gõ:
```bash
node --version
npm --version
```

### Bước 2: Cài đặt Dependencies
Mở Terminal/PowerShell trong thư mục `telegram-server`:

```bash
cd telegram-server
npm install
```

### Bước 3: Chạy Server
```bash
npm start
```

Hoặc chạy với auto-reload (development):
```bash
npm run dev
```

### Bước 4: Kiểm tra Bot
1. Mở Telegram
2. Tìm: `@KohKongShopBot_bot`
3. Gửi: `/start`
4. Bot phải trả lời ngay lập tức!

---

## 🌐 Kết Nối Website với Server

### Option 1: Chạy Local (Testing)

Server đang chạy tại: `http://localhost:3000`

Cập nhật trong `auth.js`:
```javascript
// Line ~17
async function requestVerificationCode() {
  const telegram = document.getElementById('reg-telegram').value.trim();
  
  if (!telegram || !telegram.startsWith('@')) {
    alert('❌ Vui lòng nhập Telegram username hợp lệ (bắt đầu bằng @)!');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/verification/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram })
    });

    const data = await response.json();

    if (data.success) {
      alert('✅ ' + data.message);
    } else {
      alert('❌ ' + (data.message || data.error));
    }
  } catch (error) {
    alert('❌ Không thể kết nối server. Vui lòng kiểm tra server đang chạy!');
  }
}
```

### Option 2: Deploy lên Internet (Production)

#### Deploy trên Render.com (FREE):

1. Đăng ký: https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo: `kohkonhbanhang1`
4. Settings:
   - **Name**: `kohkong-telegram-bot`
   - **Root Directory**: `telegram-server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Create Web Service"
6. Lấy URL: `https://kohkong-telegram-bot.onrender.com`

Sau đó cập nhật trong `auth.js` và `products.js`:
```javascript
const API_URL = 'https://kohkong-telegram-bot.onrender.com';
```

---

## 📡 API Endpoints

### 1. Request Verification Code
```bash
POST /api/verification/request
Content-Type: application/json

{
  "telegram": "@username"
}

# Response:
{
  "success": true,
  "message": "Mã xác minh đã được gửi đến Telegram của bạn!"
}
```

### 2. Verify Code
```bash
POST /api/verification/verify
Content-Type: application/json

{
  "telegram": "@username",
  "code": "123456"
}

# Response:
{
  "success": true,
  "verified": true,
  "message": "Xác minh thành công!"
}
```

### 3. Send Order Notification
```bash
POST /api/telegram/notify
Content-Type: application/json

{
  "telegram": "@agentUsername",
  "message": "🛒 ĐƠN HÀNG MỚI!..."
}

# Response:
{
  "success": true,
  "message": "Đã gửi thông báo đến đại lý!"
}
```

---

## 🧪 Test Bot Commands

### Trong Telegram:

1. `/start` - Khởi động bot, lưu ChatID
2. `/myinfo` - Xem thông tin username và ChatID

---

## ⚠️ Troubleshooting

### Bot không phản hồi `/start`
- Kiểm tra Bot Token đúng chưa
- Kiểm tra server đang chạy
- Xem console logs

### Không nhận được mã xác minh
- User phải gửi `/start` cho bot trước
- Kiểm tra username Telegram đúng format (@username)
- Xem server logs: `console.log`

### Lỗi "user_not_found"
- Đại lý chưa gửi `/start` cho bot
- Hướng dẫn đại lý mở Telegram → tìm `@KohKongShopBot_bot` → gửi `/start`

---

## 🔒 Bảo Mật

**QUAN TRỌNG**: Bot Token đã được hard-code trong `server.js`

Để bảo mật hơn, tạo file `.env`:
```env
TELEGRAM_BOT_TOKEN=8222381044:AAGKWavqin310ESw4XE5DsywlyTgIllGU2c
PORT=3000
```

Và sửa `server.js`:
```javascript
require('dotenv').config();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
```

---

## 📊 Logs

Server sẽ log mọi hoạt động:
```
✅ Server đang chạy tại http://localhost:3000
✅ Telegram Bot @KohKongShopBot_bot đang hoạt động
📱 User /start: @username, ChatID: 123456789
🔐 Generated code 123456 for @username
✅ Verification successful for @username
📦 Send order notification to: @username
```

---

## 🎯 Next Steps

1. ✅ Chạy server local và test
2. ✅ Update `auth.js` để gọi API thật
3. ✅ Deploy lên Render/Heroku
4. ✅ Update frontend với production URL
5. ✅ Test toàn bộ flow: Đăng ký → Xác minh → Đặt hàng

Sau khi deploy xong, website sẽ kết nối với Telegram Bot thật và gửi mã xác minh + thông báo đơn hàng!
