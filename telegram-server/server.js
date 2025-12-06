const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Telegram Bot Token
const TELEGRAM_BOT_TOKEN = '8222381044:AAGKWavqin310ESw4XE5DsywlyTgIllGU2c';

// Admin Group Chat ID for notifications
const ADMIN_GROUP_ID = -5018289214;

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Telegram Bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ==================== GLOBAL DATABASE (In-Memory) ====================
// Thay localStorage bằng database chung trên server
let globalProducts = []; // Tất cả sản phẩm từ mọi đại lý
let globalAgents = [];   // Tất cả đại lý đã đăng ký

// ==================== IMAGE UPLOAD SETUP ====================

// Tạo thư mục uploads nếu chưa có
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('📁 Đã tạo thư mục uploads/');
}

// Cấu hình Multer để lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique: timestamp + tên gốc
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận ảnh (JPG, PNG, GIF, WEBP)!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: fileFilter
});

// Serve static files từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Store verification codes (username -> {code, expiresAt, chatId})
const verificationCodes = new Map();
// Store user chat IDs (username -> chatId)
const userChatIds = new Map();

console.log('🤖 Telegram Bot đã khởi động!');

// ==================== BOT COMMANDS ====================

// Bot command: /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : null;
  const firstName = msg.from.first_name || 'Bạn';

  console.log(`📱 User /start: ${username || 'No username'}, ChatID: ${chatId}`);

  if (!username) {
    bot.sendMessage(chatId, 
      '❌ BẠN CHƯA CÓ TELEGRAM USERNAME\n\n' +
      '📝 Cách tạo username:\n' +
      '1. Mở Settings trong Telegram\n' +
      '2. Chọn "Username"\n' +
      '3. Tạo username của bạn\n' +
      '4. Quay lại và gửi /start'
    );
    return;
  }

  // Lưu chatId theo username
  userChatIds.set(username, chatId);
  console.log(`✅ Đã lưu ChatID cho ${username}`);

  // Check if user has pending verification code
  const codeData = verificationCodes.get(username);
  
  if (codeData && Date.now() <= codeData.expiresAt) {
    // User has active code - send it immediately
    const remainingMs = codeData.expiresAt - Date.now();
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    
    bot.sendMessage(chatId, 
      `🎉 CHÀO MỪNG BẠN TRỞ LẠI!\n\n` +
      `✅ Bạn có mã xác minh đang chờ!\n\n` +
      `🔐 MÃ XÁC MINH KOHKONG SHOP\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Username: \`${username}\`\n` +
      `🔢 MÃ CỦA BẠN: *${codeData.code}*\n` +
      `⏰ Còn hiệu lực: ${remainingMinutes} phút\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📝 HƯỚNG DẪN ĐĂNG KÝ:\n` +
      `1️⃣ Copy mã *${codeData.code}* ở trên\n` +
      `2️⃣ Quay lại trang đăng ký\n` +
      `3️⃣ Nhập username: \`${username}\`\n` +
      `4️⃣ Dán mã vào ô "Mã Xác Minh"\n` +
      `5️⃣ Bấm "Đăng Ký Làm Đại Lý"\n\n` +
      `⚠️ LƯU Ý QUAN TRỌNG:\n` +
      `• Username trong form PHẢI là: \`${username}\`\n` +
      `• Không chia sẻ mã này với ai!\n` +
      `• Nếu hết hạn, bấm "Gửi Yêu Cầu Mã" lại`,
      { 
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📱 Quay Lại Trang Đăng Ký', url: 'https://taphoakohkong.live/login.html' }],
            [{ text: '📋 Copy Username', callback_data: `copy_${username}` }]
          ]
        }
      }
    );
    
    console.log(`✅ Auto-sent code ${codeData.code} to ${username} on /start`);
  } else {
    // No code or expired - send welcome message
    bot.sendMessage(chatId, 
      `✅ CHÀO MỪNG ĐẾN VỚI KOHKONG SHOP BOT!\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Telegram Username: \`${username}\`\n` +
      `🆔 Chat ID: \`${chatId}\`\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `⚠️ QUAN TRỌNG - GHI NHỚ USERNAME:\n` +
      `Khi đăng ký đại lý, bạn PHẢI nhập:\n` +
      `→ Telegram: \`${username}\`\n\n` +
      `🛒 BẠN LÀ KHÁCH HÀNG?\n` +
      `1️⃣ Vào: taphoakohkong.live/products.html\n` +
      `2️⃣ Bấm "Kết Nối Bot Ngay"\n` +
      `3️⃣ Nhập username: \`${username}\`\n` +
      `4️⃣ Nhận thông báo đơn hàng tự động!\n\n` +
      `👔 BẠN LÀ ĐẠI LÝ?\n` +
      `1️⃣ Vào: taphoakohkong.live/login.html\n` +
      `2️⃣ Điền form, ô Telegram nhập: \`${username}\`\n` +
      `3️⃣ Bấm "Gửi Yêu Cầu Mã"\n` +
      `4️⃣ Quay lại bot - mã sẽ TỰ ĐỘNG gửi!\n` +
      `5️⃣ Copy mã → Hoàn tất đăng ký\n\n` +
      `📱 LỆNH CỦA BOT:\n` +
      `/getcode - Lấy mã xác minh (nếu có)\n` +
      `/stat - Xem trạng thái tài khoản\n` +
      `/myinfo - Xem thông tin của bạn`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🛒 Đặt Hàng', url: 'https://taphoakohkong.live/products.html' },
              { text: '👔 Đăng Ký Đại Lý', url: 'https://taphoakohkong.live/login.html' }
            ],
            [
              { text: `📋 Copy Username: ${username}`, callback_data: `copy_${username}` }
            ]
          ]
        }
      }
    );
  }
});

