const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PickupRequest = require('../models/PickupRequest');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/request-pickup', protect, async (req, res) => {
  try {
    const newRequest = new PickupRequest({
      userId: req.user._id,
      wasteType: req.body.wasteType,
      weight: req.body.weight,
      area: req.body.area,
      estimatedPoints: req.body.estimatedPoints
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/pickups', protect, async (req, res) => {
  try {
    const pickups = await PickupRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/redeem', protect, async (req, res) => {
  try {
    const { pointsToRedeem } = req.body;
    const user = await User.findById(req.user._id);
    if (user.points < pointsToRedeem) {
      return res.status(400).json({ message: "Insufficient points" });
    }
    user.points -= pointsToRedeem;
    await user.save();
    
    const cashValue = pointsToRedeem;
    const transaction = new Transaction({
      userId: req.user._id,
      pointsRedeemed: pointsToRedeem,
      cashValue
    });
    await transaction.save();
    res.json({ message: "Redemption successful", cashEarned: cashValue, remainingPoints: user.points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;