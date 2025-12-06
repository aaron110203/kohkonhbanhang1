# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG XÁC MINH TELEGRAM

## 🎯 Tổng Quan
Hệ thống xác minh qua Telegram Bot cho phép đại lý đăng ký an toàn và nhận thông báo đơn hàng.

## 📱 CÁCH ĐĂNG KÝ ĐẠI LÝ

### Bước 1: Kết nối với Bot
1. Mở Telegram
2. Tìm kiếm: `@KohKongShopBot_bot`
3. Nhấn **START** hoặc gửi `/start`
4. Bot sẽ lưu username của bạn

### Bước 2: Đăng ký trên Website
1. Truy cập: https://taphoakohkong.live/login.html
2. Điền thông tin:
   - Tên đại lý
   - Số điện thoại
   - Email
   - **Username Telegram** (ví dụ: @yourname)
   - Mật khẩu
3. Nhấn nút **"Gửi Yêu Cầu Mã"**

### Bước 3: Lấy mã xác minh
1. Quay lại Telegram
2. Gửi lệnh: `/getcode` cho bot
3. Bot sẽ gửi cho bạn mã 6 chữ số
4. Mã có hiệu lực **10 phút**

### Bước 4: Hoàn tất đăng ký
1. Copy mã từ Telegram
2. Quay lại trang đăng ký
3. Nhập mã vào ô **"Mã Xác Minh"**
4. Nhấn **"Đăng Ký"**
5. Hoàn tất! 🎉

## 🤖 LỆNH CỦA BOT

### `/start`
Đăng ký với bot và lưu Chat ID

**Khi nào dùng:**
- Lần đầu sử dụng bot
- Khi thay đổi username Telegram

**Kết quả:**
```
✅ CHÀO MỪNG ĐẾN VỚI KOHKONG SHOP BOT!

👤 Username: @yourname
🆔 Chat ID: 123456789

📋 HƯỚNG DẪN ĐĂNG KÝ ĐẠI LÝ:
...
```

### `/getcode`
Lấy mã xác minh của bạn

**Khi nào dùng:**
- Sau khi bấm "Gửi Yêu Cầu Mã" trên website
- Khi cần xem lại mã (còn hiệu lực)

**Kết quả:**
```
🔐 MÃ XÁC MINH KOHKONG SHOP

👤 Username: @yourname
🔢 Mã của bạn: 123456

⏰ Còn hiệu lực: 9 phút
```

**Lỗi thường gặp:**
```
❌ KHÔNG CÓ MÃ XÁC MINH

Bạn chưa yêu cầu mã xác minh nào.
```
→ Giải pháp: Truy cập website và bấm "Gửi Yêu Cầu Mã"

### `/stat`
Xem trạng thái tài khoản

**Khi nào dùng:**
- Kiểm tra xem có mã nào đang hoạt động
- Xem thời gian còn lại của mã
- Kiểm tra kết nối với bot

**Kết quả:**
```
📊 TRẠNG THÁI TÀI KHOẢN

👤 Username: @yourname
🆔 Chat ID: 123456789
✅ Đã kết nối Bot: Có

🔐 MÃ XÁC MINH ĐANG HOẠT ĐỘNG:
🔢 Mã: 123456
⏰ Còn lại: 8 phút
```

### `/myinfo`
Xem thông tin cá nhân

**Kết quả:**
```
👤 THÔNG TIN CỦA BẠN

📛 Tên: Nguyen Van A
👤 Username: @yourname
🆔 Chat ID: 123456789
```

## 🔄 QUY TRÌNH HOẠT ĐỘNG

