// Get all products from all agents
let allProducts = [];
let filteredProducts = [];
let currentProduct = null;

// Check if user connected to Telegram Bot
let userTelegram = localStorage.getItem('userTelegram') || null;

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
  loadAllProducts();
  checkTelegramConnection();
});

function loadAllProducts() {
  const agents = JSON.parse(localStorage.getItem('agents')) || [];
  
  // Collect all products from all agents
  allProducts = [];
  agents.forEach(agent => {
    if (agent.products && agent.products.length > 0) {
      agent.products.forEach(product => {
        allProducts.push({
          ...product,
          agentName: agent.fullname,
          agentTelegram: product.telegram || agent.telegram
        });
      });
    }
  });

  filteredProducts = [...allProducts];
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const countElement = document.getElementById('productCount');

  countElement.textContent = filteredProducts.length;

  if (filteredProducts.length === 0) {
    grid.innerHTML = '<p class="empty-state">Không tìm thấy sản phẩm nào.</p>';
    return;
  }

  grid.innerHTML = filteredProducts.map(product => `
    <div class="product-card" onclick='openOrderModal(${JSON.stringify(product).replace(/'/g, "&apos;")})'>
      ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" class="product-image">` : '<div class="product-image" style="display: flex; align-items: center; justify-content: center; font-size: 4rem;">' + (product.icon || '📦') + '</div>'}
      <div class="product-body">
        <span class="product-category-badge">${getCategoryName(product.category)}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">${formatPrice(product.price)} ₭</div>
        ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
        <div class="product-agent">
          👤 Đại lý: <strong>${product.agentName}</strong>
        </div>
        <button class="btn-order" onclick="event.stopPropagation(); openOrderModal(${JSON.stringify(product).replace(/'/g, "&apos;")})">
          📱 Đặt Hàng Ngay
        </button>
      </div>
    </div>
  `).join('');
}

function filterProducts() {
  const category = document.getElementById('categoryFilter').value;
  const search = document.getElementById('searchInput').value.toLowerCase();

  filteredProducts = allProducts.filter(product => {
    const matchCategory = !category || product.category === category;
    const matchSearch = !search || 
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.agentName.toLowerCase().includes(search);
    
    return matchCategory && matchSearch;
  });

  renderProducts();
}

function openOrderModal(product) {
  currentProduct = product;
  
  const modal = document.getElementById('orderModal');
  const preview = document.getElementById('productPreview');

  preview.innerHTML = `
    ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}">` : ''}
    <h4>${product.name}</h4>
    <p class="price">${formatPrice(product.price)} ₭</p>
    <p style="color: #666; font-size: 0.9rem;">Đại lý: ${product.agentName}</p>
  `;

  modal.classList.add('active');
  updateTotal();
}

function closeOrderModal() {
  document.getElementById('orderModal').classList.remove('active');
  document.getElementById('order-quantity').value = 1;
  currentProduct = null;
}

function updateTotal() {
  if (!currentProduct) return;
  
  const quantity = parseInt(document.getElementById('order-quantity').value) || 1;
  const total = currentProduct.price * quantity;
  
  document.getElementById('orderTotal').textContent = `${formatPrice(total)} ₭`;
}

async function submitOrder(e) {
  e.preventDefault();

  const customerName = document.getElementById('customer-name').value.trim();
  const customerPhone = document.getElementById('customer-phone').value.trim();
  const customerAddress = document.getElementById('customer-address').value.trim();
  const quantity = parseInt(document.getElementById('order-quantity').value);
  const note = document.getElementById('order-note').value.trim();

  const order = {
    id: Date.now().toString(),
    product: currentProduct,
    customer: {
      name: customerName,
      phone: customerPhone,
      address: customerAddress
    },
    quantity,
    note,
    total: currentProduct.price * quantity,
    createdAt: new Date().toISOString()
  };

  // Send order notification to agent via Telegram
  const agentNotified = await sendTelegramNotification(order, currentProduct.agentTelegram);
  
  // Send order confirmation to customer if connected
  if (userTelegram) {
    await sendCustomerNotification(order, userTelegram);
  }

  if (agentNotified) {
    let successMessage = `✅ ĐẶT HÀNG THÀNH CÔNG!\n\n`;
    successMessage += `Đại lý sẽ liên hệ với bạn qua Telegram trong thời gian sớm nhất.\n\n`;
    successMessage += `Telegram đại lý: ${currentProduct.agentTelegram}`;
    
    if (userTelegram) {
      successMessage += `\n\n📱 Bạn sẽ nhận thông báo xác nhận tại Telegram: ${userTelegram}`;
    } else {
      successMessage += `\n\n💡 Kết nối Telegram Bot để nhận thông báo đơn hàng!`;
    }
    
    alert(successMessage);
    
    // Reset form
    e.target.reset();
    closeOrderModal();
  } else {
    alert(`⚠️ Đơn hàng đã được tạo!\n\nVui lòng liên hệ trực tiếp với đại lý qua Telegram: ${currentProduct.agentTelegram}`);
  }
}

async function sendCustomerNotification(order, customerTelegram) {
  const message = `
✅ XÁC NHẬN ĐƠN HÀNG

Cảm ơn bạn đã đặt hàng tại KohKong Shop!

📦 Sản phẩm: ${order.product.name}
💰 Giá: ${formatPrice(order.product.price)} ₭
🔢 Số lượng: ${order.quantity}
💵 Tổng tiền: ${formatPrice(order.total)} ₭

