import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts/unread/count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h2>🏥 Healthcare Assistant</h2>
          </div>
          <div className="nav-links">
            <button
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`nav-link ${isActive('/dashboard/bookings') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard/bookings')}
            >
              Bookings
            </button>
            <button
              className={`nav-link ${isActive('/dashboard/alerts') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard/alerts')}
            >
              Alerts {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
            </button>
            <button
              className={`nav-link ${isActive('/dashboard/doctors') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard/doctors')}
            >
              👨‍⚕️ Doctors
            </button>
            <button
              className={`nav-link emergency ${isActive('/dashboard/emergency') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard/emergency')}
            >
              🚨 Emergency
            </button>
            <div className="user-menu">
              <button
                className={`nav-link profile-link ${isActive('/dashboard/profile') ? 'active' : ''}`}
                onClick={() => navigate('/dashboard/profile')}
                title="Profile"
              >
                👤 {user?.name?.split(' ')[0] || 'Profile'}
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

