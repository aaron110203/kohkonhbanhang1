# 🚀 HƯỚNG DẪN NÂNG CẤP SERVER - KOHKONG SHOP

## 📊 TÌNH TRẠNG HIỆN TẠI

### ✅ Đang Hoạt Động:
- ✅ Server chạy local tại: `http://localhost:3000`
- ✅ Telegram Bot: @KohKongShopBot_bot
- ✅ Lưu trữ: In-memory (Map objects)
- ✅ Phù hợp: Testing, Development

### ❌ Hạn Chế:
- ❌ Chỉ chạy trên máy tính của bạn
- ❌ Tắt máy = Server ngừng hoạt động
- ❌ Mất dữ liệu khi restart
- ❌ Không scale được (1 user tại 1 thời điểm)
- ❌ Website GitHub Pages không connect được

---

## 🎯 ROADMAP NÂNG CẤP

### GIAI ĐOẠN 1: DEPLOY SERVER (ƯU TIÊN CAO)
**Mục tiêu:** Website hoạt động 24/7, ai cũng truy cập được

#### Option 1A: Render.com (MIỄN PHÍ - KHUYÊN DÙNG)
```
Ưu điểm:
✅ Hoàn toàn MIỄN PHÍ
✅ Deploy tự động từ GitHub
✅ SSL certificate tự động (HTTPS)
✅ Uptime 24/7
✅ Easy setup (5 phút)

Nhược điểm:
⚠️ Server sleep sau 15 phút không dùng
⚠️ Cold start ~30 giây
⚠️ 750 giờ/tháng miễn phí

Phù hợp:
✅ Startup
✅ MVP (Minimum Viable Product)
✅ < 100 users/ngày
```

**Cách Deploy lên Render:**

1. **Tạo tài khoản Render.com**
   - Truy cập: https://render.com
   - Sign up with GitHub
   - Authorize Render

2. **Tạo Web Service**
   - Dashboard → New → Web Service
   - Connect Repository: `kohkonhbanhang1`
   - Name: `kohkong-telegram-bot`
   - Region: `Singapore` (gần Việt Nam/Campuchia nhất)
   - Branch: `main`
   - Root Directory: `telegram-server`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

3. **Environment Variables**
   ```
   TELEGRAM_BOT_TOKEN=8222381044:AAGKWavqin310ESw4XE5DsywlyTgIllGU2c
   ADMIN_GROUP_ID=-5018289214
   PORT=3000
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Đợi 3-5 phút
   - Nhận URL: `https://kohkong-telegram-bot.onrender.com`

5. **Cập nhật Frontend**
   ```javascript
   // auth.js và products.js
   const API_URL = 'https://kohkong-telegram-bot.onrender.com';
   ```

**Chi phí:** $0/tháng

---

#### Option 1B: Railway.app (MIỄN PHÍ $5 CREDIT)
```
Ưu điểm:
✅ $5 credit miễn phí mỗi tháng
✅ KHÔNG SLEEP (luôn chạy)
✅ Deploy tự động
✅ Dashboard đẹp
✅ Logs realtime

Nhược điểm:
⚠️ Hết $5 = Phải nạp tiền
⚠️ ~$5-10/tháng nếu traffic cao

Phù hợp:
✅ 100-1000 users/ngày
✅ Cần uptime cao
```

**Cách Deploy lên Railway:**

1. Truy cập: https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub repo
4. Chọn `kohkonhbanhang1`
5. Root Directory: `/telegram-server`
6. Add Variables:
   - `TELEGRAM_BOT_TOKEN`
   - `ADMIN_GROUP_ID`
7. Deploy

**Chi phí:** $0-5/tháng

---

#### Option 1C: Heroku (TRƯỚC ĐÂY MIỄN PHÍ)
```
Ưu điểm:
✅ Ổn định
✅ Scalable
✅ Add-ons nhiều

Nhược điểm:
❌ Không còn free tier
❌ $7/tháng minimum

Chi phí: $7/tháng
```

---

#### Option 1D: VPS - DigitalOcean/Vultr/Linode
```
Ưu điểm:
✅ Full control
✅ Có thể host nhiều apps
✅ IP tĩnh
✅ SSH access

Nhược điểm:
❌ Phải tự config
❌ Phải tự quản lý
❌ Cần kiến thức Linux

Chi phí: $5-10/tháng
```

---

### GIAI ĐOẠN 2: DATABASE (SAU KHI DEPLOY)
**Mục tiêu:** Lưu trữ dữ liệu vĩnh viễn, không mất khi restart

