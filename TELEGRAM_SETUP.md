# Hướng Dẫn Tích Hợp Telegram Bot

## 📱 Tạo Telegram Bot

### Bước 1: Tạo Bot với BotFather
1. Mở Telegram và tìm `@BotFather`
2. Gửi lệnh `/newbot`
3. Đặt tên bot (VD: `KohKong Shop Bot`)
4. Đặt username (VD: `@KohKongShopBot`)
5. Lưu **Bot Token** (VD: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Bước 2: Cấu Hình Bot
```
/setdescription - Đặt mô tả bot
/setabouttext - Đặt thông tin "About"
/setuserpic - Tải ảnh đại diện
```

---

## 🖥️ Backend Server (Node.js + Express)

### Cài Đặt
```bash
mkdir telegram-bot-server
cd telegram-bot-server
npm init -y
npm install express node-telegram-bot-api dotenv cors body-parser
```

### File `.env`
```env
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
PORT=3000
```

### File `server.js`
```javascript
require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store verification codes và chat IDs
const verificationCodes = new Map();
const userChatIds = new Map();

// Bot command: /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : null;

  if (!username) {
    bot.sendMessage(chatId, '❌ Bạn cần có Telegram username để sử dụng bot này!');
    return;
  }

  bot.sendMessage(chatId, 
    `Chào mừng ${msg.from.first_name}! 👋\n\n` +
    `Username của bạn: ${username}\n\n` +
    `🔹 Để đăng ký làm đại lý:\n` +
    `1. Vào website: https://taphoakohkong.live\n` +
    `2. Đăng ký với username Telegram: ${username}\n` +
    `3. Nhấn "Gửi Yêu Cầu Mã"\n` +
    `4. Bot sẽ gửi mã xác minh cho bạn\n\n` +
    `📱 Sau khi đăng ký thành công, bạn sẽ nhận thông báo đơn hàng tại đây!`
  );

  // Lưu chatId theo username
  userChatIds.set(username, chatId);
});

