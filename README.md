# 🏆 R&B Sports - Website Tin Tức Thể Thao & Phân Phối Red Bull

## 📋 Tổng quan

Website kết hợp tin tức thể thao real-time từ 100+ nguồn RSS uy tín và bán hàng sản phẩm Red Bull.

**Stack:**
- Backend: Node.js + Express
- Database: Firebase Realtime Database (fallback: in-memory)
- Frontend: HTML/CSS/JavaScript
- APIs: RSS Parser, ESPN API

## ✨ Tính năng

### 🔥 Đã hoàn thành

✅ **Tin tức thể thao** - 1,700+ bài từ 100+ nguồn RSS
✅ **Tỉ số trực tiếp** - ESPN API (NBA, Premier League, La Liga, etc.)
✅ **E-commerce** - Giỏ hàng, thanh toán Red Bull
✅ **Quản trị đơn hàng** - Admin page đơn giản, hiệu quả
✅ **Real-time database** - Firebase integration
✅ **Responsive design** - Mobile-friendly
✅ **SEO ready** - Meta tags, sitemap
✅ **Analytics ready** - Google Analytics 4 placeholder

## 🚀 Cài đặt & Chạy

### Local Development

```bash
# 1. Clone repository
git clone <your-repo-url>
cd "R&B"

# 2. Cài đặt dependencies
npm install

# 3. (Optional) Cấu hình Firebase
# Đổi tên firebase-service-account.json và điền thông tin

# 4. Chạy server
npm start

# Server chạy tại http://localhost:3000
```

### Cấu trúc thư mục

```
R&B/
├── server.js                      # Express server + APIs
├── package.json                   # Dependencies
├── firebase-service-account.json  # Firebase credentials (optional)
├── redbull-products.json          # Dữ liệu sản phẩm
├── public/
│   ├── index.html                 # Trang chủ
│   ├── news.html                  # Trang tin tức
│   ├── products.html              # Trang sản phẩm
│   ├── cart.html                  # Giỏ hàng
│   ├── checkout.html              # Thanh toán
│   ├── admin.html                 # ⭐ Quản trị đơn hàng (MỚI)
│   ├── css/style.css              # Styles
│   └── js/app.js                  # Frontend logic
├── deploy.bat                     # Deploy script (Windows)
├── deploy.sh                      # Deploy script (Linux/Mac)
└── DEPLOYMENT.md                  # Hướng dẫn deploy chi tiết
```

## 🛠️ Admin Panel

**URL:** `/admin`

**Chức năng:**
- ✅ Xem tất cả đơn hàng
- ✅ Cập nhật trạng thái (pending → confirmed → shipped → completed)
- ✅ Xóa đơn hàng
- ✅ Thống kê real-time (tổng đơn, doanh thu, etc.)
- ✅ Auto-refresh mỗi 30 giây

**Screenshot:**
```
┌─────────────────────────────────────────┐
│  🛒 Quản Lý Đơn Hàng                    │
│                                         │
│  [0 Tổng] [0 Chờ] [0 Hoàn thành] [0đ]  │
│                                         │
│  📦 Danh sách đơn hàng                  │
│  ┌───────────────────────────────────┐  │
│  │ Mã đơn │ Khách │ SĐT │ Trạng thái │  │
│  └───────────────────────────────────┘  │
│      Chưa có đơn hàng                   │
└─────────────────────────────────────────┘
```

## 📡 API Endpoints

### Public APIs

```
GET  /api/news              # Tin tức (pagination, filter)
GET  /api/scores            # Tỉ số trận đấu
GET  /api/products          # Danh sách sản phẩm
GET  /api/products/:slug    # Chi tiết sản phẩm
POST /api/orders            # Tạo đơn hàng
```

### Admin APIs (Mới)

```
GET    /api/admin/orders        # Danh sách đơn hàng
PUT    /api/admin/orders/:id    # Cập nhật trạng thái
DELETE /api/admin/orders/:id    # Xóa đơn hàng
```

