# 🗄️ MONGODB ATLAS - HƯỚNG DẪN SETUP

## ✅ DATABASE ĐÃ CHUYỂN SANG MONGODB

Dự án đã được chuyển từ Firebase sang **MongoDB Atlas** (miễn phí, dễ dùng hơn).

---

## 🚀 CÁCH TẠO MONGODB ATLAS (MIỄN PHÍ)

### Bước 1: Đăng ký MongoDB Atlas

1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Sign up (có thể dùng Google account)
3. Chọn plan **FREE (M0)** - 512MB storage

### Bước 2: Tạo Cluster

1. Chọn **Cloud Provider**: AWS
2. Chọn **Region**: Singapore (gần VN nhất)
3. **Cluster Name**: `rb-sports-cluster` (hoặc tên bạn muốn)
4. Click **Create Cluster** (đợi 3-5 phút)

### Bước 3: Tạo Database User

1. Sau khi cluster sẵn sàng, vào **Database Access** (menu bên trái)
2. Click **Add New Database User**
3. Chọn **Password** authentication:
   - Username: `rbsports`
   - Password: `rbsports123` (hoặc password mạnh hơn)
   - Database User Privileges: **Read and write to any database**
4. Click **Add User**

### Bước 4: Whitelist IP

1. Vào **Network Access** (menu bên trái)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Hoặc thêm IP của Render.com sau khi deploy
4. Click **Confirm**

### Bước 5: Lấy Connection String

1. Quay lại **Database** (menu bên trái)
2. Click nút **Connect** trên cluster
3. Chọn **Connect your application**
4. Copy **Connection String**:
   ```
   mongodb+srv://rbsports:<password>@rb-sports-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Thay `<password>` bằng password thật** (ví dụ: `rbsports123`)

---

## 🔧 SETUP TRÊN RENDER.COM

### Cách 1: Qua Render Dashboard

1. Mở Render Dashboard: https://dashboard.render.com
2. Chọn service **rb-sports**
3. Tab **Environment**
4. Click **Add Environment Variable**:
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://rbsports:rbsports123@rb-sports-cluster.xxxxx.mongodb.net/rb-sports?retryWrites=true&w=majority
   ```
5. Click **Save Changes**
6. Render sẽ auto-redeploy (~2-3 phút)

### Cách 2: Qua render.yaml

File `render.yaml` đã được cập nhật. Chỉ cần:
1. Add MONGODB_URI vào Environment Variables trên Render Dashboard
2. Deploy!

---

## 📊 CÁCH TRUY CẬP DATABASE

### 1. MongoDB Atlas Console (Web UI)

**URL:** https://cloud.mongodb.com

**Các tab:**
- **Collections** - Xem/sửa data trực tiếp
- **Indexes** - Quản lý indexes
- **Charts** - Visualize data
- **Metrics** - Monitor performance

**Cấu trúc collections:**
```
rb-sports (database)
└── orders (collection)
    ├── Document 1
    │   ├── orderId: "ORD-1738329600000"
    │   ├── customerName: "Nguyễn Văn A"
    │   ├── customerPhone: "0901234567"
    │   ├── items: [...]
    │   ├── total: 75000
    │   ├── status: "pending"
    │   ├── createdAt: "2026-01-31T..."
    │   └── updatedAt: "2026-01-31T..."
    └── Document 2
        └── ...
```

### 2. Admin Panel (Website)

**URL:** https://rb-sports.onrender.com/admin

**Tính năng:**
- Xem tất cả đơn hàng real-time
- Cập nhật trạng thái (pending → confirmed → shipped → completed)
- Xóa đơn hàng
- Thống kê: Tổng đơn, Doanh thu, Chờ xử lý, Hoàn thành

### 3. REST API

#### GET - Tất cả đơn hàng
```bash
curl https://rb-sports.onrender.com/api/admin/orders
```

#### POST - Tạo đơn mới
```bash
curl -X POST https://rb-sports.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerPhone": "0901234567",
    "customerEmail": "test@email.com",
    "customerAddress": "123 Street",
    "items": [...],
    "subtotal": 45000,
    "shipping": 30000,
    "total": 75000,
    "paymentMethod": "cod"
  }'
```

