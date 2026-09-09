# Hospital Management System - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Clone and Install Dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

2. **Environment Setup**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your configuration
# Required: MONGODB_URI, JWT_SECRET
# Optional: Email, SMS, Payment gateways, Cloudinary
```

3. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

4. **Run the Application**
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 📋 Features Implemented

### ✅ Authentication & Security
- OTP-based registration/login
- JWT authentication
- Role-based access control (Patient, Doctor, Admin, Lab, Pharmacy, Dietician, Housekeeping)
- Password hashing with bcrypt

### ✅ Patient Module
- OTP registration/login
- Appointment booking
- Appointment history
- Digital prescriptions (PDF download)
- Lab report downloads
- Medical history timeline
- Emergency contact management
- Video consultation
- Payments & invoices

### ✅ Doctor Module
- Appointment management
- Working hours & holiday calendar
- Consultation fee setup
- Patient case sheets
- E-prescription (AI-assisted)
- Upload medical reports
- Leave management
- Patient reviews & ratings
- Video consultation

### ✅ Admin Module
- Staff management
- Department & specialization setup
- Bed & ward allocation
- Billing & invoice management
- Complaint management
- Hospital analytics dashboard
- Role & permission control

### ✅ Lab Module
- Test assignment from doctors
- Upload lab reports (PDF)
- Status tracking
- Auto-notify patients via Email & SMS

### ✅ Pharmacy Module
- View prescriptions
- Medicine stock management
- Medicine purchase billing
- Invoice generation

### ✅ Dietician Module
- Food menu selection
- Dietician recommendations
- Diet plans linked to diseases

### ✅ Housekeeping Module
- Housekeeping requests
- Room service tickets
- Status updates

### ✅ Video Consultation
- WebRTC-based video calling
- Appointment-linked sessions
- Secure access
- Call duration tracking

### ✅ AI Features
- Disease risk prediction (rule-based)
- Symptom checker
- Doctor suggestion
- AI chatbot (24×7 support)
- Voice-to-text prescriptions (placeholder)
- SOAP note generator

### ✅ Payment System
- Razorpay integration
- Stripe integration
- Payment webhook verification
- Invoice generation (GST-compliant)
- PDF download

### ✅ Notifications
- Real-time notifications (Socket.io)
- Email notifications
- SMS notifications
- Appointment reminders

## 🔧 Configuration

### MongoDB Setup
```javascript
// Local MongoDB
MONGODB_URI=mongodb://localhost:27017/healthcare

// MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare
```

### Email Configuration (Nodemailer)
```javascript
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  // Use App Password for Gmail
```

### SMS Configuration (Twilio)
```javascript
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Payment Gateways

#### Razorpay
1. Sign up at https://razorpay.com
2. Get API keys from Dashboard
3. Add to .env:
```javascript
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

#### Stripe
1. Sign up at https://stripe.com
2. Get API keys from Dashboard
3. Add to .env:
```javascript
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### File Storage (Cloudinary)
1. Sign up at https://cloudinary.com
2. Get credentials from Dashboard
3. Add to .env:
```javascript
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📱 Mobile/Android Ready

The application is built with:
- Responsive design (mobile-first)
- Touch-friendly UI
- WebView compatible
- React Native ready (can be converted)

## 🎨 Theme Support

- Light mode (default)
- Dark mode (toggle in Layout)
- Theme persists in localStorage

## 🔐 Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Role-based access control
- Payment webhook verification
- Secure file uploads
- CORS configuration

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id/status` - Update status
- `POST /api/appointments/:id/video/start` - Start video call

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/webhook` - Payment webhook

### Lab
- `GET /api/lab` - Get lab reports
- `POST /api/lab` - Create test request
- `PUT /api/lab/:id` - Update report

### Pharmacy
- `GET /api/pharmacy/medicines` - Get medicines
- `GET /api/pharmacy/prescriptions` - Get prescriptions
- `POST /api/pharmacy/purchase` - Create purchase invoice

### Admin
- `GET /api/admin/staff` - Get staff
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/beds` - Get beds

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### Payment Gateway Issues
- Check API keys in .env
- Verify webhook URLs in gateway dashboard
- Check payment logs

### File Upload Issues
- Ensure uploads directory exists
- Check Cloudinary credentials
- Verify file size limits

### Socket.io Connection Issues
- Check CORS configuration
- Verify SOCKET_URL in client
- Check server logs

## 📝 Production Deployment

1. **Environment Variables**
   - Set NODE_ENV=production
   - Use strong JWT_SECRET
   - Configure production MongoDB
   - Set up production payment gateways

2. **Build Frontend**
```bash
cd client
npm run build
```

3. **Deploy**
   - Backend: Deploy to Heroku, AWS, or DigitalOcean
   - Frontend: Deploy to Netlify, Vercel, or AWS S3
   - MongoDB: Use MongoDB Atlas

4. **Security Checklist**
   - Enable HTTPS
   - Set secure CORS origins
   - Use environment variables
   - Enable rate limiting
   - Set up monitoring

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Stripe Documentation](https://stripe.com/docs)
- [Socket.io Documentation](https://socket.io/docs/)
- [React Documentation](https://react.dev/)

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Check browser console
4. Verify environment variables

## ✅ Testing Checklist

- [ ] User registration/login
- [ ] OTP verification
- [ ] Appointment booking
- [ ] Payment processing
- [ ] Video consultation
- [ ] File uploads
- [ ] Notifications
- [ ] Role-based access
- [ ] PDF generation
- [ ] Email/SMS sending

---

**Built with ❤️ for healthcare management**