#### Option 2A: MongoDB Atlas (MIỄN PHÍ - KHUYÊN DÙNG)
```
Ưu điểm:
✅ 512MB miễn phí mãi mãi
✅ Cloud-based
✅ Automatic backups
✅ Easy to use

Phù hợp:
✅ Lưu agents, products, orders
✅ Verification codes (với expiry)
✅ User sessions
```

**Cài đặt:**
```bash
npm install mongodb mongoose
```

**Schema Example:**
```javascript
// models/Agent.js
const agentSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  fullname: String,
  telegram: String,
  email: String,
  password: String, // hashed
  products: [{
    name: String,
    price: Number,
    category: String,
    imageUrl: String
  }],
  createdAt: { type: Date, default: Date.now }
});

// models/VerificationCode.js
const verificationCodeSchema = new mongoose.Schema({
  telegram: { type: String, unique: true },
  code: String,
  chatId: Number,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto delete sau 10 phút
});

// models/Order.js
const orderSchema = new mongoose.Schema({
  product: Object,
  customer: Object,
  quantity: Number,
  total: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
```

**Chi phí:** $0/tháng (512MB)

---

#### Option 2B: PostgreSQL (Render/Railway)
```
Ưu điểm:
✅ Relational database
✅ ACID compliant
✅ Good for complex queries

Chi phí: $0 (Render) hoặc dùng từ $5 credit Railway
```

---

#### Option 2C: Redis (Cache + Session)
```
Ưu điểm:
✅ Cực nhanh (in-memory)
✅ Good for sessions, cache
✅ Pub/Sub for realtime

Dùng cho:
✅ User sessions
✅ Verification codes (với TTL)
✅ Rate limiting

Chi phí: $0 (Upstash Redis Free)
```

---

### GIAI ĐOẠN 3: AUTHENTICATION & SECURITY
**Mục tiêu:** Bảo mật tài khoản, API

#### 3.1. JWT Authentication
```bash
npm install jsonwebtoken bcrypt
```

```javascript
// Login
const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });

// Protected routes
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/dashboard', verifyToken, (req, res) => {
  // Protected route
});
```

#### 3.2. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### 3.3. CORS Configuration
```javascript
app.use(cors({
  origin: ['https://taphoakohkong.live', 'http://localhost:5500'],
  credentials: true
}));
```

#### 3.4. Environment Variables
```bash
npm install dotenv
```

```javascript
// .env file
TELEGRAM_BOT_TOKEN=8222381044:AAGKWavqin310ESw4XE5DsywlyTgIllGU2c
ADMIN_GROUP_ID=-5018289214
JWT_SECRET=your_super_secret_key_here
MONGODB_URI=mongodb+srv://...
PORT=3000
NODE_ENV=production
```

```javascript
// server.js
require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_GROUP_ID = parseInt(process.env.ADMIN_GROUP_ID);
```

---

### GIAI ĐOẠN 4: FEATURES NÂNG CAO

#### 4.1. File Upload (Hình ảnh sản phẩm)
```bash
npm install multer cloudinary
```

```javascript
// Upload to Cloudinary
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('image'), async (req, res) => {
  const result = await cloudinary.uploader.upload_stream(req.file.buffer);
  res.json({ url: result.secure_url });
});
```

**Chi phí:** Cloudinary free tier: 25GB storage, 25GB bandwidth/tháng

---

#### 4.2. Real-time Notifications (WebSocket)
```bash
npm install socket.io
```

```javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('User connected');
  
  socket.on('new_order', (order) => {
    io.emit('order_notification', order);
  });
});
```

**Use case:**
- Dashboard realtime: Order mới → Notify ngay
- Chat với khách hàng
- Live product updates

---

#### 4.3. Email Notifications
```bash
npm install nodemailer
```

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

// Gửi email xác nhận đơn hàng
await transporter.sendMail({
  from: 'KohKong Shop',
  to: customer.email,
  subject: 'Xác nhận đơn hàng',
  html: `<h1>Đơn hàng #${orderId}</h1>...`
});
```

---

#### 4.4. Analytics & Logging
```bash
npm install winston morgan
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Order created', { orderId, customer });
logger.error('Payment failed', { error, orderId });
```

---

#### 4.5. Payment Integration
```javascript
// Stripe
npm install stripe

// PayPal
npm install @paypal/checkout-server-sdk

