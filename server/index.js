const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const alertRoutes = require('./routes/alerts');
const notificationRoutes = require('./routes/notifications');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Healthcare Assistant API is running' });
});

// Background job for checking upcoming appointments and sending notifications
const Booking = require('./models/Booking');
cron.schedule('*/15 * * * *', async () => {
  try {
    const now = new Date();
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);
    
    const upcomingBookings = await Booking.find({
      appointmentDate: {
        $gte: now,
        $lte: fifteenMinutesLater
      },
      notificationSent: false
    }).populate('userId');

    for (const booking of upcomingBookings) {
      // Mark notification as sent
      booking.notificationSent = true;
      await booking.save();
      
      console.log(`Upcoming appointment reminder for booking ${booking._id}`);
    }
  } catch (error) {
    console.error('Error in background job:', error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

