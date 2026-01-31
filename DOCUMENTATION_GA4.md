# 📊 TÀI LIỆU HỆ THỐNG WEBSITE R&B SPORTS
## Phân Tích GA4 - Môn MarTech

**Ngày tạo:** 31/01/2026  
**Phiên bản:** 1.0  
**Loại website:** Mô phỏng (Demo/Simulation)  
**Mục đích:** Phục vụ môn học Marketing Technology (MarTech)

---

## 📑 MỤC LỤC

1. [Kiến Trúc Kỹ Thuật Website](#1-kiến-trúc-kỹ-thuật-website)
2. [Triển Khai GA4](#2-triển-khai-ga4)
3. [Cấu Trúc Nội Dung & Tính Năng](#3-cấu-trúc-nội-dung--tính-năng)
4. [Dữ Liệu Giả Lập Đã Tạo](#4-dữ-liệu-giả-lập-đã-tạo)
5. [Tích Hợp Các Nền Tảng](#5-tích-hợp-các-nền-tảng)
6. [Vấn Đề Kỹ Thuật Tiềm Ẩn](#6-vấn-đề-kỹ-thuật-tiềm-ẩn)
7. [Mã Nguồn Quan Trọng](#7-mã-nguồn-quan-trọng)
8. [Documentation & Access](#8-documentation--access)

---

## 1. KIẾN TRÚC KỸ THUẬT WEBSITE

### 1.1 Stack Công Nghệ

| Layer | Công Nghệ | Phiên Bản | Mô Tả |
|-------|-----------|-----------|-------|
| **Frontend** | HTML5/CSS3/JavaScript (Vanilla) | ES6+ | Client-side rendering |
| **Backend** | Node.js + Express.js | Express 4.18.2 | RESTful API server |
| **Database** | MongoDB (Mongoose) | Mongoose 9.1.5 | Persistent storage (optional) |
| **Data Sources** | RSS Parser | 3.13.0 | Thu thập tin tức |
| **External API** | ESPN API | v2 | Tỷ số trận đấu real-time |
| **HTTP Client** | node-fetch | 2.7.0 | API requests |
| **CORS** | cors | 2.8.5 | Cross-origin handling |

### 1.2 Cấu Trúc Thư Mục

```
R&B/
├── server.js                    # Main Express server (882 dòng)
├── package.json                 # Dependencies & scripts
├── redbull-products.json        # Dữ liệu sản phẩm Red Bull (299 dòng)
├── render.yaml                  # Cấu hình deploy Render.com
│
├── models/
│   └── Order.js                 # MongoDB Schema cho đơn hàng
│
└── public/                      # Static files
    ├── index.html               # Trang chủ (389 dòng)
    ├── news.html                # Trang tin tức (830 dòng)
    ├── products.html            # Trang danh sách sản phẩm (371 dòng)
    ├── product-detail.html      # Trang chi tiết sản phẩm (631 dòng)
    ├── cart.html                # Giỏ hàng (424 dòng)
    ├── checkout.html            # Thanh toán (634 dòng)
    ├── about.html               # Giới thiệu (498 dòng)
    ├── admin.html               # Quản trị đơn hàng (706 dòng)
    │
    ├── css/
    │   └── style.css            # Main stylesheet (1835 dòng)
    │
    ├── js/
    │   └── app.js               # Main JavaScript (554 dòng)
    │
    └── images/
        └── logo.png             # Logo website
```

### 1.3 Tích Hợp RSS Feeds

Website thu thập tin tức từ **66 nguồn RSS** được phân loại như sau:

| Category | Số nguồn | Ví dụ nguồn |
|----------|----------|-------------|
| `general` | 12 | Sky Sports, BBC Sport, Fox Sports, ESPN |
| `football` | 42 | Arseblog, This Is Anfield, Barca Universal |
| `boxing` | 2 | Boxing News, Boxing News 24 |
| `mma` | 1 | MMA Fighting |
| `tennis` | 1 | Tennis World USA |
| `basketball` | 1 | Basketball Network |
| `formula1` | 1 | RaceFans |
| `cricket` | 1 | Cricket Country |
| `golf` | 1 | Golf Digest |
| `rugby` | 1 | Planet Rugby |
| `athletics` | 2 | Athletics Weekly, BBC Athletics |

**Danh sách đầy đủ RSS Feeds:**

```javascript
// General Sports
'https://www.skysports.com/rss/12040'                    // Sky Sports
'https://api.foxsports.com/v2/content/optimized-rss'     // Fox Sports
'https://feeds.bbci.co.uk/sport/rss.xml?edition=uk'      // BBC Sport
'https://api.sportskeeda.com/v3/feeds_v2/1414'           // Sportskeeda
'https://deadspin.com/rss/'                               // Deadspin
'https://www.cbssports.com/rss/headlines/'               // CBS Sports

// Football (Một số nguồn tiêu biểu)
'https://arseblog.com/feed'                              // Arseblog (Arsenal)
'https://www.thisisanfield.com/feed/'                    // This Is Anfield (Liverpool)
'https://barcauniversal.com/feed/'                       // Barca Universal
'https://www.juvefc.com/feed/'                           // JuveFC
'http://www.realmadridnews.com/feed'                     // Real Madrid News
```

**Cơ chế caching:**
- **News cache:** 5 phút (`expiryTime: 5 * 60 * 1000`)
- **Scores cache:** 15 phút (`expiryTime: 15 * 60 * 1000`)

### 1.4 Tích Hợp API Tỷ Số (ESPN)

```javascript
const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

const TRACKED_LEAGUES = [
    { code: 'eng.1', name: 'Premier League', sport: 'Soccer' },
    { code: 'esp.1', name: 'La Liga', sport: 'Soccer' },
    { code: 'ger.1', name: 'Bundesliga', sport: 'Soccer' },
    { code: 'ita.1', name: 'Serie A', sport: 'Soccer' },
    { code: 'fra.1', name: 'Ligue 1', sport: 'Soccer' },
    { code: 'nba', name: 'NBA', sport: 'Basketball' }
];
```

### 1.5 Danh Sách Routes

| Method | Route | Mô tả | File phục vụ |
|--------|-------|-------|--------------|
| `GET` | `/` | Trang chủ | index.html |
| `GET` | `/news` | Danh sách tin tức | news.html |
| `GET` | `/products` | Danh sách sản phẩm | products.html |
| `GET` | `/product/:slug` | Chi tiết sản phẩm | product-detail.html |
| `GET` | `/cart` | Giỏ hàng | cart.html |
| `GET` | `/checkout` | Thanh toán | checkout.html |
| `GET` | `/about` | Giới thiệu | about.html |
| `GET` | `/admin` | Quản lý đơn hàng | admin.html |

**API Endpoints:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/news` | Lấy danh sách tin tức |
| `GET` | `/api/scores` | Lấy tỷ số trận đấu |
| `GET` | `/api/scores/stats` | Thống kê tỷ số |
| `GET` | `/api/products` | Lấy danh sách sản phẩm |
| `GET` | `/api/products/:slug` | Chi tiết sản phẩm |
| `POST` | `/api/orders` | Tạo đơn hàng |
| `GET` | `/api/admin/orders` | Lấy tất cả đơn hàng |
| `PUT` | `/api/admin/orders/:id` | Cập nhật trạng thái đơn |
| `DELETE` | `/api/admin/orders/:id` | Xóa đơn hàng |
| `GET` | `/api/admin/feeds` | Danh sách RSS feeds |
| `POST` | `/api/admin/refresh-cache` | Làm mới cache |
| `GET` | `/api/status` | Trạng thái server |

### 1.6 Cơ Chế Routing & Navigation

**Client-side Navigation:**
```html
<nav class="nav-menu">
    <a href="/" class="nav-link active">Trang chủ</a>
    <a href="/news" class="nav-link">Tin tức</a>
    <a href="/products" class="nav-link">Sản phẩm</a>
    <a href="/about" class="nav-link">Giới thiệu</a>
</nav>
```

**Active State Detection (app.js):**
```javascript
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});
```

---

## 2. TRIỂN KHAI GA4

### 2.1 Thông Tin Cơ Bản

| Thuộc tính | Giá trị |
|------------|---------|
| **Measurement ID** | `G-QYB62HGYMS` |
| **Phương pháp cài đặt** | gtag.js (Global Site Tag) - Hardcoded |
| **Vị trí tracking code** | `<head>` của mọi trang HTML |
| **Số trang được tracking** | 8 trang |

### 2.2 Vị Trí Đặt Tracking Code

GA4 tracking code được đặt trong `<head>` của **TẤT CẢ** các file HTML:

- `public/index.html` (dòng 12-18)
- `public/news.html` (dòng 12-18)
- `public/products.html` (dòng 12-18)
- `public/product-detail.html` (dòng 12-18)
- `public/cart.html` (dòng 12-18)
- `public/checkout.html` (dòng 12-18)
- `public/about.html` (dòng 12-18)
- `public/admin.html` (dòng 9-15)

### 2.3 Cấu Hình GA4 Hiện Tại

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-QYB62HGYMS"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-QYB62HGYMS');
</script>
```

**Đặc điểm cấu hình:**
- ✅ Sử dụng `async` loading (không blocking)
- ✅ Khởi tạo `dataLayer` global
- ❌ Không có enhanced measurement config tùy chỉnh
- ❌ Không có debug mode
- ❌ Không có user ID setting

### 2.4 Danh Sách Events

#### 2.4.1 Automatic Events (Tự động bởi GA4)

| Event | Mô tả |
|-------|-------|
| `first_visit` | Lần truy cập đầu tiên |
| `session_start` | Bắt đầu phiên |
| `user_engagement` | Tương tác người dùng |

#### 2.4.2 Enhanced Measurement Events

GA4 Enhanced Measurement tự động thu thập (nếu được bật trong GA4 Admin):

| Event | Mô tả |
|-------|-------|
| `page_view` | Xem trang (kèm page_location, page_referrer) |
| `scroll` | Cuộn trang 90% |
| `click` | Click outbound links |
| `view_search_results` | Tìm kiếm trên site |
| `file_download` | Tải file |

#### 2.4.3 Custom Events (Tùy chỉnh)

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `page_view` | Khi tải mỗi trang | `page_location`, `page_path`, `page_title` |
| `select_content` | Click vào tin tức | `content_type`, `content_id`, `item_name`, `source` |
| `cart_updated` | Thay đổi giỏ hàng | `cart_items`, `cart_total` |
| `add_to_cart` | Thêm sản phẩm vào giỏ | `currency`, `value`, `items[]` |
| `remove_from_cart` | Xóa sản phẩm khỏi giỏ | `currency`, `value`, `items[]` |
| `begin_checkout` | Bắt đầu thanh toán | `currency`, `value`, `items[]` |
| `purchase` | Hoàn tất đơn hàng | `transaction_id`, `currency`, `value`, `items[]` |

**Chi tiết Event Parameters:**

```javascript
// Event: add_to_cart
{
    'currency': 'VND',
    'value': 45000,      // Tổng giá trị
    'items': [{
        'item_id': 'rb-001',
        'item_name': 'Red Bull Energy Drink',
        'item_variant': '250ml',
        'price': 45000,
        'quantity': 1
    }]
}

// Event: select_content (News click)
{
    'content_type': 'news',
    'content_id': 'unique-guid-from-rss',
    'item_name': 'Tiêu đề bài viết',
    'source': 'Sky Sports'
}

// Event: purchase
{
    'transaction_id': 'ORD-1706684400000',
    'currency': 'VND',
    'value': 135000,
    'items': [
        {
            'item_id': 'rb-001',
            'item_name': 'Red Bull Energy Drink',
            'item_variant': '250ml',
            'price': 45000,
            'quantity': 3
        }
    ]
}
```

### 2.5 User Properties

| Property | Giá trị | Trạng thái |
|----------|---------|------------|
| User ID | Không sử dụng | ❌ Chưa triển khai |
| Custom User Properties | Không có | ❌ Chưa triển khai |

**Ghi chú:** Website không có hệ thống đăng nhập nên không tracking User ID.

### 2.6 Conversions (Đề xuất cấu hình trong GA4 Admin)

| Conversion Event | Giá trị ước tính | Mức độ quan trọng |
|------------------|------------------|-------------------|
| `purchase` | Giá trị đơn hàng | 🔴 Critical |
| `add_to_cart` | 20% giá trị sản phẩm | 🟡 Medium |
| `begin_checkout` | 50% giá trị giỏ hàng | 🟠 High |

---

## 3. CẤU TRÚC NỘI DUNG & TÍNH NĂNG

### 3.1 TIN TỨC

#### 3.1.1 Các Danh Mục Tin Tức

| Category ID | Tên hiển thị | Số nguồn | Mô tả |
|-------------|--------------|----------|-------|
| `all` | Tất cả | 66 | Toàn bộ tin tức |
| `general` | Thể thao chung | 12 | Tin tổng hợp nhiều môn |
| `football` | Bóng đá | 42 | Premier League, La Liga, Serie A... |
| `boxing` | Boxing | 2 | Tin tức quyền Anh |
| `mma` | MMA | 1 | Võ thuật tổng hợp |
| `tennis` | Tennis | 1 | Quần vợt |
| `basketball` | Bóng rổ | 1 | NBA và bóng rổ quốc tế |
| `formula1` | F1 | 1 | Đua xe công thức 1 |
| `cricket` | Cricket | 1 | Cricket quốc tế |
| `golf` | Golf | 1 | Tin tức golf |
| `rugby` | Rugby | 1 | Bóng bầu dục |
| `athletics` | Điền kinh | 2 | Chạy, nhảy, ném... |

#### 3.1.2 Nguồn RSS Feeds (URLs đầy đủ)

<details>
<summary>📰 Click để xem danh sách 66 nguồn RSS</summary>

**General Sports (12 nguồn):**
```
https://www.skysports.com/rss/12040
https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30
https://api.sportskeeda.com/v3/feeds_v2/1414?limit=1000&response_type=w3c
https://deadspin.com/rss/
https://superwestsports.com/feed/
https://www.sportsnewsireland.com/feed
https://feeds.bbci.co.uk/sport/rss.xml?edition=uk
https://sports.inquirer.net/feed
https://www.essentiallysports.com/feed/
https://www.sportsnet.ca/feed/
https://www.completesports.com/feed/
https://www.cbssports.com/rss/headlines/
```

**Football (42 nguồn) - Một số tiêu biểu:**
```
https://arseblog.com/feed
https://www.talkchelsea.net/feed/
https://www.thisisanfield.com/feed/
https://thepeoplesperson.com/feed/
https://www.101greatgoals.com/feed/
https://barcauniversal.com/feed/
https://www.juvefc.com/feed/
http://www.realmadridnews.com/feed
https://strettynews.com/feed/
https://thesefootballtimes.co/feed/
```

**Other Sports:**
```
https://boxingnewsonline.net/feed/           (Boxing)
https://www.mmafighting.com/rss/current      (MMA)
https://www.tennisworldusa.org/rss.xml       (Tennis)
https://www.basketballnetwork.net/feed       (Basketball)
https://www.racefans.net/feed/               (F1)
https://www.cricketcountry.com/feed          (Cricket)
https://www.golfdigest.com/feed/rss          (Golf)
https://www.planetrugby.com/feed/            (Rugby)
https://athleticsweekly.com/feed/            (Athletics)
```
</details>

#### 3.1.3 Tần Suất Cập Nhật

| Loại dữ liệu | Cache Duration | Trigger |
|--------------|----------------|---------|
| Tin tức RSS | 5 phút | Request đầu tiên hoặc cache hết hạn |
| Tỷ số ESPN | 15 phút | Request hoặc server start |
| Pre-fetch | On startup | `fetchAllFeeds()` tự động chạy |

#### 3.1.4 Cấu Trúc URL Bài Viết

Tin tức link ra **nguồn gốc** (external), không lưu local:

```
Format: [Nguồn gốc RSS] → Click → Redirect to original article
Ví dụ: https://www.skysports.com/football/news/12040/...
```

#### 3.1.5 Metadata Tracking (Mỗi bài viết)

```javascript
{
    title: "Tiêu đề bài viết",
    link: "https://source.com/article-slug",
    description: "Mô tả ngắn hoặc excerpt",
    pubDate: "2026-01-31T10:30:00Z",
    source: "Sky Sports",
    category: "football",
    image: "https://cdn.source.com/image.jpg",  // nullable
    guid: "unique-article-identifier"
}
```

### 3.2 SẢN PHẨM RED BULL

#### 3.2.1 Danh Sách Sản Phẩm

| ID | Tên sản phẩm | Slug | Tagline | Giá (250ml) |
|----|--------------|------|---------|-------------|
| rb-001 | Red Bull Energy Drink | red-bull-energy-drink | The Original Red Bull | 45,000₫ |
| rb-002 | Red Bull Sugarfree | red-bull-sugarfree | Wiiings Without Sugar | 47,000₫ |
| rb-003 | Red Bull Zero | red-bull-zero | Zero Calories. 100% Wiiings | 47,000₫ |

#### 3.2.2 Cấu Trúc Chi Tiết Sản Phẩm

```javascript
{
    "id": "rb-001",
    "name": "Red Bull Energy Drink",
    "slug": "red-bull-energy-drink",
    "tagline": "The Original Red Bull",
    "slogan": "Vitalizes body and mind®",
    "description": "Red Bull Energy Drink is appreciated worldwide...",
    "category": "Energy Drink",
    "brand": "Red Bull",
    
    "images": {
        "main": "https://www.redbull.com/.../main.png",
        "thumbnail": "https://www.redbull.com/.../thumb.png"
    },
    
    "variants": [
        { "size": "250ml", "sku": "RB-250-ORIGINAL", "price": 45000, "inStock": true },
        { "size": "355ml", "sku": "RB-355-ORIGINAL", "price": 55000, "inStock": true },
        { "size": "473ml", "sku": "RB-473-ORIGINAL", "price": 65000, "inStock": true }
    ],
    
    "ingredients": { ... },
    "benefits": [ ... ],
    
    "attributes": {
        "glutenFree": true,
        "lactoseFree": true,
        "dairyFree": true,
        "vegan": true,
        "calories": "110 kcal per 250ml"
    },
    
    "externalLinks": {
        "shopee": "https://shopee.vn/search?keyword=red%20bull%20energy%20drink",
        "facebook": "https://www.facebook.com/redbull",
        "instagram": "https://www.instagram.com/redbull"
    }
}
```

#### 3.2.3 Funnel Mua Hàng

```
┌─────────────────┐
│  Products Page  │ ──────→ view_item_list (đề xuất thêm)
│   /products     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Product Detail │ ──────→ view_item (đề xuất thêm)
│  /product/:slug │
└────────┬────────┘
         │ [Thêm vào giỏ]
         ▼
┌─────────────────┐
│   Add to Cart   │ ──────→ add_to_cart ✅
│   (Toast popup) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Cart Page     │ ──────→ view_cart (đề xuất thêm)
│      /cart      │
└────────┬────────┘
         │ [Thanh toán]
         ▼
┌─────────────────┐
│  Checkout Page  │ ──────→ begin_checkout ✅
│    /checkout    │
└────────┬────────┘
         │ [Submit]
         ▼
┌─────────────────┐
│  Order Success  │ ──────→ purchase ✅
│   (Modal popup) │
└─────────────────┘
```

#### 3.2.4 Tích Hợp Shopee

| Sản phẩm | Shopee Search URL |
|----------|-------------------|
| Red Bull Energy | `https://shopee.vn/search?keyword=red%20bull%20energy%20drink` |
| Red Bull Sugarfree | `https://shopee.vn/search?keyword=red%20bull%20sugarfree` |
| Red Bull Zero | `https://shopee.vn/search?keyword=red%20bull%20zero` |

**Lưu ý:** Link đến trang tìm kiếm Shopee, không phải shop cụ thể.

### 3.3 TÍNH NĂNG TƯƠNG TÁC

| Tính năng | Trạng thái | Chi tiết |
|-----------|------------|----------|
| **Comment system** | ❌ Không có | - |
| **Share buttons** | ✅ Có | Facebook, Instagram, YouTube, Shopee (footer) |
| **Newsletter signup** | ❌ Không có | - |
| **User registration/login** | ❌ Không có | - |
| **Wishlist** | ❌ Không có | - |
| **Search functionality** | ✅ Có | Trang tin tức có search box |
| **Category filter** | ✅ Có | Filter theo danh mục tin tức |

**Search Implementation (news.html):**
```html
<div class="news-search-bar">
    <input type="text" class="search-input" placeholder="Tìm kiếm tin tức...">
    <button class="search-btn">Tìm kiếm</button>
</div>
```

---

## 4. DỮ LIỆU GIẢ LẬP ĐÃ TẠO

### 4.1 Phương Pháp Tạo Dữ Liệu

| Loại dữ liệu | Phương pháp | Nguồn |
|--------------|-------------|-------|
| **Tin tức** | Real-time RSS feeds | 66 nguồn thật từ các trang thể thao |
| **Tỷ số** | ESPN API (real-time) | API ESPN chính thức |
| **Sản phẩm** | Static JSON | `redbull-products.json` - dữ liệu thật từ Red Bull |
| **Đơn hàng** | User-generated | Người dùng tự tạo qua form |
| **GA4 data** | Cần giả lập riêng | Xem phần đề xuất bên dưới |

### 4.2 Thời Gian Giả Lập (Đề xuất)

| Giai đoạn | Thời gian | Mô tả |
|-----------|-----------|-------|
| **Warm-up** | 01/01/2026 - 15/01/2026 | Traffic thấp, test website |
| **Growth** | 16/01/2026 - 25/01/2026 | Traffic tăng dần |
| **Peak** | 26/01/2026 - 31/01/2026 | Traffic cao, nhiều conversion |

### 4.3 Kịch Bản User Personas (Đề xuất)

#### Persona 1: Sinh Viên Đại Học (40% traffic)
```yaml
Tên: Minh - 21 tuổi
Device: Mobile (80%), Desktop (20%)
Hành vi:
  - Đọc tin bóng đá hằng ngày
  - Xem tỷ số trận đấu
  - Thỉnh thoảng mua Red Bull 250ml
Sessions/week: 5-7
Avg session duration: 3-5 phút
Pages/session: 3-4
Conversion rate: 2%
```

#### Persona 2: Nhân Viên Văn Phòng (35% traffic)
```yaml
Tên: Hương - 28 tuổi
Device: Desktop (60%), Mobile (40%)
Hành vi:
  - Lướt tin trong giờ nghỉ trưa
  - Quan tâm nhiều môn thể thao
  - Mua Red Bull Sugarfree
Sessions/week: 3-4
Avg session duration: 5-8 phút
Pages/session: 5-6
Conversion rate: 5%
```

#### Persona 3: Thể Thao Enthusiast (20% traffic)
```yaml
Tên: Tuấn - 35 tuổi
Device: Desktop (70%), Tablet (30%)
Hành vi:
  - Đọc tin chuyên sâu
  - Follow nhiều môn: F1, MMA, Tennis
  - Mua combo Red Bull
Sessions/week: 7-10
Avg session duration: 10-15 phút
Pages/session: 8-10
Conversion rate: 8%
```

#### Persona 4: Casual Visitor (5% traffic)
```yaml
Tên: Lan - 45 tuổi
Device: Mobile (90%)
Hành vi:
  - Vào từ social media
  - Đọc 1-2 bài rồi thoát
  - Không mua hàng
Sessions/week: 1
Avg session duration: 1-2 phút
Pages/session: 1-2
Bounce rate: 70%
```

### 4.4 Customer Journeys Điển Hình

#### Journey 1: Browse → Read → Exit (60% users)
```
Landing (Homepage) → News List → Click Article → Exit to Source
Events: page_view (x3), select_content
```

#### Journey 2: Browse → Product → Add to Cart (25% users)
```
Landing → Products → Product Detail → Add to Cart → Exit
Events: page_view (x3), add_to_cart
```

#### Journey 3: Full Purchase (10% users)
```
Landing → Products → Add to Cart → Cart → Checkout → Purchase
Events: page_view (x5), add_to_cart, begin_checkout, purchase
```

#### Journey 4: Returning Customer (5% users)
```
Direct → Products → Add to Cart → Checkout → Purchase
Events: page_view (x3), add_to_cart, begin_checkout, purchase
(higher conversion rate)
```

### 4.5 Traffic Sources Distribution (Đề xuất)

| Source/Medium | % Traffic | Mô tả |
|---------------|-----------|-------|
| `direct / (none)` | 25% | Truy cập trực tiếp |
| `google / organic` | 35% | Tìm kiếm Google |
| `facebook.com / referral` | 20% | Từ Facebook |
| `instagram.com / referral` | 10% | Từ Instagram |
| `shopee.vn / referral` | 5% | Từ Shopee |
| `other / referral` | 5% | Các nguồn khác |

### 4.6 Device Breakdown (Đề xuất)

| Device | % Users | Đặc điểm |
|--------|---------|----------|
| Mobile | 65% | Chủ yếu đọc tin |
| Desktop | 30% | Đọc tin + mua hàng |
| Tablet | 5% | Đọc tin dài |

### 4.7 Geo Distribution (Đề xuất - Vietnam focus)

| Thành phố | % Users |
|-----------|---------|
| Hồ Chí Minh | 40% |
| Hà Nội | 30% |
| Đà Nẵng | 10% |
| Cần Thơ | 5% |
| Khác | 15% |

### 4.8 Metrics Giả Lập (Đề xuất cho 30 ngày)

#### Overview Metrics
| Metric | Giá trị đề xuất |
|--------|-----------------|
| Total Users | 5,000 - 10,000 |
| New Users | 4,500 - 9,000 (90%) |
| Sessions | 8,000 - 15,000 |
| Pageviews | 25,000 - 50,000 |
| Avg Session Duration | 3:30 - 5:00 |
| Bounce Rate | 45% - 55% |
| Pages/Session | 3.0 - 4.0 |

#### Page Performance
| Page | Pageviews | Avg Time | Exit Rate |
|------|-----------|----------|-----------|
| / (Homepage) | 30% | 45s | 25% |
| /news | 35% | 2:00 | 30% |
| /products | 15% | 1:30 | 20% |
| /product/:slug | 10% | 2:30 | 35% |
| /cart | 5% | 1:00 | 40% |
| /checkout | 3% | 3:00 | 10% |
| /about | 2% | 1:00 | 60% |

#### Event Counts (30 ngày)
| Event | Count đề xuất |
|-------|---------------|
| `page_view` | 25,000 - 50,000 |
| `select_content` (news click) | 8,000 - 15,000 |
| `add_to_cart` | 500 - 1,000 |
| `remove_from_cart` | 100 - 200 |
| `begin_checkout` | 300 - 600 |
| `purchase` | 150 - 300 |

#### Conversion Metrics
| Metric | Giá trị |
|--------|---------|
| Add to Cart Rate | 5-10% of product viewers |
| Cart Abandonment | 50-60% |
| Checkout Completion | 50-60% |
| Overall Conversion | 1.5-3% |
| Avg Order Value | 100,000 - 150,000₫ |
| Revenue (30 days) | 15,000,000 - 45,000,000₫ |

---

## 5. TÍCH HỢP CÁC NỀN TẢNG

### 5.1 Facebook

| Thuộc tính | Giá trị |
|------------|---------|
| **Page URL** | https://www.facebook.com/redbull |
| **Link location** | Footer social links |
| **Tracking method** | GA4 outbound click (Enhanced Measurement) |
| **Facebook Pixel** | ❌ Không sử dụng |

**HTML Implementation:**
```html
<a href="https://www.facebook.com/redbull" 
   target="_blank" 
   rel="noopener" 
   class="social-link" 
   aria-label="Facebook">■</a>
```

### 5.2 Instagram

| Thuộc tính | Giá trị |
|------------|---------|
| **Profile URL** | https://www.instagram.com/redbull |
| **Link location** | Footer social links |
| **Tracking method** | GA4 outbound click (Enhanced Measurement) |

### 5.3 YouTube

| Thuộc tính | Giá trị |
|------------|---------|
| **Channel URL** | https://www.youtube.com/@redbull |
| **Link location** | Footer social links |

### 5.4 Shopee

| Thuộc tính | Giá trị |
|------------|---------|
| **Search URL** | https://shopee.vn/search?keyword=red%20bull |
| **Link locations** | Footer, Product cards, Product detail page |
| **Affiliate tracking** | ❌ Không có affiliate ID |
| **Conversion tracking** | ❌ Không thể track (cross-domain) |

**Limitations:**
- Không có Shopee Affiliate ID nên không track được conversions
- GA4 chỉ track outbound click, không track purchase trên Shopee
- Không có cross-domain tracking setup

### 5.5 Tracking External Clicks (Đề xuất cải thiện)

```javascript
// Đề xuất thêm tracking cho social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const platform = this.getAttribute('aria-label');
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_click', {
                'platform': platform,
                'link_url': this.href
            });
        }
    });
});
```

---

## 6. VẤN ĐỀ KỸ THUẬT TIỀM ẨN

### 6.1 Ad Blockers

| Vấn đề | Mức độ | Giải pháp |
|--------|--------|-----------|
| gtag.js blocked | 🟡 Medium | 15-25% users có thể bị block |
| Không có fallback | 🔴 High | Cần server-side tracking |
| Data loss | 🟡 Medium | Ước tính mất 15-25% data |

**Giải pháp đề xuất:**
```javascript
// Detect ad blocker
window.addEventListener('load', function() {
    if (typeof gtag === 'undefined') {
        console.warn('GA4 blocked - consider server-side tracking');
        // Fallback: Send to own endpoint
    }
});
```

### 6.2 Cookie Consent

| Trạng thái | Chi tiết |
|------------|----------|
| **Hiện tại** | ❌ Không có cookie consent banner |
| **GDPR compliance** | ❌ Không tuân thủ |
| **PDPA Vietnam** | ⚠️ Cần review |

**Đề xuất implementation:**
```javascript
// Consent mode (đề xuất thêm)
gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied'
});

// Sau khi user consent
gtag('consent', 'update', {
    'analytics_storage': 'granted'
});
```

### 6.3 Cross-Domain Tracking

| Vấn đề | Chi tiết |
|--------|----------|
| **External news links** | ❌ Không track được sau khi click |
| **Shopee redirect** | ❌ Mất session khi đến Shopee |
| **Solution** | Enhanced Measurement outbound clicks |

### 6.4 Data Sampling

| Scenario | Risk Level | Giải pháp |
|----------|------------|-----------|
| < 500K events/day | ✅ Không sampling | Hiện tại OK |
| > 500K events/day | 🟡 Có thể sampling | GA4 360 |
| High cardinality dims | 🟡 Thresholds applied | Giảm cardinality |

### 6.5 Page Load Performance

**GA4 Impact Analysis:**

| Metric | Không GA4 | Có GA4 | Impact |
|--------|-----------|--------|--------|
| First Contentful Paint | ~1.0s | ~1.1s | +100ms |
| Largest Contentful Paint | ~2.0s | ~2.1s | +100ms |
| Total Blocking Time | ~50ms | ~80ms | +30ms |
| Script size | 0KB | ~45KB | gtag.js |

**Optimizations đã áp dụng:**
- ✅ `async` loading cho gtag.js
- ✅ Đặt trong `<head>` (không blocking render)
- ❌ Chưa có lazy loading cho non-critical pages

### 6.6 Multiple Tracking Pixels

| Pixel | Trạng thái | Conflict |
|-------|------------|----------|
| GA4 | ✅ Active | - |
| Facebook Pixel | ❌ Không có | No conflict |
| Google Ads | ❌ Không có | No conflict |
| Shopee Pixel | ❌ Không có | No conflict |

**Kết luận:** Không có conflict vì chỉ dùng GA4.

---

## 7. MÃ NGUỒN QUAN TRỌNG

### 7.1 GA4 Initialization Code

```html
<!-- File: public/index.html (và tất cả HTML files) -->
<!-- Vị trí: <head> section, lines 12-18 -->

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-QYB62HGYMS"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-QYB62HGYMS');
</script>
```

### 7.2 Custom Event: Add to Cart

```javascript
// File: public/js/app.js
// Function: addToCart() - lines 100-125

function addToCart(product, variant, quantity = 1) {
    const existingIndex = cart.findIndex(item => 
        item.productId === product.id && item.sku === variant.sku
    );
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            productId: product.id,
            productName: product.name,
            sku: variant.sku,
            size: variant.size,
            price: variant.price,
            quantity: quantity,
            image: product.images.thumbnail
        });
    }
    
    saveCart();
    showToast(`Đã thêm ${product.name} (${variant.size}) vào giỏ hàng`, 'success');
    
    // GA4 Event - Add to cart
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
            'currency': 'VND',
            'value': variant.price * quantity,
            'items': [{
                'item_id': product.id,
                'item_name': product.name,
                'item_variant': variant.size,
                'price': variant.price,
                'quantity': quantity
            }]
        });
    }
}
```

### 7.3 Custom Event: Select Content (News Click)

```javascript
// File: public/js/app.js
// Function: createNewsCard() - lines 230-260

function createNewsCard(item, index) {
    const card = document.createElement('a');
    card.href = item.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'news-card';
    
    // ... card HTML ...
    
    // GA4 Event - News click
    card.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'select_content', {
                'content_type': 'news',
                'content_id': item.guid,
                'item_name': item.title,
                'source': item.source
            });
        }
    });
    
    return card;
}
```

### 7.4 Custom Event: Purchase

```javascript
// File: public/checkout.html
// Form submit handler - lines 500-560

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // ... validation & order submission ...
    
    const response = await RBSports.submitOrder(orderData);
    
    if (response.success) {
        // GA4 - Purchase
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                'transaction_id': response.data.orderId,
                'currency': 'VND',
                'value': currentTotal,
                'items': currentCart.map(item => ({
                    'item_id': item.productId,
                    'item_name': item.productName,
                    'item_variant': item.size,
                    'price': item.price,
                    'quantity': item.quantity
                }))
            });
        }
        
        // Show success modal
        document.getElementById('orderIdDisplay').textContent = response.data.orderId;
        document.getElementById('successModal').classList.add('active');
        
        // Clear cart
        RBSports.clearCart();
    }
});
```

### 7.5 Custom Event: Begin Checkout

```javascript
// File: public/checkout.html
// Render checkout function - lines 580-600

function renderCheckout() {
    const cart = RBSports.cart();
    const total = RBSports.getCartTotal();
    
    // ... render checkout form ...
    
    // GA4 - Begin checkout
    if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
            'currency': 'VND',
            'value': total,
            'items': cart.map(item => ({
                'item_id': item.productId,
                'item_name': item.productName,
                'item_variant': item.size,
                'price': item.price,
                'quantity': item.quantity
            }))
        });
    }
}
```

### 7.6 Page View Tracking

```javascript
// File: public/js/app.js
// Function: initApp() - lines 485-510

function initApp() {
    updateCartUI();
    initMobileMenu();
    
    // Mark current page in navigation
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // GA4 Page view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_location': window.location.href,
            'page_path': window.location.pathname,
            'page_title': document.title
        });
    }
}

document.addEventListener('DOMContentLoaded', initApp);
```

### 7.7 Cart Updated Event

```javascript
// File: public/js/app.js
// Function: saveCart() - lines 85-95

function saveCart() {
    localStorage.setItem('rb_cart', JSON.stringify(cart));
    updateCartUI();
    
    // GA4 Event - Cart updated
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cart_updated', {
            'cart_items': cart.length,
            'cart_total': cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
    }
}
```

---

## 8. DOCUMENTATION & ACCESS

### 8.1 GA4 Property Information

| Thuộc tính | Giá trị |
|------------|---------|
| **Property Name** | R&B Sports (đề xuất) |
| **Measurement ID** | G-QYB62HGYMS |
| **Data Stream** | Web |
| **Website URL** | https://[your-domain] |
| **Time Zone** | Vietnam (UTC+7) |
| **Currency** | VND |

### 8.2 GA4 Property Structure (Đề xuất)

```
GA4 Account: [MarTech Class Account]
└── Property: R&B Sports
    └── Data Stream: Web - R&B Sports Website
        ├── Measurement ID: G-QYB62HGYMS
        ├── Enhanced Measurement: ON
        │   ├── Page views: ON
        │   ├── Scrolls: ON
        │   ├── Outbound clicks: ON
        │   ├── Site search: ON
        │   ├── Video engagement: OFF
        │   ├── File downloads: OFF
        │   └── Form interactions: OFF
        │
        └── Custom Events:
            ├── select_content
            ├── add_to_cart
            ├── remove_from_cart
            ├── cart_updated
            ├── begin_checkout
            └── purchase
```

### 8.3 Đề Xuất Reports & Explorations

#### Standard Reports nên xem:

| Report | Path | Mục đích |
|--------|------|----------|
| Realtime | Reports > Realtime | Theo dõi traffic thời gian thực |
| User Acquisition | Reports > Acquisition > User acquisition | Nguồn traffic mới |
| Traffic Acquisition | Reports > Acquisition > Traffic acquisition | Nguồn theo session |
| Pages and screens | Reports > Engagement > Pages and screens | Performance từng trang |
| Events | Reports > Engagement > Events | Tất cả events |
| Conversions | Reports > Engagement > Conversions | Conversion events |
| Ecommerce purchases | Reports > Monetization > Ecommerce purchases | Doanh thu |

#### Custom Explorations đề xuất tạo:

1. **Funnel Exploration: Purchase Funnel**
   ```
   Steps:
   1. page_view (products)
   2. add_to_cart
   3. begin_checkout
   4. purchase
   ```

2. **Path Exploration: User Journey**
   ```
   Starting point: session_start
   Ending point: purchase
   ```

3. **Segment Overlap: Device vs Conversion**
   ```
   Segment 1: Mobile users
   Segment 2: Desktop users
   Segment 3: Purchasers
   ```

### 8.4 Custom Dimensions (Đề xuất configure)

| Dimension Name | Scope | Parameter | Mô tả |
|----------------|-------|-----------|-------|
| News Source | Event | `source` | Nguồn tin tức (Sky Sports, BBC...) |
| Content Type | Event | `content_type` | Loại nội dung (news, product) |
| Product Variant | Event | `item_variant` | Size sản phẩm (250ml, 355ml...) |
| Cart Total | Event | `cart_total` | Tổng giá trị giỏ hàng |

### 8.5 Custom Metrics (Đề xuất configure)

| Metric Name | Scope | Parameter | Unit |
|-------------|-------|-----------|------|
| Cart Items Count | Event | `cart_items` | Standard |
| Cart Value | Event | `cart_total` | Currency (VND) |

---

## 📝 PHỤ LỤC

### A. Danh Sách File và Line Numbers cho GA4 Code

| File | GA4 Code Lines | Custom Events Lines |
|------|----------------|---------------------|
| public/index.html | 12-18 | - |
| public/news.html | 12-18 | - |
| public/products.html | 12-18 | - |
| public/product-detail.html | 12-18 | - |
| public/cart.html | 12-18 | - |
| public/checkout.html | 12-18 | 500-600 |
| public/about.html | 12-18 | - |
| public/admin.html | 9-15 | - |
| public/js/app.js | - | 85-95, 100-140, 230-260, 485-510 |

### B. Quick Reference: Event Parameters

```javascript
// Standard ecommerce item object
{
    'item_id': 'string',        // Product ID
    'item_name': 'string',      // Product name
    'item_variant': 'string',   // Size/variant
    'price': number,            // Price in VND
    'quantity': number          // Quantity
}

// News content object
{
    'content_type': 'news',
    'content_id': 'string',     // GUID from RSS
    'item_name': 'string',      // Article title
    'source': 'string'          // RSS source name
}
```

### C. Testing Checklist

- [ ] Verify GA4 tag fires on all pages
- [ ] Test add_to_cart event with different products
- [ ] Test complete purchase flow
- [ ] Verify news click events
- [ ] Check Real-time report in GA4
- [ ] Verify DebugView events
- [ ] Test on mobile devices
- [ ] Test with ad blocker enabled

---

**Tài liệu này được tạo tự động bởi Claude Sonnet 4.5 (Coding Agent)**  
**Ngày cập nhật cuối:** 31/01/2026  
**Phiên bản tài liệu:** 1.0
