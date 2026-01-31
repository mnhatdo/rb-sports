/**
 * Simple JSON File Database
 * Tự động lưu dữ liệu vào file, không cần cài đặt gì thêm
 */

const fs = require('fs');
const path = require('path');

class JsonDatabase {
    constructor(filename = 'orders.json') {
        this.dataDir = path.join(__dirname, 'data');
        this.filePath = path.join(this.dataDir, filename);
        this.data = { orders: [], lastUpdated: new Date().toISOString() };
        this._ensureDataDir();
        this._load();
    }

    // Đảm bảo thư mục data tồn tại
    _ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
            console.log('📁 Created data directory');
        }
    }

    // Load dữ liệu từ file
    _load() {
        try {
            if (fs.existsSync(this.filePath)) {
                const content = fs.readFileSync(this.filePath, 'utf8');
                this.data = JSON.parse(content);
                console.log(`✓ Loaded ${this.data.orders.length} orders from database`);
            } else {
                this._save();
                console.log('✓ Created new database file');
            }
        } catch (error) {
            console.error('Error loading database:', error.message);
            this.data = { orders: [], lastUpdated: new Date().toISOString() };
        }
    }

    // Lưu dữ liệu vào file
    _save() {
        try {
            this.data.lastUpdated = new Date().toISOString();
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('Error saving database:', error.message);
            return false;
        }
    }

    // ===== ORDER OPERATIONS =====

    // Tạo đơn hàng mới
    createOrder(orderData) {
        const order = {
            orderId: `ORD-${Date.now()}`,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.data.orders.unshift(order); // Thêm vào đầu mảng
        this._save();
        
        console.log(`📦 New order created: ${order.orderId}`);
        return order;
    }

    // Lấy tất cả đơn hàng
    getAllOrders() {
        return this.data.orders;
    }

    // Lấy đơn hàng theo ID
    getOrderById(orderId) {
        return this.data.orders.find(o => o.orderId === orderId);
    }

    // Cập nhật trạng thái đơn hàng
    updateOrderStatus(orderId, status) {
        const order = this.data.orders.find(o => o.orderId === orderId);
        if (order) {
            order.status = status;
            order.updatedAt = new Date().toISOString();
            this._save();
            console.log(`📝 Order ${orderId} updated to: ${status}`);
            return order;
        }
        return null;
    }

    // Xóa đơn hàng
    deleteOrder(orderId) {
        const index = this.data.orders.findIndex(o => o.orderId === orderId);
        if (index !== -1) {
            const deleted = this.data.orders.splice(index, 1)[0];
            this._save();
            console.log(`🗑️ Order ${orderId} deleted`);
            return deleted;
        }
        return null;
    }

    // Thống kê
    getStats() {
        const orders = this.data.orders;
        return {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            confirmed: orders.filter(o => o.status === 'confirmed').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            completed: orders.filter(o => o.status === 'completed').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length,
            totalRevenue: orders
                .filter(o => o.status === 'completed')
                .reduce((sum, o) => sum + (o.total || 0), 0),
            lastUpdated: this.data.lastUpdated
        };
    }

    // Export database info
    getInfo() {
        return {
            type: 'JSON File Database',
            filePath: this.filePath,
            ordersCount: this.data.orders.length,
            lastUpdated: this.data.lastUpdated
        };
    }
}

// Singleton instance
const db = new JsonDatabase();

module.exports = db;
