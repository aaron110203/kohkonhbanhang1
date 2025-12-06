const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const bodyParser = require('body-parser');

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

// Store verification codes (username -> {code, expiresAt, chatId})
const verificationCodes = new Map();
// Store user chat IDs (username -> chatId)
const userChatIds = new Map();

console.log('🤖 Telegram Bot đã khởi động!');

// Bot command: /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : null;
  const firstName = msg.from.first_name || 'Bạn';

  console.log(`📱 User /start: ${username || 'No username'}, ChatID: ${chatId}`);

  if (!username) {
    bot.sendMessage(chatId, 
      '❌ Bạn cần có Telegram username để sử dụng bot này!\n\n' +
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

  bot.sendMessage(chatId, 
    `Xin chào ${firstName}! 👋\n\n` +
    `✅ Username của bạn: ${username}\n\n` +
    `🔹 Để đăng ký làm đại lý:\n` +
    `1. Vào website: https://taphoakohkong.live\n` +
    `2. Click "Đăng Ký Ngay"\n` +
    `3. Nhập username Telegram: ${username}\n` +
    `4. Click "Gửi Yêu Cầu Mã"\n` +
    `5. Bot sẽ gửi mã xác minh 6 số cho bạn ngay tại đây!\n\n` +
    `📱 Sau khi đăng ký thành công, bạn sẽ nhận thông báo đơn hàng tại đây khi có khách đặt hàng!`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌐 Mở Website', url: 'https://taphoakohkong.live' }],
          [{ text: '📦 Xem Sản Phẩm', url: 'https://taphoakohkong.live/products.html' }]
        ]
      }
    }
  );
});

// Bot command: /myinfo
bot.onText(/\/myinfo/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : 'Không có';
  const firstName = msg.from.first_name || 'N/A';
  const lastName = msg.from.last_name || '';

  bot.sendMessage(chatId,
    `📋 THÔNG TIN CỦA BẠN:\n\n` +
    `👤 Tên: ${firstName} ${lastName}\n` +
    `📱 Username: ${username}\n` +
    `🆔 Chat ID: ${chatId}\n\n` +
    `💡 Sử dụng username này để đăng ký trên website!`
  );
});

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

  // Send instruction to user via Telegram
  bot.sendMessage(chatId, 
    `✅ MÃ XÁC MINH ĐÃ ĐƯỢC TẠO!\n\n` +
    `👤 Username: ${telegram}\n` +
    `⏰ Mã có hiệu lực trong 10 phút\n\n` +
    `📋 CÁCH LẤY MÃ:\n` +
    `Gửi lệnh /getcode để nhận mã xác minh của bạn!\n\n` +
    `Hoặc gửi /stat để xem trạng thái tài khoản.`,
    { 
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔐 Lấy Mã Ngay', callback_data: 'get_code' }
          ]
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
      `📱 User cần gửi /getcode để lấy mã!`,
      { parse_mode: 'Markdown' }
    );
    console.log('✅ Notification sent to admin group');
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error.message);
  }

  res.json({ 
    success: true, 
    message: 'Mã xác minh đã được tạo! Vui lòng mở Telegram và gửi lệnh /getcode để nhận mã.' 
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
        `📦 ĐơN HÀNG MỚI TỪ WEBSITE!\n\n` +
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

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK',
    bot: 'KohKong Shop Bot',
    telegram: '@KohKongShopBot_bot',
    endpoints: {
      verification_request: 'POST /api/verification/request',
      verification_verify: 'POST /api/verification/verify',
      telegram_notify: 'POST /api/telegram/notify'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  console.log(`✅ Telegram Bot @KohKongShopBot_bot đang hoạt động`);
  console.log(`\n📋 API Endpoints:`);
  console.log(`   POST /api/verification/request - Gửi mã xác minh`);
  console.log(`   POST /api/verification/verify - Xác minh mã`);
  console.log(`   POST /api/telegram/notify - Gửi thông báo đơn hàng`);
});

// Handle bot errors
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});
