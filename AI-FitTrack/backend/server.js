const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dns = require('dns');
const connectDB = require('./config/db.js');

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({ origin: '*'}));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'AI FitTrack API running' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});