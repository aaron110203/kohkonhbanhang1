// Switch between login and register forms
function switchToRegister(e) {
  e.preventDefault();
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
}

function switchToLogin(e) {
  e.preventDefault();
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
}

// Request verification code from Telegram Bot
async function requestVerificationCode() {
  const telegram = document.getElementById('reg-telegram').value.trim();
  
  if (!telegram || !telegram.startsWith('@')) {
    alert('❌ Vui lòng nhập Telegram username hợp lệ (bắt đầu bằng @)!');
    return;
  }

  // Show loading
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Đang gửi...';

  try {
    // Production URL - automatically uses Render deployment
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'  // Development
      : 'https://kohkonhbanhang1.onrender.com';  // Production
    
    const response = await fetch(`${API_URL}/api/verification/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram })
    });

    const data = await response.json();

    if (data.success) {
      // Open Telegram bot directly
      const botUsername = 'KohKongShopBot_bot';
      const telegramUrl = `https://t.me/${botUsername}`;
      
      // Show countdown modal
      showCountdownModal(telegram, telegramUrl);
      
    } else {
      if (data.error === 'user_not_found') {
        const botUsername = 'KohKongShopBot_bot';
        const telegramUrl = `https://t.me/${botUsername}`;
        
        if (confirm(
          '❌ BẠN CHƯA KẾT NỐI BOT!\n\n' +
          '📱 Bạn cần gửi /start cho bot trước.\n\n' +
          'Bấm OK để mở Telegram ngay!'
        )) {
          window.open(telegramUrl, '_blank');
        }
      } else {
        alert('❌ ' + (data.message || data.error || 'Có lỗi xảy ra'));
      }
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Không thể kết nối server!\n\n' +
          'Lý do có thể:\n' +
          '• Server chưa chạy\n' +
          '• Kiểm tra kết nối internet\n\n' +
          'Vui lòng thử lại sau!');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Gửi Yêu Cầu Mã';
  }
}

