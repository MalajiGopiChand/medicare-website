import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h1 style={{ color: "black" }}>My Bookings</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard/medicine-booking')}>
            💊 Medicine Booking
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/appointment-booking')}>
            📅 Appointment Booking
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">📅</div>
          <h2>No Bookings Yet</h2>
          <p>Start by booking your first appointment</p>
          <div className="empty-state-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard/medicine-booking')}>
              💊 Book Medicine
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/appointment-booking')}>
              📅 Book Appointment
            </button>
          </div>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-card-header">
                <h3>{booking.ointmentType}</h3>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-details">
                <div className="detail-item">
                  <span className="detail-label">📅 Date:</span>
                  <span className="detail-value">{formatDate(booking.appointmentDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🕐 Time:</span>
                  <span className="detail-value">{booking.appointmentTime}</span>
                </div>
                {booking.description && (
                  <div className="detail-item">
                    <span className="detail-label">📝 Notes:</span>
                    <span className="detail-value">{booking.description}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{formatDate(booking.createdAt)}</span>
                </div>
              </div>
              <div className="booking-actions">
                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(booking._id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;

