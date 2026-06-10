const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const productCtrl = require('../controllers/productController');
const orderCtrl = require('../controllers/orderController');
const customerCtrl = require('../controllers/customerController');
const categoryCtrl = require('../controllers/categoryController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Auth
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', protect, authCtrl.getMe);
router.put('/auth/profile', protect, authCtrl.updateProfile);

// Categories
router.get('/categories', categoryCtrl.getCategories);
router.post('/categories', protect, adminOnly, categoryCtrl.createCategory);
router.put('/categories/:id', protect, adminOnly, categoryCtrl.updateCategory);
router.delete('/categories/:id', protect, adminOnly, categoryCtrl.deleteCategory);

// Products (public)
router.get('/products', productCtrl.getProducts);
router.get('/products/:id', productCtrl.getProduct);

// Products (admin)
router.get('/admin/products', protect, adminOnly, productCtrl.adminGetProducts);
router.post('/admin/products', protect, adminOnly, upload.array('images', 10), productCtrl.createProduct);
router.put('/admin/products/:id', protect, adminOnly, upload.array('images', 10), productCtrl.updateProduct);
router.delete('/admin/products/:id', protect, adminOnly, productCtrl.deleteProduct);

// Orders
router.post('/orders', optionalAuth, orderCtrl.createOrder);
router.get('/orders/my', protect, orderCtrl.getMyOrders);
router.get('/orders/:id', protect, orderCtrl.getOrder);

// Admin orders
router.get('/admin/orders', protect, adminOnly, orderCtrl.adminGetOrders);
router.put('/admin/orders/:id/status', protect, adminOnly, orderCtrl.updateOrderStatus);

// Dashboard
router.get('/admin/dashboard', protect, adminOnly, orderCtrl.getDashboardStats);

// Customers
router.get('/admin/customers', protect, adminOnly, customerCtrl.getCustomers);
router.get('/admin/customers/:id', protect, adminOnly, customerCtrl.getCustomer);

module.exports = router;
