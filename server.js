require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' || 'https://ton-frontend.vercel.app', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', routes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Seed demo data if collection is empty
const seedDatabase = async () => {
  const { User, Category, Product, Order } = require('./models');
  const bcrypt = require('bcryptjs');

  const adminExists = await User.findOne({ email: 'admin@wholesale.com' });
  if (adminExists) return;

  console.log('🌱 Seeding demo data...');

  // Clear any partial data to prevent E11000 duplicate key errors
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
  ]);

  // Demo users — passwords hashed via pre-save hook
  await User.create({ fullName: 'Admin User',  email: 'admin@wholesale.com',  password: 'Admin@123',  phone: '+1-555-0100', address: '123 Admin Street, New York, NY 10001',        role: 'admin' });
  await User.create({ fullName: 'John Smith',  email: 'client@wholesale.com', password: 'Client@123', phone: '+1-555-0200', address: '456 Business Ave, Los Angeles, CA 90210', role: 'client' });
  console.log('✅ Demo users created');

  const cats = await Category.insertMany([
    { name: 'Electronics',     slug: 'electronics',     description: 'Electronic components and devices',      icon: '⚡' },
    { name: 'Textiles',        slug: 'textiles',        description: 'Fabrics and clothing materials',         icon: '🧵' },
    { name: 'Industrial Tools',slug: 'industrial-tools',description: 'Professional tools and equipment',       icon: '🔧' },
    { name: 'Food & Beverages',slug: 'food-beverages',  description: 'Wholesale food products',                icon: '🍎' },
    { name: 'Packaging',       slug: 'packaging',       description: 'Packaging materials and solutions',      icon: '📦' },
    { name: 'Office Supplies', slug: 'office-supplies', description: 'Office and stationery products',         icon: '📎' },
  ]);
  console.log('✅ Categories created');

  const makeImages = (sku) => [
    { imageUrl: `https://picsum.photos/seed/${sku}-1/600/600`, isPrimary: true,  sortOrder: 0 },
    { imageUrl: `https://picsum.photos/seed/${sku}-2/600/600`, isPrimary: false, sortOrder: 1 },
    { imageUrl: `https://picsum.photos/seed/${sku}-3/600/600`, isPrimary: false, sortOrder: 2 },
  ];

  await Product.insertMany([
    { name: 'Industrial LED Strip Light 5m',  slug: 'industrial-led-strip-5m-'  + Date.now(),      description: 'High-quality SMD LED strip lights for commercial use. IP65 waterproof, 60 LEDs/m.',           unitPrice: 12.99, wholesalePrice: 9.99,  wholesaleMinQty: 100, stock: 5000,  categoryId: cats[0]._id, sku: 'LED-001', isFeatured: true,  images: makeImages('LED-001') },
    { name: 'Premium Cotton T-Shirt Blank',   slug: 'premium-cotton-tshirt-'    + Date.now() + 1,  description: '100% organic cotton blank t-shirts. Pre-shrunk, seamless collar, 15 colors available.',       unitPrice: 4.50,  wholesalePrice: 2.99,  wholesaleMinQty: 100, stock: 20000, categoryId: cats[1]._id, sku: 'TXT-001', isFeatured: true,  images: makeImages('TXT-001') },
    { name: 'Heavy Duty Power Drill 800W',    slug: 'heavy-duty-power-drill-'   + Date.now() + 2,  description: 'Professional 800W drill, variable speed, 13mm chuck. Suitable for wood, metal, masonry.',    unitPrice: 89.99, wholesalePrice: 69.99, wholesaleMinQty: 50,  stock: 300,   categoryId: cats[2]._id, sku: 'TLS-001', isFeatured: false, images: makeImages('TLS-001') },
    { name: 'Organic Green Tea 250g',         slug: 'organic-green-tea-250g-'   + Date.now() + 3,  description: 'Premium Chinese organic green tea. EU certified, rich in antioxidants, resealable pouches.',  unitPrice: 8.99,  wholesalePrice: 6.49,  wholesaleMinQty: 100, stock: 10000, categoryId: cats[3]._id, sku: 'FDB-001', isFeatured: true,  images: makeImages('FDB-001') },
    { name: 'Kraft Paper Bags 26×35cm',       slug: 'kraft-paper-bags-26x35-'   + Date.now() + 4,  description: 'Eco-friendly kraft bags with handles. 120gsm, retail & food packaging. Custom printing.',    unitPrice: 0.45,  wholesalePrice: 0.29,  wholesaleMinQty: 500, stock: 100000,categoryId: cats[4]._id, sku: 'PKG-001', isFeatured: false, images: makeImages('PKG-001') },
    { name: 'A4 Copy Paper 80gsm Ream',       slug: 'a4-copy-paper-80gsm-'      + Date.now() + 5,  description: 'High-quality A4 paper for laser & inkjet. 80gsm, 500 sheets, brightness 102%. Acid-free.',   unitPrice: 6.99,  wholesalePrice: 4.99,  wholesaleMinQty: 100, stock: 50000, categoryId: cats[5]._id, sku: 'OFC-001', isFeatured: true,  images: makeImages('OFC-001') },
    { name: 'Wireless Bluetooth Earbuds',     slug: 'wireless-bluetooth-earbuds-'+ Date.now() + 6, description: 'True wireless earbuds, ANC, 30h battery, IPX5, Bluetooth 5.2.',                               unitPrice: 24.99, wholesalePrice: 18.99, wholesaleMinQty: 100, stock: 2000,  categoryId: cats[0]._id, sku: 'LED-002', isFeatured: true,  images: makeImages('LED-002') },
    { name: 'Polyester Fleece Fabric Roll',   slug: 'polyester-fleece-fabric-'   + Date.now() + 7, description: 'Anti-pill fleece fabric, 150cm wide, 200gsm. 30+ colours, per metre or 50m rolls.',           unitPrice: 3.20,  wholesalePrice: 2.10,  wholesaleMinQty: 100, stock: 8000,  categoryId: cats[1]._id, sku: 'TXT-002', isFeatured: false, images: makeImages('TXT-002') },
  ]);
  console.log('✅ Products created with images');
};

// Boot
(async () => {
  await connectDB();
  await seedDatabase();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
