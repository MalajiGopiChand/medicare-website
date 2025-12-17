const auth = require('./auth');

// Role-based access control middleware
const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      // First verify auth
      auth(req, res, async () => {
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
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = { requireRole };


