# Hướng Dẫn Kết Nối Domain với Cloudflare

## ✅ HOÀN THÀNH: Code đã push lên GitHub
Repository: https://github.com/aaron110203/kohkonhbanhang1

---

## BƯỚC 1: BẬT GITHUB PAGES

1. Vào repository: https://github.com/aaron110203/kohkonhbanhang1
2. Click **Settings** (⚙️)
3. Sidebar trái → Click **Pages**
4. Tại **Source**:
   - Branch: chọn **main**
   - Folder: chọn **/ (root)**
5. Click **Save**
6. Đợi 1-2 phút, trang sẽ có sẵn tại: `https://aaron110203.github.io/kohkonhbanhang1/landing.html`

---

## BƯỚC 2: THÊM CLOUDFLARE

### A. Thêm site vào Cloudflare:

1. Đăng nhập Cloudflare: https://dash.cloudflare.com
2. Click **Add a Site**
3. Nhập domain của bạn (ví dụ: `yourdomain.com`)
4. Chọn plan **Free** → Click **Continue**
5. Cloudflare sẽ scan DNS records → Click **Continue**

### B. Thay đổi Nameservers:

Cloudflare sẽ cho bạn 2 nameservers, ví dụ:
```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

**Vào nhà cung cấp domain của bạn** (GoDaddy, Namecheap, Google Domains, etc.):
1. Tìm mục **DNS Management** hoặc **Nameservers**
2. Chọn **Custom Nameservers**
3. Thay thế bằng 2 nameservers của Cloudflare
4. Save

⏰ **Chờ 5 phút - 24 giờ** để nameservers cập nhật

---

## BƯỚC 3: CÀI ĐẶT DNS TRÊN CLOUDFLARE

Sau khi Cloudflare active, vào **DNS** → **Records**:

### Thêm 4 A Records cho GitHub Pages:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | @ | 185.199.108.153 | Proxied (🧡) |
| A | @ | 185.199.109.153 | Proxied (🧡) |
| A | @ | 185.199.110.153 | Proxied (🧡) |
| A | @ | 185.199.111.153 | Proxied (🧡) |

### Thêm CNAME cho www:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | www | aaron110203.github.io | Proxied (🧡) |

Click **Save**

---

## BƯỚC 4: CẬP NHẬT FILE CNAME

**File CNAME đã được tạo** với nội dung: `yourdomain.com`

Thay `yourdomain.com` bằng domain thật của bạn, sau đó chạy:

```powershell
git add CNAME
git commit -m "Update CNAME with real domain"
git push origin main
```

---

## BƯỚC 5: CẤU HÌNH GITHUB PAGES VỚI CUSTOM DOMAIN

1. Vào: https://github.com/aaron110203/kohkonhbanhang1/settings/pages
2. Tại **Custom domain**:
   - Nhập domain của bạn (ví dụ: `yourdomain.com`)
   - Click **Save**
3. Tick ✅ **Enforce HTTPS** (sau khi DNS propagate xong)

---

## BƯỚC 6: BẬT SSL/TLS TRÊN CLOUDFLARE

1. Vào Cloudflare → **SSL/TLS**
2. Chọn **Full** hoặc **Full (strict)**
3. Vào **Edge Certificates**:
   - ✅ Always Use HTTPS: **On**
   - ✅ Automatic HTTPS Rewrites: **On**
   - ✅ Minimum TLS Version: **TLS 1.2**

---

## KIỂM TRA WEBSITE

Sau 5-30 phút, truy cập:
- `http://yourdomain.com` → tự động chuyển https
- `https://yourdomain.com` → hiển thị website
- `https://www.yourdomain.com` → hiển thị website

---

## TÓM TẮT NHANH:

✅ Code đã lên GitHub: https://github.com/aaron110203/kohkonhbanhang1
⬜ Bật GitHub Pages (Settings → Pages → Branch: main → Save)
⬜ Thêm domain vào Cloudflare
⬜ Đổi nameservers tại nhà cung cấp domain
⬜ Thêm DNS records (4 A records + 1 CNAME)
⬜ Cập nhật file CNAME với domain thật
⬜ GitHub Settings → Pages → Custom domain
⬜ Cloudflare → SSL/TLS → Full

---

## LƯU Ý:

- GitHub Pages miễn phí cho public repository
- Cloudflare Free plan đã đủ dùng
- SSL/HTTPS hoàn toàn miễn phí
- Website sẽ load nhanh nhờ CDN của Cloudflare

**Domain của bạn là gì?** Để tôi cập nhật file CNAME cho chính xác.
