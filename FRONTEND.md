# Frontend Documentation

## Overview
The frontend is a complete React.js application with modern UI/UX, responsive design, and full integration with the backend API.

## Technology Stack
- **React 19** - Latest React version
- **React Router DOM 7** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

## Project Structure

```
client/src/
├── components/
│   ├── Layout.js          # Main layout with navigation
│   └── Layout.css         # Layout styles
├── context/
│   └── AuthContext.js     # Authentication state management
├── pages/
│   ├── Login.js           # Login page
│   ├── Register.js        # Registration page
│   ├── Dashboard.js       # Main dashboard
│   ├── Bookings.js        # Bookings list page
│   ├── BookingForm.js     # Create/edit booking form
│   ├── Alerts.js          # Alerts and notifications page
│   ├── EmergencyAlert.js  # Emergency alert form
│   └── *.css              # Page-specific styles
├── App.js                 # Main app component with routing
├── App.css               # Global app styles
├── index.js              # React entry point
└── index.css             # Base styles
```

## Pages & Features

### 1. Authentication Pages

#### Login (`/login`)
- Email and password authentication
- Error handling and validation
- Redirects to dashboard on success
- Link to registration page

#### Register (`/register`)
- User registration form
- Fields: Name, Email, Phone, Password
- Password validation (min 6 characters)
- Auto-login after registration

### 2. Dashboard (`/`)
- **Statistics Cards:**
  - Upcoming Appointments count
  - Unread Alerts count
  - Total Bookings count

- **Upcoming Appointments Section:**
  - Shows next 3 upcoming appointments
  - Quick "New Booking" button
  - View all bookings link

- **Recent Alerts Section:**
  - Shows last 5 alerts
  - Unread alerts highlighted
  - View all alerts link

- **Quick Actions:**
  - Emergency Alert button
  - Book Appointment button

- **Auto-refresh:** Updates every 30 seconds

### 3. Bookings (`/bookings`)
- **List View:**
  - All user bookings displayed as cards
  - Shows: Ointment type, date, time, status, description
  - Cancel booking functionality
  - Empty state with call-to-action

- **New Booking Form (`/bookings/new`):**
  - Ointment type selection (Antibiotic, Antifungal, Steroid, Moisturizer, Other)
  - Date picker (minimum: tomorrow)
  - Time picker
  - Optional description/notes
  - Form validation
  - Cancel and submit buttons

### 4. Alerts (`/alerts`)
- **Filter Tabs:**
  - All alerts
  - Unread only
  - Emergency only

- **Alert Cards:**
  - Priority badges (critical, high, medium, low)
  - Alert type icons (🚨 emergency, 📅 appointment, 💊 medication, 📢 general)
  - Timestamp display
  - Mark as read functionality
  - Delete alert option

- **Bulk Actions:**
  - Mark all as read button
  - Unread count display

### 5. Emergency Alert (`/emergency`)
- **Quick Options:**
  - Pre-filled templates for common emergencies:
    - Medical Emergency
    - Severe Pain
    - Allergic Reaction
    - Difficulty Breathing

- **Emergency Form:**
  - Title field
  - Detailed message textarea
  - Success confirmation
  - Auto-redirect to alerts page

- **Safety Notice:**
  - Reminder to call emergency services for life-threatening situations

## Components

### Layout Component
- **Navigation Bar:**
  - Brand logo/name
  - Dashboard link
  - Bookings link
  - Alerts link (with unread badge)
  - Emergency button (highlighted)
  - User name display
  - Logout button

- **Responsive Design:**
  - Mobile-friendly navigation
  - Collapsible menu on small screens
  - Sticky header

### AuthContext
- **State Management:**
  - User authentication state
  - Loading states
  - Token management

- **Methods:**
  - `login(email, password)` - User login
  - `register(name, email, password, phone)` - User registration
  - `logout()` - User logout
  - Auto-fetch user on app load

## Styling & Design

### Color Scheme
- **Primary Gradient:** Purple to violet (#667eea to #764ba2)
- **Emergency:** Red (#e74c3c)
- **Success:** Green (#27ae60)
- **Warning:** Orange (#f39c12)
- **Info:** Blue (#3498db)

### Design Features
- **Gradient Backgrounds:** Modern purple gradient throughout
- **Card-based Layout:** Clean card design with shadows
- **Smooth Animations:** Hover effects and transitions
- **Responsive Grid:** Flexible grid layouts
- **Mobile-first:** Optimized for all screen sizes

### Responsive Breakpoints
- **Desktop:** Full layout with sidebar navigation
- **Tablet:** Adjusted grid columns
- **Mobile:** Stacked layout, full-width buttons

## API Integration

All API calls use Axios with base URL: `http://localhost:5000/api`

### Endpoints Used:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/unread/count` - Get unread count
- `POST /api/alerts/emergency` - Send emergency alert
- `PUT /api/alerts/:id/read` - Mark alert as read
- `PUT /api/alerts/read-all` - Mark all as read
- `DELETE /api/alerts/:id` - Delete alert
- `GET /api/notifications` - Get notifications

## Protected Routes

All routes except `/login` and `/register` are protected:
- Requires authentication token
- Redirects to login if not authenticated
- Shows loading state during auth check

## User Experience Features

1. **Loading States:** Shows loading indicators during API calls
2. **Error Handling:** Displays user-friendly error messages
3. **Success Feedback:** Confirmation messages for actions
4. **Auto-refresh:** Dashboard and alerts update automatically
5. **Form Validation:** Client-side validation before submission
6. **Confirmation Dialogs:** Confirm before destructive actions
7. **Empty States:** Helpful messages when no data exists
8. **Smooth Navigation:** Seamless page transitions

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Running the Frontend

```bash
# From root directory
npm run client

# Or from client directory
cd client
npm start
```

Frontend runs on: **http://localhost:3000**

## Build for Production

```bash
cd client
npm run build
```

Creates optimized production build in `client/build/` directory.

