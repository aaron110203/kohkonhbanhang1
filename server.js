// Simple Express Server for Telegram Authentication
// Chạy: node server.js

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8034408024:AAHnNscm-phyT2YOM7KZIxFyescXxcN_n2k';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Storage cho verification codes (trong production nên dùng Redis/Database)
const verificationCodes = new Map();

// Storage cho users (trong production nên dùng Database)
const users = new Map();

// Demo users
users.set('admin', {
    username: 'admin',
    fullname: 'Quản trị viên',
    password: '123456',
    telegram_id: 'admin_telegram'
});

// Generate random verification code
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// API: Gửi mã xác minh
app.post('/api/send-verification', async (req, res) => {
    const { telegram } = req.body;
    
    if (!telegram) {
        return res.json({ success: false, error: 'Vui lòng nhập Telegram ID hoặc username' });
    }

    const code = generateCode();
    const chatId = telegram.replace('@', ''); // Loại bỏ @ nếu có
    
    // Lưu mã (hết hạn sau 5 phút)
    verificationCodes.set(chatId, {
        code: code,
        expiry: Date.now() + 5 * 60 * 1000,
        createdAt: new Date()
    });

    const message = `🔐 *KohKong Bán Hàng - Mã Xác Minh*\n\n` +
                   `Mã của bạn: *${code}*\n\n` +
                   `Có hiệu lực trong 5 phút.\n` +
                   `⚠️ Không chia sẻ mã này!`;

    try {
        const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        
        if (data.ok) {
            console.log(`✅ Mã ${code} đã gửi đến ${chatId}`);
            res.json({ 
                success: true, 
                message: 'Mã xác minh đã được gửi đến Telegram của bạn!' 
            });
        } else {
            console.error('❌ Lỗi Telegram:', data.description);
            res.json({ 
                success: false, 
                error: `Không thể gửi tin nhắn. ${data.description}` 
            });
        }
    } catch (error) {
        console.error('❌ Lỗi:', error);
        res.json({ success: false, error: 'Lỗi kết nối Telegram API' });
    }
});

// API: Xác minh mã
app.post('/api/verify-code', (req, res) => {
    const { telegram, code } = req.body;
    
    const chatId = telegram.replace('@', '');
    const stored = verificationCodes.get(chatId);
    
    if (!stored) {
        return res.json({ success: false, error: 'Mã xác minh không tồn tại' });
    }
    
    if (Date.now() > stored.expiry) {
        verificationCodes.delete(chatId);
        return res.json({ success: false, error: 'Mã xác minh đã hết hạn' });
    }
    
    if (stored.code === code) {
        verificationCodes.delete(chatId);
        console.log(`✅ Xác minh thành công cho ${chatId}`);
        res.json({ 
            success: true, 
            message: 'Xác minh thành công!',
            telegram_id: chatId
        });
    } else {
        res.json({ success: false, error: 'Mã xác minh không đúng' });
    }
});

// API: Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.get(username);
    
    if (!user) {
        return res.json({ success: false, error: 'Tài khoản không tồn tại!' });
    }
    
    if (user.password !== password) {
        return res.json({ success: false, error: 'Mật khẩu không đúng!' });
    }
    
    console.log(`✅ Đăng nhập: ${username}`);
    res.json({ 
        success: true, 
        message: 'Đăng nhập thành công!',
        user: {
            username: user.username,
            fullname: user.fullname,
            telegram_id: user.telegram_id
        }
    });
});

// API: Register
app.post('/api/register', (req, res) => {
    const { username, fullname, password, telegram_id } = req.body;
    
    // Validate
    if (!username || !fullname || !password || !telegram_id) {
        return res.json({ success: false, error: 'Vui lòng điền đầy đủ thông tin!' });
    }
    
    if (users.has(username)) {
        return res.json({ success: false, error: 'Tên đăng nhập đã tồn tại!' });
    }
    
    // Check if telegram_id already used
    for (let [key, user] of users.entries()) {
        if (user.telegram_id === telegram_id) {
            return res.json({ success: false, error: 'Telegram này đã được đăng ký!' });
        }
    }
    
    // Create new user
    users.set(username, {
        username: username,
        fullname: fullname,
        password: password,
        telegram_id: telegram_id,
        created_at: new Date()
    });
    
    console.log(`✅ Đăng ký thành công: ${username} (${fullname})`);
    console.log(`📊 Tổng số users: ${users.size}`);
    
    res.json({ 
        success: true, 
        message: 'Đăng ký thành công!',
        user: {
            username: username,
            fullname: fullname
        }
    });
});

// Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║  🚀 Server đang chạy tại:                 ║
║  http://localhost:${PORT}                    ║
║                                           ║
║  📱 Telegram Bot Token: Active            ║
║  ✅ Sẵn sàng xác minh người dùng          ║
╚═══════════════════════════════════════════╝
    `);
});
