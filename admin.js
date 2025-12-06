// Admin Panel Logic

let allAgents = [];
let allProducts = [];
let blockedIPs = [];

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
  loadAdminData();
  loadBlockedIPs();
  // Auto refresh every 10 seconds
  setInterval(() => {
    loadAdminData();
    loadBlockedIPs();
  }, 10000);
});

async function loadAdminData() {
  try {
    // Load from server API
    const response = await fetch('https://kohkonhbanhang1.onrender.com/api/agents');
    if (response.ok) {
      const data = await response.json();
      allAgents = data.agents || [];
    } else {
      throw new Error('Server not available');
    }
  } catch (error) {
    console.warn('Loading from localStorage:', error);
    // Fallback to localStorage
    allAgents = JSON.parse(localStorage.getItem('agents')) || [];
  }

  try {
    const prodResponse = await fetch('https://kohkonhbanhang1.onrender.com/api/products');
    if (prodResponse.ok) {
      const data = await prodResponse.json();
      allProducts = data.products || [];
    }
  } catch (error) {
    allProducts = JSON.parse(localStorage.getItem('products')) || [];
  }

  updateStats();
  renderAgentsTable();
  renderProductsTable();
}

async function loadBlockedIPs() {
  try {
    const response = await fetch('https://kohkonhbanhang1.onrender.com/api/blocked-ips');
    if (response.ok) {
      const data = await response.json();
      blockedIPs = data.blockedIPs || [];
    }
  } catch (error) {
    console.warn('Could not load blocked IPs:', error);
  }
  
  renderBlockedIPsTable();
}

function updateStats() {
  const totalAgents = allAgents.length;
  const totalVIP = allAgents.filter(a => a.accountType === 'VIP').length;
  const totalProducts = allProducts.length;
  
  // Products created today
  const today = new Date().toDateString();
  const todayProducts = allProducts.filter(p => {
    const productDate = new Date(p.createdAt).toDateString();
    return productDate === today;
  }).length;

  document.getElementById('totalAgents').textContent = totalAgents;
  document.getElementById('totalVIP').textContent = totalVIP;
  document.getElementById('totalProducts').textContent = totalProducts;
  document.getElementById('todayProducts').textContent = todayProducts;
}

