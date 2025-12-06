// Thư viện ảnh sản phẩm theo danh mục
const PRODUCT_IMAGES = {
  food: [
    { id: 'rice1', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', name: 'Gạo Thơm' },
    { id: 'noodle1', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', name: 'Mì Ăn Liền' },
    { id: 'oil1', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', name: 'Dầu Ăn' },
    { id: 'fish1', url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400', name: 'Cá Khô' },
    { id: 'meat1', url: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400', name: 'Thịt Hộp' },
    { id: 'egg1', url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', name: 'Trứng' },
    { id: 'bread1', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', name: 'Bánh Mì' },
    { id: 'snack1', url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400', name: 'Snack' }
  ],
  
  drinks: [
    { id: 'water1', url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400', name: 'Nước Suối' },
    { id: 'soda1', url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400', name: 'Nước Ngọt' },
    { id: 'beer1', url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400', name: 'Bia' },
    { id: 'coffee1', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', name: 'Cà Phê' },
    { id: 'tea1', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', name: 'Trà' },
    { id: 'juice1', url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', name: 'Nước Ép' },
    { id: 'energy1', url: 'https://images.unsplash.com/photo-1622543925917-763c34f6f001?w=400', name: 'Nước Tăng Lực' },
    { id: 'milk1', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', name: 'Sữa' }
  ],

  fruits: [
    { id: 'apple1', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', name: 'Táo' },
    { id: 'banana1', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', name: 'Chuối' },
    { id: 'orange1', url: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400', name: 'Cam' },
    { id: 'grape1', url: 'https://images.unsplash.com/photo-1599819177795-0f8f8c51e1e7?w=400', name: 'Nho' },
    { id: 'mango1', url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400', name: 'Xoài' },
    { id: 'watermelon1', url: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400', name: 'Dưa Hấu' },
    { id: 'dragon1', url: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=400', name: 'Thanh Long' },
    { id: 'durian1', url: 'https://images.unsplash.com/photo-1580835845971-3eaf8b6c6d0d?w=400', name: 'Sầu Riêng' }
  ],

  cosmetics: [
    { id: 'lipstick1', url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', name: 'Son Môi' },
    { id: 'cream1', url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', name: 'Kem Dưỡng' },
    { id: 'perfume1', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', name: 'Nước Hoa' },
    { id: 'makeup1', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', name: 'Phấn Trang Điểm' },
    { id: 'serum1', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', name: 'Serum' },
    { id: 'mask1', url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', name: 'Mặt Nạ' },
    { id: 'sunscreen1', url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', name: 'Kem Chống Nắng' },
    { id: 'toner1', url: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400', name: 'Nước Hoa Hồng' }
  ],

  personal: [
    { id: 'shampoo1', url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400', name: 'Dầu Gội' },
    { id: 'soap1', url: 'https://images.unsplash.com/photo-1600857062241-98e5dba60f2f?w=400', name: 'Xà Phòng' },
    { id: 'toothpaste1', url: 'https://images.unsplash.com/photo-1622597467836-f3c7ca9d0861?w=400', name: 'Kem Đánh Răng' },
    { id: 'lotion1', url: 'https://images.unsplash.com/photo-1556229010-aa1673b196ea?w=400', name: 'Sữa Dưỡng Thể' },
    { id: 'tissue1', url: 'https://images.unsplash.com/photo-1591031910633-cee04a4e7b3f?w=400', name: 'Khăn Giấy' },
    { id: 'pad1', url: 'https://images.unsplash.com/photo-1550572017-4d432b2de8a2?w=400', name: 'Băng Vệ Sinh' },
    { id: 'deodorant1', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', name: 'Lăn Khử Mùi' },
    { id: 'cotton1', url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400', name: 'Bông Tẩy Trang' }
  ],

  fashion: [
    { id: 'tshirt1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', name: 'Áo Thun' },
    { id: 'jeans1', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', name: 'Quần Jeans' },
    { id: 'dress1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', name: 'Đầm' },
    { id: 'shoes1', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', name: 'Giày' },
    { id: 'bag1', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', name: 'Túi Xách' },
    { id: 'hat1', url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400', name: 'Mũ' },
    { id: 'watch1', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400', name: 'Đồng Hồ' },
    { id: 'glasses1', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', name: 'Kính' }
  ],

  electronics: [
    { id: 'phone1', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', name: 'Điện Thoại' },
    { id: 'charger1', url: 'https://images.unsplash.com/photo-1591290619762-c588f7e344dd?w=400', name: 'Sạc' },
    { id: 'headphone1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', name: 'Tai Nghe' },
    { id: 'powerbank1', url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', name: 'Pin Dự Phòng' },
    { id: 'cable1', url: 'https://images.unsplash.com/photo-1588432840364-79f2c97c60a2?w=400', name: 'Cáp Sạc' },
    { id: 'speaker1', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', name: 'Loa Bluetooth' },
    { id: 'mouse1', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', name: 'Chuột' },
    { id: 'keyboard1', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', name: 'Bàn Phím' }
  ],

  medicine: [
    { id: 'painkiller1', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', name: 'Thuốc Giảm Đau' },
    { id: 'vitamin1', url: 'https://images.unsplash.com/photo-1550572017-4d432b2de8a2?w=400', name: 'Vitamin' },
    { id: 'bandage1', url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400', name: 'Băng Gạc' },
    { id: 'antiseptic1', url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400', name: 'Nước Sát Trùng' },
    { id: 'fever1', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', name: 'Thuốc Hạ Sốt' },
    { id: 'cough1', url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400', name: 'Thuốc Ho' },
    { id: 'balm1', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', name: 'Dầu Gió' },
    { id: 'plaster1', url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400', name: 'Băng Dán' }
  ],

  grocery: [
    { id: 'salt1', url: 'https://images.unsplash.com/photo-1576672843344-d6c5a23c1b05?w=400', name: 'Muối' },
    { id: 'sugar1', url: 'https://images.unsplash.com/photo-1580735605084-e0be02fbb18f?w=400', name: 'Đường' },
    { id: 'soy1', url: 'https://images.unsplash.com/photo-1599970698794-cc3f5c770638?w=400', name: 'Nước Tương' },
    { id: 'fish_sauce1', url: 'https://images.unsplash.com/photo-1563245372-c49e0aa6e62e?w=400', name: 'Nước Mắm' },
    { id: 'msg1', url: 'https://images.unsplash.com/photo-1576672843344-d6c5a23c1b05?w=400', name: 'Bột Ngọt' },
    { id: 'pepper1', url: 'https://images.unsplash.com/photo-1599909533604-1f7d0c6f60ba?w=400', name: 'Tiêu' },
    { id: 'garlic1', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', name: 'Tỏi' },
    { id: 'chili1', url: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400', name: 'Ớt' }
  ],

  home: [
    { id: 'detergent1', url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400', name: 'Nước Giặt' },
    { id: 'dishsoap1', url: 'https://images.unsplash.com/photo-1600857062241-98e5dba60f2f?w=400', name: 'Nước Rửa Chén' },
    { id: 'cleaner1', url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400', name: 'Nước Lau Nhà' },
    { id: 'sponge1', url: 'https://images.unsplash.com/photo-1620838844906-815b7c5f33bb?w=400', name: 'Miếng Rửa Chén' },
    { id: 'trash_bag1', url: 'https://images.unsplash.com/photo-1604762511393-4bd49da0c2db?w=400', name: 'Túi Rác' },
    { id: 'broom1', url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400', name: 'Chổi' },
    { id: 'mop1', url: 'https://images.unsplash.com/photo-1620838844906-815b7c5f33bb?w=400', name: 'Cây Lau Nhà' },
    { id: 'bulb1', url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400', name: 'Bóng Đèn' }
  ]
};

// Hàm lấy ảnh theo danh mục
function getImagesByCategory(category) {
  return PRODUCT_IMAGES[category] || [];
}

// Hàm lấy tất cả danh mục
function getAllCategories() {
  return Object.keys(PRODUCT_IMAGES);
}
