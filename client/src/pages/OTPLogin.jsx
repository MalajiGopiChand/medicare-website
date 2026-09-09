import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Auth.css';

const OTPLogin = () => {
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP verification
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const { loginWithOTP } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-otp', { phone });
      setStep(2);
      // Show OTP in development mode
      if (response.data.otp) {
        console.log(`OTP for ${phone}: ${response.data.otp}`);
        alert(`OTP sent! (Dev mode) OTP: ${response.data.otp}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First try to verify without name/email (for existing users)
      if (!isNewUser) {
        try {
          await loginWithOTP(phone, otp);
          navigate('/dashboard');
          return;
        } catch (err) {
          // If user doesn't exist, ask for name and email
          if (err.response?.status === 400 && 
              (err.response?.data?.message?.includes('Name and email') || 
               err.response?.data?.message?.includes('required for registration'))) {
            setIsNewUser(true);
            setError('Please provide your name and email to complete registration.');
            setLoading(false);
            return;
          }
          throw err;
        }
      }

      // For new users, name and email are required
      if (!name || !email) {
        setError('Name and email are required for registration.');
        setLoading(false);
        return;
      }

      // Register new user with OTP
      await loginWithOTP(phone, otp, name, email);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
        setError(err.response?.data?.message + ' Please login instead.');
        setIsNewUser(false);
      } else if (err.response?.status === 400 && err.response?.data?.message?.includes('Name and email')) {
        setIsNewUser(true);
        setError('Please provide your name and email to complete registration.');
      } else {
        setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🏥 Healthcare Assistant</h1>
          <p>{step === 1 ? 'Enter your phone number' : 'Enter the OTP sent to your phone'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="auth-form">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+91 9876543210"
                pattern="[+]?[0-9]{10,15}"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            {isNewUser && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                pattern="[0-9]{6}"
              />
              <small style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                OTP sent to {phone}
              </small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                  setIsNewUser(false);
                }}
                disabled={loading}
              >
                Change Number
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          <p>
            {step === 1 ? (
              <>
                Already have an account? <Link to="/login">Login with password</Link>
              </>
            ) : (
              <>
                Didn't receive OTP? <button type="button" onClick={handleSendOTP} className="link-button">Resend</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;

