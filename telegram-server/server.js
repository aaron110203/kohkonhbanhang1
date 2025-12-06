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
      telegram_notify: 'POST /api/telegram/notify'
    }
  });
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
});

// Handle bot errors
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});
