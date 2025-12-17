# 🏥 Hospital Management System

A comprehensive, production-ready Hospital Management System built with modern web technologies. This system provides complete healthcare management solutions for patients, doctors, admins, lab technicians, pharmacists, dieticians, and housekeeping staff.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

## ✨ Features

### 🔐 Authentication & Security
- **OTP-based Registration/Login** - Secure phone number verification
- **JWT Authentication** - Token-based secure sessions
- **Role-based Access Control** - 7 different user roles
- **Password Hashing** - Bcrypt encryption
- **2FA Ready** - Two-factor authentication support

### 👥 User Roles
1. **👨‍⚕️ Doctor** - Appointment management, prescriptions, patient history
2. **🧑‍⚕️ Patient** - Booking, reports, payments, video consultation
3. **🧑‍💼 Admin** - Staff management, analytics, billing, bed allocation
4. **🧑‍🔬 Lab** - Test requests, report uploads, notifications
5. **💊 Pharmacy** - Stock management, prescriptions, billing
6. **🥗 Dietician** - Diet plans, recommendations
7. **🧹 Housekeeping** - Service tickets, room requests

### 🚀 Core Features

#### Patient Module
- ✅ OTP-based registration & login
- ✅ Online appointment booking with payment
- ✅ Appointment history & management
- ✅ Digital prescriptions (PDF download)
- ✅ Lab report downloads
- ✅ Medical history timeline
- ✅ Emergency contact management
- ✅ Video consultation (WebRTC)
- ✅ Payments & invoices

#### Doctor Module
- ✅ Appointment management dashboard
- ✅ Working hours & holiday calendar
- ✅ Consultation fee setup
- ✅ Patient case sheets
- ✅ E-prescription (AI-assisted)
- ✅ Upload medical reports
- ✅ Leave management
- ✅ Patient reviews & ratings
- ✅ Video consultation

#### Admin Module
- ✅ Doctor & staff management
- ✅ Department & specialization setup
- ✅ Bed & ward allocation
- ✅ Billing & invoice management
- ✅ Complaint management
- ✅ Hospital analytics dashboard
- ✅ Role & permission control

#### Lab Module
- ✅ Test assignment from doctors
- ✅ Upload lab reports (PDF)
- ✅ Status tracking
- ✅ Auto-notify patients via Email & SMS

#### Pharmacy Module
- ✅ View prescriptions
- ✅ Medicine stock management
- ✅ Medicine purchase billing
- ✅ Invoice generation

#### Dietician Module
- ✅ Food menu selection
- ✅ Dietician recommendations
- ✅ Diet plans linked to diseases

#### Housekeeping Module
- ✅ Housekeeping requests
- ✅ Room service tickets
- ✅ Status updates

### 🧠 AI Features
- **Disease Risk Prediction** - Rule-based AI for health risk assessment
- **Symptom Checker** - Intelligent symptom analysis
- **Doctor Suggestion** - AI-powered doctor recommendations
- **AI Chatbot** - 24×7 healthcare assistant
- **SOAP Note Generator** - Automated medical documentation
- **Voice-to-Text** - Prescription voice input (ready for API integration)

### 💳 Payment System
- **Razorpay Integration** - Primary payment gateway
- **Stripe Integration** - International payments
- **Webhook Verification** - Secure payment confirmation
- **GST-compliant Invoices** - Professional invoice generation
- **PDF Downloads** - Download invoices & prescriptions

### 📹 Video Consultation
- **WebRTC-based** - Real-time video calling
- **Appointment-linked** - Secure session management
- **Call Duration Tracking** - Automatic logging
- **Mute/Unmute Controls** - Full call controls

### 🔔 Notifications
- **Real-time** - Socket.io powered
- **Email Notifications** - Nodemailer integration
- **SMS Notifications** - Twilio integration
- **Appointment Reminders** - Automated alerts
- **Lab Report Alerts** - Instant notifications

## 🛠️ Tech Stack

### Frontend
- **React.js 19** - Modern UI library
- **React Router DOM 7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time server
- **PDFKit** - PDF generation
- **Multer** - File uploads
- **Cloudinary** - Cloud storage

### Integrations
- **Razorpay** - Payment gateway
- **Stripe** - Payment gateway
- **Twilio** - SMS service
- **Nodemailer** - Email service
- **Cloudinary** - File storage
- **AWS S3** - Alternative storage

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd hospa
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 3: Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Required: MONGODB_URI, JWT_SECRET
# Optional: Email, SMS, Payment gateways, Cloudinary
```

### Step 4: Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### Step 5: Run Application
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

### Step 6: Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available options. Key variables:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/healthcare

# Security
JWT_SECRET=your-super-secret-key-change-in-production

# Email (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Payments
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
STRIPE_SECRET_KEY=your-stripe-key

# Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/status` - Update status
- `POST /api/appointments/:id/video/start` - Start video call
- `POST /api/appointments/:id/video/end` - End video call

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
- `POST /api/pharmacy/purchase` - Create purchase

### Admin
- `GET /api/admin/staff` - Get staff
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/beds` - Get beds

### AI
- `POST /api/ai/disease-risk` - Disease risk prediction
- `POST /api/ai/soap-notes` - Generate SOAP notes

## 🎨 UI/UX Features

- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark/Light Mode** - Theme switcher
- ✅ **Smooth Animations** - Framer Motion
- ✅ **Dashboard Charts** - Recharts integration
- ✅ **Loading States** - Professional loading indicators
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Accessibility** - WCAG compliant

## 📱 Mobile Ready

- Responsive components
- Touch-friendly UI
- WebView compatible
- React Native ready
- Optimized performance

## 🚀 Production Deployment

### Build Frontend
```bash
cd client
npm run build
```

### Deploy Backend
- Deploy to Heroku, AWS, DigitalOcean, etc.
- Set environment variables
- Configure MongoDB Atlas
- Set up payment gateway webhooks

### Deploy Frontend
- Deploy to Netlify, Vercel, AWS S3, etc.
- Configure API endpoints
- Enable HTTPS

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test API endpoints
# Use Postman or similar tool
```

## 📝 Project Structure

```
hospa/
├── server/                 # Backend
│   ├── index.js           # Main server
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & validation
│   └── utils/             # Helper functions
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   └── App.jsx        # Main app
│   └── public/            # Static files
├── .env.example           # Environment template
├── SETUP_GUIDE.md        # Detailed setup guide
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
1. Check `SETUP_GUIDE.md` for setup help
2. Review server logs
3. Check browser console
4. Verify environment variables

## ✅ Features Checklist

- [x] OTP Authentication
- [x] Role-based Dashboards
- [x] Appointment Booking
- [x] Video Consultation
- [x] AI Features
- [x] Payment Integration
- [x] Invoice Generation
- [x] Lab Module
- [x] Pharmacy Module
- [x] Admin Module
- [x] Real-time Notifications
- [x] File Uploads
- [x] PDF Generation
- [x] Dark/Light Mode
- [x] Responsive Design

## 🎯 Future Enhancements

- [ ] Advanced AI with OpenAI
- [ ] Mobile App (React Native)
- [ ] Multi-language Support
- [ ] Advanced Analytics
- [ ] Telemedicine Features
- [ ] Integration with Medical Devices

---

**Built with ❤️ for healthcare management**

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
