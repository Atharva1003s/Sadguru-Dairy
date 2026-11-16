import mongoose from 'mongoose';

const milkEntrySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    month: {
      type: Number, // 1 to 12
      required: true,
      index: true,
    },
    day: {
      type: Number, // 1 to 31
      required: true,
      index: true,
    },
    quantity: {
      type: Number, // in Litres (e.g., 0.5, 1, 1.5, 2, 0)
      required: true,
      min: 0,
      default: 0,
    },
    milkType: {
      type: String,
      enum: ['cow', 'buffalo'],
      default: 'cow',
    },
    rate: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    enteredBy: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    status: {
      type: String,
      enum: ['confirmed', 'modified_by_admin', 'disputed'],
      default: 'confirmed',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index so each customer has at most one record per calendar date
milkEntrySchema.index({ customer: 1, year: 1, month: 1, day: 1 }, { unique: true });

const MilkEntry = mongoose.model('MilkEntry', milkEntrySchema);
export default MilkEntry;
