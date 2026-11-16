import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Setting from '../models/Setting.js';
import MilkEntry from '../models/MilkEntry.js';
import { seedCustomersList } from '../data/seedCustomers.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/milk_dairy_db';

export const seedDatabase = async ({ reset = false } = {}) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    console.log('Connected to MongoDB for seeding...');

    // 1. Ensure Admin Account
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = new User({
        name: 'डेअरी व्यवस्थापक (सद्गुरू दुग्धालय)',
        nameMarathi: 'डेअरी व्यवस्थापक (सद्गुरू दुग्धालय)',
        nameEnglish: 'Dairy Admin (Sadguru Dairy)',
        phone: 'admin',
        password: 'admin', // will be hashed by pre-save
        pin: '9999',
        role: 'admin',
        serialNo: 0,
        active: true,
      });
      await admin.save();
      console.log('✅ Admin account created: phone=admin, password=admin');
    } else {
      console.log('ℹ️ Admin account already exists');
    }

    // 2. Ensure Settings
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting({
        dairyName: 'सद्गुरू दुग्धालय (Sadguru Dairy)',
        dairyTagline: '१००% शुद्ध दूध - मंगल हो',
        ownerName: 'व्यवस्थापक',
        phone: '9822000000',
        defaultCowRate: 60,
        defaultBuffaloRate: 75,
        upiId: 'sadgurudairy@upi',
        address: 'दूध संकलन केंद्र, मुख्य बाजारपेठ',
      });
      await setting.save();
      console.log('✅ Default dairy settings created');
    } else {
      setting.dairyName = 'सद्गुरू दुग्धालय (Sadguru Dairy)';
      setting.upiId = 'sadgurudairy@upi';
      await setting.save();
    }

    // 3. Reset or Seed Customers
    if (reset) {
      console.log('Reset flag enabled: Removing old customers and entries...');
      await User.deleteMany({ role: 'customer' });
      await MilkEntry.deleteMany({});
    }

    const existingCount = await User.countDocuments({ role: 'customer' });
    if (existingCount === 0 || reset) {
      console.log(`Seeding ${seedCustomersList.length} customers (28 Buffalo, 21 Cow)...`);
      const customersToInsert = seedCustomersList.map((c) => {
        const prefix = c.category === 'buffalo' ? '980001' : '980002';
        const phoneFormatted = `${prefix}${String(c.serialNo).padStart(4, '0')}`;
        return {
          name: c.nameMarathi,
          nameMarathi: c.nameMarathi,
          nameEnglish: c.nameEnglish,
          phone: phoneFormatted,
          pin: '1234',
          role: 'customer',
          serialNo: c.serialNo,
          category: c.category,
          milkType: c.milkType,
          defaultQuantity: c.defaultQuantity || 1.0,
          customRate: null,
          active: true,
          notes: `${c.category === 'buffalo' ? 'Buffalo Milk' : 'Cow Milk'} #${c.serialNo}`,
        };
      });

      const inserted = await User.insertMany(customersToInsert);
      console.log(`✅ Successfully seeded ${inserted.length} customers!`);

      // 4. Seed sample entries for current month so register is alive immediately
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // 1-12
      const currentDay = today.getDate();

      const sampleEntries = [];
      for (const customer of inserted) {
        for (let d = 1; d <= Math.min(currentDay, 7); d++) {
          const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const rate = customer.milkType === 'buffalo' ? 75 : 60;
          const isAbsent = d === 4 && customer.serialNo % 5 === 0;
          const qty = isAbsent ? 0 : customer.defaultQuantity;

          sampleEntries.push({
            customer: customer._id,
            date: dateStr,
            year: currentYear,
            month: currentMonth,
            day: d,
            quantity: qty,
            milkType: customer.milkType,
            rate: rate,
            totalAmount: qty * rate,
            enteredBy: 'admin',
            status: 'confirmed',
            notes: isAbsent ? 'सुट्टी / Absent' : 'नियमित रतीब',
          });
        }
      }

      if (sampleEntries.length > 0) {
        await MilkEntry.insertMany(sampleEntries);
        console.log(`✅ Seeded ${sampleEntries.length} sample entries for demo register`);
      }
    } else {
      console.log(`ℹ️ ${existingCount} customers already exist in database.`);
    }

    console.log('🚀 Database initialization complete!');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase({ reset: true }).then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
