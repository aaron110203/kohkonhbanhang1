# HƯỚNG DẪN KHÁCH HÀNG - KẾT NỐI TELEGRAM BOT

## 🎯 TÍNH NĂNG MỚI: NHẬN THÔNG BÁO ĐƠN HÀNG QUA TELEGRAM

Bây giờ khách hàng có thể kết nối Telegram Bot để nhận thông báo xác nhận đơn hàng ngay lập tức!

---

## 📱 CÁCH KẾT NỐI BOT (CHO KHÁCH HÀNG)

### Bước 1: Mở Telegram
1. Mở ứng dụng Telegram
2. Tìm kiếm: **@KohKongShopBot_bot**
3. Nhấn **START** hoặc gửi lệnh: `/start`

Bot sẽ gửi:
```
✅ CHÀO MỪNG ĐẾN VỚI KOHKONG SHOP BOT!

👤 Username: @yourname
🆔 Chat ID: 123456789

🛒 BẠN LÀ KHÁCH HÀNG?
• Truy cập website: https://taphoakohkong.live/products.html
• Bấm nút "Kết Nối Bot Ngay"
• Nhập username: @yourname
• Khi đặt hàng, bạn sẽ nhận thông báo tại đây!
```

### Bước 2: Vào Website
1. Truy cập: https://taphoakohkong.live/products.html
2. Bạn sẽ thấy banner màu xanh:

```
┌─────────────────────────────────────────────────────────┐
│  🤖  📱 Đặt Hàng Qua Telegram                           │
│                                                          │
│  Khách hàng của bạn có thể đặt hàng trực tiếp qua       │
│  Telegram Bot. Bạn sẽ nhận thông báo ngay lập tức!     │
│                                                          │
│  ✅ Nhận đơn hàng tức thì                               │
│  ✅ Xác nhận đơn tự động                                │
│  ✅ Chat trực tiếp với khách                            │
│  ✅ Theo dõi trạng thái đơn                             │
│                                                          │
│         [ Kết Nối Bot Ngay ]                            │
└─────────────────────────────────────────────────────────┘
```

### Bước 3: Kết Nối Bot
1. Nhấn nút **"Kết Nối Bot Ngay"**
2. Popup sẽ hiện ra yêu cầu nhập username
3. Nhập username Telegram của bạn (ví dụ: `@yourname`)
4. Nhấn OK

### Bước 4: Xác Nhận Kết Nối
Banner sẽ đổi màu xanh lá:

```
┌─────────────────────────────────────────────────────────┐
│  ✅  🎉 Đã Kết Nối Telegram Bot!                        │
│                                                          │
│  Bạn sẽ nhận thông báo đơn hàng tại Telegram: @yourname │
│                                                          │
│         [ Ngắt Kết Nối ]                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🛒 ĐẶT HÀNG VÀ NHẬN THÔNG BÁO

### Khi bạn đặt hàng:

1. **Chọn sản phẩm** → Nhấn "Đặt Hàng Ngay"
2. **Điền thông tin:**
   - Tên khách hàng
   - Số điện thoại
   - Địa chỉ
   - Số lượng
   - Ghi chú (nếu có)
3. **Nhấn "Đặt Hàng"**

### Thông báo bạn nhận được:

**Trên Website:**
```
✅ ĐẶT HÀNG THÀNH CÔNG!

Đại lý sẽ liên hệ với bạn qua Telegram trong thời gian sớm nhất.

Telegram đại lý: @agent123

📱 Bạn sẽ nhận thông báo xác nhận tại Telegram: @yourname
```

**Trên Telegram (ngay lập tức):**
```
✅ XÁC NHẬN ĐƠN HÀNG

Cảm ơn bạn đã đặt hàng tại KohKong Shop!

📦 Sản phẩm: Coca Cola 330ml
💰 Giá: 5,000 ₭
🔢 Số lượng: 2
💵 Tổng tiền: 10,000 ₭

👤 Tên: Nguyễn Văn A
📱 SĐT: 0123456789
📍 Địa chỉ: 123 Đường ABC, TP HCM

🤝 Đại lý: Kohkong Shop
📲 Telegram đại lý: @agent123

⏰ 6/12/2025, 10:30:00

📞 Đại lý sẽ liên hệ với bạn sớm nhất!
```

---

## 🔄 LUỒNG HOẠT ĐỘNG HOÀN CHỈNH

```
┌─────────────────────────────────────────────────────────┐
│  KHÁCH HÀNG                                              │
└─────────────────────────────────────────────────────────┘
   │
   │ 1. Gửi /start cho @KohKongShopBot_bot
   │
   ▼
┌─────────────────────────────────────────────────────────┐
│  BOT: Lưu username → ChatID                             │
│  Bot: "Bạn đã kết nối thành công!"                      │
└─────────────────────────────────────────────────────────┘
   │
   │ 2. Vào website → Bấm "Kết Nối Bot Ngay"
   │    → Nhập @username
   │
   ▼
┌─────────────────────────────────────────────────────────┐
│  WEBSITE: Lưu @username vào localStorage                │
│  Website: "Kết nối thành công!"                         │
└─────────────────────────────────────────────────────────┘
   │
   │ 3. Chọn sản phẩm → Đặt hàng
   │
   ▼
┌─────────────────────────────────────────────────────────┐
│  WEBSITE: Gửi 2 yêu cầu API:                            │
│  • /api/telegram/notify → Đại lý                        │
│  • /api/telegram/notify → Khách hàng (@username)        │
└─────────────────────────────────────────────────────────┘
   │
   │ 4. API xử lý
   │
   ▼
