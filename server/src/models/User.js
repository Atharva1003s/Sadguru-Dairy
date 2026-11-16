import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameMarathi: {
      type: String,
      required: true,
      trim: true,
    },
    nameEnglish: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pin: {
      type: String,
      default: '1234',
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    serialNo: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['cow', 'buffalo'],
      default: 'cow',
    },
    milkType: {
      type: String,
      enum: ['cow', 'buffalo'],
      default: 'cow',
    },
    defaultQuantity: {
      type: Number,
      default: 1.0,
      min: 0,
    },
    customRate: {
      type: Number,
      default: null, // null means use global default for this milk type
    },
    active: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      default: '',
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

// Hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password for admin
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check PIN for customer
userSchema.methods.matchPin = function (enteredPin) {
  return this.pin === enteredPin.trim();
};

const User = mongoose.model('User', userSchema);
export default User;
