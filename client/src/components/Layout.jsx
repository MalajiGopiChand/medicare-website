import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from './ThemeProvider';
import axios from 'axios';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const getRoleBasedNavItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/dashboard/bookings', label: 'Bookings', icon: '📅' },
      { path: '/dashboard/alerts', label: 'Alerts', icon: '🔔', badge: unreadCount }
    ];

    if (user?.role === 'doctor') {
      return [
        ...baseItems,
        { path: '/dashboard/appointments', label: 'Appointments', icon: '👨‍⚕️' },
        { path: '/dashboard/prescriptions', label: 'Prescriptions', icon: '💊' }
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/dashboard/admin/staff', label: 'Staff', icon: '👥' },
        { path: '/dashboard/admin/analytics', label: 'Analytics', icon: '📊' },
        { path: '/dashboard/admin/beds', label: 'Beds', icon: '🛏️' }
      ];
    }

    if (user?.role === 'lab') {
      return [
        ...baseItems,
        { path: '/dashboard/lab/reports', label: 'Lab Reports', icon: '🧪' }
      ];
    }

    if (user?.role === 'pharmacy') {
      return [
        ...baseItems,
        { path: '/dashboard/pharmacy/medicines', label: 'Medicines', icon: '💊' },
        { path: '/dashboard/pharmacy/prescriptions', label: 'Prescriptions', icon: '📋' }
      ];
    }

    return baseItems;
  };

  return (
    <div className="layout" data-theme={theme}>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h2>🏥 Healthcare Assistant</h2>
            <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              ☰
            </button>
          </div>
          <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {getRoleBasedNavItems().map(item => (
              <button
                key={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.icon} {item.label}
                {item.badge > 0 && <span className="badge-count">{item.badge}</span>}
              </button>
            ))}
            <button
              className={`nav-link ${isActive('/dashboard/doctors') ? 'active' : ''}`}
              onClick={() => {
                navigate('/dashboard/doctors');
                setIsMobileMenuOpen(false);
              }}
            >
              👨‍⚕️ Doctors
            </button>
            <button
              className={`nav-link emergency ${isActive('/dashboard/emergency') ? 'active' : ''}`}
              onClick={() => {
                navigate('/dashboard/emergency');
                setIsMobileMenuOpen(false);
              }}
            >
              🚨 Emergency
            </button>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="user-menu">
              <button
                className={`nav-link profile-link ${isActive('/dashboard/profile') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/dashboard/profile');
                  setIsMobileMenuOpen(false);
                }}
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

