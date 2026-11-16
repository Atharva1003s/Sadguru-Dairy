import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    dairyName: {
      type: String,
      default: 'सद्गुरू दुग्धालय (Sadguru Dairy)',
    },
    dairyTagline: {
      type: String,
      default: '१००% शुद्ध दूध - मंगल हो',
    },
    ownerName: {
      type: String,
      default: 'व्यवस्थापक',
    },
    phone: {
      type: String,
      default: '9822000000',
    },
    defaultCowRate: {
      type: Number,
      default: 60, // ₹ per litre
    },
    defaultBuffaloRate: {
      type: Number,
      default: 75, // ₹ per litre
    },
    upiId: {
      type: String,
      default: 'sadgurudairy@upi',
    },
    address: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
