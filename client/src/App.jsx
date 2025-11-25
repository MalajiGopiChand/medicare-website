import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Alerts from './pages/Alerts';
import BookingForm from './pages/BookingForm';
import MedicineBooking from './pages/MedicineBooking';
import AppointmentBooking from './pages/AppointmentBooking';
import EmergencyAlert from './pages/EmergencyAlert';
import Doctors from './pages/Doctors';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ChatBot from './components/ChatBot';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<><Home /><ChatBot /></>} />
          <Route path="/login" element={<><Login /><ChatBot /></>} />
          <Route path="/register" element={<><Register /><ChatBot /></>} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<><Dashboard /><ChatBot /></>} />
            <Route path="bookings" element={<><Bookings /><ChatBot /></>} />
            <Route path="medicine-booking" element={<><MedicineBooking /><ChatBot /></>} />
            <Route path="appointment-booking" element={<><AppointmentBooking /><ChatBot /></>} />
            <Route path="alerts" element={<><Alerts /><ChatBot /></>} />
            <Route path="emergency" element={<><EmergencyAlert /><ChatBot /></>} />
            <Route path="doctors" element={<><Doctors /><ChatBot /></>} />
            <Route path="profile" element={<><Profile /><ChatBot /></>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

