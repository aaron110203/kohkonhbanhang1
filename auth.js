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

// Handle Registration
function handleRegister(e) {
  e.preventDefault();
  
  const fullname = document.getElementById('reg-fullname').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  const telegram = document.getElementById('reg-telegram').value.trim();
  
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
  
  // Get existing users
  let users = JSON.parse(localStorage.getItem('agents')) || [];
  
  // Check if username or email already exists
  if (users.find(u => u.username === username)) {
    alert('❌ Tên đăng nhập đã tồn tại!');
    return;
  }
  
  if (users.find(u => u.email === email)) {
    alert('❌ Email đã được sử dụng!');
    return;
  }
  
  // Create new agent account
  const newAgent = {
    id: Date.now(),
    fullname,
    phone,
    email,
    username,
    password, // In production, this should be hashed
    telegram,
    role: 'agent',
    products: [],
    registeredAt: new Date().toISOString(),
    isActive: true
  };
  
  users.push(newAgent);
  localStorage.setItem('agents', JSON.stringify(users));
  
  alert('✅ Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
  
  // Switch to login form and pre-fill username
  switchToLogin(e);
  document.getElementById('login-username').value = username;
  document.getElementById('login-password').focus();
}

// Handle Login
function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;
  
  if (!username || !password) {
    alert('❌ Vui lòng nhập đầy đủ thông tin!');
    return;
  }
  
  // Get users
  const users = JSON.parse(localStorage.getItem('agents')) || [];
  
  // Find user
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    alert('❌ Tên đăng nhập hoặc mật khẩu không đúng!');
    return;
  }
  
  if (!user.isActive) {
    alert('❌ Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
    return;
  }
  
  // Create session
  const session = {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    telegram: user.telegram,
    role: user.role,
    loginAt: new Date().toISOString()
  };
  
  // Save session
  if (rememberMe) {
    localStorage.setItem('currentUser', JSON.stringify(session));
  } else {
    sessionStorage.setItem('currentUser', JSON.stringify(session));
  }
  
  alert('✅ Đăng nhập thành công!');
  
  // Redirect to dashboard
  window.location.href = 'dashboard.html';
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', function() {
  const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  
  if (currentUser) {
    // Already logged in, redirect to dashboard
    window.location.href = 'dashboard.html';
  }
});