// Bot command: /getcode - Lấy mã xác minh
bot.onText(/\/getcode/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : null;

  if (!username) {
    bot.sendMessage(chatId, 
      `⚠️ BẠN CHƯA CÓ USERNAME\n\n` +
      `Vui lòng tạo username Telegram trước khi sử dụng bot!`
    );
    return;
  }

  // Check if user has a pending verification code
  const codeData = verificationCodes.get(username);

  if (!codeData) {
    bot.sendMessage(chatId, 
      `❌ KHÔNG CÓ MÃ XÁC MINH\n\n` +
      `Bạn chưa yêu cầu mã xác minh nào.\n\n` +
      `📋 Vui lòng:\n` +
      `1. Truy cập website: https://taphoakohkong.live/login.html\n` +
      `2. Điền thông tin đăng ký\n` +
      `3. Nhập username: ${username}\n` +
      `4. Bấm "Gửi Yêu Cầu Mã"\n` +
      `5. Sau đó quay lại đây gửi /getcode`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📱 Đăng Ký Ngay', url: 'https://taphoakohkong.live/login.html' }]
          ]
        }
      }
    );
    return;
  }

  // Check if code is expired
  if (Date.now() > codeData.expiresAt) {
    verificationCodes.delete(username);
    bot.sendMessage(chatId, 
      `⏰ MÃ ĐÃ HẾT HẠN\n\n` +
      `Mã xác minh của bạn đã hết hạn (10 phút).\n\n` +
      `Vui lòng yêu cầu mã mới trên website!`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔄 Yêu Cầu Mã Mới', url: 'https://taphoakohkong.live/login.html' }]
          ]
        }
      }
    );
    return;
  }

  // Calculate remaining time
  const remainingMs = codeData.expiresAt - Date.now();
  const remainingMinutes = Math.ceil(remainingMs / 60000);

  bot.sendMessage(chatId, 
    `🔐 MÃ XÁC MINH KOHKONG SHOP\n\n` +
    `👤 Username: ${username}\n` +
    `🔢 Mã của bạn: *${codeData.code}*\n\n` +
    `⏰ Còn hiệu lực: ${remainingMinutes} phút\n\n` +
    `📝 HƯỚNG DẪN:\n` +
    `1. Copy mã trên\n` +
    `2. Quay lại trang đăng ký\n` +
    `3. Nhập mã vào ô "Mã Xác Minh"\n` +
    `4. Hoàn tất đăng ký\n\n` +
    `⚠️ Không chia sẻ mã này với ai!`,
    { 
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📱 Quay Lại Trang Đăng Ký', url: 'https://taphoakohkong.live/login.html' }]
        ]
      }
    }
  );

  console.log(`✅ Code ${codeData.code} retrieved by ${username}`);
});

