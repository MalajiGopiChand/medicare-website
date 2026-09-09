import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    totalPatients: 0,
    averageRating: 0,
    totalRevenue: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, prescriptionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments'),
        axios.get('http://localhost:5000/api/prescriptions')
      ]);

      const allAppointments = appointmentsRes.data;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayAppts = allAppointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate.toDateString() === today.toDateString() && apt.status !== 'cancelled';
      });

      const upcomingAppts = allAppointments.filter(apt => 
        new Date(apt.appointmentDate) > new Date() && apt.status !== 'completed' && apt.status !== 'cancelled'
      );

      setStats({
        todayAppointments: todayAppts.length,
        upcomingAppointments: upcomingAppts.length,
        completedAppointments: allAppointments.filter(a => a.status === 'completed').length,
        totalPatients: new Set(allAppointments.map(a => a.patient?._id)).size,
        averageRating: user.averageRating || 0,
        totalRevenue: allAppointments.reduce((sum, a) => sum + (a.consultationFee || 0), 0)
      });

      setAppointments(allAppointments.slice(0, 5));
      setRecentPrescriptions(prescriptionsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 15 },
    { name: 'Wed', appointments: 10 },
    { name: 'Thu', appointments: 18 },
    { name: 'Fri', appointments: 14 },
    { name: 'Sat', appointments: 8 },
    { name: 'Sun', appointments: 5 }
  ];

  const statusData = [
    { name: 'Completed', value: stats.completedAppointments },
    { name: 'Upcoming', value: stats.upcomingAppointments },
    { name: 'Today', value: stats.todayAppointments }
  ];

  const COLORS = ['#3282b8', '#27ae60', '#f39c12'];

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>👨‍⚕️ Doctor Dashboard</h1>
        <p>Welcome back, Dr. {user?.name}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.todayAppointments}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedAppointments}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.averageRating.toFixed(1)}</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Weekly Appointments</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#3282b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h2>Appointment Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Recent Appointments</h2>
          <div className="appointments-list">
            {appointments.length === 0 ? (
              <p className="empty-state">No appointments</p>
            ) : (
              appointments.map(apt => (
                <div key={apt._id} className="appointment-item">
                  <div>
                    <h4>{apt.patient?.name}</h4>
                    <p>{new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}</p>
                  </div>
                  <span className={`status-badge status-${apt.status}`}>{apt.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Prescriptions</h2>
          <div className="prescriptions-list">
            {recentPrescriptions.length === 0 ? (
              <p className="empty-state">No prescriptions</p>
            ) : (
              recentPrescriptions.map(pres => (
                <div key={pres._id} className="prescription-item">
                  <h4>{pres.patient?.name}</h4>
                  <p>{pres.diagnosis || 'No diagnosis'}</p>
                  <small>{new Date(pres.createdAt).toLocaleDateString()}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/appointments')}>
          View All Appointments
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/prescriptions')}>
          Create Prescription
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/profile')}>
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default DoctorDashboard;