// Show countdown modal with Telegram redirect
function showCountdownModal(telegram, telegramUrl) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.id = 'countdownOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;

  // Create modal content
  const modal = document.createElement('div');
  modal.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 3rem;
    border-radius: 20px;
    text-align: center;
    max-width: 500px;
    color: white;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    animation: slideUp 0.4s ease;
  `;

  let countdown = 60;
  
  modal.innerHTML = `
    <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 1s infinite;">🤖</div>
    <h2 style="font-size: 2rem; margin-bottom: 1rem; font-weight: 700;">Mở Telegram Ngay!</h2>
    <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.95; line-height: 1.6;">
      ✅ Mã xác minh đã được tạo cho:<br>
      <strong style="font-size: 1.6rem; display: block; margin-top: 0.5rem;">${telegram}</strong>
    </p>
    
    <div style="background: rgba(255,255,255,0.2); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; backdrop-filter: blur(10px);">
      <div style="font-size: 1rem; margin-bottom: 0.5rem; opacity: 0.9;">⏰ Thời gian còn lại:</div>
      <div id="countdown" style="font-size: 3.5rem; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">${countdown}s</div>
    </div>

    <div style="background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; text-align: left;">
      <div style="font-weight: bold; margin-bottom: 1rem; font-size: 1.1rem;">📋 HƯỚNG DẪN NHANH:</div>
      <div style="line-height: 2; font-size: 0.95rem;">
        1️⃣ Bấm nút "Mở Telegram" bên dưới<br>
        2️⃣ Gửi lệnh <code style="background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 4px;">/start</code> cho bot<br>
        3️⃣ Bot sẽ TỰ ĐỘNG gửi mã cho bạn<br>
        4️⃣ Copy mã 6 chữ số và dán vào form
      </div>
    </div>

    <button id="openTelegramBtn" style="
      background: white;
      color: #667eea;
      border: none;
      padding: 1.2rem 3rem;
      font-size: 1.3rem;
      font-weight: bold;
      border-radius: 12px;
      cursor: pointer;
      margin-bottom: 1rem;
      width: 100%;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    ">
      📱 Mở Telegram Bot
    </button>

    <button id="closeCountdownBtn" style="
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 0.8rem 2rem;
      font-size: 1rem;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      transition: all 0.3s;
    ">
      ✕ Đóng
    </button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `;
  document.head.appendChild(style);

  // Countdown timer
  const countdownElement = document.getElementById('countdown');
  const timer = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown + 's';
    
    if (countdown <= 10) {
      countdownElement.style.color = '#ff6b6b';
      countdownElement.style.animation = 'pulse 0.5s infinite';
    }
    
    if (countdown <= 0) {
      clearInterval(timer);
      overlay.remove();
      alert('⏰ HẾT THỜI GIAN!\n\nVui lòng bấm "Gửi Yêu Cầu Mã" lại để nhận mã mới.');
    }
  }, 1000);

  // Open Telegram button
  const openBtn = document.getElementById('openTelegramBtn');
  openBtn.onclick = () => {
    window.open(telegramUrl, '_blank');
    openBtn.textContent = '✅ Đã mở! Kiểm tra Telegram';
    openBtn.style.background = '#2ecc71';
    openBtn.style.color = 'white';
  };
  
  openBtn.onmouseover = () => {
    if (!openBtn.textContent.includes('✅')) {
      openBtn.style.transform = 'scale(1.05)';
      openBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    }
  };
  
  openBtn.onmouseout = () => {
    openBtn.style.transform = 'scale(1)';
    openBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
  };

  // Close button
  document.getElementById('closeCountdownBtn').onclick = () => {
    clearInterval(timer);
    overlay.remove();
  };
  
  document.getElementById('closeCountdownBtn').onmouseover = function() {
    this.style.background = 'rgba(255,255,255,0.3)';
  };
  
  document.getElementById('closeCountdownBtn').onmouseout = function() {
    this.style.background = 'rgba(255,255,255,0.2)';
  };

  // Auto open Telegram after 1.5 seconds
  setTimeout(() => {
    window.open(telegramUrl, '_blank');
    openBtn.textContent = '✅ Đã mở! Kiểm tra Telegram';
    openBtn.style.background = '#2ecc71';
    openBtn.style.color = 'white';
  }, 1500);
}

// Handle Registration
async function handleRegister(e) {
  e.preventDefault();
  
  const fullname = document.getElementById('reg-fullname').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  const telegram = document.getElementById('reg-telegram').value.trim();
  const verification = document.getElementById('reg-verification').value.trim();
  
  // Validate
  if (password !== confirmPassword) {
    alert('❌ Mật khẩu xác nhận không khớp!');
    return;
  }
  
  if (password.length < 6) {
    alert('❌ Mật khẩu phải có ít nhất 6 ký tự!');
    return;
  }
  
  if (username.length < 4) {
    alert('❌ Tên đăng nhập phải có ít nhất 4 ký tự!');
    return;
  }

  if (!telegram || !telegram.startsWith('@')) {
    alert('❌ Telegram username phải bắt đầu bằng @!');
    return;
  }

  let isVerified = false;

  // Optional verification check
  if (verification && verification.length === 6) {
    // Verify with backend API
    try {
      const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'  // Development
        : 'https://kohkonhbanhang1.onrender.com';  // Production
        
      const verifyResponse = await fetch(`${API_URL}/api/verification/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram, code: verification })
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success && verifyData.verified) {
        isVerified = true;
      } else {
        alert('❌ ' + (verifyData.error || 'Mã xác minh không đúng!'));
        return;
      }
    } catch (error) {
      // If API fails, accept any 6-digit code for fallback
      console.warn('Verification API failed, using fallback');
      isVerified = true;
    }
  }
  
  // Get existing users
  let users = JSON.parse(localStorage.getItem('agents')) || [];
  
  // Check if username already exists
  if (users.find(u => u.username === username)) {
    alert('❌ Tên đăng nhập đã tồn tại!');
    return;
  }
  
  if (users.find(u => u.telegram === telegram)) {
    alert('❌ Telegram username đã được đăng ký!');
    return;
  }
  
  // Create new agent account
  const newAgent = {
    id: Date.now(),
    fullname,
    username,
    password,
    telegram,
    verified: isVerified,
    role: 'agent',
    accountType: 'FREE', // Mặc định là FREE (5 sản phẩm/ngày)
    products: [],
    registeredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isActive: true
  };
  
  users.push(newAgent);
  localStorage.setItem('agents', JSON.stringify(users));
  
  alert('✅ Đăng ký thành công!\n\n🆓 Tài khoản Thường: 5 sản phẩm/ngày\n\nVui lòng đăng nhập.');
  
  // Switch to login form
  switchToLogin(e);
  
  // Pre-fill username
  document.getElementById('login-username').value = username;
}

// Handle Login
function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;
  
  // Get users
  const users = JSON.parse(localStorage.getItem('agents')) || [];
  
  // Find user
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    alert('❌ Tên đăng nhập hoặc mật khẩu không đúng!');
    return;
  }
  
  if (!user.isActive) {
    alert('❌ Tài khoản của bạn đã bị vô hiệu hóa!');
    return;
  }
  
  // Save user session
  const userSession = {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    telegram: user.telegram,
    verified: user.verified,
    role: user.role,
    loginAt: new Date().toISOString()
  };
  
  if (rememberMe) {
    localStorage.setItem('currentUser', JSON.stringify(userSession));
  } else {
    sessionStorage.setItem('currentUser', JSON.stringify(userSession));
  }
  
  alert('✅ Đăng nhập thành công!');
  
  // Redirect to dashboard
  window.location.href = 'dashboard.html';
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  
  if (currentUser) {
    window.location.href = 'dashboard.html';
  }
});
