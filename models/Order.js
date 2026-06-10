const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity:    { type: Number, required: true, min: 1 },
  unitPrice:   { type: Number, required: true, min: 0 },
  totalPrice:  { type: Number, required: true, min: 0 },
});

const orderSchema = new mongoose.Schema({
  orderNumber:     { type: String, unique: true, required: true },
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerName:    { type: String, required: true },
  customerEmail:   { type: String, required: true },
  customerPhone:   { type: String, required: true },
  customerAddress: { type: String, required: true },
  notes:           { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'],
    default: 'pending',
  },
  subtotal:    { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  items:       [orderItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
