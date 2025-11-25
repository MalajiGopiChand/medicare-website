import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './AppointmentBooking.css';

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    problemType: '',
    severity: 'moderate',
    appointmentDate: '',
    appointmentTime: '',
    symptoms: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const healthProblems = [
    { id: 'fever', name: 'Fever', icon: '🌡️', description: 'High body temperature' },
    { id: 'cough', name: 'Cough', icon: '🤧', description: 'Persistent or severe coughing' },
    { id: 'cold', name: 'Cold & Flu', icon: '😷', description: 'Common cold symptoms' },
    { id: 'headache', name: 'Headache', icon: '🤕', description: 'Persistent headaches' },
    { id: 'stomach', name: 'Stomach Issues', icon: '🤢', description: 'Digestive problems' },
    { id: 'allergy', name: 'Allergies', icon: '🤧', description: 'Allergic reactions' },
    { id: 'skin', name: 'Skin Problems', icon: '🔴', description: 'Skin conditions' },
    { id: 'pain', name: 'Body Pain', icon: '😣', description: 'Muscle or joint pain' },
    { id: 'breathing', name: 'Breathing Issues', icon: '😮‍💨', description: 'Respiratory problems' },
    { id: 'infection', name: 'Infection', icon: '🦠', description: 'Suspected infections' },
    { id: 'eye', name: 'Eye Problems', icon: '👁️', description: 'Eye-related issues' },
    { id: 'ear', name: 'Ear Problems', icon: '👂', description: 'Ear pain or issues' },
    { id: 'throat', name: 'Throat Issues', icon: '🫁', description: 'Sore throat or swallowing problems' },
    { id: 'dental', name: 'Dental Problems', icon: '🦷', description: 'Tooth or gum issues' },
    { id: 'mental', name: 'Mental Health', icon: '🧠', description: 'Anxiety, stress, or depression' },
    { id: 'other', name: 'Other', icon: '🏥', description: 'Other health concerns' }
  ];

  const severityLevels = [
    { value: 'mild', label: 'Mild', color: '#27ae60' },
    { value: 'moderate', label: 'Moderate', color: '#f39c12' },
    { value: 'severe', label: 'Severe', color: '#e74c3c' },
    { value: 'critical', label: 'Critical', color: '#c0392b' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleProblemSelect = (problem) => {
    setFormData({
      ...formData,
      problemType: problem.name
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.appointmentDate && formData.appointmentTime) {
        const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
        const now = new Date();
        
        if (appointmentDateTime <= now) {
          setError('Appointment date and time must be in the future');
          setLoading(false);
          return;
        }
      }

      // Map problem type to category
      const problemCategoryMap = {
        'Fever': 'Fever',
        'Cough': 'Cough',
        'Cold & Flu': 'Cold',
        'Headache': 'Headache',
        'Stomach Issues': 'Stomach',
        'Allergies': 'Allergy',
        'Skin Problems': 'Skin',
        'Body Pain': 'Pain',
        'Breathing Issues': 'Breathing',
        'Infection': 'Infection',
        'Eye Problems': 'Eye',
        'Ear Problems': 'Ear',
        'Throat Issues': 'Throat',
        'Dental Problems': 'Dental',
        'Mental Health': 'Mental Health',
        'Other': 'General'
      };

      const bookingData = {
        ointmentType: formData.problemType,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        description: `Severity: ${formData.severity}\nSymptoms: ${formData.symptoms}\n${formData.description || ''}`,
        bookingType: 'appointment',
        category: problemCategoryMap[formData.problemType] || 'General'
      };

      await axios.post('http://localhost:5000/api/bookings', bookingData);
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
        setError('Failed to create appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="appointment-booking-page">
      <div className="appointment-booking-container">
        <motion.div
          className="form-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>🏥 Appointment Booking</h1>
          <p>Book an appointment for your health concerns</p>
        </motion.div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="appointment-booking-form">
          <div className="form-section">
            <h3>Select Health Problem</h3>
            <div className="problems-grid">
              {healthProblems.map((problem, index) => (
                <motion.button
                  key={problem.id}
                  type="button"
                  className={`problem-card ${formData.problemType === problem.name ? 'selected' : ''}`}
                  onClick={() => handleProblemSelect(problem)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="problem-icon">{problem.icon}</div>
                  <div className="problem-name">{problem.name}</div>
                  <div className="problem-desc">{problem.description}</div>
                </motion.button>
              ))}
            </div>
            {formData.problemType && (
              <div className="selected-problem">
                Selected: <strong>{formData.problemType}</strong>
              </div>
            )}
          </div>

          <div className="form-section">
            <label htmlFor="severity">Severity Level *</label>
            <div className="severity-options">
              {severityLevels.map(level => (
                <label key={level.value} className="severity-option">
                  <input
                    type="radio"
                    name="severity"
                    value={level.value}
                    checked={formData.severity === level.value}
                    onChange={handleChange}
                    required
                  />
                  <span className="severity-label" style={{ borderColor: level.color }}>
                    <span className="severity-dot" style={{ backgroundColor: level.color }}></span>
                    {level.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="symptoms">Symptoms *</label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe your symptoms in detail (e.g., fever for 2 days, persistent cough, etc.)"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="appointmentDate">Preferred Date *</label>
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
            <label htmlFor="appointmentTime">Preferred Time *</label>
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
            <label htmlFor="description">Additional Information (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any additional information, medical history, or concerns..."
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
            <button type="submit" className="btn btn-primary" disabled={loading || !formData.problemType}>
              {loading ? 'Booking...' : '🏥 Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking;

