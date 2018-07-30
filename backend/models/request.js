const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  transactionId: { type: String, required: true },
  customer: { type: String, required: true },
  follower: { type: String, required: true, enum: ['Kiki', 'Kris', 'Funny'] },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 0 },
    isOrdered: { type: Boolean, required: true, default: false },
    orderedQty: { type: Number, required: true, min: 0, default: 0 },
    isRevoke: { type: Boolean, required: true, default: false }
  }],
  isRevoke: { type: Boolean, required: true, default: false }

});

module.exports = mongoose.model("Request", requestSchema);
