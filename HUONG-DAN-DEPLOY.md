# 🚀 HƯỚNG DẪN DEPLOY SERVER LÊN RENDER.COM

## ⚠️ QUAN TRỌNG: Phải deploy server để các tính năng hoạt động!

Các tính năng sau **CHƯA HOẠT ĐỘNG** cho đến khi bạn deploy server:
- ✅ Nâng cấp VIP đại lý
- ✅ Auto-logout khi admin xóa tài khoản
- ✅ Chặn IP vĩnh viễn khi xóa tài khoản
- ✅ Thông báo Telegram cho admin khi IP bị chặn
- ✅ Hiển thị IP và ngày đăng ký trong bảng admin
- ✅ Quản lý IP bị chặn (chặn/mở)

---

## 📋 CÁC BƯỚC DEPLOY

### **CÁCH 1: Deploy Tự Động (Nếu đã setup GitHub Integration)**

1. Code đã được push lên GitHub ✅
2. Render.com sẽ tự động detect thay đổi
3. Đợi 2-5 phút để Render rebuild server
4. Kiểm tra status tại: https://dashboard.render.com

---

### **CÁCH 2: Deploy Thủ Công (Manual Deploy)**

#### Bước 1: Đăng nhập Render.com
- Vào: https://dashboard.render.com
- Đăng nhập bằng tài khoản GitHub của bạn

#### Bước 2: Tìm Service
- Tìm service tên: `kohkonhbanhang1`
- Hoặc vào direct link: https://dashboard.render.com/web/srv-YOUR_SERVICE_ID

#### Bước 3: Deploy
1. Click nút **"Manual Deploy"** (góc trên bên phải)
2. Chọn **"Deploy latest commit"**
3. Đợi quá trình build (2-5 phút)
4. Kiểm tra **Logs** để xem deploy thành công

#### Bước 4: Xác Nhận Deploy Thành Công
- Logs hiển thị: ✅ Server đang chạy tại http://localhost:3000
- Logs hiển thị: ✅ Telegram Bot @KohKongShopBot_bot đang hoạt động
- Status: **Live** (màu xanh)

---

## 🧪 KIỂM TRA SAU KHI DEPLOY

### 1️⃣ Kiểm tra server đang chạy
```powershell
Invoke-RestMethod -Uri "https://kohkonhbanhang1.onrender.com/api/agents" -Method Get
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "agents": [...]
}
```

### 2️⃣ Kiểm tra Blocked IPs API
```powershell
Invoke-RestMethod -Uri "https://kohkonhbanhang1.onrender.com/api/blocked-ips" -Method Get
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "blockedIPs": [],
  "total": 0
}
```

### 3️⃣ Test chức năng
1. **Vào Admin Panel:** https://taphoakohkong.live/admin.html
2. **Đăng nhập admin**
3. **Kiểm tra:**
   - Bảng đại lý có cột "IP Address", "Ngày Đăng Ký", "Lần Đăng Nhập Cuối"
   - Nút "👑 Nâng Cấp VIP" hoạt động
   - Nút "🚫 Chặn IP" hiển thị
   - Bảng "🚫 Quản Lý IP Bị Chặn" hiển thị

4. **Test xóa tài khoản:**
   - Xóa 1 tài khoản đại lý
   - Kiểm tra xem IP có xuất hiện trong bảng "IP Bị Chặn"
   - Đại lý bị đăng xuất tự động
   - Thử đăng nhập lại → Phải báo lỗi "Tài khoản bị khóa"

5. **Test Telegram notification:**
   - Xóa 1 tài khoản
   - Kiểm tra Telegram group `-5018289214`
   - Phải nhận được thông báo HTML với thông tin IP bị chặn

---

## 🔍 XỬ LÝ LỖI

### Lỗi: Deploy Failed
**Nguyên nhân:** Syntax error hoặc missing dependencies

**Giải pháp:**
1. Kiểm tra Logs trong Render Dashboard
2. Tìm dòng lỗi (thường có từ khóa `Error:` hoặc `Failed`)
3. Sửa lỗi trong code
4. Commit và push lại:
```powershell
cd "d:\làm web bằng đc"
git add -A
git commit -m "Fix deploy error"
git push origin main
```

### Lỗi: Server running nhưng features không hoạt động
**Nguyên nhân:** Server cũ vẫn đang chạy, chưa restart

**Giải pháp:**
1. Vào Render Dashboard
2. Click **Settings** → **Restart Service**
3. Đợi server restart (1-2 phút)

### Lỗi: Telegram notifications không gửi
**Nguyên nhân:** ADMIN_GROUP_ID sai hoặc bot chưa được add vào group

**Giải pháp:**
1. Kiểm tra bot `@KohKongShopBot_bot` đã trong group `-5018289214`
2. Bot phải là admin của group
3. Kiểm tra logs có dòng: `📨 Admin notification sent`

---

## 📊 MONITORING

### Kiểm tra Server Status
- Dashboard: https://dashboard.render.com/web/srv-YOUR_SERVICE_ID
- Logs: Click tab "Logs" để xem real-time logs
- Metrics: Click tab "Metrics" để xem CPU/Memory usage

### Auto-Ping
Server có auto-ping mỗi 10 phút để tránh sleep:
```javascript
// 🔄 AUTO PING: Giữ server luôn hoạt động
setInterval(() => {
  fetch('https://kohkonhbanhang1.onrender.com')
}, 10 * 60 * 1000); // Ping mỗi 10 phút
```

---

## 🎯 CHECKLIST SAU KHI DEPLOY

- [ ] Server status: **Live** (màu xanh)
- [ ] Logs không có error
- [ ] API `/api/agents` hoạt động
- [ ] API `/api/blocked-ips` hoạt động
- [ ] Admin panel hiển thị đầy đủ cột IP và dates
- [ ] Nút "Nâng Cấp VIP" hoạt động
- [ ] Nút "Chặn IP" hoạt động
- [ ] Xóa tài khoản → IP bị chặn
- [ ] Xóa tài khoản → Telegram notification gửi
- [ ] Đại lý bị chặn không thể đăng nhập lại
- [ ] Bảng "Quản Lý IP Bị Chặn" hoạt động

---

## 🆘 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra Logs trong Render Dashboard
2. Kiểm tra Browser Console (F12) trong admin panel
3. Test API endpoints bằng Postman hoặc PowerShell
4. Kiểm tra GitHub repo đã có code mới nhất

---

## 📝 GHI CHÚ

- **Frontend (GitHub Pages):** Auto-deploy khi push code
- **Backend (Render.com):** Cần manual deploy hoặc setup auto-deploy
- **Database:** In-memory (restart server = mất data)
- **Telegram Bot:** Luôn chạy 24/7 trên Render

---

✅ **Sau khi deploy thành công, tất cả tính năng sẽ hoạt động bình thường!**
