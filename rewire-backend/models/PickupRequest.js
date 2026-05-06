const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wasteType: { type: String, required: true },
  weight: { type: Number, required: true },
  area: { type: String },
  estimatedPoints: { type: Number },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PickupRequest', pickupSchema);