function renderAgentsTable() {
  const tbody = document.getElementById('agentsTableBody');
  
  if (allAgents.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
          Chưa có đại lý nào đăng ký
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = allAgents.map(agent => {
    const accountType = agent.accountType || 'FREE';
    const dailyLimit = accountType === 'VIP' ? '∞' : '5';
    const todayCount = getTodayProductCount(agent.id);
    const productsCount = agent.products?.length || 0;
    
    let quotaPercent = 0;
    let quotaColor = '#4caf50';
    
    if (accountType === 'FREE') {
      quotaPercent = (todayCount / 5) * 100;
      if (quotaPercent >= 100) {
        quotaColor = '#f44336';
      } else if (quotaPercent >= 80) {
        quotaColor = '#ff9800';
      }
    }

    return `
      <tr>
        <td><strong>${agent.fullname}</strong></td>
        <td>${agent.username}</td>
        <td>${agent.telegram || 'Chưa cập nhật'}</td>
        <td>
          <span class="badge ${accountType === 'VIP' ? 'badge-vip' : 'badge-free'}">
            ${accountType === 'VIP' ? '👑 VIP' : '🆓 Thường'}
          </span>
        </td>
        <td>
          <div class="quota-text">${todayCount} / ${dailyLimit} sản phẩm</div>
          ${accountType === 'FREE' ? `
            <div class="quota-bar">
              <div class="quota-fill" style="width: ${quotaPercent}%; background: ${quotaColor};"></div>
            </div>
          ` : ''}
        </td>
        <td><strong>${productsCount}</strong></td>
        <td>${formatDate(agent.createdAt)}</td>
        <td>
          ${accountType === 'FREE' ? `
            <button class="btn-upgrade" onclick="upgradeAgent('${agent.id}')">
              👑 Nâng Cấp VIP
            </button>
          ` : `
            <button class="btn-downgrade" onclick="downgradeAgent('${agent.id}')">
              ⬇️ Hạ Xuống Thường
            </button>
          `}
          <button class="btn-delete" onclick="deleteAgent('${agent.id}')">
            🗑️ Xóa
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function getTodayProductCount(agentId) {
  const today = new Date().toDateString();
  return allProducts.filter(p => {
    const productDate = new Date(p.createdAt).toDateString();
    return p.agentId === agentId && productDate === today;
  }).length;
}

async function upgradeAgent(agentId) {
  if (!confirm('Nâng cấp đại lý lên VIP?\n\nVIP sẽ được:\n- Đăng không giới hạn sản phẩm\n- Ưu tiên hiển thị\n- Badge vàng')) {
    return;
  }

  try {
    console.log('Upgrading agent:', agentId);
    
    // Update on server
    const response = await fetch(`https://kohkonhbanhang1.onrender.com/api/agents/${agentId}/upgrade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountType: 'VIP' })
    });

    const data = await response.json();
    console.log('Server response:', data);

    if (response.ok && data.success) {
      // Also update localStorage
      const agents = JSON.parse(localStorage.getItem('agents')) || [];
      const agentIndex = agents.findIndex(a => a.id == agentId);
      
      if (agentIndex !== -1) {
        agents[agentIndex].accountType = 'VIP';
        agents[agentIndex].upgradedAt = new Date().toISOString();
        localStorage.setItem('agents', JSON.stringify(agents));
      }
      
      alert('✅ Đã nâng cấp lên VIP!');
      loadAdminData();
    } else {
      throw new Error(data.error || 'Server error');
    }
  } catch (error) {
    console.error('Upgrade error:', error);
    alert('❌ Lỗi: ' + error.message + '\n\nThử lại sau!');
  }
}