// Bot command: /stat - Xem trạng thái
bot.onText(/\/stat/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : null;

  if (!username) {
    bot.sendMessage(chatId, 
      `⚠️ BẠN CHƯA CÓ USERNAME\n\n` +
      `Vui lòng tạo username Telegram trước!`
    );
    return;
  }

  const codeData = verificationCodes.get(username);
  const isRegistered = userChatIds.has(username);

  let statusMessage = `📊 TRẠNG THÁI TÀI KHOẢN\n\n`;
  statusMessage += `👤 Username: ${username}\n`;
  statusMessage += `🆔 Chat ID: ${chatId}\n`;
  statusMessage += `✅ Đã kết nối Bot: ${isRegistered ? 'Có' : 'Chưa'}\n\n`;

  if (codeData) {
    const remainingMs = codeData.expiresAt - Date.now();
    if (remainingMs > 0) {
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      statusMessage += `🔐 MÃ XÁC MINH ĐANG HOẠT ĐỘNG:\n`;
      statusMessage += `🔢 Mã: *${codeData.code}*\n`;
      statusMessage += `⏰ Còn lại: ${remainingMinutes} phút\n\n`;
      statusMessage += `💡 Gửi /getcode để xem chi tiết`;
    } else {
      statusMessage += `⏰ Mã xác minh đã hết hạn\n`;
      statusMessage += `🔄 Yêu cầu mã mới trên website`;
    }
  } else {
    statusMessage += `📋 CHƯA CÓ MÃ XÁC MINH\n\n`;
    statusMessage += `Vui lòng truy cập website để yêu cầu mã!`;
  }

  bot.sendMessage(chatId, statusMessage, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔐 Lấy Mã', callback_data: 'get_code' },
          { text: '📱 Đăng Ký', url: 'https://taphoakohkong.live/login.html' }
        ]
      ]
    }
  });
});

// Bot command: /myinfo - Xem thông tin
bot.onText(/\/myinfo/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : 'Chưa có username';
  const firstName = msg.from.first_name || '';
  const lastName = msg.from.last_name || '';

  bot.sendMessage(chatId, 
    `👤 THÔNG TIN CỦA BẠN\n\n` +
    `📛 Tên: ${firstName} ${lastName}\n` +
    `👤 Username: ${username}\n` +
    `🆔 Chat ID: ${chatId}\n\n` +
    `💡 Gửi /getcode để lấy mã xác minh\n` +
    `💡 Gửi /stat để xem trạng thái`
  );
});

