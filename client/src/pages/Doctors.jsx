import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Doctors.css';

const Doctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Dermatologist',
      experience: '15 years',
      education: 'MD, Harvard Medical School',
      image: '👩‍⚕️',
      description: 'Expert in skin care and ointment treatments with extensive experience in dermatology.',
      expertise: ['Acne Treatment', 'Eczema Management', 'Skin Allergies', 'Ointment Prescriptions'],
      availability: 'Mon-Fri: 9 AM - 5 PM',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@healthcare.com',
      rating: 4.9,
      patients: 2500,
      languages: ['English', 'Spanish']
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'General Practitioner',
      experience: '12 years',
      education: 'MD, Johns Hopkins University',
      image: '👨‍⚕️',
      description: 'Specialized in preventive care and medication management with a focus on patient wellness.',
      expertise: ['General Medicine', 'Preventive Care', 'Chronic Disease Management', 'Health Checkups'],
      availability: 'Mon-Sat: 8 AM - 6 PM',
      phone: '+1 (555) 234-5678',
      email: 'michael.chen@healthcare.com',
      rating: 4.8,
      patients: 3200,
      languages: ['English', 'Mandarin']
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialization: 'Emergency Medicine',
      experience: '10 years',
      education: 'MD, Stanford University',
      image: '👩‍⚕️',
      description: 'Available 24/7 for emergency consultations with expertise in urgent care and critical situations.',
      expertise: ['Emergency Care', 'Trauma Treatment', 'Acute Illness', 'Urgent Consultations'],
      availability: '24/7 Emergency Service',
      phone: '+1 (555) 345-6789',
      email: 'emily.rodriguez@healthcare.com',
      rating: 4.9,
      patients: 1800,
      languages: ['English', 'Spanish', 'French']
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialization: 'Pediatric Care',
      experience: '18 years',
      education: 'MD, Boston Children\'s Hospital',
      image: '👨‍⚕️',
      description: 'Expert in children\'s healthcare and treatments with a gentle approach to pediatric care.',
      expertise: ['Pediatric Care', 'Child Development', 'Vaccinations', 'Child Skin Care'],
      availability: 'Mon-Fri: 10 AM - 4 PM',
      phone: '+1 (555) 456-7890',
      email: 'james.wilson@healthcare.com',
      rating: 4.95,
      patients: 4200,
      languages: ['English']
    },
    {
      id: 5,
      name: 'Dr. Priya Sharma',
      specialization: 'Dermatology & Cosmetology',
      experience: '14 years',
      education: 'MD, AIIMS Delhi',
      image: '👩‍⚕️',
      description: 'Specialized in advanced dermatological treatments and cosmetic procedures.',
      expertise: ['Advanced Dermatology', 'Cosmetic Procedures', 'Skin Rejuvenation', 'Hair Care'],
      availability: 'Tue-Sat: 9 AM - 6 PM',
      phone: '+1 (555) 567-8901',
      email: 'priya.sharma@healthcare.com',
      rating: 4.85,
      patients: 2800,
      languages: ['English', 'Hindi', 'Tamil']
    },
    {
      id: 6,
      name: 'Dr. Robert Anderson',
      specialization: 'Internal Medicine',
      experience: '20 years',
      education: 'MD, Mayo Clinic',
      image: '👨‍⚕️',
      description: 'Experienced in treating complex medical conditions and managing long-term health issues.',
      expertise: ['Internal Medicine', 'Chronic Disease', 'Diabetes Management', 'Hypertension'],
      availability: 'Mon-Fri: 8 AM - 5 PM',
      phone: '+1 (555) 678-9012',
      email: 'robert.anderson@healthcare.com',
      rating: 4.9,
      patients: 5000,
      languages: ['English']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="doctors-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="doctors-header">
        <h1>Our Expert Doctors</h1>
        <p>Meet our team of experienced healthcare professionals dedicated to your well-being</p>
      </div>

      <div className="doctors-grid">
        {doctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            className="doctor-card"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => setSelectedDoctor(doctor)}
          >
            <div className="doctor-image-large">{doctor.image}</div>
            <div className="doctor-card-content">
              <h3>{doctor.name}</h3>
              <p className="doctor-specialty">{doctor.specialization}</p>
              <div className="doctor-rating">
                <span className="stars">⭐</span>
                <span className="rating-value">{doctor.rating}</span>
                <span className="rating-count">({doctor.patients}+ patients)</span>
              </div>
              <p className="doctor-experience">Experience: {doctor.experience}</p>
              <p className="doctor-description-short">{doctor.description}</p>
              <div className="doctor-availability">
                <span>🕐 {doctor.availability}</span>
              </div>
              <button className="view-details-btn">View Details</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <motion.div
          className="doctor-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedDoctor(null)}
        >
          <motion.div
            className="doctor-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={() => setSelectedDoctor(null)}>×</button>
            <div className="doctor-modal-content">
              <div className="doctor-modal-header">
                <div className="doctor-modal-image">{selectedDoctor.image}</div>
                <div>
                  <h2>{selectedDoctor.name}</h2>
                  <p className="doctor-modal-specialty">{selectedDoctor.specialization}</p>
                  <div className="doctor-modal-rating">
                    <span className="stars">⭐</span>
                    <span>{selectedDoctor.rating}</span>
                    <span className="rating-text">({selectedDoctor.patients}+ patients)</span>
                  </div>
                </div>
              </div>

              <div className="doctor-modal-body">
                <div className="modal-section">
                  <h3>About</h3>
                  <p>{selectedDoctor.description}</p>
                </div>

                <div className="modal-section">
                  <h3>Education</h3>
                  <p>{selectedDoctor.education}</p>
                </div>

                <div className="modal-section">
                  <h3>Areas of Expertise</h3>
                  <div className="expertise-tags">
                    {selectedDoctor.expertise.map((item, idx) => (
                      <span key={idx} className="expertise-tag">{item}</span>
                    ))}
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Contact Information</h3>
                  <div className="contact-info">
                    <p><strong>Phone:</strong> {selectedDoctor.phone}</p>
                    <p><strong>Email:</strong> {selectedDoctor.email}</p>
                    <p><strong>Availability:</strong> {selectedDoctor.availability}</p>
                    <p><strong>Languages:</strong> {selectedDoctor.languages.join(', ')}</p>
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Experience</h3>
                  <p>{selectedDoctor.experience} of professional experience in {selectedDoctor.specialization}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Doctors;

