# Healthcare Assistant Application

A comprehensive healthcare assistant application providing ointment booking and emergency alerts with a modern, responsive UI. Built with React.js, Node.js, Express.js, and MongoDB.

## Features

- 🔐 **User Authentication** - Secure login and registration system
- 📅 **Ointment Booking** - Schedule and manage healthcare appointments
- 🚨 **Emergency Alerts** - Send and receive emergency notifications
- 🔔 **Notifications System** - Real-time alerts and appointment reminders
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX** - Beautiful, user-friendly interface with smooth animations

## Tech Stack

### Frontend
- React.js 19
- React Router DOM
- Axios for API calls
- CSS3 with modern styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Node-cron for background scheduling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd hospa
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/healthcare
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in `.env`.

## Running the Application

### Option 1: Run both servers together (Recommended)
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) concurrently.

### Option 2: Run servers separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Usage

1. **Register a new account**
   - Navigate to `http://localhost:3000/register`
   - Fill in your details (name, email, phone, password)
   - Click "Register"

2. **Login**
   - Navigate to `http://localhost:3000/login`
   - Enter your email and password
   - Click "Login"

3. **Book an Appointment**
   - Click on "Bookings" in the navigation
   - Click "New Booking"
   - Fill in the appointment details
   - Submit the form

4. **Send Emergency Alert**
   - Click on "Emergency" in the navigation
   - Fill in the emergency details or use quick options
   - Click "Send Emergency Alert"

5. **View Alerts**
   - Click on "Alerts" in the navigation
   - View all your alerts and notifications
   - Mark alerts as read or delete them

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Bookings
- `GET /api/bookings` - Get all bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)
- `POST /api/bookings` - Create new booking (protected)
- `PUT /api/bookings/:id` - Update booking (protected)
- `DELETE /api/bookings/:id` - Delete booking (protected)

### Alerts
- `GET /api/alerts` - Get all alerts (protected)
- `GET /api/alerts/unread/count` - Get unread alerts count (protected)
- `POST /api/alerts/emergency` - Create emergency alert (protected)
- `PUT /api/alerts/:id/read` - Mark alert as read (protected)
- `PUT /api/alerts/read-all` - Mark all alerts as read (protected)
- `DELETE /api/alerts/:id` - Delete alert (protected)

### Notifications
- `GET /api/notifications` - Get notifications and upcoming appointments (protected)

## Project Structure

```
hospa/
├── server/
│   ├── index.js              # Express server setup
│   ├── models/               # MongoDB models
│   │   ├── User.js
│   │   ├── Booking.js
│   │   └── Alert.js
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── alerts.js
│   │   └── notifications.js
│   └── middleware/
│       └── auth.js           # JWT authentication middleware
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   └── Layout.js
│   │   ├── context/          # React context
│   │   │   └── AuthContext.js
│   │   ├── pages/            # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Bookings.js
│   │   │   ├── BookingForm.js
│   │   │   ├── Alerts.js
│   │   │   └── EmergencyAlert.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## Features in Detail

### Background Scheduling
The application uses `node-cron` to check for upcoming appointments every 15 minutes and automatically creates notifications for appointments within the next 15 minutes.

### Security
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected API routes
- Secure data storage in MongoDB

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface
- Optimized for Android and iOS devices

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection string
- Verify the `MONGODB_URI` in `.env` is correct

### Port Already in Use
- Change the `PORT` in `.env` for backend
- React app runs on port 3000 by default (change in `client/package.json` if needed)

### CORS Issues
- CORS is enabled for all origins in development
- Update CORS settings in `server/index.js` for production

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

