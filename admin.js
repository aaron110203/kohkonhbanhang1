// Admin Panel Logic

let allAgents = [];
let allProducts = [];

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
  loadAdminData();
  // Auto refresh every 10 seconds
  setInterval(loadAdminData, 10000);
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
    // Update on server
    const response = await fetch(`https://kohkonhbanhang1.onrender.com/api/agents/${agentId}/upgrade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountType: 'VIP' })
    });

    if (response.ok) {
      alert('✅ Đã nâng cấp lên VIP!');
    } else {
      throw new Error('Server error');
    }
  } catch (error) {
    console.warn('Updating localStorage:', error);
    // Fallback to localStorage
    const agents = JSON.parse(localStorage.getItem('agents')) || [];
    const agentIndex = agents.findIndex(a => a.id === agentId);
    
    if (agentIndex !== -1) {
      agents[agentIndex].accountType = 'VIP';
      agents[agentIndex].upgradedAt = new Date().toISOString();
      localStorage.setItem('agents', JSON.stringify(agents));
      alert('✅ Đã nâng cấp lên VIP!');
    }
  }

  loadAdminData();
}

async function downgradeAgent(agentId) {
  if (!confirm('Hạ xuống tài khoản Thường?\n\nSẽ giới hạn 5 sản phẩm/ngày')) {
    return;
  }

  try {
    const response = await fetch(`https://kohkonhbanhang1.onrender.com/api/agents/${agentId}/upgrade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountType: 'FREE' })
    });

    if (response.ok) {
      alert('✅ Đã hạ xuống Thường!');
    }
  } catch (error) {
    const agents = JSON.parse(localStorage.getItem('agents')) || [];
    const agentIndex = agents.findIndex(a => a.id === agentId);
    
    if (agentIndex !== -1) {
      agents[agentIndex].accountType = 'FREE';
      localStorage.setItem('agents', JSON.stringify(agents));
      alert('✅ Đã hạ xuống Thường!');
    }
  }

  loadAdminData();
}

async function deleteAgent(agentId) {
  if (!confirm('⚠️ XÓA ĐẠI LÝ?\n\nTất cả sản phẩm của đại lý này cũng sẽ bị xóa!')) {
    return;
  }

  try {
    const response = await fetch(`https://kohkonhbanhang1.onrender.com/api/agents/${agentId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('✅ Đã xóa đại lý!');
    }
  } catch (error) {
    const agents = JSON.parse(localStorage.getItem('agents')) || [];
    const newAgents = agents.filter(a => a.id !== agentId);
    localStorage.setItem('agents', JSON.stringify(newAgents));
    
    // Delete agent's products
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newProducts = products.filter(p => p.agentId !== agentId);
    localStorage.setItem('products', JSON.stringify(newProducts));
    
    alert('✅ Đã xóa đại lý!');
  }

  loadAdminData();
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
