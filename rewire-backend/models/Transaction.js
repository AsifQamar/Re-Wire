const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pointsRedeemed: { type: Number, required: true },
  cashValue: { type: Number, required: true }, 
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);