// Handle callback query (inline button clicks)
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const username = query.from.username ? `@${query.from.username}` : null;

  if (query.data === 'get_code') {
    // Same logic as /getcode command
    if (!username) {
      bot.answerCallbackQuery(query.id, { text: '❌ Bạn chưa có username!' });
      return;
    }

    const codeData = verificationCodes.get(username);

    if (!codeData) {
      bot.answerCallbackQuery(query.id, { text: '❌ Không có mã xác minh' });
      bot.sendMessage(chatId, 
        `❌ KHÔNG CÓ MÃ XÁC MINH\n\n` +
        `Vui lòng truy cập website và yêu cầu mã mới!`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '📱 Đăng Ký Ngay', url: 'https://taphoakohkong.live/login.html' }]
            ]
          }
        }
      );
      return;
    }

    if (Date.now() > codeData.expiresAt) {
      verificationCodes.delete(username);
      bot.answerCallbackQuery(query.id, { text: '⏰ Mã đã hết hạn!' });
      bot.sendMessage(chatId, 
        `⏰ MÃ ĐÃ HẾT HẠN\n\n` +
        `Vui lòng yêu cầu mã mới trên website!`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🔄 Yêu Cầu Mã Mới', url: 'https://taphoakohkong.live/login.html' }]
            ]
          }
        }
      );
      return;
    }

    const remainingMs = codeData.expiresAt - Date.now();
    const remainingMinutes = Math.ceil(remainingMs / 60000);

    bot.answerCallbackQuery(query.id, { text: '✅ Đây là mã của bạn!' });
    bot.sendMessage(chatId, 
      `🔐 MÃ XÁC MINH KOHKONG SHOP\n\n` +
      `👤 Username: ${username}\n` +
      `🔢 Mã của bạn: *${codeData.code}*\n\n` +
      `⏰ Còn hiệu lực: ${remainingMinutes} phút\n\n` +
      `⚠️ Không chia sẻ mã này với ai!`,
      { 
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📱 Quay Lại Trang Đăng Ký', url: 'https://taphoakohkong.live/login.html' }]
          ]
        }
      }
    );
  }
});

// ==================== API ENDPOINTS ====================

// API: Request verification code
app.post('/api/verification/request', async (req, res) => {
  const { telegram } = req.body;

  console.log(`📨 Request verification for: ${telegram}`);

  if (!telegram || !telegram.startsWith('@')) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid Telegram username. Must start with @' 
    });
  }

  // Check if user has started the bot
  const chatId = userChatIds.get(telegram);

  if (!chatId) {
    return res.status(404).json({ 
      success: false,
      error: 'user_not_found',
      message: `Vui lòng mở Telegram và gửi /start cho bot @KohKongShopBot_bot trước khi đăng ký!`
    });
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store code (expires in 10 minutes)
  verificationCodes.set(telegram, {
    code,
    chatId,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  console.log(`🔐 Generated code ${code} for ${telegram}`);

  // Send code immediately to user via Telegram
  bot.sendMessage(chatId, 
    `🔐 MÃ XÁC MINH KOHKONG SHOP\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 Username: \`${telegram}\`\n` +
    `🔢 MÃ CỦA BẠN: *${code}*\n` +
    `⏰ Hiệu lực: 10 phút\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📝 HƯỚNG DẪN ĐĂNG KÝ:\n` +
    `1️⃣ Copy mã *${code}* ở trên\n` +
    `2️⃣ Quay lại trang đăng ký\n` +
    `3️⃣ Kiểm tra username: \`${telegram}\`\n` +
    `4️⃣ Dán mã vào ô "Mã Xác Minh"\n` +
    `5️⃣ Bấm "Đăng Ký Làm Đại Lý"\n\n` +
    `⚠️ LƯU Ý:\n` +
    `• Username trong form PHẢI là: \`${telegram}\`\n` +
    `• Không chia sẻ mã với ai!\n` +
    `• Nếu không thấy mã, gửi /getcode`,
    { 
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📱 Quay Lại Trang Đăng Ký', url: 'https://taphoakohkong.live/login.html' }]
        ]
      }
    }
  );

  // Send notification to admin group
  try {
    await bot.sendMessage(ADMIN_GROUP_ID,
      `🔔 YÊU CẦU MÃ XÁC MINH MỚI\n\n` +
      `👤 Telegram: ${telegram}\n` +
      `🔐 Mã: ${code}\n` +
      `⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}\n` +
      `🌐 IP: ${req.ip || 'Unknown'}\n\n` +
      `📱 Mã đã được gửi tự động cho user!`,
      { parse_mode: 'Markdown' }
    );
    console.log('✅ Notification sent to admin group');
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error.message);
  }

  res.json({ 
    success: true, 
    message: 'Mã xác minh đã được gửi! Vui lòng kiểm tra Telegram của bạn.' 
  });
});

