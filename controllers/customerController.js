const { User, Order } = require('../models');

exports.getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;
    const filter = { role: 'client' };

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, count] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit)).lean(),
      User.countDocuments(filter),
    ]);

    // Add order stats per customer
    const customersWithStats = await Promise.all(users.map(async (user) => {
      const [orderCount, revenueResult] = await Promise.all([
        Order.countDocuments({ userId: user._id }),
        Order.aggregate([
          { $match: { userId: user._id, status: { $nin: ['cancelled'] } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
      ]);
      return { ...user, id: user._id?.toString(), orderCount, totalSpent: revenueResult[0]?.total || 0 };
    }));

    res.json({ success: true, data: customersWithStats, pagination: { page: parseInt(page), total: count, pages: Math.ceil(count / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'client' }).select('-password').lean();
    if (!user) return res.status(404).json({ success: false, message: 'Customer not found' });

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);

    const normalizedOrders = orders.map(o => ({
      ...o,
      id: o._id?.toString(),
      items: (o.items || []).map(item => ({ ...item, id: item._id?.toString() })),
    }));

    res.json({ success: true, data: { ...user, id: user._id?.toString(), orders: normalizedOrders, totalSpent, orderCount: orders.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
