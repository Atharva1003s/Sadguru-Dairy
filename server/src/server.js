import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seed.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import entryRoutes from './routes/entryRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and auto-seed if first run
const initApp = async () => {
  await connectDB();
  await seedDatabase({ reset: false });
};
initApp().catch((err) => {
  console.error('Initialization error:', err);
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes (support both /api/* and direct routes /* for zero-friction client calls)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/customers', customerRoutes);
app.use('/customers', customerRoutes);

app.use('/api/entries', entryRoutes);
app.use('/entries', entryRoutes);

app.use('/api/settings', settingRoutes);
app.use('/settings', settingRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🥛 सद्गुरू दुग्धालय - Sadguru Dairy Milk Register API is running smoothly!',
    version: '1.0.0',
    status: 'online',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'सर्व्हर त्रुटी: ' + err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🥛 Sadguru Dairy (सद्गुरू दुग्धालय) Backend Server running on http://localhost:${PORT}`);
});
