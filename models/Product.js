const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  imageUrl:  { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
  description:      { type: String },
  unitPrice:        { type: Number, required: true, min: 0 },
  wholesalePrice:   { type: Number, required: true, min: 0 },
  wholesaleMinQty:  { type: Number, default: 100 },
  stock:            { type: Number, default: 0, min: 0 },
  categoryId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  sku:              { type: String, unique: true, sparse: true },
  isActive:         { type: Boolean, default: true },
  isFeatured:       { type: Boolean, default: false },
  tags:             [{ type: String }],
  images:           [productImageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
