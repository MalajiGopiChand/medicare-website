const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const alertRoutes = require('./routes/alerts');
const notificationRoutes = require('./routes/notifications');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const paymentRoutes = require('./routes/payments');
const labRoutes = require('./routes/lab');
const pharmacyRoutes = require('./routes/pharmacy');
const adminRoutes = require('./routes/admin');
const dieticianRoutes = require('./routes/dietician');
const housekeepingRoutes = require('./routes/housekeeping');
const aiRoutes = require('./routes/ai');
const videoRoutes = require('./routes/video');
const uploadRoutes = require('./routes/upload');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

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
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dietician', dieticianRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/upload', uploadRoutes);

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

// Socket.io for real-time notifications and video calls
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Video call events
  socket.on('join-video-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });

  socket.on('leave-video-room', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', { userId: socket.id });
  });

  socket.on('offer', ({ offer, roomId }) => {
    socket.to(roomId).emit('offer', { offer, userId: socket.id });
  });

  socket.on('answer', ({ answer, roomId }) => {
    socket.to(roomId).emit('answer', { answer, userId: socket.id });
  });

  socket.on('ice-candidate', ({ candidate, roomId }) => {
    socket.to(roomId).emit('ice-candidate', { candidate, userId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