// API: Verify code
app.post('/api/verification/verify', async (req, res) => {
  const { telegram, code } = req.body;

  console.log(`🔍 Verify code for: ${telegram}, code: ${code}`);

  const stored = verificationCodes.get(telegram);

  if (!stored) {
    return res.status(400).json({ 
      success: false,
      error: 'Không tìm thấy mã xác minh. Vui lòng yêu cầu mã mới!' 
    });
  }

  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(telegram);
    return res.status(400).json({ 
      success: false,
      error: 'Mã xác minh đã hết hạn. Vui lòng yêu cầu mã mới!' 
    });
  }

  if (stored.code !== code) {
    return res.status(400).json({ 
      success: false,
      error: 'Mã xác minh không đúng!' 
    });
  }

  // Success - delete code
  verificationCodes.delete(telegram);
  
  // Send success message to user
  bot.sendMessage(stored.chatId,
    `✅ XÁC MINH THÀNH CÔNG!\n\n` +
    `Chúc mừng bạn đã trở thành đại lý của KohKong Shop! 🎉\n\n` +
    `📱 Bạn sẽ nhận thông báo đơn hàng tại đây.\n` +
    `🌐 Đăng nhập vào dashboard để quản lý sản phẩm!`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎯 Vào Dashboard', url: 'https://taphoakohkong.live/dashboard.html' }]
        ]
      }
    }
  );

  console.log(`✅ Verification successful for ${telegram}`);
  
  // Send notification to admin group about successful verification
  try {
    await bot.sendMessage(ADMIN_GROUP_ID,
      `✅ ĐẠI LÝ MỚI ĐĂNG KÝ THÀNH CÔNG!\n\n` +
      `👤 Telegram: ${telegram}\n` +
      `⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}\n\n` +
      `🎉 Đại lý mới đã xác minh thành công!`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error.message);
  }
  
  res.json({ 
    success: true, 
    verified: true,
    message: 'Xác minh thành công!' 
  });
});

