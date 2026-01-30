# R&B Sports - Deployment Guide

## 📋 Tóm tắt dự án

**R&B Sports** là website tin tức thể thao + bán hàng Red Bull với:
- Backend: Node.js + Express
- Database: Firebase Realtime Database (hoặc in-memory fallback)
- Frontend: HTML/CSS/JavaScript thuần
- Features: RSS News Aggregator, Live Scores (ESPN API), E-commerce

## 🚀 Phương án Deploy MIỄN PHÍ

### ✅ **KHUYẾN NGHỊ: Render.com** (Free Tier)

**Ưu điểm:**
- ✓ Hoàn toàn miễn phí cho web service
- ✓ Tự động deploy từ Git
- ✓ SSL/HTTPS tự động
- ✓ Hỗ trợ Node.js native
- ✓ 750 giờ/tháng (đủ chạy 24/7)
- ✓ Domain miễn phí: `your-app.onrender.com`

**Hạn chế:**
- Ngủ sau 15 phút không hoạt động (cold start ~30s)
- 512MB RAM

**Cách deploy:**
1. Push code lên GitHub
2. Tạo tài khoản Render.com
3. New Web Service → Connect GitHub repo
4. Build: `npm install`
5. Start: `npm start`
6. Deploy!

---

### 🔥 **LỰA CHỌN 2: Railway.app** (Free $5/tháng credit)

**Ưu điểm:**
- ✓ $5 credit miễn phí/tháng
- ✓ Không ngủ (always-on)
- ✓ Deploy cực nhanh
- ✓ 1GB RAM
- ✓ Postgres/Redis built-in

**Hạn chế:**
- Credit có thể hết nếu traffic cao
- Cần verify bằng card (không charge)

---

### ⚡ **LỰA CHỌN 3: Vercel** (Best cho Frontend)

**Ưu điểm:**
- ✓ Serverless functions cho API
- ✓ CDN toàn cầu cực nhanh
- ✓ Zero config
- ✓ Domain + SSL miễn phí

**Hạn chế:**
- Serverless có timeout 10s
- RSS fetching có thể bị timeout
- Cần refactor thành Serverless Functions

**Giải pháp:**
- Frontend trên Vercel
- Backend APIs trên Render
- Tách làm 2 services

---

### 🌐 **LỰA CHỌN 4: Netlify** (Tương tự Vercel)

**Ưu điểm:**
- ✓ Netlify Functions (AWS Lambda)
- ✓ 125k requests/tháng
- ✓ Form handling built-in

**Hạn chế:**
- Giống Vercel (timeout issues)

---

### 📦 **LỰA CHỌN 5: Fly.io** (Free 3 VMs)

**Ưu điểm:**
- ✓ 3 shared VMs miễn phí
- ✓ 160GB bandwidth/tháng
- ✓ Gần Việt Nam (Singapore region)

**Hạn chế:**
- Setup phức tạp hơn

---

## 🎯 **QUYẾT ĐỊNH CUỐI CÙNG**

### Cho dự án này: **RENDER.COM**

**Lý do:**
1. ✅ Dễ deploy nhất (3 clicks)
2. ✅ Phù hợp với Node.js backend
3. ✅ RSS fetching không bị giới hạn timeout
4. ✅ Hoàn toàn miễn phí
5. ✅ Always-on option có thể upgrade sau

**Cold start fix:**
- Dùng cron-job.org gọi API mỗi 10 phút để giữ app awake

---

## 🔧 Setup cho Render

### 1. Chuẩn bị code

Tạo file `render.yaml`:

```yaml
services:
  - type: web
    name: rb-sports
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

### 2. Environment Variables trên Render

```
NODE_ENV=production
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### 3. Deploy Steps

```bash
# 1. Init git (nếu chưa có)
git init
git add .
git commit -m "Initial commit"

# 2. Push lên GitHub
gh repo create rb-sports --public
git remote add origin https://github.com/YOUR_USERNAME/rb-sports.git
git push -u origin main

# 3. Vào Render.com
- New Web Service
- Connect GitHub repo
- Build: npm install
- Start: npm start
- Deploy!
```

---

## 🗄️ Firebase Setup (cho Database)

### Free Tier Limits:
- ✅ 1GB storage
- ✅ 10GB/month bandwidth
- ✅ 100 simultaneous connections

### Setup:
1. Vào console.firebase.google.com
2. Create project → "rb-sports"
3. Realtime Database → Create
4. Rules → Cho phép admin write

```json
{
  "rules": {
    "orders": {
      ".read": false,
      ".write": false
    }
  }
}
```

5. Download service account JSON
6. Paste vào `firebase-service-account.json`
7. Hoặc dùng environment variables trên Render

---

## ⚡ Performance Optimization

### Cache Strategy:
- RSS: Cache 5 phút
- Scores: Cache 15 phút
- Products: Static (no cache needed)

### Monitoring:
- Render có built-in logs & metrics
- UptimeRobot.com (miễn phí) để monitor uptime

---

## 💰 Chi phí dự kiến

| Service | Tier | Chi phí |
|---------|------|---------|
| Render Web Service | Free | $0/tháng |
| Firebase Realtime DB | Spark | $0/tháng |
| Domain (optional) | - | ~$10/năm |
| **TỔNG** | | **$0/tháng** |

---

## 🚀 Next Steps

1. ✅ Push code lên GitHub
2. ✅ Setup Firebase (10 phút)
3. ✅ Deploy trên Render (5 phút)
4. ✅ Test production
5. ⚡ (Optional) Mua domain riêng
6. ⚡ (Optional) Setup cron job keep-alive

**Expected deployment time: 15-20 phút**

---

## 📞 Sau khi deploy

- URL: `https://rb-sports.onrender.com`
- Admin: `https://rb-sports.onrender.com/admin`
- API: `https://rb-sports.onrender.com/api/*`
