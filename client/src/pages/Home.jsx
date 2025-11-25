import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Dermatologist',
      experience: '15 years',
      image: '👩‍⚕️',
      description: 'Expert in skin care and ointment treatments'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'General Practitioner',
      experience: '12 years',
      image: '👨‍⚕️',
      description: 'Specialized in preventive care and medication management'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialization: 'Emergency Medicine',
      experience: '10 years',
      image: '👩‍⚕️',
      description: 'Available 24/7 for emergency consultations'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialization: 'Pediatric Care',
      experience: '18 years',
      image: '👨‍⚕️',
      description: 'Expert in children\'s healthcare and treatments'
    }
  ];

  const features = [
    { icon: '📅', title: 'Easy Booking', desc: 'Book appointments in minutes' },
    { icon: '🚨', title: 'Emergency Alerts', desc: '24/7 emergency support' },
    { icon: '🔔', title: 'Notifications', desc: 'Stay updated with reminders' },
    { icon: '💊', title: 'Ointment Care', desc: 'Specialized ointment treatments' }
  ];

  return (
    <div className="home-page">
      {/* Navigation Header */}
      <nav className="home-nav">
        <div className="home-nav-container">
          <div className="home-nav-brand">
            <h2>🏥 Healthcare Assistant</h2>
          </div>
          <div className="home-nav-links">
            <Link to="/login" className="nav-link-btn">Sign In</Link>
            <Link to="/register" className="nav-link-btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-title" variants={itemVariants}>
            Your Trusted Healthcare
            <span className="highlight"> Assistant</span>
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Book ointment appointments, manage your health, and get emergency alerts
            all in one place. Professional care at your fingertips.
          </motion.p>
          <motion.div className="hero-buttons" variants={itemVariants}>
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline btn-large">
              Sign In
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span>↓</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Us?
          </motion.h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">About Our Healthcare Platform</h2>
              <p className="about-description">
                We are dedicated to providing exceptional healthcare services through
                innovative technology. Our platform connects patients with professional
                medical care, making healthcare accessible, convenient, and reliable.
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <h3>10,000+</h3>
                  <p>Happy Patients</p>
                </div>
                <div className="stat-item">
                  <h3>50+</h3>
                  <p>Expert Doctors</p>
                </div>
                <div className="stat-item">
                  <h3>24/7</h3>
                  <p>Emergency Support</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="about-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="image-placeholder">
                <span className="medical-icon">🏥</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="doctors-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Meet Our Expert Doctors
          </motion.h2>
          <p className="section-subtitle">
            Our team of experienced healthcare professionals is dedicated to your well-being
          </p>
          <div className="doctors-grid">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                className="doctor-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -10 }}
              >
                <div className="doctor-image">{doctor.image}</div>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="doctor-specialization">{doctor.specialization}</p>
                  <p className="doctor-experience">Experience: {doctor.experience}</p>
                  <p className="doctor-description">{doctor.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of patients who trust us with their healthcare needs</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Create Account
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

