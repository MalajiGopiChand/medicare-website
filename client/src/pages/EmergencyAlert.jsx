import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmergencyAlert.css';

const EmergencyAlert = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
      await axios.post('http://localhost:5000/api/alerts/emergency', formData);
      setSuccess(true);
      setFormData({ title: '', message: '' });
      setTimeout(() => {
        navigate('/alerts');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send emergency alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickOptions = [
    { title: 'Medical Emergency', message: 'I need immediate medical assistance' },
    { title: 'Severe Pain', message: 'Experiencing severe pain that requires urgent attention' },
    { title: 'Allergic Reaction', message: 'Having an allergic reaction, need immediate help' },
    { title: 'Difficulty Breathing', message: 'Experiencing difficulty breathing' }
  ];

  const handleQuickSelect = (option) => {
    setFormData({
      title: option.title,
      message: option.message
    });
  };

  return (
    <div className="emergency-page">
      <div className="emergency-container">
        <div className="emergency-header">
          <div className="emergency-icon">🚨</div>
          <h1>Emergency Alert</h1>
          <p>Send an emergency alert to get immediate assistance</p>
        </div>

        {success && (
          <div className="success-message">
            ✅ Emergency alert sent successfully! Redirecting to alerts...
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="quick-options">
          <h3>Quick Options</h3>
          <div className="quick-options-grid">
            {quickOptions.map((option, index) => (
              <button
                key={index}
                className="quick-option-btn"
                onClick={() => handleQuickSelect(option)}
              >
                {option.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="emergency-form">
          <div className="form-group">
            <label htmlFor="title">Alert Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Medical Emergency"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Emergency Details *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Describe your emergency situation..."
              rows="6"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-danger emergency-submit" disabled={loading}>
              {loading ? 'Sending...' : '🚨 Send Emergency Alert'}
            </button>
          </div>
        </form>

        <div className="emergency-info">
          <p>
            <strong>Note:</strong> In case of a life-threatening emergency, please call your local
            emergency services immediately (e.g., 911, 112, etc.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;

