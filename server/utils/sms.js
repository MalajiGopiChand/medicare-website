// Using Twilio for SMS (you can replace with other providers)
const twilio = require('twilio');

let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (err) {
    console.error('Failed to initialize Twilio client:', err.message);
  }
}

exports.sendOTPSMS = async (phone, otp) => {
  if (!client) {
    console.log(`[DEV MODE] OTP for ${phone}: ${otp}`);
    return true;
  }

  try {
    await client.messages.create({
      body: `Your OTP for Hospital Management System is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return true;
  } catch (error) {
    console.error('SMS error:', error);
    // In development, just log the OTP
    console.log(`OTP for ${phone}: ${otp}`);
    return true; // Return true in dev mode
  }
};

exports.sendNotificationSMS = async (phone, message) => {
  if (!client) {
    console.log(`[DEV MODE] SMS to ${phone}: ${message}`);
    return true;
  }

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return true;
  } catch (error) {
    console.error('SMS error:', error);
    return false;
  }
};