```
┌─────────────────────────────────────────────────────────────┐
│  1. USER: Gửi /start cho @KohKongShopBot_bot               │
│     → Bot lưu username và Chat ID                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. USER: Điền form đăng ký trên website                    │
│     → Nhập username Telegram (@yourname)                    │
│     → Bấm "Gửi Yêu Cầu Mã"                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. SERVER: Tạo mã 6 chữ số                                 │
│     → Lưu mã vào database (hiệu lực 10 phút)                │
│     → Gửi thông báo "mã đã được tạo" cho user               │
│     → Gửi thông báo về nhóm quản trị (-5018289214)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. USER: Quay lại Telegram                                 │
│     → Gửi /getcode cho bot                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. BOT: Kiểm tra và gửi mã                                 │
│     → Kiểm tra username có mã đang hoạt động không?         │
│     → Kiểm tra mã còn hiệu lực không?                       │
│     → Gửi mã 6 chữ số cho user                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  6. USER: Nhập mã vào website                               │
│     → Nhập mã vào ô "Mã Xác Minh"                           │
│     → Bấm "Đăng Ký"                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  7. SERVER: Xác minh                                        │
│     → So sánh mã nhập vào với mã đã lưu                     │
│     → Kiểm tra thời gian hết hạn                            │
│     → Xóa mã sau khi xác minh thành công                    │
│     → Gửi thông báo thành công cho user                     │
│     → Gửi thông báo về nhóm quản trị                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  8. ✅ HOÀN TẤT - Đại lý đã đăng ký thành công!             │
└─────────────────────────────────────────────────────────────┘
```

## ❗ LỖI THƯỜNG GẶP

### Lỗi 1: "user_not_found"
**Nguyên nhân:** Bạn chưa gửi `/start` cho bot

**Giải pháp:**
1. Mở Telegram
2. Tìm `@KohKongShopBot_bot`
3. Gửi `/start`
4. Thử lại

### Lỗi 2: "KHÔNG CÓ MÃ XÁC MINH"
**Nguyên nhân:** Bạn chưa yêu cầu mã trên website

**Giải pháp:**
1. Truy cập website
2. Điền form đăng ký
3. Bấm "Gửi Yêu Cầu Mã"
4. Sau đó gửi `/getcode` trên Telegram

### Lỗi 3: "MÃ ĐÃ HẾT HẠN"
**Nguyên nhân:** Mã có hiệu lực 10 phút, đã quá thời gian

**Giải pháp:**
1. Quay lại website
2. Bấm "Gửi Yêu Cầu Mã" lại
3. Lấy mã mới bằng `/getcode`

### Lỗi 4: "Mã xác minh không đúng"
**Nguyên nhân:** Nhập sai mã

**Giải pháp:**
1. Gửi `/getcode` lại để xem mã
2. Copy chính xác mã 6 chữ số
3. Paste vào website

### Lỗi 5: "Bạn chưa có username"
**Nguyên nhân:** Tài khoản Telegram chưa có username

**Giải pháp:**
1. Mở Telegram → Settings
2. Chọn "Username"
3. Tạo username (vd: @yourname)
4. Gửi lại `/start`

## 📊 THÔNG BÁO TỰ ĐỘNG

### Cho User:
1. **Khi yêu cầu mã:** Bot gửi hướng dẫn lấy mã
2. **Khi xác minh thành công:** Bot gửi chúc mừng
3. **Khi có đơn hàng:** Bot gửi chi tiết đơn hàng

### Cho Admin (Nhóm -5018289214):
1. **Khi có yêu cầu mã mới:** Thông báo user và mã
2. **Khi có đại lý mới:** Thông báo đăng ký thành công
3. **Khi có đơn hàng:** Thông báo chi tiết đơn hàng

## 🔧 KỸ THUẬT

### Lưu trữ mã xác minh:
```javascript
verificationCodes = Map {
  '@username' => {
    code: '123456',
    chatId: 987654321,
    expiresAt: 1733472000000
  }
}
```

### Lưu trữ Chat ID:
```javascript
userChatIds = Map {
  '@username' => 987654321
}
```

### API Endpoints:
- `POST /api/verification/request` - Tạo mã
- `POST /api/verification/verify` - Xác minh mã
- `POST /api/telegram/notify` - Gửi thông báo đơn hàng

## 📞 HỖ TRỢ

Nếu gặp vấn đề, vui lòng:
1. Gửi `/stat` để kiểm tra trạng thái
2. Thử gửi `/start` lại
3. Liên hệ admin qua nhóm Telegram

---
**Bot:** @KohKongShopBot_bot  
**Website:** https://taphoakohkong.live  
**Admin Group:** -5018289214