// API: Send order notification to agent
app.post('/api/telegram/notify', async (req, res) => {
  const { telegram, message } = req.body;

  console.log(`📦 Send order notification to: ${telegram}`);

  if (!telegram || !message) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing telegram or message' 
    });
  }

  const chatId = userChatIds.get(telegram);

  if (!chatId) {
    return res.status(404).json({ 
      success: false,
      error: 'Agent not found. Agent must start the bot first.',
      message: 'Đại lý chưa kích hoạt bot. Vui lòng gửi /start cho @KohKongShopBot_bot'
    });
  }

  try {
    await bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📱 Liên Hệ Khách Hàng', url: 'tel:' }],
          [{ text: '✅ Xác Nhận Đơn', callback_data: 'confirm_order' }]
        ]
      }
    });
    
    console.log(`✅ Order notification sent to ${telegram}`);
    
    // Send notification to admin group about new order
    try {
      await bot.sendMessage(ADMIN_GROUP_ID,
        `📦 ĐƠN HÀNG MỚI TỪ WEBSITE!\n\n` +
        `👤 Đại lý: ${telegram}\n` +
        `⏰ ${new Date().toLocaleString('vi-VN')}\n\n` +
        `${message.split('\n').slice(0, 6).join('\n')}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      console.error('❌ Failed to send admin notification:', error.message);
    }
    
    res.json({ 
      success: true, 
      message: 'Đã gửi thông báo đến đại lý!' 
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ==================== IMAGE UPLOAD API ====================

// API: Upload ảnh sản phẩm
app.post('/api/upload/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Chưa chọn ảnh!'
      });
    }

    // URL của ảnh đã upload
    const imageUrl = `/uploads/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${imageUrl}`;

    console.log(`✅ Ảnh đã upload: ${req.file.filename} (${(req.file.size / 1024).toFixed(2)} KB)`);

    res.json({
      success: true,
      message: 'Ảnh đã tải lên thành công!',
      imageUrl: imageUrl,
      fullUrl: fullUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

  } catch (error) {
    console.error('❌ Error uploading image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API: Xóa ảnh
app.delete('/api/upload/image/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File không tồn tại!'
      });
    }

    // Xóa file
    fs.unlinkSync(filePath);
    console.log(`🗑️ Đã xóa ảnh: ${filename}`);

    res.json({
      success: true,
      message: 'Đã xóa ảnh thành công!'
    });

  } catch (error) {
    console.error('❌ Error deleting image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API: Lấy danh sách ảnh đã upload
app.get('/api/upload/images', (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        success: true,
        images: []
      });
    }

    const files = fs.readdirSync(uploadsDir);
    const images = files.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        filename: file,
        url: `/uploads/${file}`,
        fullUrl: `${req.protocol}://${req.get('host')}/uploads/${file}`,
        size: stats.size,
        createdAt: stats.birthtime
      };
    });

    res.json({
      success: true,
      total: images.length,
      images: images
    });

  } catch (error) {
    console.error('❌ Error listing images:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK',
    bot: 'KohKong Shop Bot',
    telegram: '@KohKongShopBot_bot',
    commands: {
      start: '/start - Đăng ký với bot',
      getcode: '/getcode - Lấy mã xác minh',
      stat: '/stat - Xem trạng thái tài khoản',
      myinfo: '/myinfo - Xem thông tin cá nhân'
    },
    endpoints: {
      verification_request: 'POST /api/verification/request',
      verification_verify: 'POST /api/verification/verify',
      telegram_notify: 'POST /api/telegram/notify',
      upload_image: 'POST /api/upload/image',
      delete_image: 'DELETE /api/upload/image/:filename',
      list_images: 'GET /api/upload/images',
      telegram_notify: 'POST /api/telegram/notify'
    }
  });
});

// ==================== TELEGRAM NOTIFICATION API ====================
app.post('/api/telegram/notify', async (req, res) => {
  try {
    const { message, imageUrl } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Gửi thông báo đến admin group
    if (imageUrl && imageUrl.startsWith('http')) {
      // Nếu có ảnh từ server, gửi kèm ảnh
      await bot.sendPhoto(ADMIN_GROUP_ID, imageUrl, {
        caption: message,
        parse_mode: 'HTML'
      });
    } else {
      // Chỉ gửi text
      await bot.sendMessage(ADMIN_GROUP_ID, message);
    }

    res.json({ 
      success: true, 
      message: 'Notification sent to Telegram' 
    });
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// ==================== GLOBAL PRODUCTS API ====================
// GET: Lấy tất cả sản phẩm (cho mọi người dùng)
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    products: globalProducts,
    total: globalProducts.length
  });
});

