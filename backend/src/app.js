import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import memberRoutes from './routes/member.routes.js';
import packageRoutes from './routes/package.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import roomRoutes from './routes/room.routes.js';
import equipmentRoutes from './routes/equipment.routes.js';
import trainingLogRoutes from './routes/trainingLog.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import reportRoutes from './routes/report.routes.js';
import userRoutes from './routes/user.routes.js';
import trainerRoutes from './routes/trainer.routes.js';
import staffScheduleRoutes from './routes/staffSchedule.routes.js';
import promotionRoutes from './routes/promotion.routes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain (covers preview + production deployments)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gym Management API is running 🏋️' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/training-logs', trainingLogRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/staff-schedules', staffScheduleRoutes);
app.use('/api/promotions', promotionRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
