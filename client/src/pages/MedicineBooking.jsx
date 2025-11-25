import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './MedicineBooking.css';

const MedicineBooking = () => {
  const [formData, setFormData] = useState({
    medicineType: '',
    appointmentDate: '',
    appointmentTime: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const medicines = {
    'Antibiotics': [
      'Amoxicillin', 'Azithromycin', 'Cephalexin', 'Ciprofloxacin', 'Doxycycline',
      'Erythromycin', 'Penicillin', 'Tetracycline', 'Clindamycin', 'Metronidazole',
      'Trimethoprim', 'Sulfamethoxazole', 'Levofloxacin', 'Vancomycin', 'Gentamicin'
    ],
    'Antifungals': [
      'Clotrimazole', 'Miconazole', 'Ketoconazole', 'Fluconazole', 'Terbinafine',
      'Nystatin', 'Amphotericin B', 'Itraconazole', 'Voriconazole', 'Caspofungin',
      'Griseofulvin', 'Ciclopirox', 'Econazole', 'Sertaconazole', 'Butenafine'
    ],
    'Steroids': [
      'Hydrocortisone', 'Prednisone', 'Betamethasone', 'Dexamethasone', 'Triamcinolone',
      'Mometasone', 'Fluticasone', 'Clobetasol', 'Methylprednisolone', 'Beclomethasone',
      'Budesonide', 'Fluocinolone', 'Desonide', 'Alclometasone', 'Flurandrenolide'
    ],
    'Moisturizers': [
      'Cetaphil', 'Eucerin', 'Aveeno', 'CeraVe', 'Vanicream',
      'Aquaphor', 'Vaseline', 'Lubriderm', 'Neutrogena', 'La Roche-Posay',
      'Bioderma', 'Avene', 'Sebamed', 'Dove', 'Nivea'
    ],
    'Pain Relief': [
      'Ibuprofen', 'Acetaminophen', 'Aspirin', 'Naproxen', 'Diclofenac',
      'Meloxicam', 'Celecoxib', 'Tramadol', 'Codeine', 'Morphine',
      'Gabapentin', 'Pregabalin', 'Lidocaine', 'Benzocaine', 'Capsaicin'
    ],
    'Antihistamines': [
      'Diphenhydramine', 'Loratadine', 'Cetirizine', 'Fexofenadine', 'Chlorpheniramine',
      'Promethazine', 'Hydroxyzine', 'Desloratadine', 'Levocetirizine', 'Cyproheptadine'
    ],
    'Vitamins': [
      'Vitamin D', 'Vitamin C', 'Vitamin B12', 'Vitamin E', 'Vitamin A',
      'Folic Acid', 'Biotin', 'Niacin', 'Riboflavin', 'Thiamine',
      'Calcium', 'Iron', 'Zinc', 'Magnesium', 'Multivitamin'
    ],
    'Topical Treatments': [
      'Benzoyl Peroxide', 'Salicylic Acid', 'Retin-A', 'Adapalene', 'Tretinoin',
      'Azelaic Acid', 'Glycolic Acid', 'Tea Tree Oil', 'Aloe Vera', 'Calamine',
      'Zinc Oxide', 'Coal Tar', 'Sulfur', 'Urea', 'Lactic Acid'
    ],
    'Other': [
      'Custom Prescription', 'Specialized Treatment', 'Compounded Medication', 'Other'
    ]
  };

  const allMedicines = Object.values(medicines).flat();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleMedicineSelect = (medicine) => {
    setFormData({
      ...formData,
      medicineType: medicine
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

      // Determine category based on selected medicine
      const categoryMap = {
        'Antibiotics': 'Antibiotic',
        'Antifungals': 'Antifungal',
        'Steroids': 'Steroid',
        'Moisturizers': 'Moisturizer',
        'Pain Relief': 'Pain Relief',
        'Antihistamines': 'Antihistamine',
        'Vitamins': 'Vitamin',
        'Topical Treatments': 'Topical Treatment',
        'Other': 'Other'
      };

      // Find which category the selected medicine belongs to
      let medicineCategory = 'Other';
      if (selectedCategory !== 'all') {
        medicineCategory = categoryMap[selectedCategory] || 'Other';
      } else {
        // If "all" is selected, try to find the category
        for (const [cat, meds] of Object.entries(medicines)) {
          if (meds.includes(formData.medicineType)) {
            medicineCategory = categoryMap[cat] || 'Other';
            break;
          }
        }
      }

      const bookingData = {
        ointmentType: formData.medicineType,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        description: formData.description,
        bookingType: 'medicine',
        category: medicineCategory
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
        setError('Failed to create booking. Please try again.');
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

  const filteredMedicines = selectedCategory === 'all' 
    ? allMedicines 
    : medicines[selectedCategory] || [];

  return (
    <div className="medicine-booking-page">
      <div className="medicine-booking-container">
        <motion.div
          className="form-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>💊 Medicine Booking</h1>
          <p>Book an appointment for your medicine or ointment needs</p>
        </motion.div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="medicine-booking-form">
          <div className="form-section">
            <h3>Select Medicine Category</h3>
            <div className="category-tabs">
              {Object.keys(medicines).map(category => (
                <button
                  key={category}
                  type="button"
                  className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
              <button
                type="button"
                className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Medicines
              </button>
            </div>
          </div>

          <div className="form-section">
            <label htmlFor="medicineType">Select Medicine *</label>
            <div className="medicine-grid">
              {filteredMedicines.map((medicine, index) => (
                <motion.button
                  key={index}
                  type="button"
                  className={`medicine-card ${formData.medicineType === medicine ? 'selected' : ''}`}
                  onClick={() => handleMedicineSelect(medicine)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  {medicine}
                </motion.button>
              ))}
            </div>
            {formData.medicineType && (
              <div className="selected-medicine">
                Selected: <strong>{formData.medicineType}</strong>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="appointmentDate">Appointment Date *</label>
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
            <label htmlFor="appointmentTime">Appointment Time *</label>
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
            <label htmlFor="description">Additional Notes (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any additional information, dosage requirements, or special instructions..."
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
            <button type="submit" className="btn btn-primary" disabled={loading || !formData.medicineType}>
              {loading ? 'Booking...' : '💊 Book Medicine Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineBooking;

