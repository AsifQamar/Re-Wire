const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const createPaymentIntent = async (req, res) => {
  try {
    const { amountInRupees } = req.body; 

    if (!amountInRupees) {
      return res.status(400).json({ message: "Amount in Rupees is required" });
    }

    const amountInPaise = amountInRupees * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: 'inr', 
      metadata: { userId: req.user._id.toString() } 
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };