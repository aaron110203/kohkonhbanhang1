# Hướng Dẫn SEO và Social Media Marketing

## 🔍 Google Search Console

### Bước 1: Xác Minh Website
1. Truy cập: https://search.google.com/search-console
2. Thêm property: `https://taphoakohkong.live`
3. Chọn phương thức xác minh: **HTML file**
4. Tải file `google-verification.html` và upload lên root

### Bước 2: Submit Sitemap
1. Vào Search Console → Sitemaps
2. Nhập URL: `https://taphoakohkong.live/sitemap.xml`
3. Click **Submit**

### Bước 3: Request Indexing
1. Vào URL Inspection
2. Nhập URL trang chủ: `https://taphoakohkong.live`
3. Click **Request Indexing**

---

## 📊 Google Analytics Setup

### Tạo Google Analytics Account
1. Truy cập: https://analytics.google.com
2. Tạo Account mới: "KohKong Shop"
3. Tạo Property: "taphoakohkong.live"
4. Lấy **Measurement ID** (GA4): `G-XXXXXXXXXX`

### Thêm vào Website
Mở file `index.html`, thêm trước `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Thay `G-XXXXXXXXXX` bằng Measurement ID thật của bạn.

---

## 📘 Facebook Business & Pixel

### Tạo Facebook Page
1. Tạo Facebook Page: "KohKong Shop"
2. Thêm ảnh đại diện và cover
3. Điền thông tin: Website, địa chỉ, mô tả

### Tạo Facebook Pixel
1. Vào Facebook Business Manager
2. Events Manager → Create Pixel
3. Tên: "KohKong Shop Pixel"
4. Lấy **Pixel ID**: `123456789012345`

### Thêm Pixel vào Website
```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '123456789012345');
  fbq('track', 'PageView');
</script>
```

---

## 🎯 TikTok Business & Pixel

### Tạo TikTok Business Account
1. Truy cập: https://business.tiktok.com
2. Tạo account: "KohKong Shop"
3. Vào Events → Create Pixel
4. Lấy **Pixel ID**

---

## 📱 Social Media Strategy

### 1. Facebook Marketing

**Nội Dung Đăng:**
- Giới thiệu sản phẩm mới (hàng ngày)
- Khuyến mãi, giảm giá
- Review khách hàng
- Video unboxing
- Live stream bán hàng

**Facebook Ads:**
```
Campaign: Awareness
- Objective: Reach
- Audience: Cambodia, 18-65 tuổi
- Budget: $5/day

Campaign: Conversion
- Objective: Traffic
- Destination: https://taphoakohkong.live/products.html
- Budget: $10/day
```

### 2. Telegram Channel

**Tạo Channel:**
1. Mở Telegram → New Channel
2. Tên: "KohKong Shop - Deals"
3. Username: `@KohKongShopDeals`

**Nội dung:**
- Sản phẩm mới hàng ngày
- Flash sale
- Mã giảm giá
- Tips mua sắm

**Liên kết với Bot:**
- Bot: `@KohKongShopBot`
- Mention bot trong mỗi post để khách đặt hàng

### 3. WhatsApp Business

**Setup:**
1. Tải WhatsApp Business
2. Tạo Business Profile
3. Thêm Catalog (danh mục sản phẩm)
4. Link: `https://wa.me/855XXXXXXXXX`

**Auto Reply:**
```
Xin chào! Cảm ơn bạn đã quan tâm đến KohKong Shop.
🛒 Xem sản phẩm: https://taphoakohkong.live/products.html
📱 Đặt hàng ngay tại website hoặc nhắn tin cho chúng tôi!
```

### 4. TikTok Marketing

**Nội dung Video:**
- Unboxing sản phẩm (15-30s)
- Review nhanh
- Behind the scenes
- Khách hàng review
- Flash sale countdown

**Hashtags:**
```
#KohKongShop #Cambodia #OnlineShopping #Shopping
#មាតិកា #ទិញទំនិញអនឡាញ #កម្ពុជា
```

### 5. Instagram

