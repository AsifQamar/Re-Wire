const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PickupRequest = require('../models/PickupRequest');
const { protect } = require('../middleware/authMiddleware');

const recyclerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'recycler') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized: Recyclers only' });
  }
};

router.get('/pending', protect, recyclerOnly, async (req, res) => {
  try {
    const pickups = await PickupRequest.find({ status: 'pending' }).populate('userId', 'username email');
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/pickup/:id/complete', protect, recyclerOnly, async (req, res) => {
  try {
    const pickup = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    if (!pickup) return res.status(404).json({ message: "Pickup not found" });

    const pointsEarned = pickup.estimatedPoints || (pickup.weight * 10);
    const user = await User.findById(pickup.userId);
    if (user) {
      user.points += pointsEarned;
      await user.save();
    }
    res.json({ message: "Pickup completed", pointsAwarded: pointsEarned });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;