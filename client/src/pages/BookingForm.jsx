import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    ointmentType: '',
    appointmentDate: '',
    appointmentTime: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate date and time
      if (formData.appointmentDate && formData.appointmentTime) {
        const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
        const now = new Date();
        
        if (appointmentDateTime <= now) {
          setError('Appointment date and time must be in the future');
          setLoading(false);
          return;
        }
      }

      // Send data as-is (backend will handle date formatting)
      await axios.post('http://localhost:5000/api/bookings', formData);
      navigate('/dashboard/bookings');
    } catch (err) {
      console.error('Booking error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Please login again. Your session may have expired.');
      } else if (err.response?.status === 400) {
        setError('Invalid booking data. Please check all fields.');
      } else if (!err.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to create booking. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date as minimum date
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="booking-form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Book Ointment Appointment</h1>
          <p>Schedule your healthcare appointment</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="ointmentType">Ointment Type *</label>
            <select
              id="ointmentType"
              name="ointmentType"
              value={formData.ointmentType}
              onChange={handleChange}
              required
            >
              <option value="">Select ointment type</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Antifungal">Antifungal</option>
              <option value="Steroid">Steroid</option>
              <option value="Moisturizer">Moisturizer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="appointmentDate">Appointment Date *</label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={getMinDate()}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="appointmentTime">Appointment Time *</label>
            <input
              type="time"
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Additional Notes (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any additional information or special requirements..."
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard/bookings')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;