// Local: Momo, ZaloPay, VNPay
```

---

### GIAI ĐOẠN 5: PERFORMANCE & SCALABILITY

#### 5.1. Caching với Redis
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache products
app.get('/api/products', async (req, res) => {
  const cached = await client.get('products');
  if (cached) return res.json(JSON.parse(cached));
  
  const products = await Product.find();
  await client.setEx('products', 3600, JSON.stringify(products)); // Cache 1 hour
  res.json(products);
});
```

#### 5.2. CDN cho Static Assets
```
- Cloudflare (Free)
- AWS CloudFront
- Bunny CDN
```

#### 5.3. Load Balancing
```
- Nginx
- AWS Load Balancer
- Cloudflare Load Balancing
```

---

## 📋 CHECKLIST TRIỂN KHAI

### ✅ WEEK 1: Deploy Server (ƯU TIÊN CAO)
- [ ] Đăng ký Render.com
- [ ] Deploy Telegram Bot server
- [ ] Test API endpoints
- [ ] Cập nhật API_URL trong frontend
- [ ] Test đăng ký với production server
- [ ] Monitor logs

### ✅ WEEK 2: Database
- [ ] Đăng ký MongoDB Atlas
- [ ] Cài đặt Mongoose
- [ ] Tạo schemas (Agent, Product, Order, VerificationCode)
- [ ] Migrate từ localStorage sang MongoDB
- [ ] Test CRUD operations

### ✅ WEEK 3: Security
- [ ] Implement JWT authentication
- [ ] Hash passwords với bcrypt
- [ ] Add rate limiting
- [ ] Setup environment variables
- [ ] HTTPS cho toàn bộ site

### ✅ WEEK 4: Features
- [ ] Upload hình ảnh sản phẩm (Cloudinary)
- [ ] Email notifications
- [ ] Order management system
- [ ] Analytics dashboard

---

## 💰 TỔNG CHI PHÍ DỰ KIẾN

### Option A: HOÀN TOÀN MIỄN PHÍ
```
✅ Render.com (Free)           : $0/tháng
✅ MongoDB Atlas (512MB)       : $0/tháng
✅ Cloudinary (25GB)           : $0/tháng
✅ Cloudflare (CDN)            : $0/tháng
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG:                           $0/tháng
```

**Giới hạn:**
- ~100 users/ngày
- ~1000 requests/ngày
- Server sleep sau 15 phút idle

---

### Option B: PRODUCTION-READY (KHUYÊN DÙNG)
```
✅ Railway ($5 credit)         : $0-5/tháng
✅ MongoDB Atlas (512MB)       : $0/tháng
✅ Cloudinary                  : $0/tháng
✅ Domain .com                 : $12/năm (~$1/tháng)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG:                           $1-6/tháng
```

**Giới hạn:**
- ~1000 users/ngày
- ~10,000 requests/ngày
- 24/7 uptime

---

### Option C: SCALE-UP (Khi có nhiều khách)
```
✅ VPS DigitalOcean            : $10/tháng
✅ MongoDB Atlas (2GB)         : $9/tháng
✅ Cloudinary Pro              : $0-25/tháng
✅ Domain + SSL                : $1/tháng
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG:                           $20-45/tháng
```

**Giới hạn:**
- ~10,000 users/ngày
- ~100,000 requests/ngày
- Unlimited bandwidth

---

## 🎯 KHUYẾN NGHỊ

### NGAY BÂY GIỜ (Tuần này):
1. ✅ **Deploy lên Render.com** (MIỄN PHÍ)
   - Làm theo hướng dẫn Option 1A ở trên
   - 30 phút là xong
   - Website hoạt động 24/7

### THÁNG 1:
2. ✅ **Setup MongoDB Atlas** (MIỄN PHÍ)
   - Lưu trữ vĩnh viễn
   - Không mất data

### THÁNG 2-3:
3. ✅ **Add Features**
   - Upload ảnh sản phẩm
   - Email notifications
   - Analytics

### KHI CÓ 100+ USERS/NGÀY:
4. ✅ **Nâng cấp lên Railway**
   - $5/tháng
   - No sleep, faster

### KHI CÓ 1000+ USERS/NGÀY:
5. ✅ **VPS + Load Balancer**
   - Full control
   - Scalable

---

## 🚀 HÀNH ĐỘNG TIẾP THEO

Bạn muốn tôi giúp gì?

1. **Deploy ngay lên Render.com** (30 phút)
2. **Setup MongoDB** (1 giờ)
3. **Add JWT Authentication** (2 giờ)
4. **Upload ảnh Cloudinary** (1 giờ)
5. **Tất cả các bước trên** (1 ngày)

Hãy cho tôi biết bạn muốn bắt đầu từ đâu! 🎯
