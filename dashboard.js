// Get current user
const currentUserStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
let currentUser = null;

if (currentUserStr) {
  currentUser = JSON.parse(currentUserStr);
  document.getElementById('userName').textContent = `Xin chào, ${currentUser.fullname}`;
  
  // Display agent's telegram
  const telegramDisplay = document.getElementById('agentTelegramDisplay');
  if (telegramDisplay) {
    telegramDisplay.textContent = currentUser.telegram || 'Chưa cập nhật';
  }
} else {
  window.location.href = 'login.html';
}

// Setup file input listener when page loads
document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('product-image');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      const previewBox = document.getElementById('image-preview');
      const previewImg = document.getElementById('preview-img');
      const previewInfo = document.getElementById('preview-info');
      
      if (!file) {
        previewBox.style.display = 'none';
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB');
        fileInput.value = '';
        previewBox.style.display = 'none';
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('⚠️ Vui lòng chọn file ảnh (JPG, PNG, GIF)');
        fileInput.value = '';
        previewBox.style.display = 'none';
        return;
      }

      // Read and preview
      const reader = new FileReader();
      reader.onload = function(event) {
        previewImg.src = event.target.result;
        previewBox.style.display = 'block';
        
        const sizeKB = (file.size / 1024).toFixed(2);
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        
        previewInfo.innerHTML = `
          <strong>📁 Tên:</strong> ${file.name}<br>
          <strong>📏 Kích thước:</strong> ${sizeKB} KB (${sizeMB} MB)<br>
          <strong>✅ Trạng thái:</strong> <span style="color: #28a745; font-weight: bold;">Đã chọn thành công!</span>
        `;
      };
      reader.readAsDataURL(file);
    });
  }
});

// Preview image before upload
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('image-preview');
      const img = document.getElementById('preview-img');
      img.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// Convert image to Base64
