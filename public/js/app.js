/* ============================================
   R&B Sports - Main Application JavaScript
   ============================================ */

// API Base URL
const API_BASE = '';

// Cart State
let cart = JSON.parse(localStorage.getItem('rb_cart')) || [];

// ============================================
// Utility Functions
// ============================================

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// ============================================
// Toast Notifications
// ============================================

function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span style="font-size: 1.2rem;">${icons[type] || icons.info}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// Cart Functions
// ============================================

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

function updateCartUI() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounts.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

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

function removeFromCart(index) {
    const item = cart[index];
    
    // GA4 Event - Remove from cart
    if (typeof gtag !== 'undefined') {
        gtag('event', 'remove_from_cart', {
            'currency': 'VND',
            'value': item.price * item.quantity,
            'items': [{
                'item_id': item.productId,
                'item_name': item.productName,
                'item_variant': item.size,
                'price': item.price,
                'quantity': item.quantity
            }]
        });
    }
    
    cart.splice(index, 1);
    saveCart();
}

function updateCartQuantity(index, quantity) {
    if (quantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = quantity;
        saveCart();
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    saveCart();
}

// ============================================
// API Functions
// ============================================

async function fetchNews(options = {}) {
    const { category = 'all', limit = 20, offset = 0, hasImage } = options;
    
    let url = `${API_BASE}/api/news?limit=${limit}&offset=${offset}`;
    if (category !== 'all') url += `&category=${category}`;
    if (hasImage !== undefined) url += `&hasImage=${hasImage}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
        return { success: false, data: [] };
    }
}

async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE}/api/products`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, data: [] };
    }
}

async function fetchProduct(slug) {
    try {
        const response = await fetch(`${API_BASE}/api/products/${slug}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, data: null };
    }
}

async function submitOrder(orderData) {
    try {
        const response = await fetch(`${API_BASE}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error submitting order:', error);
        return { success: false, error: 'Đã xảy ra lỗi khi đặt hàng' };
    }
}

// ============================================
// News Rendering Functions
// ============================================

function createNewsCard(item, index) {
    const card = document.createElement('a');
    card.href = item.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'news-card';
    card.setAttribute('data-index', index);
    
    card.innerHTML = `
        ${item.image ? `<img src="${item.image}" alt="${truncateText(item.title, 50)}" class="news-card-image" loading="lazy" onerror="this.parentElement.classList.add('no-image')">` : ''}
        <div class="news-card-content">
            <div class="news-card-meta">
                <span class="news-source">${item.source}</span>
                <span>${formatDate(item.pubDate)}</span>
            </div>
            <h3 class="news-card-title">${item.title}</h3>
            <p class="news-card-desc">${truncateText(stripHtml(item.description), 120)}</p>
            <span class="news-card-link">Đọc thêm →</span>
        </div>
    `;
    
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

function createNewsListItem(item, index) {
    const listItem = document.createElement('a');
    listItem.href = item.link;
    listItem.target = '_blank';
    listItem.rel = 'noopener noreferrer';
    listItem.className = 'news-list-item';
    listItem.setAttribute('data-index', index);
    
    listItem.innerHTML = `
        <div class="news-list-content">
            <h4 class="news-list-title">${item.title}</h4>
            <div class="news-list-meta">
                <span class="news-source">${item.source}</span>
                <span>${formatDate(item.pubDate)}</span>
            </div>
        </div>
    `;
    
    listItem.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'select_content', {
                'content_type': 'news',
                'content_id': item.guid,
                'item_name': item.title,
                'source': item.source
            });
        }
    });
    
    return listItem;
}