👤 Tên: ${order.customer.name}
📱 SĐT: ${order.customer.phone}
📍 Địa chỉ: ${order.customer.address}
${order.note ? `📝 Ghi chú: ${order.note}` : ''}

🤝 Đại lý: ${order.product.agentName}
📲 Telegram đại lý: ${order.product.agentTelegram}

⏰ ${new Date(order.createdAt).toLocaleString('vi-VN')}

📞 Đại lý sẽ liên hệ với bạn sớm nhất!
`;

  try {
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'  // Development
      : 'https://kohkonhbanhang1.onrender.com';  // Production
    
    await fetch(`${API_URL}/api/telegram/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram: customerTelegram,
        message: message
      })
    });
    
    return true;
  } catch (error) {
    console.error('Error sending customer notification:', error);
    return false;
  }
}

async function sendTelegramNotification(order, agentTelegram) {
  // Send message to agent's Telegram via Bot API
  const message = `
🛒 ĐƠN HÀNG MỚI!

📦 Sản phẩm: ${order.product.name}
💰 Giá: ${formatPrice(order.product.price)} ₭
🔢 Số lượng: ${order.quantity}
💵 Tổng tiền: ${formatPrice(order.total)} ₭

👤 Khách hàng: ${order.customer.name}
📱 SĐT: ${order.customer.phone}
📍 Địa chỉ: ${order.customer.address}
${order.note ? `📝 Ghi chú: ${order.note}` : ''}

⏰ Thời gian: ${new Date(order.createdAt).toLocaleString('vi-VN')}
`;

  try {
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'  // Development
      : 'https://kohkonhbanhang1.onrender.com';  // Production
    
    const response = await fetch(`${API_URL}/api/telegram/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram: agentTelegram,
        message: message
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Order notification sent to agent');
      return true;
    } else {
      console.error('❌ Failed to send notification:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Telegram notification error:', error);
    return false;
  }
}

function formatPrice(price) {
  return price.toLocaleString('vi-VN');
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

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('orderModal');
  if (event.target === modal) {
    closeOrderModal();
  }
}

// ==================== TELEGRAM BOT CONNECTION ====================

function checkTelegramConnection() {
  const banner = document.getElementById('telegramBanner');
  const userTelegram = localStorage.getItem('userTelegram');
  
  if (userTelegram) {
    // User already connected
    banner.classList.add('connected');
    banner.innerHTML = `
      <div class="banner-content">
        <span class="banner-icon">✅</span>
        <div class="banner-text">
          <h3>🎉 Đã Kết Nối Telegram Bot!</h3>
          <p>Bạn sẽ nhận thông báo đơn hàng tại Telegram: <strong>${userTelegram}</strong></p>
        </div>
        <button class="connect-bot-btn" onclick="disconnectTelegramBot()">
          Ngắt Kết Nối
        </button>
      </div>
    `;
  }
}

function connectTelegramBot() {
  const username = prompt(
    '📱 KẾT NỐI TELEGRAM BOT\n\n' +
    'Để nhận thông báo đơn hàng, vui lòng:\n\n' +
    '1. Mở Telegram\n' +
    '2. Tìm: @KohKongShopBot_bot\n' +
    '3. Gửi: /start\n' +
    '4. Nhập username Telegram của bạn bên dưới:\n\n' +
    'Username (ví dụ: @yourname):'
  );

  if (!username) return;

  if (!username.startsWith('@')) {
    alert('❌ Username phải bắt đầu bằng @\n\nVí dụ: @yourname');
    return;
  }

  // Save to localStorage
  localStorage.setItem('userTelegram', username);
  userTelegram = username;

  // Update banner
  checkTelegramConnection();

  alert(
    '✅ KẾT NỐI THÀNH CÔNG!\n\n' +
    `Telegram: ${username}\n\n` +
    '📱 Bây giờ bạn sẽ nhận thông báo đơn hàng tại Telegram!\n\n' +
    '💡 Đảm bảo bạn đã gửi /start cho @KohKongShopBot_bot'
  );
}

function disconnectTelegramBot() {
  if (!confirm('Bạn có chắc muốn ngắt kết nối Telegram Bot?\n\nBạn sẽ không nhận được thông báo đơn hàng nữa.')) {
    return;
  }

  localStorage.removeItem('userTelegram');
  userTelegram = null;

  // Reset banner
  const banner = document.getElementById('telegramBanner');
  banner.classList.remove('connected');
  banner.innerHTML = `
    <div class="banner-content">
      <span class="banner-icon">🤖</span>
      <div class="banner-text">
        <h3>📱 Đặt Hàng Qua Telegram</h3>
        <p>Khách hàng của bạn có thể đặt hàng trực tiếp qua Telegram Bot. Bạn sẽ nhận thông báo ngay lập tức và xử lý đơn hàng nhanh chóng!</p>
        <div class="banner-features">
          ✅ Nhận đơn hàng tức thì
          ✅ Xác nhận đơn tự động
          ✅ Chat trực tiếp với khách
          ✅ Theo dõi trạng thái đơn
        </div>
      </div>
      <button class="connect-bot-btn" onclick="connectTelegramBot()">
        Kết Nối Bot Ngay
      </button>
    </div>
  `;

  alert('✅ Đã ngắt kết nối Telegram Bot!');
}

