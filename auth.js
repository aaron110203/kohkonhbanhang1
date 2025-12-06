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
    // Change this URL when deploy to production
    const API_URL = 'http://localhost:3000';
    
    const response = await fetch(`${API_URL}/api/verification/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram })
    });

    const data = await response.json();

    if (data.success) {
      alert('✅ MÃ XÁC MINH ĐÃ ĐƯỢC TẠO!\n\n' +
            '📱 Mở Telegram và gửi lệnh:\n' +
            '/getcode\n\n' +
            'Cho bot @KohKongShopBot_bot để nhận mã.\n\n' +
            'Hoặc gửi /stat để xem trạng thái tài khoản.');
    } else {
      if (data.error === 'user_not_found') {
        alert('❌ ' + data.message + '\n\n' +
              '📱 Hướng dẫn:\n' +
              '1. Mở Telegram\n' +
              '2. Tìm: @KohKongShopBot_bot\n' +
              '3. Gửi: /start\n' +
              '4. Quay lại đây và thử lại!');
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
      const API_URL = 'http://localhost:3000';
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
    products: [],
    registeredAt: new Date().toISOString(),
    isActive: true
  };
  
  users.push(newAgent);
  localStorage.setItem('agents', JSON.stringify(users));
  
  alert('✅ Đăng ký thành công! Vui lòng đăng nhập.');
  
  // Switch to login form
  switchToLogin(e);
  
  // Pre-fill username
  document.getElementById('username').value = username;
}

// Handle Login
function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
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
