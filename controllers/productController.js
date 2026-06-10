const { Product, Category } = require('../models');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const generateSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, category, sort = 'createdAt', order = 'DESC', featured } = req.query;
    const skip = (page - 1) * limit;
    const filter = { isActive: true };
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.categoryId = category;
    if (featured === 'true') filter.isFeatured = true;
    const sortObj = { [sort]: order === 'DESC' ? -1 : 1 };
    const [rows, count] = await Promise.all([
      Product.find(filter).populate('categoryId', 'id name slug').sort(sortObj).skip(+skip).limit(+limit).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, data: rows.map(normalizeProduct), pagination: { page: +page, limit: +limit, total: count, pages: Math.ceil(count / limit) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getProduct = async (req, res) => {
  try {
    const isId = mongoose.Types.ObjectId.isValid(req.params.id);
    const product = await Product.findOne({ $or: [...(isId ? [{ _id: req.params.id }] : []), { slug: req.params.id }], isActive: true }).populate('categoryId', 'id name slug').lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: normalizeProduct(product) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, unitPrice, wholesalePrice, wholesaleMinQty, stock, categoryId, sku, isFeatured, tags } = req.body;
    const images = req.files?.length > 0 ? req.files.map((f, i) => ({ imageUrl: `/uploads/${f.filename}`, isPrimary: i === 0, sortOrder: i })) : [];
    const product = await Product.create({ name, slug: generateSlug(name), description, unitPrice, wholesalePrice, wholesaleMinQty: wholesaleMinQty || 100, stock, categoryId, sku, isFeatured: isFeatured === 'true', tags: tags ? JSON.parse(tags) : [], images });
    const full = await Product.findById(product._id).populate('categoryId', 'id name slug').lean();
    res.status(201).json({ success: true, data: normalizeProduct(full) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const { name, description, unitPrice, wholesalePrice, wholesaleMinQty, stock, categoryId, sku, isFeatured, tags, isActive } = req.body;
    if (name) { product.name = name; product.slug = generateSlug(name); }
    if (description !== undefined) product.description = description;
    if (unitPrice !== undefined) product.unitPrice = unitPrice;
    if (wholesalePrice !== undefined) product.wholesalePrice = wholesalePrice;
    if (wholesaleMinQty !== undefined) product.wholesaleMinQty = wholesaleMinQty;
    if (stock !== undefined) product.stock = stock;
    if (categoryId !== undefined) product.categoryId = categoryId;
    if (sku !== undefined) product.sku = sku;
    if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (tags !== undefined) product.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    if (req.files?.length > 0) {
      product.images.forEach(img => { if (img.imageUrl.startsWith('/uploads/')) { const p = path.join(__dirname, '..', img.imageUrl); if (fs.existsSync(p)) fs.unlinkSync(p); } });
      product.images = req.files.map((f, i) => ({ imageUrl: `/uploads/${f.filename}`, isPrimary: i === 0, sortOrder: i }));
    }
    await product.save();
    const full = await Product.findById(product._id).populate('categoryId', 'id name slug').lean();
    res.json({ success: true, data: normalizeProduct(full) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.isActive = false;
    await product.save();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.adminGetProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.categoryId = category;
    const [rows, count] = await Promise.all([
      Product.find(filter).populate('categoryId', 'id name').sort({ createdAt: -1 }).skip(+skip).limit(+limit).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, data: rows.map(normalizeProduct), pagination: { page: +page, limit: +limit, total: count, pages: Math.ceil(count / limit) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

function normalizeProduct(p) {
  const cat = p.categoryId && typeof p.categoryId === 'object' ? p.categoryId : null;
  return { ...p, id: p._id?.toString(), categoryId: cat?._id?.toString() || p.categoryId?.toString(), category: cat ? { id: cat._id?.toString(), name: cat.name, slug: cat.slug } : undefined };
}
