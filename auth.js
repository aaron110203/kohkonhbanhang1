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
function requestVerificationCode() {
  const telegram = document.getElementById('reg-telegram').value.trim();
  
  if (!telegram || !telegram.startsWith('@')) {
    alert('❌ Vui lòng nhập Telegram username hợp lệ (bắt đầu bằng @)!');
    return;
  }

  // In production, this would call your backend API to send verification code via Telegram Bot
  // For now, we'll generate a random 6-digit code for demo
  const demoCode = Math.floor(100000 + Math.random() * 900000);
  
  alert(`📱 Demo Mode: Mã xác minh của bạn là: ${demoCode}\n\n(Trong production, mã này sẽ được gửi qua Telegram Bot @KohKongShopBot)`);
  
  // Store demo code temporarily
  sessionStorage.setItem('demoVerificationCode', demoCode.toString());
}

// Handle Registration
function handleRegister(e) {
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

  // Optional verification check (demo mode)
  const demoCode = sessionStorage.getItem('demoVerificationCode');
  let isVerified = false;
  
  if (verification) {
    if (demoCode && verification === demoCode) {
      isVerified = true;
    } else if (verification.length === 6) {
      // Accept any 6-digit code for demo
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
  
  // Clear demo code
  sessionStorage.removeItem('demoVerificationCode');
  
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
