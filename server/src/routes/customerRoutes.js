import express from 'express';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/customers/directory
// @desc    Public lightweight customer list for search & quick selection
router.get('/directory', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer', active: true })
      .select('_id serialNo name nameMarathi nameEnglish category milkType defaultQuantity')
      .sort({ category: 1, serialNo: 1 });

    return res.json({ success: true, customers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/customers
// @desc    Get all customers with full details (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { search, category, active } = req.query;
    let query = { role: 'customer' };

    if (active !== undefined) {
      query.active = active === 'true';
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { nameMarathi: regex },
        { nameEnglish: regex },
        { phone: regex },
      ];
    }

    const customers = await User.find(query)
      .select('-password')
      .sort({ category: 1, serialNo: 1, createdAt: 1 });

    return res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/customers/:id
// @desc    Get single customer
router.get('/:id', protect, async (req, res) => {
  try {
    // If not admin, verify it's the customer themself
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'अनधिकृत प्रवेश' });
    }

    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'ग्राहक सापडला नाही' });
    }

    return res.json({ success: true, customer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/customers
// @desc    Add new customer (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      nameMarathi,
      nameEnglish,
      phone,
      category,
      milkType,
      defaultQuantity,
      customRate,
      pin,
      serialNo,
      notes,
    } = req.body;

    if (!nameMarathi) {
      return res.status(400).json({ success: false, message: 'ग्राहकाचे नाव आवश्यक आहे' });
    }

    // Determine serial number if not provided
    let calculatedSerial = serialNo;
    if (!calculatedSerial) {
      const highestSerial = await User.findOne({ role: 'customer' }).sort({ serialNo: -1 });
      calculatedSerial = highestSerial && highestSerial.serialNo ? highestSerial.serialNo + 1 : 1;
    }

    // Generate fallback phone if blank
    const customerPhone = phone && phone.trim() ? phone.trim() : `980000${String(calculatedSerial).padStart(4, '0')}`;

    // Check duplicate phone
    const existing = await User.findOne({ phone: customerPhone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'हा फोन नंबर आधीच वापरला गेला आहे' });
    }

    const newCustomer = new User({
      name: nameMarathi,
      nameMarathi,
      nameEnglish: nameEnglish || '',
      phone: customerPhone,
      pin: pin || '1234',
      role: 'customer',
      serialNo: calculatedSerial,
      category: category || 'cow',
      milkType: milkType || 'cow',
      defaultQuantity: defaultQuantity !== undefined ? Number(defaultQuantity) : 1.0,
      customRate: customRate !== undefined && customRate !== '' ? Number(customRate) : null,
      active: true,
      notes: notes || '',
    });

    await newCustomer.save();

    return res.status(201).json({
      success: true,
      message: 'ग्राहक यशस्वीरित्या जोडला!',
      customer: newCustomer,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer details (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'ग्राहक सापडला नाही' });
    }

    const fields = [
      'nameMarathi',
      'nameEnglish',
      'phone',
      'pin',
      'category',
      'milkType',
      'defaultQuantity',
      'customRate',
      'serialNo',
      'active',
      'notes',
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (f === 'nameMarathi') {
          customer.name = req.body[f];
          customer.nameMarathi = req.body[f];
        } else if (f === 'defaultQuantity' || f === 'serialNo') {
          customer[f] = Number(req.body[f]);
        } else if (f === 'customRate') {
          customer[f] = req.body[f] === null || req.body[f] === '' ? null : Number(req.body[f]);
        } else {
          customer[f] = req.body[f];
        }
      }
    });

    await customer.save();

    return res.json({
      success: true,
      message: 'माहिती अद्ययावत केली!',
      customer,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/customers/:id/reset-pin
// @desc    Admin reset customer PIN to default 1234
router.put('/:id/reset-pin', protect, adminOnly, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'ग्राहक सापडला नाही' });
    }
    customer.pin = '1234';
    await customer.save();
    return res.json({ success: true, message: 'पिन १२३४ वर रीसेट केला!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Deactivate customer (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'ग्राहक सापडला नाही' });
    }

    customer.active = false;
    await customer.save();

    return res.json({ success: true, message: 'ग्राहक निष्क्रिय केला!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