// POST: Thêm sản phẩm mới (từ dashboard)
app.post('/api/products', (req, res) => {
  try {
    const product = req.body;
    
    if (!product.name || !product.price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // Thêm vào database
    globalProducts.push(product);
    
    console.log(`✅ New product added: ${product.name} by ${product.agentName}`);
    
    res.json({
      success: true,
      message: 'Product added successfully',
      product: product,
      total: globalProducts.length
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// DELETE: Xóa sản phẩm
app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = globalProducts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const deleted = globalProducts.splice(index, 1)[0];
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      product: deleted
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// PUT: Cập nhật sản phẩm
app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const index = globalProducts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    globalProducts[index] = { ...globalProducts[index], ...updates };
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: globalProducts[index]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ==================== GLOBAL AGENTS API ====================
// GET: Lấy tất cả đại lý
app.get('/api/agents', (req, res) => {
  res.json({
    success: true,
    agents: globalAgents.map(a => ({
      id: a.id,
      username: a.username,
      fullname: a.fullname,
      telegram: a.telegram,
      productsCount: a.products?.length || 0
    })),
    total: globalAgents.length
  });
});

// POST: Đăng ký đại lý mới
app.post('/api/agents/register', (req, res) => {
  try {
    const { username, password, fullname, telegram } = req.body;
    
    if (!username || !password || !fullname) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Kiểm tra username đã tồn tại
    const exists = globalAgents.some(a => a.username === username);
    if (exists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newAgent = {
      id: Date.now().toString(),
      username,
      password, // ⚠️ Trong production nên hash password
      fullname,
      telegram,
      products: [],
      createdAt: new Date().toISOString()
    };

    globalAgents.push(newAgent);

    res.json({
      success: true,
      message: 'Agent registered successfully',
      agent: {
        id: newAgent.id,
        username: newAgent.username,
        fullname: newAgent.fullname,
        telegram: newAgent.telegram
      }
    });
  } catch (error) {
    console.error('Error registering agent:', error);
    res.status(500).json({ error: 'Failed to register agent' });
  }
});

// POST: Đăng nhập
app.post('/api/agents/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    const agent = globalAgents.find(a => 
      a.username === username && a.password === password
    );

    if (!agent) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      agent: {
        id: agent.id,
        username: agent.username,
        fullname: agent.fullname,
        telegram: agent.telegram,
        accountType: agent.accountType || 'FREE',
        products: agent.products
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// PUT: Upgrade/Downgrade agent
app.put('/api/agents/:id/upgrade', (req, res) => {
  try {
    const { id } = req.params;
    const { accountType } = req.body;
    
    const agent = globalAgents.find(a => a.id === id);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    agent.accountType = accountType;
    agent.upgradedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: `Agent upgraded to ${accountType}`,
      agent: {
        id: agent.id,
        username: agent.username,
        fullname: agent.fullname,
        accountType: agent.accountType
      }
    });
  } catch (error) {
    console.error('Error upgrading agent:', error);
    res.status(500).json({ error: 'Failed to upgrade agent' });
  }
});

// DELETE: Delete agent
app.delete('/api/agents/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = globalAgents.findIndex(a => a.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const deleted = globalAgents.splice(index, 1)[0];
    
    // Also delete agent's products
    globalProducts = globalProducts.filter(p => p.agentId !== id);
    
    res.json({
      success: true,
      message: 'Agent deleted successfully',
      agent: deleted
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  console.log(`✅ Telegram Bot @KohKongShopBot_bot đang hoạt động`);
  console.log(`\n📋 LỆNH BOT:`);
  console.log(`   /start - Đăng ký với bot`);
  console.log(`   /getcode - Lấy mã xác minh`);
  console.log(`   /stat - Xem trạng thái tài khoản`);
  console.log(`   /myinfo - Xem thông tin cá nhân`);
  console.log(`\n📋 API Endpoints:`);
  console.log(`   POST /api/verification/request - Tạo mã xác minh`);
  console.log(`   POST /api/verification/verify - Xác minh mã`);
  console.log(`   POST /api/telegram/notify - Gửi thông báo đơn hàng`);
  console.log(`   POST /api/upload/image - Upload ảnh sản phẩm`);
  console.log(`   DELETE /api/upload/image/:filename - Xóa ảnh`);
  console.log(`   GET /api/upload/images - Danh sách ảnh`);
  console.log(`\n📁 Uploads folder: ${path.join(__dirname, 'uploads')}`);
  
  // 🔄 AUTO PING: Giữ server luôn hoạt động (tránh Render.com sleep)
  if (process.env.RENDER) {
    console.log('\n🔄 Auto-ping enabled (Keep server alive 24/7)');
    setInterval(() => {
      const url = process.env.RENDER_EXTERNAL_URL || 'https://kohkonhbanhang1.onrender.com';
      fetch(url)
        .then(() => console.log('🏓 Ping successful'))
        .catch(() => console.log('⚠️ Ping failed'));
    }, 10 * 60 * 1000); // Ping mỗi 10 phút
  }
});

// Handle bot errors
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});
