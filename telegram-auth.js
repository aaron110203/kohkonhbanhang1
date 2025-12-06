// Telegram Bot Authentication Handler
// Token: 8034408024:AAHnNscm-phyT2YOM7KZIxFyescXxcN_n2k

const TELEGRAM_BOT_TOKEN = '8034408024:AAHnNscm-phyT2YOM7KZIxFyescXxcN_n2k';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Tạo mã xác minh ngẫu nhiên
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Lưu trữ mã xác minh tạm thời (trong thực tế nên dùng database)
const verificationCodes = new Map();

// Gửi mã xác minh qua Telegram
async function sendVerificationCode(telegramId, username) {
    const code = generateVerificationCode();
    const expiryTime = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút
    
    // Lưu mã xác minh
    verificationCodes.set(telegramId, {
        code: code,
        expiry: expiryTime,
        username: username
    });

    // Tin nhắn gửi cho user
    const message = `🔐 *Mã Xác Minh KohKong Bán Hàng*\n\n` +
                   `Mã xác minh của bạn là: *${code}*\n\n` +
                   `Mã này sẽ hết hạn sau 5 phút.\n` +
                   `Vui lòng không chia sẻ mã này với bất kỳ ai!`;

    try {
        const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        
        if (data.ok) {
            console.log('Mã xác minh đã được gửi thành công!');
            return { success: true, message: 'Mã xác minh đã được gửi đến Telegram của bạn' };
        } else {
            console.error('Lỗi gửi tin nhắn:', data);
            return { success: false, error: data.description };
        }
    } catch (error) {
        console.error('Lỗi kết nối Telegram API:', error);
        return { success: false, error: 'Không thể kết nối đến Telegram' };
    }
}

// Xác minh mã
function verifyCode(telegramId, inputCode) {
    const stored = verificationCodes.get(telegramId);
    
    if (!stored) {
        return { success: false, error: 'Không tìm thấy mã xác minh' };
    }
    
    if (Date.now() > stored.expiry) {
        verificationCodes.delete(telegramId);
        return { success: false, error: 'Mã xác minh đã hết hạn' };
    }
    
    if (stored.code === inputCode) {
        verificationCodes.delete(telegramId);
        return { success: true, message: 'Xác minh thành công!' };
    } else {
        return { success: false, error: 'Mã xác minh không đúng' };
    }
}

// Lấy thông tin user từ Telegram ID
async function getTelegramUser(telegramId) {
    try {
        const response = await fetch(`${TELEGRAM_API}/getChat?chat_id=${telegramId}`);
        const data = await response.json();
        
        if (data.ok) {
            return {
                success: true,
                user: {
                    id: data.result.id,
                    first_name: data.result.first_name,
                    last_name: data.result.last_name,
                    username: data.result.username
                }
            };
        } else {
            return { success: false, error: 'Không tìm thấy user' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Export functions (nếu dùng Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendVerificationCode,
        verifyCode,
        getTelegramUser
    };
}
