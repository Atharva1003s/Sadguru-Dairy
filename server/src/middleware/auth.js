import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_milk_dairy_key_2026_secure'
      );
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      next();
    } catch (error) {
      console.error('Auth protect error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied: Admin only' });
  }
};

// Verify that the request is made by the customer themself OR an admin
export const customerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const requestedCustomerId = req.params.customerId || req.body.customerId;

  if (
    req.user.role === 'admin' ||
    (requestedCustomerId && req.user._id.toString() === requestedCustomerId.toString())
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: You can only view or record your own milk',
    });
  }
};
