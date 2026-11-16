import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_milk_dairy_key_2026_secure', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/admin-login
// @desc    Admin login with phone/username and password
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'कृपया युजरनेम आणि पासवर्ड टाका' });
    }

    const user = await User.findOne({
      role: 'admin',
      $or: [{ phone: username.trim() }, { nameEnglish: new RegExp(`^${username.trim()}$`, 'i') }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'अवैध ॲडमिन क्रेडेंशियल्स' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'चुकीचा पासवर्ड' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        nameMarathi: user.nameMarathi,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/auth/customer-login
// @desc    Customer login via phone number and 4-digit PIN
router.post('/customer-login', async (req, res) => {
  try {
    const { phone, pin } = req.body;
    if (!phone || !pin) {
      return res.status(400).json({ success: false, message: 'कृपया मोबाईल नंबर आणि पिन टाका' });
    }

    const customer = await User.findOne({ phone: phone.trim(), role: 'customer', active: true });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'हा मोबाईल नंबर नोंदणीकृत नाही' });
    }

    if (!customer.matchPin(pin)) {
      return res.status(401).json({ success: false, message: 'चुकीचा ४-अंकी पिन (Default: 1234)' });
    }

    const token = generateToken(customer._id);

    return res.json({
      success: true,
      token,
      user: {
        _id: customer._id,
        name: customer.name,
        nameMarathi: customer.nameMarathi,
        nameEnglish: customer.nameEnglish,
        serialNo: customer.serialNo,
        role: customer.role,
        phone: customer.phone,
        milkType: customer.milkType,
        defaultQuantity: customer.defaultQuantity,
      },
    });
  } catch (error) {
    console.error('Customer login error:', error);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/auth/quick-customer-select
// @desc    Quick login by selecting customer from register list + entering 4-digit PIN
router.post('/quick-customer-select', async (req, res) => {
  try {
    const { customerId, pin } = req.body;
    if (!customerId || !pin) {
      return res.status(400).json({ success: false, message: 'कृपया ग्राहक निवडा आणि पिन टाका' });
    }

    const customer = await User.findOne({ _id: customerId, role: 'customer', active: true });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'ग्राहक सापडला नाही' });
    }

    if (!customer.matchPin(pin)) {
      return res.status(401).json({ success: false, message: 'चुकीचा पिन! (Default PIN: 1234)' });
    }

    const token = generateToken(customer._id);

    return res.json({
      success: true,
      token,
      user: {
        _id: customer._id,
        name: customer.name,
        nameMarathi: customer.nameMarathi,
        nameEnglish: customer.nameEnglish,
        serialNo: customer.serialNo,
        role: customer.role,
        phone: customer.phone,
        milkType: customer.milkType,
        defaultQuantity: customer.defaultQuantity,
      },
    });
  } catch (error) {
    console.error('Quick customer login error:', error);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get currently logged in user info
router.get('/me', protect, async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

// @route   PUT /api/auth/change-pin
// @desc    Change customer 4-digit PIN
router.put('/change-pin', protect, async (req, res) => {
  try {
    const { oldPin, newPin } = req.body;
    if (!newPin || newPin.length !== 4) {
      return res.status(400).json({ success: false, message: 'पिन ४ अंकी असावा' });
    }

    const user = await User.findById(req.user._id);
    if (!user.matchPin(oldPin)) {
      return res.status(400).json({ success: false, message: 'जुना पिन चुकीचा आहे' });
    }

    user.pin = newPin;
    await user.save();

    return res.json({ success: true, message: 'पिन यशस्वीरित्या बदलला!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
