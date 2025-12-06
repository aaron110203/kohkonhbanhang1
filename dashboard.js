// Get current user
const currentUserStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
let currentUser = null;

if (currentUserStr) {
  currentUser = JSON.parse(currentUserStr);
  document.getElementById('userName').textContent = `Xin chào, ${currentUser.fullname}`;
} else {
  window.location.href = 'login.html';
}

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('currentUser');
  alert('Đã đăng xuất thành công!');
  window.location.href = 'login.html';
}

// Show section
function showSection(section) {
  const allSections = document.querySelectorAll('.content-section');
  allSections.forEach(s => s.classList.add('hidden'));

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  if (section === 'products') {
    document.getElementById('products-section').classList.remove('hidden');
    navItems[0].classList.add('active');
    loadMyProducts();
  } else if (section === 'add-product') {
    document.getElementById('add-product-section').classList.remove('hidden');
    navItems[1].classList.add('active');
  }
}

// Load user's products
function loadMyProducts() {
  const agents = JSON.parse(localStorage.getItem('agents')) || [];
  const agent = agents.find(a => a.username === currentUser.username);

  const grid = document.getElementById('myProductsGrid');

  if (!agent || !agent.products || agent.products.length === 0) {
    grid.innerHTML = '<p class="empty-state">Bạn chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p>';
    return;
  }

  grid.innerHTML = agent.products.map(product => `
    <div class="product-card">
      <div class="product-header">
        <span class="product-icon">${product.icon || '📦'}</span>
        <div class="product-actions">
          <button class="btn-icon btn-edit" onclick="editProduct('${product.id}')" title="Sửa">✏️</button>
          <button class="btn-icon btn-delete" onclick="deleteProduct('${product.id}')" title="Xóa">🗑️</button>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-price">${formatPrice(product.price)} ₭</div>
        <span class="product-category">${getCategoryName(product.category)}</span>
        ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
        <div class="product-meta">
          <span>Tạo: ${formatDate(product.createdAt)}</span>
          <span>ID: ${product.id.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Add product
function addProduct(e) {
  e.preventDefault();

  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const category = document.getElementById('product-category').value;
  const icon = document.getElementById('product-icon').value.trim() || '📦';
  const description = document.getElementById('product-description').value.trim();
  const telegram = document.getElementById('product-telegram').value.trim() || currentUser.telegram || '';

  if (!name || !price || !category) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
    return;
  }

  const product = {
    id: generateId(),
    name,
    price,
    category,
    icon,
    description,
    telegram,
    agentId: currentUser.id,
    agentName: currentUser.fullname,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Get agents from localStorage
  const agents = JSON.parse(localStorage.getItem('agents')) || [];
  const agentIndex = agents.findIndex(a => a.username === currentUser.username);

  if (agentIndex === -1) {
    alert('Không tìm thấy tài khoản!');
    return;
  }

  // Add product to agent's products
  if (!agents[agentIndex].products) {
    agents[agentIndex].products = [];
  }
  agents[agentIndex].products.push(product);

  // Save back to localStorage
  localStorage.setItem('agents', JSON.stringify(agents));

  // Update current user
  currentUser.products = agents[agentIndex].products;
  if (localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  } else {
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  alert('✅ Thêm sản phẩm thành công!');

  // Reset form
  e.target.reset();

  // Go back to products list
  showSection('products');
}

// Edit product
function editProduct(productId) {
  const agents = JSON.parse(localStorage.getItem('agents')) || [];
  const agent = agents.find(a => a.username === currentUser.username);
  const product = agent.products.find(p => p.id === productId);

  if (!product) {
    alert('Không tìm thấy sản phẩm!');
    return;
  }

  // Fill form with product data
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-icon').value = product.icon;
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('product-telegram').value = product.telegram || '';

  // Change form to edit mode
  showSection('add-product');
  const form = document.querySelector('.product-form');
  form.dataset.editId = productId;

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Cập Nhật Sản Phẩm';
  submitBtn.style.background = 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';

  // Change form handler
  form.onsubmit = (e) => updateProduct(e, productId);
}

// Update product
function updateProduct(e, productId) {
  e.preventDefault();

  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const category = document.getElementById('product-category').value;
  const icon = document.getElementById('product-icon').value.trim() || '📦';
  const description = document.getElementById('product-description').value.trim();
  const telegram = document.getElementById('product-telegram').value.trim() || currentUser.telegram || '';

  const agents = JSON.parse(localStorage.getItem('agents')) || [];
  const agentIndex = agents.findIndex(a => a.username === currentUser.username);
  const productIndex = agents[agentIndex].products.findIndex(p => p.id === productId);

  // Update product
  agents[agentIndex].products[productIndex] = {
    ...agents[agentIndex].products[productIndex],
    name,
    price,
    category,
    icon,
    description,
    telegram,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem('agents', JSON.stringify(agents));

  // Update current user
  currentUser.products = agents[agentIndex].products;
  if (localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  } else {
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  alert('✅ Cập nhật sản phẩm thành công!');

  // Reset form
  e.target.reset();
  delete e.target.dataset.editId;
  e.target.onsubmit = addProduct;

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Thêm Sản Phẩm';
  submitBtn.style.background = '';

  showSection('products');
}

// Delete product
function deleteProduct(productId) {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    return;
  }

  const agents = JSON.parse(localStorage.getItem('agents')) || [];
  const agentIndex = agents.findIndex(a => a.username === currentUser.username);

  // Remove product
  agents[agentIndex].products = agents[agentIndex].products.filter(p => p.id !== productId);

  localStorage.setItem('agents', JSON.stringify(agents));

  // Update current user
  currentUser.products = agents[agentIndex].products;
  if (localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  } else {
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  alert('✅ Đã xóa sản phẩm!');
  loadMyProducts();
}

// Helper functions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatPrice(price) {
  return price.toLocaleString('vi-VN');
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getCategoryName(category) {
  const categories = {
    'food': '🍚 Đồ Ăn',
    'fashion': '👕 Thời Trang',
    'medicine': '💊 Thuốc',
    'personal': '🧴 Chăm Sóc',
    'grocery': '🛒 Tạp Hóa',
    'fruits': '🍎 Trái Cây',
    'drinks': '🥤 Đồ Uống',
    'electronics': '📱 Điện Tử',
    'cosmetics': '💄 Mỹ Phẩm',
    'home': '🏠 Gia Dụng'
  };
  return categories[category] || category;
}

// Load products on page load
loadMyProducts();