┌─────────────────────────────────────────────────────────┐
│  SERVER: Tìm ChatID của @username                       │
│  Server: Gửi tin nhắn qua Telegram Bot API             │
└─────────────────────────────────────────────────────────┘
   │
   │ 5. Telegram Bot gửi tin nhắn
   │
   ▼
┌─────────────────────────────────────────────────────────┐
│  KHÁCH HÀNG: Nhận thông báo xác nhận đơn hàng           │
│  ✅ XÁC NHẬN ĐƠN HÀNG                                   │
│  📦 Sản phẩm: ...                                       │
│  💰 Giá: ...                                            │
└─────────────────────────────────────────────────────────┘
   │
   │ 6. Đại lý cũng nhận thông báo
   │
   ▼
┌─────────────────────────────────────────────────────────┐
│  ĐẠI LÝ: Nhận đơn hàng mới                              │
│  🛒 ĐƠN HÀNG MỚI!                                       │
│  📦 Sản phẩm: ...                                       │
│  👤 Khách hàng: ...                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 SO SÁNH TRƯỚC VÀ SAU

### TRƯỚC ĐÂY:
- ❌ Khách hàng không biết đơn hàng có được gửi không
- ❌ Phải chờ đại lý liên hệ
- ❌ Không có xác nhận tự động
- ❌ Dễ quên thông tin đơn hàng

### BÂY GIỜ:
- ✅ Khách hàng nhận xác nhận ngay lập tức
- ✅ Thông tin đơn hàng lưu trên Telegram
- ✅ Biết được đại lý nào sẽ xử lý
- ✅ Có Telegram đại lý để liên hệ
- ✅ Trải nghiệm chuyên nghiệp hơn

---

## ❓ CÂU HỎI THƯỜNG GẶP

### 1. Tôi có bắt buộc phải kết nối bot không?
**Không.** Bạn vẫn có thể đặt hàng bình thường. Nhưng kết nối bot giúp bạn nhận xác nhận nhanh hơn!

### 2. Tôi không có username Telegram thì sao?
**Cách tạo username:**
1. Mở Telegram → Settings
2. Chọn "Username"
3. Tạo username của bạn (ví dụ: `yourname`)
4. Lưu lại
5. Quay lại bot và gửi `/start`

### 3. Tôi có thể ngắt kết nối bot không?
**Có.** Vào trang products → Bấm nút "Ngắt Kết Nối" trên banner.

### 4. Kết nối có mất phí không?
**Không.** Hoàn toàn miễn phí!

### 5. Tôi có thể kết nối nhiều tài khoản không?
**Một trình duyệt chỉ lưu một username.** Nếu muốn đổi, hãy ngắt kết nối và kết nối lại với username khác.

### 6. Thông báo có gửi đến số điện thoại không?
**Không.** Chỉ gửi qua Telegram. Telegram an toàn và nhanh hơn SMS!

### 7. Tôi đặt hàng nhưng không nhận được thông báo?
**Kiểm tra:**
1. Đã gửi `/start` cho @KohKongShopBot_bot chưa?
2. Username có đúng không? (phải có dấu @)
3. Banner có hiện "Đã Kết Nối" không?
4. Kiểm tra tin nhắn từ @KohKongShopBot_bot

---

## 🎨 GIAO DIỆN BANNER

### Banner Chưa Kết Nối:
![Banner Blue](attachment:banner-blue.png)
- Màu xanh dương (#0088cc)
- Nút "Kết Nối Bot Ngay"
- Icon robot đang nhảy

### Banner Đã Kết Nối:
![Banner Green](attachment:banner-green.png)
- Màu xanh lá (#2ecc71)
- Hiển thị username đã kết nối
- Nút "Ngắt Kết Nối"
- Icon check ✅

---

## 📱 LỆNH BOT

Khách hàng có thể dùng các lệnh:

### `/start`
Kết nối với bot lần đầu

### `/stat`
Xem trạng thái kết nối:
```
📊 TRẠNG THÁI TÀI KHOẢN

👤 Username: @yourname
🆔 Chat ID: 123456789
✅ Đã kết nối Bot: Có
```

### `/myinfo`
Xem thông tin cá nhân:
```
👤 THÔNG TIN CỦA BẠN

📛 Tên: Nguyen Van A
👤 Username: @yourname
🆔 Chat ID: 123456789
```

---

## 🔐 BẢO MẬT

- ✅ Username được lưu **cục bộ** (localStorage) trên trình duyệt của bạn
- ✅ Không chia sẻ với bên thứ 3
- ✅ Chỉ dùng để gửi thông báo đơn hàng
- ✅ Bạn có thể ngắt kết nối bất cứ lúc nào

---

## 🎯 LỢI ÍCH

### Cho Khách Hàng:
1. ✅ Nhận xác nhận đơn hàng tức thì
2. ✅ Lưu thông tin đơn hàng trên Telegram
3. ✅ Biết được đại lý xử lý đơn
4. ✅ Dễ dàng liên hệ đại lý
5. ✅ Theo dõi đơn hàng chuyên nghiệp

### Cho Đại Lý:
1. ✅ Khách hàng tin tưởng hơn
2. ✅ Giảm câu hỏi "đơn hàng tôi đâu?"
3. ✅ Tăng trải nghiệm người dùng
4. ✅ Hệ thống tự động hóa

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, vui lòng:
1. Gửi `/stat` để kiểm tra trạng thái
2. Thử gửi `/start` lại
3. Liên hệ admin qua nhóm Telegram

**Bot:** @KohKongShopBot_bot  
**Website:** https://taphoakohkong.live  
**Admin Group:** -5018289214