## 🔥 Firebase Setup (Optional)

1. Tạo project tại [Firebase Console](https://console.firebase.google.com)
2. Bật Realtime Database
3. Download Service Account JSON
4. Paste vào `firebase-service-account.json`
5. Restart server

**Lợi ích:**
- ✅ Lưu đơn hàng persistent (không mất khi restart)
- ✅ Real-time sync
- ✅ Miễn phí (Spark plan: 1GB storage, 10GB bandwidth)

**Nếu không dùng Firebase:**
- Server vẫn chạy bình thường
- Đơn hàng lưu trong memory (mất khi restart)

## 🌐 Deployment

### ⚡ Khuyến nghị: Render.com (Miễn phí)

```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

**Hoặc thủ công:**
1. Push code lên GitHub
2. Vào [render.com](https://render.com) → New Web Service
3. Connect GitHub repo
4. Build: `npm install`
5. Start: `npm start`
6. Deploy!

**Live URL:** `https://your-app.onrender.com`

### Chi tiết deployment

Xem [DEPLOYMENT.md](DEPLOYMENT.md) để biết:
- 5 phương án deploy miễn phí
- So sánh ưu/nhược điểm
- Hướng dẫn chi tiết từng bước
- Environment variables setup
- Domain configuration

## 📊 Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 4.18 |
| Database | Firebase Realtime DB |
| RSS Parser | rss-parser 3.13 |
| HTTP Client | node-fetch 2.7 |
| Frontend | Vanilla JS + CSS3 |
| Deployment | Render / Vercel / Railway |

## 🔐 Security

- ✅ Firebase admin-only writes
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling
- ⚠️ TODO: Add authentication cho /admin

## 📈 Performance

- ✅ RSS cache: 5 phút
- ✅ Scores cache: 15 phút
- ✅ Static assets: Browser cache
- ✅ Lazy loading images
- ✅ Minified CSS/JS

## 🐛 Troubleshooting

### Server tự tắt sau khi fetch RSS
**Nguyên nhân:** Terminal behavior trong VS Code
**Giải pháp:** Deploy lên Render/Railway, server sẽ chạy ổn định

### Firebase không kết nối
**Kiểm tra:**
1. File `firebase-service-account.json` có đúng format?
2. Project ID trong file có khớp với Firebase Console?
3. Realtime Database đã được enable?

### RSS feeds lỗi 403/404
**Bình thường!** Một số feed bị chặn/ngừng hoạt động
- Vẫn có 1,700+ tin từ các nguồn khác
- Server tự động bỏ qua feed lỗi

## 📝 Changelog

### v2.0 - 30/01/2026
- ✅ Đơn giản hóa admin panel (chỉ quản lý đơn hàng)
- ✅ Tích hợp Firebase Realtime Database
- ✅ Chuẩn bị deployment scripts
- ✅ Cải thiện UI admin page
- ✅ Auto-refresh orders

### v1.0 - Initial Release
- Tin tức thể thao từ RSS
- Tỉ số từ ESPN API
- E-commerce Red Bull
- Basic admin panel

## 🤝 Contributing

1. Fork repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

ISC

## 👤 Author

**R&B Sports Team**
- Website: Coming soon
- Admin: `/admin`

## 🎯 Next Steps

**Gợi ý cải tiến:**
1. ⚡ Authentication cho /admin (JWT, Google OAuth)
2. ⚡ Email notifications cho đơn hàng mới
3. ⚡ Export orders to Excel
4. ⚡ Payment gateway integration (MoMo, ZaloPay)
5. ⚡ Customer portal để tracking đơn hàng
6. ⚡ Push notifications

---

**Ready to deploy?** Chạy `deploy.bat` (Windows) hoặc `deploy.sh` (Linux/Mac)

**Questions?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide!
