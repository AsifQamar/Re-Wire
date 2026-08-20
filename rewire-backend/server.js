const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 

const app = express();


connectDB();


app.use(cors());
app.use(express.json());


app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/recycler', require('./routes/recyclerRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

app.get('/', (req, res) => res.send('Rewire Backend is running securely!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;