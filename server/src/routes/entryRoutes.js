import express from 'express';
import MilkEntry from '../models/MilkEntry.js';
import User from '../models/User.js';
import Setting from '../models/Setting.js';
import { protect, adminOnly, customerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to get effective rate for a customer
const getEffectiveRate = (customer, settings) => {
  if (customer.customRate !== null && customer.customRate !== undefined && customer.customRate > 0) {
    return customer.customRate;
  }
  return customer.milkType === 'buffalo'
    ? settings.defaultBuffaloRate || 75
    : settings.defaultCowRate || 60;
};

// @route   GET /api/entries/monthly-grid
// @desc    Get complete physical-register style table for all customers (Admin View)
router.get('/monthly-grid', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    const year = parseInt(req.query.year) || today.getFullYear();
    const month = parseInt(req.query.month) || today.getMonth() + 1;
    const category = req.query.category || 'all';

    // Days in this month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Fetch settings for default rates
    let settings = await Setting.findOne();
    if (!settings) {
      settings = { defaultCowRate: 60, defaultBuffaloRate: 75 };
    }

    // Customer query filter
    const customerFilter = { role: 'customer', active: true };
    if (category && category !== 'all') {
      customerFilter.category = category;
    }

    const customers = await User.find(customerFilter).sort({ category: 1, serialNo: 1, createdAt: 1 });

    // Fetch all entries for this month & year
    const customerIds = customers.map((c) => c._id);
    const entries = await MilkEntry.find({
      customer: { $in: customerIds },
      year,
      month,
    });

    // Create a map for quick lookup: customerId -> day -> entry
    const entryMap = {};
    entries.forEach((e) => {
      const cId = e.customer.toString();
      if (!entryMap[cId]) entryMap[cId] = {};
      entryMap[cId][e.day] = e;
    });

    // Compute customer rows
    const customerRows = [];
    const dailyTotals = {};
    for (let d = 1; d <= daysInMonth; d++) {
      dailyTotals[d] = { cow: 0, buffalo: 0, total: 0 };
    }

    let grandTotalCowLitres = 0;
    let grandTotalBuffaloLitres = 0;
    let grandTotalLitres = 0;
    let grandTotalAmount = 0;

    customers.forEach((c) => {
      const cId = c._id.toString();
      const customerEntries = entryMap[cId] || {};
      const rate = getEffectiveRate(c, settings);

      let customerTotalLitres = 0;
      const dayValues = {};

      for (let d = 1; d <= daysInMonth; d++) {
        const entry = customerEntries[d];
        const qty = entry ? entry.quantity : null;
        dayValues[d] = qty;

        if (qty && qty > 0) {
          customerTotalLitres += qty;
          if (c.milkType === 'buffalo') {
            dailyTotals[d].buffalo += qty;
            grandTotalBuffaloLitres += qty;
          } else {
            dailyTotals[d].cow += qty;
            grandTotalCowLitres += qty;
          }
          dailyTotals[d].total += qty;
        }
      }

      const customerTotalAmount = customerTotalLitres * rate;
      grandTotalLitres += customerTotalLitres;
      grandTotalAmount += customerTotalAmount;

      customerRows.push({
        _id: c._id,
        serialNo: c.serialNo,
        name: c.name,
        nameMarathi: c.nameMarathi,
        nameEnglish: c.nameEnglish,
        phone: c.phone,
        category: c.category,
        milkType: c.milkType,
        defaultQuantity: c.defaultQuantity,
        rate,
        entries: dayValues,
        totalLitres: parseFloat(customerTotalLitres.toFixed(2)),
        totalAmount: Math.round(customerTotalAmount),
      });
    });

    return res.json({
      success: true,
      year,
      month,
      daysInMonth,
      customers: customerRows,
      dailyTotals,
      summary: {
        totalCowLitres: parseFloat(grandTotalCowLitres.toFixed(2)),
        totalBuffaloLitres: parseFloat(grandTotalBuffaloLitres.toFixed(2)),
        grandTotalLitres: parseFloat(grandTotalLitres.toFixed(2)),
        grandTotalAmount: Math.round(grandTotalAmount),
        customerCount: customers.length,
      },
    });
  } catch (error) {
    console.error('Monthly grid error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/entries/customer/:customerId
// @desc    Get single customer monthly view (Customer or Admin)
router.get('/customer/:customerId', protect, customerOrAdmin, async (req, res) => {
  try {
    const { customerId } = req.params;
    const today = new Date();
    const year = parseInt(req.query.year) || today.getFullYear();
    const month = parseInt(req.query.month) || today.getMonth() + 1;

    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'ग्राहक सापडला नाही' });
    }

    let settings = await Setting.findOne();
    if (!settings) {
      settings = { defaultCowRate: 60, defaultBuffaloRate: 75 };
    }

    const rate = getEffectiveRate(customer, settings);
    const daysInMonth = new Date(year, month, 0).getDate();

    const entries = await MilkEntry.find({
      customer: customerId,
      year,
      month,
    }).sort({ day: 1 });

    const entriesByDay = {};
    let totalLitres = 0;

    entries.forEach((e) => {
      entriesByDay[e.day] = {
        _id: e._id,
        quantity: e.quantity,
        rate: e.rate || rate,
        totalAmount: e.totalAmount || e.quantity * rate,
        enteredBy: e.enteredBy,
        status: e.status,
        notes: e.notes,
        date: e.date,
      };
      if (e.quantity > 0) {
        totalLitres += e.quantity;
      }
    });

    // Check today's entry
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
    const todayEntry = isCurrentMonth ? entriesByDay[today.getDate()] || null : null;

    return res.json({
      success: true,
      customer: {
        _id: customer._id,
        name: customer.name,
        nameMarathi: customer.nameMarathi,
        nameEnglish: customer.nameEnglish,
        phone: customer.phone,
        serialNo: customer.serialNo,
        category: customer.category,
        milkType: customer.milkType,
        defaultQuantity: customer.defaultQuantity,
        rate,
      },
      year,
      month,
      daysInMonth,
      entriesByDay,
      totalLitres: parseFloat(totalLitres.toFixed(2)),
      totalAmount: Math.round(totalLitres * rate),
      todayDate: todayStr,
      todayDay: today.getDate(),
      todayEntry,
    });
  } catch (error) {
    console.error('Customer entries error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/entries/record
// @desc    Add or update milk entry for customer (Customer or Admin)
router.post('/record', protect, customerOrAdmin, async (req, res) => {
  try {
    const { customerId, date, quantity, notes } = req.body;

    if (!customerId || !date || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'कृपया ग्राहक, तारीख आणि लिटर संख्या निवडा',
      });
    }

    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'ग्राहक सापडला नाही' });
    }

    // Parse date components safely
    const [yearStr, monthStr, dayStr] = date.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);

    let settings = await Setting.findOne();
    if (!settings) {
      settings = { defaultCowRate: 60, defaultBuffaloRate: 75 };
    }

    const rate = getEffectiveRate(customer, settings);
    const numQty = parseFloat(quantity) || 0;
    const totalAmount = numQty * rate;
    const enteredBy = req.user.role === 'admin' ? 'admin' : 'customer';
    const status = req.user.role === 'admin' ? 'modified_by_admin' : 'confirmed';

    // Upsert entry
    const entry = await MilkEntry.findOneAndUpdate(
      { customer: customerId, year, month, day },
      {
        customer: customerId,
        date,
        year,
        month,
        day,
        quantity: numQty,
        milkType: customer.milkType,
        rate,
        totalAmount,
        enteredBy,
        status,
        notes: notes || (numQty === 0 ? 'रजा / Absent' : ''),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      success: true,
      message: `${day}/${month} चे दूध (${numQty}L) यशस्वीरित्या नोंदवले!`,
      entry,
    });
  } catch (error) {
    console.error('Record entry error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/entries/batch-fill-today
// @desc    Quick 1-click batch fill for admin for a given date with customer default quantities
router.post('/batch-fill-today', protect, adminOnly, async (req, res) => {
  try {
    const { date, category } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: 'तारीख आवश्यक आहे' });
    }

    const [yearStr, monthStr, dayStr] = date.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);

    let settings = await Setting.findOne();
    if (!settings) {
      settings = { defaultCowRate: 60, defaultBuffaloRate: 75 };
    }

    const customerFilter = { role: 'customer', active: true };
    if (category && category !== 'all') {
      customerFilter.category = category;
    }

    const customers = await User.find(customerFilter);

    // Find existing entries on this date
    const existingEntries = await MilkEntry.find({
      customer: { $in: customers.map((c) => c._id) },
      year,
      month,
      day,
    });

    const existingMap = new Set(existingEntries.map((e) => e.customer.toString()));

    const newEntries = [];
    customers.forEach((c) => {
      if (!existingMap.has(c._id.toString())) {
        const rate = getEffectiveRate(c, settings);
        const qty = c.defaultQuantity || 1.0;
        newEntries.push({
          customer: c._id,
          date,
          year,
          month,
          day,
          quantity: qty,
          milkType: c.milkType,
          rate,
          totalAmount: qty * rate,
          enteredBy: 'admin',
          status: 'confirmed',
          notes: 'Daily default batch fill',
        });
      }
    });

    if (newEntries.length > 0) {
      await MilkEntry.insertMany(newEntries);
    }

    return res.json({
      success: true,
      message: `${newEntries.length} ग्राहकांसाठी आजचे नेहमीचे दूध नोंदवले गेले!`,
      addedCount: newEntries.length,
      skippedCount: existingEntries.length,
    });
  } catch (error) {
    console.error('Batch fill error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/entries/:id
// @desc    Delete a milk entry (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const entry = await MilkEntry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'नोंद सापडली नाही' });
    }
    return res.json({ success: true, message: 'नोंद हटवली!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
