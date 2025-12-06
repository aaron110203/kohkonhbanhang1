// Sample Products Data - Sản phẩm mẫu cho website
const sampleProducts = [
  {
    id: 'sample-001',
    name: 'iPhone 15 Pro Max 256GB',
    price: 1299.99,
    category: 'electronics',
    description: 'iPhone 15 Pro Max with A17 Pro chip, titanium design, and advanced camera system',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-002',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1199.99,
    category: 'electronics',
    description: 'Latest Samsung flagship with 200MP camera and S Pen',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-003',
    name: 'MacBook Pro 14" M3',
    price: 1999.99,
    category: 'electronics',
    description: 'Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-004',
    name: 'Nike Air Jordan 1 Retro',
    price: 179.99,
    category: 'fashion',
    description: 'Classic Air Jordan 1 sneakers in Chicago colorway',
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-005',
    name: 'Adidas Ultraboost 22',
    price: 189.99,
    category: 'fashion',
    description: 'Premium running shoes with Boost cushioning',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-006',
    name: 'Chanel No. 5 Eau de Parfum',
    price: 149.99,
    category: 'beauty',
    description: 'Iconic Chanel perfume, 100ml bottle',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-007',
    name: 'Dior Sauvage EDT',
    price: 129.99,
    category: 'beauty',
    description: 'Popular men\'s fragrance by Dior, 100ml',
    imageUrl: 'https://images.unsplash.com/photo-1595535882792-d3f702da663b?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-008',
    name: 'Organic Green Tea (500g)',
    price: 24.99,
    category: 'food',
    description: 'Premium organic green tea leaves from Japan',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-009',
    name: 'Premium Coffee Beans 1kg',
    price: 34.99,
    category: 'food',
    description: 'Arabica coffee beans from Colombia',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-010',
    name: 'Coca-Cola 24 Cans Pack',
    price: 15.99,
    category: 'drinks',
    description: 'Coca-Cola Classic 330ml x 24 cans',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-011',
    name: 'Red Bull Energy Drink 12 Pack',
    price: 22.99,
    category: 'drinks',
    description: 'Red Bull 250ml x 12 cans',
    imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34f5a99e?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-012',
    name: 'Sony WH-1000XM5 Headphones',
    price: 399.99,
    category: 'electronics',
    description: 'Premium noise-cancelling wireless headphones',
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-013',
    name: 'Gucci Belt Black Leather',
    price: 459.99,
    category: 'fashion',
    description: 'Authentic Gucci leather belt with gold buckle',
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583aa?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-014',
    name: 'La Mer Moisturizing Cream',
    price: 359.99,
    category: 'beauty',
    description: 'Luxury moisturizing cream 60ml',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-015',
    name: 'Instant Noodles 30 Pack',
    price: 19.99,
    category: 'food',
    description: 'Popular instant ramen noodles variety pack',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500',
    agentName: 'KohKong Shop',
    telegram: '@KohKongShopBot_bot',
    createdAt: new Date().toISOString()
  }
];

// Function to load sample products to server
async function loadSampleProducts() {
  try {
    for (const product of sampleProducts) {
      const response = await fetch('https://kohkonhbanhang1.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
      
      if (response.ok) {
        console.log('✅ Added sample product:', product.name);
      }
    }
    
    alert('✅ Đã thêm ' + sampleProducts.length + ' sản phẩm mẫu thành công!');
    location.reload();
  } catch (error) {
    console.error('❌ Error loading sample products:', error);
    alert('❌ Lỗi khi thêm sản phẩm mẫu!');
  }
}

console.log('📦 Sample Products Module loaded. Run loadSampleProducts() to add products.');