// API: Request verification code
app.post('/api/verification/request', (req, res) => {
  const { telegram } = req.body;

  if (!telegram || !telegram.startsWith('@')) {
    return res.status(400).json({ error: 'Invalid Telegram username' });
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store code (expires in 10 minutes)
  verificationCodes.set(telegram, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  // Get chatId
  const chatId = userChatIds.get(telegram);

  if (!chatId) {
    return res.status(404).json({ 
      error: 'User not found. Please send /start to the bot first.',
      message: 'Vui lòng mở Telegram và gửi /start cho bot trước!'
    });
  }

  // Send code via Telegram
  bot.sendMessage(chatId, 
    `🔐 MÃ XÁC MINH\n\n` +
    `Mã của bạn: ${code}\n\n` +
    `⏰ Mã có hiệu lực trong 10 phút.\n` +
    `Nhập mã này vào website để hoàn tất đăng ký.`
  );

  res.json({ success: true, message: 'Verification code sent via Telegram' });
});

// API: Verify code
app.post('/api/verification/verify', (req, res) => {
  const { telegram, code } = req.body;

  const stored = verificationCodes.get(telegram);

  if (!stored) {
    return res.status(400).json({ error: 'No verification code found' });
  }

  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(telegram);
    return res.status(400).json({ error: 'Verification code expired' });
  }

  if (stored.code !== code) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  // Success - delete code
  verificationCodes.delete(telegram);
  
  res.json({ success: true, verified: true });
});

// API: Send order notification to agent
app.post('/api/telegram/notify', async (req, res) => {
  const { telegram, message } = req.body;

  if (!telegram || !message) {
    return res.status(400).json({ error: 'Missing telegram or message' });
  }

  const chatId = userChatIds.get(telegram);

  if (!chatId) {
    return res.status(404).json({ 
      error: 'Agent not found',
      message: 'Đại lý chưa kích hoạt bot'
    });
  }

  try {
    await bot.sendMessage(chatId, message);
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Telegram Bot active`);
});
```

### Chạy Server
```bash
node server.js
```

---

## 🌐 Kết Nối Frontend với Backend

### Cập nhật `auth.js`

```javascript
// Request verification code
async function requestVerificationCode() {
  const telegram = document.getElementById('reg-telegram').value.trim();
  
  if (!telegram || !telegram.startsWith('@')) {
    alert('❌ Vui lòng nhập Telegram username hợp lệ!');
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
      alert('✅ Mã xác minh đã được gửi đến Telegram của bạn!');
    } else {
      alert('❌ ' + (data.message || 'Có lỗi xảy ra'));
    }
  } catch (error) {
    alert('❌ Không thể kết nối đến server. Vui lòng thử lại!');
  }
}
```

### Cập nhật `products.js`

```javascript
async function sendTelegramNotification(order) {
  const message = `
🛒 ĐƠN HÀNG MỚI!

📦 Sản phẩm: ${order.product.name}
💰 Giá: ${formatPrice(order.product.price)} ₭
🔢 Số lượng: ${order.quantity}
💵 Tổng tiền: ${formatPrice(order.total)} ₭

👤 Khách hàng: ${order.customer.name}
📱 SĐT: ${order.customer.phone}
📍 Địa chỉ: ${order.customer.address}
${order.note ? `📝 Ghi chú: ${order.note}` : ''}

⏰ ${new Date().toLocaleString('vi-VN')}
`;

  try {
    const response = await fetch('http://localhost:3000/api/telegram/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram: order.product.agentTelegram,
        message: message
      })
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Telegram notification error:', error);
    return false;
  }
}
```

---

## 🚀 Deploy Backend (Production)

### Option 1: Heroku
```bash
heroku create your-app-name
heroku config:set TELEGRAM_BOT_TOKEN=your_token_here
git push heroku main
```

### Option 2: Railway.app
1. Kết nối GitHub repo
2. Thêm biến môi trường `TELEGRAM_BOT_TOKEN`
3. Deploy tự động

### Option 3: Render.com
1. Tạo Web Service
2. Kết nối GitHub
3. Thêm Environment Variables
4. Deploy

---

## 📝 Testing

### Test Bot Commands
1. Mở Telegram, tìm bot của bạn
2. Gửi `/start`
3. Bot phải trả lời với hướng dẫn

### Test Verification Flow
1. Vào website → Đăng ký
2. Nhập username Telegram
3. Click "Gửi Yêu Cầu Mã"
4. Kiểm tra Telegram → nhận mã 6 số
5. Nhập mã vào website

### Test Order Notification
1. Khách đặt hàng trên website
2. Đại lý nhận thông báo trên Telegram
3. Kiểm tra thông tin đơn hàng đầy đủ

---

## 🔒 Bảo Mật

1. **HTTPS**: Deploy backend với SSL/TLS
2. **Rate Limiting**: Giới hạn request
3. **CORS**: Chỉ cho phép domain của bạn
4. **Token**: Bảo vệ Bot Token trong `.env`

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## ❓ Troubleshooting

### Bot không phản hồi /start
- Kiểm tra Bot Token trong `.env`
- Đảm bảo polling đang chạy
- Xem console logs

### Không nhận được mã xác minh
- User phải gửi `/start` cho bot trước
- Kiểm tra username Telegram đúng format (@username)
- Kiểm tra server logs

### Đại lý không nhận thông báo đơn hàng
- Đảm bảo đại lý đã active bot (/start)
- Kiểm tra Telegram username trong database
- Verify chatId được lưu đúng

---

## 📞 Support

Nếu cần hỗ trợ thêm, liên hệ qua:
- Telegram: @YourSupportUsername
- Email: support@yourdomain.com

---

**Lưu ý**: Hiện tại website đang chạy ở chế độ DEMO (không có backend). Để kích hoạt đầy đủ tính năng Telegram Bot, bạn cần setup backend server theo hướng dẫn trên.
