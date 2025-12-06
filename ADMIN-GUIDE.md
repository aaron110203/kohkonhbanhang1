# 🛡️ HƯỚNG DẪN SỬ DỤNG ADMIN PANEL

## ✅ ĐÃ HOÀN THÀNH:

### 1. Admin Dashboard
- Quản lý tất cả đại lý
- Xem thống kê: Tổng đại lý, VIP, Sản phẩm
- Theo dõi quota hằng ngày của từng đại lý

### 2. Phân Cấp Tài Khoản

**🆓 TÀI KHOẢN THƯỜNG (FREE)**:
- Giới hạn: **5 sản phẩm/ngày**
- Reset vào 00:00 hằng ngày
- Badge màu xanh nhạt

**👑 TÀI KHOẢN VIP**:
- **KHÔNG GIỚI HẠN** sản phẩm
- Badge vàng đặc biệt
- Ưu tiên hiển thị

### 3. Chức Năng Admin

✅ **Nâng cấp VIP**: 1 click nâng đại lý lên VIP
✅ **Hạ cấp**: Đưa VIP về Thường nếu cần
✅ **Xóa đại lý**: Xóa đại lý và toàn bộ sản phẩm
✅ **Theo dõi quota**: Xem từng đại lý đã đăng bao nhiêu sản phẩm hôm nay

---

## 🔐 ĐĂNG NHẬP ADMIN

### URL: `admin-login.html`

**Thông tin đăng nhập mặc định**:
```
Username: admin
Password: Admin@KohKong2025
```

⚠️ **LƯU Ý**: Trong production, hãy đổi password này ngay!

---

## 📊 SỬ DỤNG ADMIN PANEL

### Bước 1: Đăng nhập
1. Vào `admin-login.html`
2. Nhập username: `admin`
3. Nhập password: `Admin@KohKong2025`
4. Click "Đăng Nhập Admin"

### Bước 2: Xem thống kê
Dashboard hiển thị:
- 📊 Tổng số đại lý
- 👑 Số đại lý VIP
- 📦 Tổng sản phẩm
- 🆕 Sản phẩm đăng hôm nay

### Bước 3: Quản lý đại lý

**Nâng cấp lên VIP**:
1. Tìm đại lý có badge "🆓 Thường"
2. Click nút "👑 Nâng Cấp VIP"
3. Xác nhận
4. ✅ Đại lý ngay lập tức đăng không giới hạn!

**Hạ xuống Thường**:
1. Tìm đại lý có badge "👑 VIP"
2. Click nút "⬇️ Hạ Xuống Thường"
3. Xác nhận
4. Đại lý bị giới hạn lại 5 sản phẩm/ngày

**Xóa đại lý**:
1. Click nút "🗑️ Xóa"
2. Xác nhận (cảnh báo sẽ xóa luôn sản phẩm)
3. Đại lý và sản phẩm bị xóa vĩnh viễn

---

## 🎯 CÁCH HOẠT ĐỘNG

### Đại lý FREE (Thường)
```
Ngày 1: Đăng 5 sản phẩm → HẾT QUOTA
        Cố đăng thêm → ❌ Báo lỗi "Hết hạn mức"
        
Ngày 2: Reset → Lại được đăng 5 sản phẩm mới
```

### Đại lý VIP
```
Ngày 1: Đăng 10 sản phẩm → OK
        Đăng 20 sản phẩm → OK
        Đăng 100 sản phẩm → OK (Không giới hạn!)
```

---

## 📋 BẢNG QUOTA

| Loại | Hạn mức/ngày | Badge | Nút Admin |
|------|--------------|-------|-----------|
| FREE | 5 sản phẩm | 🆓 Thường | 👑 Nâng Cấp VIP |
| VIP | ∞ Không giới hạn | 👑 VIP | ⬇️ Hạ Xuống Thường |

---

## 🌐 URLS SAU KHI DEPLOY

**Local**:
- Admin Login: `file:///admin-login.html`
- Admin Panel: `file:///admin.html`

**Cloudflare Pages** (sau khi deploy):
- Admin Login: `https://kohkonhbanhang1.pages.dev/admin-login`
- Admin Panel: `https://kohkonhbanhang1.pages.dev/admin`

---

## ⚡ AUTO-REFRESH

Admin Panel tự động cập nhật mỗi **10 giây** để theo dõi real-time:
- Đại lý mới đăng ký
- Sản phẩm mới được đăng
- Quota của từng đại lý

---

## 🔒 BẢO MẬT

### Đổi mật khẩu Admin (Quan trọng!)

**File**: `admin-login.html`

Tìm dòng:
```javascript
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@KohKong2025';
```

Đổi thành:
```javascript
const ADMIN_USERNAME = 'your_admin_name';
const ADMIN_PASSWORD = 'Your_Strong_P@ssw0rd!';
```

### Trong production:
- Lưu credentials trên server
- Dùng JWT token
- Hash password với bcrypt
- Thêm 2FA (Two-Factor Authentication)

---

## 💡 TIPS

1. **Nâng VIP cho đại lý tốt**: Thưởng cho đại lý bán nhiều
2. **Theo dõi quota**: Biết đại lý nào hoạt động mạnh
3. **Xóa spam**: Loại bỏ đại lý đăng sản phẩm không phù hợp
4. **Backup**: Thường xuyên export dữ liệu

---

## 🎁 TÍNH NĂNG NÂNG CAO (Coming Soon)

- [ ] Email thông báo khi đại lý đạt quota
- [ ] Lịch sử nâng/hạ cấp
- [ ] Export báo cáo Excel
- [ ] Gói VIP có thời hạn (30 ngày, 90 ngày)
- [ ] Thanh toán online để nâng VIP tự động
- [ ] Dashboard analytics (biểu đồ, thống kê)

---

## 📞 HỖ TRỢ

Nếu có vấn đề:
1. Kiểm tra Console (F12)
2. Xem log trong terminal (server)
3. Liên hệ qua Telegram Bot

**Admin Panel đã sẵn sàng! 🚀**
