const { Order, Product } = require('../models');
const mongoose = require('mongoose');

const generateOrderNumber = () => 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();

// POST /orders
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, notes, items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No items in order' });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive)
        return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
      if (product.stock < item.quantity)
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });

      const price = item.quantity >= product.wholesaleMinQty ? product.wholesalePrice : product.unitPrice;
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;
      orderItems.push({ productId: product._id, productName: product.name, quantity: item.quantity, unitPrice: price, totalPrice: lineTotal });
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user?._id || null,
      customerName, customerEmail, customerPhone, customerAddress, notes,
      subtotal, totalAmount: subtotal,
      status: 'pending',
      items: orderItems,
    });

    // Decrement stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json({ success: true, data: normalizeOrder(order.toObject()) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const filter = req.user
      ? { $or: [{ userId: req.user._id }, { customerEmail: req.user.email }] }
      : { customerEmail: req.query.email };

    const [rows, count] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit)).lean(),
      Order.countDocuments(filter),
    ]);

    res.json({ success: true, data: rows.map(normalizeOrder), pagination: { page: parseInt(page), total: count, pages: Math.ceil(count / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const isAdmin = req.user?.role === 'admin';
    const isOwner = order.userId?.toString() === req.user?._id?.toString() || order.customerEmail === req.user?.email;
    if (!isAdmin && !isOwner) return res.status(403).json({ success: false, message: 'Access denied' });

    res.json({ success: true, data: normalizeOrder(order) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /admin/orders
exports.adminGetOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const [rows, count] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit)).lean(),
      Order.countDocuments(filter),
    ]);

    res.json({ success: true, data: rows.map(normalizeOrder), pagination: { page: parseInt(page), total: count, pages: Math.ceil(count / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Restore stock on cancel
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
      }
    }

    order.status = status;
    await order.save();
    res.json({ success: true, data: normalizeOrder(order.toObject()) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const { Product, Order, User } = require('../models');

    const [totalProducts, totalClients, totalOrders, revenueResult, recentOrders, statusCounts] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'client' }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $nin: ['cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(8).lean(),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const revenue = revenueResult[0]?.total || 0;
    const statusCountsFormatted = statusCounts.map(s => ({ status: s._id, count: s.count }));

    res.json({
      success: true,
      data: {
        totalProducts, totalClients, totalOrders,
        revenue,
        recentOrders: recentOrders.map(normalizeOrder),
        statusCounts: statusCountsFormatted,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

function normalizeOrder(o) {
  return {
    ...o,
    id: o._id?.toString(),
    items: (o.items || []).map(item => ({
      ...item,
      id: item._id?.toString(),
      productId: item.productId?.toString(),
    })),
  };
}
