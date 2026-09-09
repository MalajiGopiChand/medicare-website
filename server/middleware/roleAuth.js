const auth = require('./auth');
const jwt = require('jsonwebtoken');

// Role-based access control middleware
const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      // First verify auth token
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      req.user = decoded;

      // Now check user role
      try {
        const User = require('../models/User');
        const user = await User.findById(req.user.userId);
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        if (!roles.includes(user.role)) {
          return res.status(403).json({ 
            message: 'Access denied. Insufficient permissions.' 
          });
        }
        
        req.userRole = user.role;
        req.userData = user;
        next();
      } catch (error) {
        console.error('Error in roleAuth middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    } catch (error) {
      console.error('Error in requireRole middleware:', error);
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = { requireRole };


