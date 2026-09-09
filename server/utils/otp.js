const crypto = require('crypto');

// Generate 6-digit OTP
exports.generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Store OTP in memory (in production, use Redis)
const otpStore = new Map();

exports.storeOTP = (phone, otp) => {
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(phone, { otp, expiry });
};

exports.verifyOTP = (phone, otp) => {
  const stored = otpStore.get(phone);
  if (!stored) return false;
  if (Date.now() > stored.expiry) {
    otpStore.delete(phone);
    return false;
  }
  if (stored.otp === otp) {
    otpStore.delete(phone);
    return true;
  }
  return false;
};

exports.clearOTP = (phone) => {
  otpStore.delete(phone);
};

