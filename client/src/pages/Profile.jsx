import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    bookings: [],
    alerts: [],
    stats: {
      totalBookings: 0,
      completedBookings: 0,
      upcomingBookings: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const [bookingsRes, alertsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings'),
        axios.get('http://localhost:5000/api/alerts')
      ]);

      const bookings = bookingsRes.data;
      const alerts = alertsRes.data;

      const now = new Date();
      const upcoming = bookings.filter(
        booking => new Date(booking.appointmentDate) >= now && 
        booking.status !== 'cancelled' && 
        booking.status !== 'completed'
      );

      setProfileData({
        bookings,
        alerts,
        stats: {
          totalBookings: bookings.length,
          completedBookings: bookings.filter(b => b.status === 'completed').length,
          upcomingBookings: upcoming.length
        }
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
    setEditError('');
    setEditSuccess('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    setEditLoading(true);

    try {
      const response = await axios.put('http://localhost:5000/api/auth/profile', editForm);
      
      // Update user in context
      if (updateUser) {
        updateUser(response.data.user);
      }
      
      setEditSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh user data after a short delay
      setTimeout(() => {
        setEditSuccess('');
        // The user context will be updated automatically
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setEditError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setEditError('');
    setEditSuccess('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);

    try {
      // Validate passwords match
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError('New passwords do not match');
        setPasswordLoading(false);
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long');
        setPasswordLoading(false);
        return;
      }

      await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Hide form after 2 seconds
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Password change error:', err);
      if (err.response?.data?.message) {
        setPasswordError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setPasswordError('Invalid password. Please check your current password.');
      } else {
        setPasswordError('Failed to change password. Please try again.');
      }
    } finally {
      setPasswordLoading(false);
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
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-info">
          <h1>{user?.name || 'User'}</h1>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-phone">📞 {user?.phone}</p>
          <div className="profile-badges">
            <span className="badge-member">Member Since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
            <span className="badge-status">Active Patient</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings ({profileData.stats.totalBookings})
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Medical History
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === 'overview' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="stats-grid-profile">
              <div className="stat-card-profile">
                <div className="stat-icon-profile">📅</div>
                <div className="stat-content">
                  <h3>{profileData.stats.totalBookings}</h3>
                  <p>Total Appointments</p>
                </div>
              </div>
              <div className="stat-card-profile">
                <div className="stat-icon-profile">✅</div>
                <div className="stat-content">
                  <h3>{profileData.stats.completedBookings}</h3>
                  <p>Completed</p>
                </div>
              </div>
              <div className="stat-card-profile">
                <div className="stat-icon-profile">📋</div>
                <div className="stat-content">
                  <h3>{profileData.stats.upcomingBookings}</h3>
                  <p>Upcoming</p>
                </div>
              </div>
              <div className="stat-card-profile">
                <div className="stat-icon-profile">🔔</div>
                <div className="stat-content">
                  <h3>{profileData.alerts.filter(a => !a.isRead).length}</h3>
                  <p>Unread Alerts</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {profileData.bookings.slice(0, 5).map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    className="activity-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="activity-icon">📅</div>
                    <div className="activity-content">
                      <h4>{booking.ointmentType} Appointment</h4>
                      <p>{formatDate(booking.appointmentDate)} at {booking.appointmentTime}</p>
                    </div>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </motion.div>
                ))}
                {profileData.bookings.length === 0 && (
                  <p className="empty-message">No recent activity</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bookings-list-profile">
              {profileData.bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  className="booking-card-profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="booking-header-profile">
                    <h3>{booking.ointmentType}</h3>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details-profile">
                    <div className="detail-row">
                      <span className="detail-label">📅 Date:</span>
                      <span className="detail-value">{formatDate(booking.appointmentDate)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">🕐 Time:</span>
                      <span className="detail-value">{booking.appointmentTime}</span>
                    </div>
                    {booking.description && (
                      <div className="detail-row">
                        <span className="detail-label">📝 Notes:</span>
                        <span className="detail-value">{booking.description}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{formatDate(booking.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {profileData.bookings.length === 0 && (
                <div className="empty-state-profile">
                  <div className="empty-icon-large">📅</div>
                  <h3>No Bookings Yet</h3>
                  <p>You haven't made any appointments yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="history-section">
              <h2>Medical History</h2>
              <div className="history-timeline">
                {profileData.bookings
                  .filter(b => b.status === 'completed')
                  .map((booking, index) => (
                    <motion.div
                      key={booking._id}
                      className="timeline-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>{booking.ointmentType} Treatment</h4>
                        <p className="timeline-date">{formatDate(booking.appointmentDate)}</p>
                        {booking.description && <p>{booking.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                {profileData.bookings.filter(b => b.status === 'completed').length === 0 && (
                  <div className="empty-state-profile">
                    <div className="empty-icon-large">📋</div>
                    <h3>No Medical History</h3>
                    <p>Your completed appointments will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="settings-section">
              <h2>Account Settings</h2>
              
              <div className="settings-card">
                <div className="settings-card-header">
                  <h3>Personal Information</h3>
                  {!isEditing && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Edit Profile
                    </button>
                  )}
                </div>

                {editSuccess && (
                  <div className="success-message">{editSuccess}</div>
                )}
                {editError && (
                  <div className="error-message">{editError}</div>
                )}

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="edit-profile-form">
                    <div className="settings-item">
                      <label htmlFor="edit-name">Full Name *</label>
                      <input
                        type="text"
                        id="edit-name"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="settings-item">
                      <label htmlFor="edit-email">Email Address *</label>
                      <input
                        type="email"
                        id="edit-email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="settings-item">
                      <label htmlFor="edit-phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="edit-phone"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        required
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="edit-form-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                        disabled={editLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={editLoading}
                      >
                        {editLoading ? 'Saving...' : '💾 Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="settings-item">
                      <label>Full Name</label>
                      <input type="text" value={user?.name || ''} readOnly />
                    </div>
                    <div className="settings-item">
                      <label>Email Address</label>
                      <input type="email" value={user?.email || ''} readOnly />
                    </div>
                    <div className="settings-item">
                      <label>Phone Number</label>
                      <input type="tel" value={user?.phone || ''} readOnly />
                    </div>
                  </>
                )}
              </div>

              <div className="settings-card">
                <h3>Notification Preferences</h3>
                <div className="settings-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Email Notifications
                  </label>
                </div>
                <div className="settings-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Appointment Reminders
                  </label>
                </div>
                <div className="settings-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Emergency Alerts
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <div className="settings-card-header">
                  <h3>Privacy & Security</h3>
                  {!showChangePassword && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowChangePassword(true)}
                    >
                      🔒 Change Password
                    </button>
                  )}
                </div>
                <p>Your data is securely stored and encrypted. We follow HIPAA compliance standards.</p>
                
                {showChangePassword && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="change-password-form"
                  >
                    {passwordSuccess && (
                      <div className="success-message">{passwordSuccess}</div>
                    )}
                    {passwordError && (
                      <div className="error-message">{passwordError}</div>
                    )}
                    
                    <form onSubmit={handleChangePassword}>
                      <div className="settings-item">
                        <label htmlFor="currentPassword">Current Password *</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          required
                          placeholder="Enter your current password"
                        />
                      </div>
                      <div className="settings-item">
                        <label htmlFor="newPassword">New Password *</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          required
                          minLength={6}
                          placeholder="Enter new password (min 6 characters)"
                        />
                      </div>
                      <div className="settings-item">
                        <label htmlFor="confirmPassword">Confirm New Password *</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          required
                          minLength={6}
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="edit-form-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowChangePassword(false);
                            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            setPasswordError('');
                            setPasswordSuccess('');
                          }}
                          disabled={passwordLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={passwordLoading}
                        >
                          {passwordLoading ? 'Changing...' : '🔒 Change Password'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