async function downgradeAgent(agentId) {
  if (!confirm('Hạ xuống tài khoản Thường?\n\nSẽ giới hạn 5 sản phẩm/ngày')) {
    return;
  }

  try {
    console.log('Downgrading agent:', agentId);
    
    const response = await fetch(`https://kohkonhbanhang1.onrender.com/api/agents/${agentId}/upgrade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountType: 'FREE' })
    });

    const data = await response.json();
    console.log('Server response:', data);

    if (response.ok && data.success) {
      // Also update localStorage
      const agents = JSON.parse(localStorage.getItem('agents')) || [];
      const agentIndex = agents.findIndex(a => a.id == agentId);
      
      if (agentIndex !== -1) {
        agents[agentIndex].accountType = 'FREE';
        localStorage.setItem('agents', JSON.stringify(agents));
      }
      
      alert('✅ Đã hạ xuống Thường!');
      loadAdminData();
    } else {
      throw new Error(data.error || 'Server error');
    }
  } catch (error) {
    console.error('Downgrade error:', error);
    alert('❌ Lỗi: ' + error.message + '\n\nThử lại sau!');
  }
}

async function deleteAgent(agentId) {
  if (!confirm('⚠️ XÓA ĐẠI LÝ?\n\nTất cả sản phẩm của đại lý này cũng sẽ bị xóa!\nIP sẽ bị CHẶN vĩnh viễn!')) {
    return;
  }

  try {
    const response = await fetch(`https://kohkonhbanhang1.onrender.com/api/agents/${agentId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Xóa khỏi localStorage
      const agents = JSON.parse(localStorage.getItem('agents')) || [];
      const newAgents = agents.filter(a => a.id != agentId);
      localStorage.setItem('agents', JSON.stringify(newAgents));
      
      // Xóa sản phẩm của agent
      const products = JSON.parse(localStorage.getItem('products')) || [];
      const newProducts = products.filter(p => p.agentId != agentId);
      localStorage.setItem('products', JSON.stringify(newProducts));
      
      alert('✅ Đã xóa đại lý và chặn IP!\n\nĐại lý sẽ bị đăng xuất tự động.');
      loadAdminData();
      loadBlockedIPs();
    } else {
      throw new Error(data.error || 'Failed to delete');
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert('❌ Lỗi khi xóa đại lý: ' + error.message);
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
}

function logoutAdmin() {
  if (confirm('Đăng xuất Admin?')) {
    localStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminUser');
    window.location.href = 'admin-login.html';
  }
}

// Render products table
function renderProductsTable() {
  const tbody = document.getElementById('productsTableBody');
  
  if (allProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
          Chưa có sản phẩm nào
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = allProducts.map(product => {
    const agent = allAgents.find(a => a.id === product.agentId);
    const agentName = agent ? agent.fullname : product.agentName || 'Không rõ';
    
    return `
      <tr>
        <td style="width: 80px;">
          ${product.imageUrl ? `<img src="${product.imageUrl}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">` : '📦'}
        </td>
        <td><strong>${product.name}</strong></td>
        <td style="color: #4CAF50; font-weight: bold;">$${parseFloat(product.price).toFixed(2)}</td>
        <td>${getCategoryName(product.category)}</td>
        <td>${agentName}</td>
        <td>${formatDate(product.createdAt)}</td>
        <td>
          <button class="btn-delete" onclick="deleteProduct('${product.id}')">
            🗑️ Xóa
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function getCategoryName(category) {
  const categories = {
    'electronics': '📱 Điện tử',
    'fashion': '👗 Thời trang',
    'beauty': '💄 Mỹ phẩm',
    'food': '🍜 Đồ ăn',
    'drinks': '🥤 Đồ uống',
    'other': '📦 Khác'
  };
  return categories[category] || '📦 Khác';
}

async function deleteProduct(productId) {
  if (!confirm('⚠️ XÓA SẢN PHẨM?\n\nHành động này không thể hoàn tác!')) {
    return;
  }

  try {
    const response = await fetch(`https://kohkonhbanhang1.onrender.com/api/products/${productId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('✅ Đã xóa sản phẩm!');
      loadAdminData();
    } else {
      throw new Error('Server error');
    }
  } catch (error) {
    console.warn('Deleting from localStorage:', error);
    // Fallback to localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newProducts = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(newProducts));
    
    alert('✅ Đã xóa sản phẩm!');
    loadAdminData();
  }
}

function renderBlockedIPsTable() {
  const tbody = document.getElementById('blockedIPsTableBody');
  
  if (!blockedIPs || blockedIPs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px; color: #999;">
          Không có IP nào bị chặn
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = blockedIPs.map(blocked => `
    <tr>
      <td><code style="background: #f5f5f5; padding: 5px 10px; border-radius: 3px;">${blocked.ip || 'N/A'}</code></td>
      <td><strong>${blocked.username}</strong></td>
      <td>${formatDate(blocked.blockedAt)}</td>
      <td>${blocked.reason || 'N/A'}</td>
      <td>
        <button class="btn-upgrade" onclick="unblockIP('${blocked.ip}', '${blocked.username}')" style="background: #4CAF50;">
          🔓 Mở Khóa
        </button>
      </td>
    </tr>
  `).join('');
}

async function unblockIP(ip, username) {
  if (!confirm(`Mở khóa IP cho ${username}?\n\nIP: ${ip}\n\nĐại lý sẽ có thể đăng ký lại.`)) {
    return;
  }

  try {
    const response = await fetch('https://kohkonhbanhang1.onrender.com/api/unblock-ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, username })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('✅ Đã mở khóa IP!');
      loadBlockedIPs();
    } else {
      throw new Error(data.error || 'Failed to unblock');
    }
  } catch (error) {
    alert('❌ Lỗi: ' + error.message);
  }
}