#### PUT - Cập nhật trạng thái
```bash
curl -X PUT https://rb-sports.onrender.com/api/admin/orders/ORD-1738329600000 \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

#### DELETE - Xóa đơn
```bash
curl -X DELETE https://rb-sports.onrender.com/api/admin/orders/ORD-1738329600000
```

### 4. MongoDB Compass (Desktop App)

**Download:** https://www.mongodb.com/try/download/compass

**Connection String:**
```
mongodb+srv://rbsports:rbsports123@rb-sports-cluster.xxxxx.mongodb.net/rb-sports
```

**Tính năng:**
- GUI đẹp để xem/sửa data
- Query builder
- Import/Export data
- Schema analysis

---

## 🔐 BẢO MẬT

### Network Access
- Nên chỉ cho phép IP của Render.com thay vì 0.0.0.0/0
- Lấy IP của Render service và thêm vào whitelist

### Database User
- Dùng password mạnh
- Tạo user riêng cho mỗi môi trường (dev/prod)
- Chỉ cấp quyền cần thiết

### Connection String
- **KHÔNG BAO GIỜ** commit connection string vào Git
- Dùng Environment Variables
- File `.env` đã được thêm vào `.gitignore`

---

## 📈 UU ĐIỂM MONGODB VS FIREBASE

| Feature | MongoDB Atlas | Firebase Realtime DB |
|---------|---------------|----------------------|
| **Free Tier** | 512MB | 1GB |
| **Queries** | Flexible (MongoDB query) | Limited (JSON tree) |
| **Indexes** | Full support | Limited |
| **Backup** | Automatic | Manual |
| **Analytics** | Built-in charts | Requires export |
| **Schema** | Flexible (NoSQL) | JSON only |
| **Admin UI** | Excellent (Compass) | Basic |

---

## 🧪 TEST DATABASE

### Test 1: Tạo đơn hàng từ website
1. Mở: https://rb-sports.onrender.com/products
2. Thêm sản phẩm → Checkout → Đặt hàng
3. Vào MongoDB Atlas Console → Collections
4. Sẽ thấy document mới trong collection `orders`!

### Test 2: Kiểm tra Admin Panel
1. Mở: https://rb-sports.onrender.com/admin
2. Nhập password
3. Sẽ thấy đơn hàng vừa tạo
4. Thử cập nhật trạng thái → MongoDB sẽ update real-time!

### Test 3: Check API
```bash
# Xem tất cả orders
curl https://rb-sports.onrender.com/api/admin/orders

# Nếu response là {"success":true,"data":[...]} → MongoDB đang hoạt động!
```

---

## ⚠️ LƯU Ý

### Nếu không setup MongoDB:
- Server vẫn chạy bình thường
- Data lưu trong memory (RAM)
- ❌ **Mất data khi restart server**

### Khi deploy lên Render:
- **PHẢI** thêm MONGODB_URI vào Environment Variables
- Không thêm thì data sẽ mất mỗi lần redeploy

---

## 📞 TROUBLESHOOTING

**Connection timeout?**
- Check Network Access whitelist
- Verify connection string đúng format
- Thử ping cluster từ terminal

**Authentication failed?**
- Check username/password
- Đảm bảo database user được tạo đúng
- Password không có ký tự đặc biệt cần encode

**Data không xuất hiện?**
- Check Environment Variable trên Render
- Xem logs: Render Dashboard → Logs tab
- Verify MONGODB_URI đúng

---

## 🎉 KẾT LUẬN

**Database đã SẴNSÀNG!**

Chỉ cần:
1. Tạo MongoDB Atlas cluster (5 phút)
2. Lấy connection string
3. Add vào Render Environment Variables
4. Deploy!

**MongoDB Atlas Console:** https://cloud.mongodb.com  
**Admin Panel:** https://rb-sports.onrender.com/admin

Good luck! 🚀
