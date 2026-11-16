import express from 'express';
import Setting from '../models/Setting.js';
import User from '../models/User.js';
import MilkEntry from '../models/MilkEntry.js';
import { seedDatabase } from '../utils/seed.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get dairy settings (rates, name, UPI, etc.)
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        dairyName: 'निलेश डेअरी (Nilesh Dairy)',
        dairyTagline: '१००% शुद्ध दूध - मंगल हो',
        ownerName: 'निलेश',
        phone: '9822000000',
        defaultCowRate: 60,
        defaultBuffaloRate: 75,
        upiId: 'nileshdairy@upi',
      });
    }
    return res.json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update dairy settings (Admin only)
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    const { dairyName, dairyTagline, ownerName, phone, defaultCowRate, defaultBuffaloRate, upiId, address } = req.body;

    if (dairyName !== undefined) settings.dairyName = dairyName;
    if (dairyTagline !== undefined) settings.dairyTagline = dairyTagline;
    if (ownerName !== undefined) settings.ownerName = ownerName;
    if (phone !== undefined) settings.phone = phone;
    if (defaultCowRate !== undefined) settings.defaultCowRate = Number(defaultCowRate);
    if (defaultBuffaloRate !== undefined) settings.defaultBuffaloRate = Number(defaultBuffaloRate);
    if (upiId !== undefined) settings.upiId = upiId;
    if (address !== undefined) settings.address = address;

    await settings.save();
    return res.json({ success: true, message: 'सेटिंग्ज अद्ययावत केली!', settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/settings/reseed
// @desc    Reseed customers from updated list (Admin only)
router.post('/reseed', protect, adminOnly, async (req, res) => {
  try {
    await seedDatabase({ reset: true });
    return res.json({ success: true, message: 'सर्व ग्राहक यादी यशस्वीरित्या रीसीड केली!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
