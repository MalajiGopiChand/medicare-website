import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingBookings: 0,
    unreadAlerts: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    todayAppointments: 0,
    thisWeekAppointments: 0,
    cancelledBookings: 0
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, alertsRes, notificationsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings'),
        axios.get('http://localhost:5000/api/alerts'),
        axios.get('http://localhost:5000/api/notifications')
      ]);

      const bookings = bookingsRes.data;
      const alerts = alertsRes.data;
      setAllBookings(bookings);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      const upcoming = bookings.filter(
        booking => new Date(booking.appointmentDate) >= now && 
        booking.status !== 'cancelled' && 
        booking.status !== 'completed'
      );

      const todayAppts = bookings.filter(booking => {
        const bookingDate = new Date(booking.appointmentDate);
        return bookingDate >= today && bookingDate < new Date(today.getTime() + 24 * 60 * 60 * 1000) &&
               booking.status !== 'cancelled' && booking.status !== 'completed';
      });

      const weekAppts = bookings.filter(booking => {
        const bookingDate = new Date(booking.appointmentDate);
        return bookingDate >= today && bookingDate < weekFromNow &&
               booking.status !== 'cancelled' && booking.status !== 'completed';
      });

      setStats({
        upcomingBookings: upcoming.length,
        unreadAlerts: alerts.filter(a => !a.isRead).length,
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        todayAppointments: todayAppts.length,
        thisWeekAppointments: weekAppts.length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length
      });

      setUpcomingBookings(upcoming.slice(0, 5));
      setRecentAlerts(alerts.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCompletionRate = () => {
    if (stats.totalBookings === 0) return 0;
    return Math.round((stats.completedBookings / stats.totalBookings) * 100);
  };

  const getOintmentTypeStats = () => {
    const types = {};
    allBookings.forEach(booking => {
      types[booking.ointmentType] = (types[booking.ointmentType] || 0) + 1;
    });
    return Object.entries(types)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const completionRate = getCompletionRate();
  const ointmentStats = getOintmentTypeStats();

  return (
    <motion.div
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div className="welcome-section" variants={itemVariants}>
        <div className="welcome-content">
          <h1 className="welcome-title">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="welcome-subtitle">Here's your healthcare overview for today</p>
        </div>
        <div className="welcome-date">
          <div className="date-icon">📅</div>
          <div>
            <div className="date-day">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
            <div className="date-full">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="stats-grid-main">
        <motion.div
          className="stat-card stat-primary"
          variants={itemVariants}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <div className="stat-card-header">
            <div className="stat-icon-wrapper stat-blue">
              <span className="stat-icon">📅</span>
            </div>
            <div className="stat-trend">↑ 12%</div>
          </div>
          <div className="stat-value">{stats.upcomingBookings}</div>
          <div className="stat-label">Upcoming Appointments</div>
          <div className="stat-detail">{stats.todayAppointments} today</div>
        </motion.div>

        <motion.div
          className="stat-card stat-primary"
          variants={itemVariants}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <div className="stat-card-header">
            <div className="stat-icon-wrapper stat-green">
              <span className="stat-icon">✅</span>
            </div>
            <div className="stat-trend">↑ 8%</div>
          </div>
          <div className="stat-value">{stats.completedBookings}</div>
          <div className="stat-label">Completed Bookings</div>
          <div className="stat-detail">{completionRate}% completion rate</div>
        </motion.div>

        <motion.div
          className="stat-card stat-primary"
          variants={itemVariants}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <div className="stat-card-header">
            <div className="stat-icon-wrapper stat-orange">
              <span className="stat-icon">🔔</span>
            </div>
            <div className="stat-trend stat-trend-alert">!</div>
          </div>
          <div className="stat-value">{stats.unreadAlerts}</div>
          <div className="stat-label">Unread Alerts</div>
          <div className="stat-detail">Requires attention</div>
        </motion.div>

        <motion.div
          className="stat-card stat-primary"
          variants={itemVariants}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <div className="stat-card-header">
            <div className="stat-icon-wrapper stat-purple">
              <span className="stat-icon">📊</span>
            </div>
            <div className="stat-trend">↑ 5%</div>
          </div>
          <div className="stat-value">{stats.totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
          <div className="stat-detail">{stats.thisWeekAppointments} this week</div>
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <div className="stats-grid-secondary">
        <motion.div className="stat-card-small" variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <div className="stat-small-icon">⏳</div>
          <div className="stat-small-value">{stats.pendingBookings}</div>
          <div className="stat-small-label">Pending</div>
        </motion.div>
        <motion.div className="stat-card-small" variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <div className="stat-small-icon">📆</div>
          <div className="stat-small-value">{stats.thisWeekAppointments}</div>
          <div className="stat-small-label">This Week</div>
        </motion.div>
        <motion.div className="stat-card-small" variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <div className="stat-small-icon">❌</div>
          <div className="stat-small-value">{stats.cancelledBookings}</div>
          <div className="stat-small-label">Cancelled</div>
        </motion.div>
        <motion.div className="stat-card-small" variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <div className="stat-small-icon">📈</div>
          <div className="stat-small-value">{completionRate}%</div>
          <div className="stat-small-label">Success Rate</div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-main-grid">
        {/* Upcoming Appointments Card */}
        <motion.div className="dashboard-card card-large" variants={itemVariants} whileHover={{ y: -3 }}>
          <div className="card-header">
            <div>
              <h2>📅 Upcoming Appointments</h2>
              <p className="card-subtitle">Your next scheduled visits</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/bookings/new')}>
              + New Booking
            </button>
          </div>
          {upcomingBookings.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon">📅</div>
              <p>No upcoming appointments</p>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard/bookings/new')}>
                Book Now
              </button>
            </div>
          ) : (
            <div className="bookings-list-enhanced">
              {upcomingBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  className="booking-item-enhanced"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5, backgroundColor: '#f0f7ff' }}
                >
                  <div className="booking-icon-wrapper">
                    <span className="booking-type-icon">💊</span>
                  </div>
                  <div className="booking-info-enhanced">
                    <h4>{booking.ointmentType}</h4>
                    <div className="booking-meta">
                      <span className="booking-date">
                        📅 {new Date(booking.appointmentDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="booking-time">🕐 {booking.appointmentTime}</span>
                    </div>
                    {booking.description && (
                      <p className="booking-description">{booking.description}</p>
                    )}
                  </div>
                  <div className="booking-status-wrapper">
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {upcomingBookings.length > 0 && (
            <button className="view-all-btn" onClick={() => navigate('/dashboard/bookings')}>
              View All Bookings →
            </button>
          )}
        </motion.div>

        {/* Recent Alerts Card */}
        <motion.div className="dashboard-card card-large" variants={itemVariants} whileHover={{ y: -3 }}>
          <div className="card-header">
            <div>
              <h2>🔔 Recent Alerts</h2>
              <p className="card-subtitle">Important notifications</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard/alerts')}>
              View All
            </button>
          </div>
          {recentAlerts.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon">🔔</div>
              <p>No alerts at the moment</p>
            </div>
          ) : (
            <div className="alerts-list-enhanced">
              {recentAlerts.map((alert, index) => (
                <motion.div
                  key={alert._id}
                  className={`alert-item-enhanced ${!alert.isRead ? 'unread' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className={`alert-icon-wrapper priority-${alert.priority}`}>
                    {alert.type === 'emergency' ? '🚨' : alert.type === 'appointment' ? '📅' : '📢'}
                  </div>
                  <div className="alert-content-enhanced">
                    <div className="alert-header-enhanced">
                      <h4>{alert.title}</h4>
                      <span className={`badge badge-${alert.priority}`}>
                        {alert.priority}
                      </span>
                    </div>
                    <p>{alert.message}</p>
                    <span className="alert-time">
                      {new Date(alert.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Ointment Type Statistics */}
        <motion.div className="dashboard-card" variants={itemVariants} whileHover={{ y: -3 }}>
          <div className="card-header">
            <div>
              <h2>💊 Ointment Types</h2>
              <p className="card-subtitle">Most used treatments</p>
            </div>
          </div>
          <div className="ointment-stats">
            {ointmentStats.length === 0 ? (
              <p className="empty-state">No data available</p>
            ) : (
              ointmentStats.map((item, index) => {
                const percentage = Math.round((item.count / stats.totalBookings) * 100) || 0;
                return (
                  <motion.div
                    key={item.type}
                    className="ointment-stat-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="ointment-stat-header">
                      <span className="ointment-type">{item.type}</span>
                      <span className="ointment-count">{item.count}</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        style={{ backgroundColor: getProgressColor(index) }}
                      />
                    </div>
                    <span className="ointment-percentage">{percentage}%</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div className="dashboard-card" variants={itemVariants} whileHover={{ y: -3 }}>
          <div className="card-header">
            <div>
              <h2>⚡ Quick Actions</h2>
              <p className="card-subtitle">Common tasks</p>
            </div>
          </div>
          <div className="quick-actions-grid">
            <motion.button
              className="quick-action-btn"
              onClick={() => navigate('/dashboard/medicine-booking')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="action-icon">💊</span>
              <span>Medicine Booking</span>
            </motion.button>
            <motion.button
              className="quick-action-btn"
              onClick={() => navigate('/dashboard/appointment-booking')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="action-icon">📅</span>
              <span>Appointment Booking</span>
            </motion.button>
            <motion.button
              className="quick-action-btn emergency"
              onClick={() => navigate('/dashboard/emergency')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="action-icon">🚨</span>
              <span>Emergency Alert</span>
            </motion.button>
            <motion.button
              className="quick-action-btn"
              onClick={() => navigate('/dashboard/doctors')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="action-icon">👨‍⚕️</span>
              <span>View Doctors</span>
            </motion.button>
            <motion.button
              className="quick-action-btn"
              onClick={() => navigate('/dashboard/profile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="action-icon">👤</span>
              <span>My Profile</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const getProgressColor = (index) => {
  const colors = ['#3282b8', '#0f4c75', '#27ae60', '#f39c12'];
  return colors[index % colors.length];
};

export default Dashboard;