// Create Home News Card (for homepage with featured card)
function createHomeNewsCard(item, index) {
    const card = document.createElement('a');
    card.href = item.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = index === 0 ? 'home-news-card featured' : 'home-news-card';
    card.setAttribute('data-index', index);
    
    card.innerHTML = `
        <img src="${item.image}" alt="${truncateText(item.title, 50)}" class="home-news-image" loading="lazy">
        <div class="home-news-content">
            <div class="home-news-meta">
                <span class="news-source">${item.source}</span>
                <span>${formatDate(item.pubDate)}</span>
            </div>
            <h3 class="home-news-title">${item.title}</h3>
            ${index === 0 ? `<p class="home-news-desc">${truncateText(stripHtml(item.description), 150)}</p>` : ''}
        </div>
    `;
    
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

// Create News Page Card (for news.html - uniform size, mixed design)
function createNewsPageCard(item, index) {
    const card = document.createElement('a');
    card.href = item.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = item.image ? 'news-page-card with-image' : 'news-page-card no-image';
    card.setAttribute('data-index', index);
    
    // Ensure description exists, use title as fallback
    const description = item.description && stripHtml(item.description).trim() 
        ? stripHtml(item.description) 
        : item.title;
    
    if (item.image) {
        card.innerHTML = `
            <img src="${item.image}" alt="${truncateText(item.title, 50)}" class="news-page-image" loading="lazy">
            <div class="news-page-content">
                <div class="news-page-meta">
                    <span class="news-source">${item.source}</span>
                    <span>${formatDate(item.pubDate)}</span>
                </div>
                <h3 class="news-page-title">${item.title}</h3>
                <p class="news-page-desc">${truncateText(description, 100)}</p>
            </div>
        `;
    } else {
        card.innerHTML = `
            <div class="news-page-content-full">
                <div class="news-page-meta">
                    <span class="news-source">${item.source}</span>
                    <span>${formatDate(item.pubDate)}</span>
                </div>
                <h3 class="news-page-title">${item.title}</h3>
                <p class="news-page-desc">${truncateText(description, 150)}</p>
                <span class="news-page-link">Đọc thêm →</span>
            </div>
        `;
    }
    
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

// ============================================
// Product Rendering Functions
// ============================================

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const defaultVariant = product.variants[0];
    
    card.innerHTML = `
        <img src="${product.images.main}" alt="${product.name}" class="product-image" loading="lazy">
        <p class="product-tagline">${product.tagline}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${truncateText(product.description, 100)}</p>
        <div class="product-variants">
            ${product.variants.map((v, i) => `
                <button class="variant-btn ${i === 0 ? 'active' : ''}" data-index="${i}">
                    ${v.size}
                </button>
            `).join('')}
        </div>
        <p class="product-price" data-prices='${JSON.stringify(product.variants.map(v => v.price))}'>
            ${formatPrice(defaultVariant.price)}
        </p>
        <button class="add-to-cart-btn">
            🛒 Thêm vào giỏ hàng
        </button>
    `;
    
    // Variant selection
    const variantBtns = card.querySelectorAll('.variant-btn');
    const priceEl = card.querySelector('.product-price');
    
    variantBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            variantBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const prices = JSON.parse(priceEl.dataset.prices);
            const index = parseInt(btn.dataset.index);
            priceEl.textContent = formatPrice(prices[index]);
        });
    });
    
    // Add to cart
    const addBtn = card.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', () => {
        const activeVariant = card.querySelector('.variant-btn.active');
        const variantIndex = parseInt(activeVariant.dataset.index);
        addToCart(product, product.variants[variantIndex]);
    });
    
    // Click on card to view details
    card.querySelector('.product-image').addEventListener('click', () => {
        window.location.href = `/product/${product.slug}`;
    });
    
    card.querySelector('.product-name').addEventListener('click', () => {
        window.location.href = `/product/${product.slug}`;
    });
    
    card.querySelector('.product-name').style.cursor = 'pointer';
    card.querySelector('.product-image').style.cursor = 'pointer';
    
    return card;
}

// ============================================
// Mobile Menu
// ============================================

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const spans = menuBtn.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// ============================================
// Page Initialization
// ============================================

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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Export functions for use in other scripts
window.RBSports = {
    fetchNews,
    fetchProducts,
    fetchProduct,
    submitOrder,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    clearCart,
    cart: () => cart,
    formatPrice,
    formatDate,
    showToast,
    createNewsCard,
    createNewsListItem,
    createHomeNewsCard,
    createNewsPageCard,
    createProductCard,
    truncateText,
    stripHtml
};