**Post Ideas:**
- Ảnh sản phẩm đẹp
- Carousel (nhiều sản phẩm)
- Reels (video ngắn)
- Stories (sale, promotion)

---

## 🎨 Content Calendar (Lịch Đăng Bài)

### Hàng Ngày:
- **7:00 AM**: Facebook - Sản phẩm mới
- **12:00 PM**: Telegram - Flash sale
- **6:00 PM**: TikTok - Video review
- **8:00 PM**: Instagram Stories - Behind the scenes

### Hàng Tuần:
- **Thứ 2**: Giới thiệu danh mục mới
- **Thứ 4**: Khuyến mãi giữa tuần
- **Thứ 6**: Weekend sale
- **Chủ Nhật**: Review tổng kết tuần

---

## 🔗 Link Building (Tăng Backlinks)

### 1. Đăng Ký Thư Mục
- Google My Business
- Bing Places
- Yellow Pages Cambodia
- Khmer24.com
- CamboTrade.com

### 2. Press Release
Viết bài PR và gửi đến:
- Khmer Times
- Phnom Penh Post
- Cambodia Daily
- Blog công nghệ

### 3. Forum & Community
- Reddit Cambodia
- Facebook Groups (Bán hàng, Mua sắm)
- Khmer Forums

---

## 📈 Theo Dõi Hiệu Quả

### Google Analytics - Metrics Quan Trọng:
- **Users**: Số người truy cập
- **Sessions**: Số lượt truy cập
- **Bounce Rate**: Tỷ lệ thoát (< 50% là tốt)
- **Avg Session Duration**: Thời gian trung bình (> 2 phút là tốt)
- **Conversions**: Số đơn hàng

### Facebook Insights:
- Reach (Phủ sóng)
- Engagement (Tương tác)
- Click-Through Rate (CTR)
- Cost Per Click (CPC)

### Mục Tiêu 3 Tháng Đầu:
- ✅ 1,000+ visitors/tháng
- ✅ 500+ Facebook followers
- ✅ 200+ Telegram members
- ✅ 50+ orders/tháng

---

## 🎁 Khuyến Mãi Để Viral

### Campaign Ý Tưởng:

**1. Share & Win**
```
📢 CHIA SẺ - NHẬN QUÀ!

✨ Cách tham gia:
1. Share bài đăng này
2. Tag 3 người bạn
3. Follow page KohKong Shop
4. Inbox để nhận mã giảm 20%

🎁 10 người share nhiều nhất: Voucher 100,000₭
⏰ Hết hạn: 7 ngày
```

**2. Referral Program**
```
👥 GIỚI THIỆU BẠN BÈ - NHẬN THƯỞNG!

🎁 Bạn được: 50,000₭
🎁 Bạn bè: 50,000₭

Điều kiện: Bạn bè đặt đơn hàng đầu tiên
```

**3. Flash Sale**
```
⚡ FLASH SALE 1 GIỜ!

💥 Giảm 50% tất cả sản phẩm
⏰ 8:00 PM - 9:00 PM
🔥 Số lượng có hạn
```

---

## 📞 Liên Hệ & Support

### Hotline:
- Telegram: @KohKongShopBot
- WhatsApp: +855 XX XXX XXX
- Email: support@taphoakohkong.live

### Social Media Links:
- Facebook: facebook.com/kohkongshop
- Instagram: instagram.com/kohkongshop
- TikTok: tiktok.com/@kohkongshop
- Telegram: t.me/KohKongShopDeals

---

## ✅ Checklist SEO Hàng Tuần

- [ ] Đăng 5-7 bài Facebook
- [ ] Tạo 3-4 video TikTok
- [ ] Update 10+ sản phẩm mới
- [ ] Trả lời tất cả tin nhắn khách hàng
- [ ] Kiểm tra Google Analytics
- [ ] Optimize từ khóa dựa trên search data
- [ ] Chạy ít nhất 1 campaign quảng cáo

---

**Lưu ý**: SEO và Social Media Marketing cần thời gian. Kiên trì đăng bài đều đặn và tương tác với khách hàng sẽ mang lại kết quả tốt sau 2-3 tháng!
