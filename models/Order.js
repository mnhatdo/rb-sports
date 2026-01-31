const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: false
    },
    customerAddress: {
        type: String,
        required: true
    },
    items: [{
        productId: String,
        productName: String,
        sku: String,
        size: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        required: true,
        default: 30000
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'bank_transfer', 'momo', 'zalopay'],
        default: 'cod'
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true // Tự động tạo createdAt và updatedAt
});

// Index cho search và sort
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ customerPhone: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