function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
  console.log('🔍 showSection called with:', section);
  
  const allSections = document.querySelectorAll('.content-section');
  console.log('📦 Found sections:', allSections.length);
  allSections.forEach(s => s.classList.add('hidden'));

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  if (section === 'products') {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.classList.remove('hidden');
      console.log('✅ Showing products section');
    }
    if (navItems[0]) navItems[0].classList.add('active');
    loadMyProducts();
  } else if (section === 'add-product') {
    const addProductSection = document.getElementById('add-product-section');
    if (addProductSection) {
      addProductSection.classList.remove('hidden');
      console.log('✅ Showing add-product section');
    }
    if (navItems[1]) navItems[1].classList.add('active');
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
      ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 0.75rem;">` : ''}
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
          <span>Telegram: ${product.telegram || 'N/A'}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Add product
async function addProduct(e) {
  e.preventDefault();

  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const category = document.getElementById('product-category').value;
  const icon = document.getElementById('product-icon').value.trim() || '📦';
  const description = document.getElementById('product-description').value.trim();
  const telegramInput = document.getElementById('product-telegram').value.trim();
  const telegram = telegramInput || currentUser.telegram || '';
  const imageFile = document.getElementById('product-image').files[0];
  
  // Lấy phương thức upload đã chọn
  const uploadMethod = document.querySelector('input[name="upload-method"]:checked').value;

  if (!name || !price || !category) {
    alert('❌ Vui lòng điền đầy đủ thông tin bắt buộc!');
    return;
  }

  if (!imageFile) {
    alert('❌ Vui lòng upload hình ảnh sản phẩm!');
    return;
  }

  // Show loading
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Đang lưu...';

  try {
    let imageUrl;
    
    if (uploadMethod === 'server') {
      // UPLOAD LÊN SERVER
      submitBtn.textContent = '📤 Đang upload ảnh...';
      
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const uploadResponse = await fetch('https://kohkonhbanhang1.onrender.com/api/upload/image', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Upload ảnh thất bại!');
      }
      
      const uploadResult = await uploadResponse.json();
      imageUrl = uploadResult.fullUrl; // URL đầy đủ từ server
      
      console.log('✅ Ảnh đã upload lên server:', imageUrl);
      
    } else {
      // LƯU BASE64 (LocalStorage)
      submitBtn.textContent = '💾 Đang chuyển đổi ảnh...';
      imageUrl = await imageToBase64(imageFile);
      console.log('✅ Ảnh đã chuyển Base64');
    }

    const product = {
      id: generateId(),
      name,
      price,
      category,
      icon,
      description,
      telegram,
      imageUrl, // URL từ server hoặc Base64
      uploadMethod, // Lưu thông tin phương thức upload
      agentId: currentUser.id,
      agentName: currentUser.fullname,
      agentTelegram: currentUser.telegram,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 🌐 LƯU VÀO SERVER (GLOBAL DATABASE) - Đồng bộ toàn cầu
    submitBtn.textContent = '🌐 Đang đồng bộ lên server...';
    
    const saveResponse = await fetch('https://kohkonhbanhang1.onrender.com/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });

    if (!saveResponse.ok) {
      throw new Error('Không thể lưu sản phẩm lên server!');
    }

    const saveResult = await saveResponse.json();
    console.log('✅ Đã lưu lên server:', saveResult);

    // Backup vào localStorage (fallback)
    const agents = JSON.parse(localStorage.getItem('agents')) || [];
    const agentIndex = agents.findIndex(a => a.username === currentUser.username);

    if (agentIndex !== -1) {
      if (!agents[agentIndex].products) {
        agents[agentIndex].products = [];
      }
      agents[agentIndex].products.push(product);
      localStorage.setItem('agents', JSON.stringify(agents));

      currentUser.products = agents[agentIndex].products;
      if (localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
    }

    // Lưu vào products chung (backup)
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    allProducts.push(product);
    localStorage.setItem('products', JSON.stringify(allProducts));

    // 📱 GỬI THÔNG BÁO TELEGRAM
    submitBtn.textContent = '📱 Đang gửi thông báo...';
    await sendTelegramNotification(product);

    alert('✅ Thêm sản phẩm thành công!\n\n' + 
          (uploadMethod === 'server' ? 
            '📤 Ảnh đã upload lên server: ' + imageUrl : 
            '💾 Ảnh đã lưu Base64 vào LocalStorage') + 
          '\n\n🌐 Sản phẩm đã đồng bộ toàn cầu!' +
          '\n📱 Mọi người trên thế giới đều có thể xem!' +
          '\n📢 Đã gửi thông báo đến Telegram Bot!');

    // Reset form
    e.target.reset();
    document.getElementById('image-preview').style.display = 'none';

    // Go back to products list
    showSection('products');
  } catch (error) {
    console.error('Error adding product:', error);
    alert('❌ Có lỗi xảy ra khi thêm sản phẩm: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
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

// Load category images when category changes
function loadCategoryImages(category) {
  const gallerySection = document.getElementById('imageGallerySection');
  const gallery = document.getElementById('imageGallery');
  
  if (!category) {
    gallerySection.style.display = 'none';
    return;
  }

  const images = getImagesByCategory(category);
  
  if (images.length === 0) {
    gallerySection.style.display = 'none';
    return;
  }

  gallerySection.style.display = 'block';
  
  gallery.innerHTML = images.map(img => `
    <div class="image-item" data-url="${img.url}" onclick="selectImage('${img.url}', this)">
      <img src="${img.url}" alt="${img.name}" loading="lazy">
      <div class="image-item-name">${img.name}</div>
      <div class="checkmark">✓</div>
    </div>
  `).join('');
}

// Select image
function selectImage(url, element) {
  // Remove previous selection
  const allItems = document.querySelectorAll('.image-item');
  allItems.forEach(item => item.classList.remove('selected'));
  
  // Add selection to clicked item
  element.classList.add('selected');
  
  // Set hidden input value
  document.getElementById('selected-image-url').value = url;
}

// Send Telegram notification
async function sendTelegramNotification(product) {
  try {
    const message = `🆕 SẢN PHẨM MỚI ĐƯỢC ĐĂNG\n\n` +
                   `📦 Tên: ${product.name}\n` +
                   `💰 Giá: ${formatPrice(product.price)} ₭\n` +
                   `📂 Danh mục: ${getCategoryName(product.category)}\n` +
                   `👤 Đại lý: ${product.agentName}\n` +
                   `📱 Telegram: ${product.telegram}\n` +
                   `📅 Ngày: ${formatDate(product.createdAt)}\n\n` +
                   `🌐 Xem tại: https://taphoakohkong.live`;

    const response = await fetch('https://kohkonhbanhang1.onrender.com/api/telegram/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        imageUrl: product.uploadMethod === 'server' ? product.imageUrl : null
      })
    });

    if (response.ok) {
      console.log('✅ Đã gửi thông báo Telegram');
    } else {
      console.warn('⚠️ Không gửi được thông báo Telegram');
    }
  } catch (error) {
    console.error('❌ Lỗi gửi Telegram:', error);
  }
}
