import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, emergency

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/alerts/${id}/read`);
      fetchAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/alerts/read-all');
      fetchAlerts();
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await axios.delete(`http://localhost:5000/api/alerts/${id}`);
        fetchAlerts();
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.isRead;
    if (filter === 'emergency') return alert.type === 'emergency';
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading alerts...</div>;
  }

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div>
          <h1 style={{ color: "black" }}>Alerts & Notifications</h1>
          {unreadCount > 0 && (
            <p className="unread-count" style={{ color: "black" }}>{unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={handleMarkAllAsRead}  >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')} style={{ color: "black" }}
        >
          All ({alerts.length})
        </button>
        <button
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')} style={{ color: "black" }}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`filter-tab ${filter === 'emergency' ? 'active' : ''}`}
          onClick={() => setFilter('emergency')} style={{ color: "black" }}
        >
          Emergency ({alerts.filter(a => a.type === 'emergency').length})
        </button>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">🔔</div>
          <h2 style={{ color: "black" }}>No Alerts</h2>
          <p>You're all caught up! No alerts to display.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {filteredAlerts.map(alert => (
            <div
              key={alert._id}
              className={`alert-card ${!alert.isRead ? 'unread' : ''} priority-${alert.priority}`}
            >
              <div className="alert-icon">
                {alert.type === 'emergency' ? '🚨' : 
                 alert.type === 'appointment' ? '📅' : 
                 alert.type === 'medication' ? '💊' : '📢'}
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <h3>{alert.title}</h3>
                  <span className={`badge badge-${alert.priority}`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <div className="alert-footer">
                  <span className="alert-date">{formatDate(alert.createdAt)}</span>
                  <div className="alert-actions">
                    {!alert.isRead && (
                      <button
                        className="btn-mark-read"
                        onClick={() => handleMarkAsRead(alert._id)}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(alert._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;

