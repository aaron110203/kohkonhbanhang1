// Get all products from all agents
let allProducts = [];
let filteredProducts = [];
let currentProduct = null;

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
  loadAllProducts();
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
  const success = await sendTelegramNotification(order);

  if (success) {
    alert(`✅ Đặt hàng thành công!\n\nĐại lý sẽ liên hệ với bạn qua Telegram trong thời gian sớm nhất.\n\nTelegram đại lý: ${currentProduct.agentTelegram}`);
    
    // Reset form
    e.target.reset();
    closeOrderModal();
  } else {
    alert(`⚠️ Đơn hàng đã được tạo!\n\nVui lòng liên hệ trực tiếp với đại lý qua Telegram: ${currentProduct.agentTelegram}`);
  }
}

async function sendTelegramNotification(order) {
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
    // Change this URL when deploy to production
    const API_URL = 'http://localhost:3000';
    
    const response = await fetch(`${API_URL}/api/telegram/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram: order.product.agentTelegram,
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
};
