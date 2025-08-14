const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const apiRoutes = require('./routes/api');
const webhookRoutes = require('./routes/webhook');

const app = express();

// ✅ CORS configuration — allow Vercel frontend + localhost
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://whatsapp-clone-git-main-chats-projects-189443e0.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ API routes
app.use('/api', apiRoutes);
app.use('/webhook', webhookRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.resolve(__dirname, '..', 'frontend', 'dist');
  console.log(`📂 Serving frontend from: ${frontendPath}`);

  app.use(express.static(frontendPath));

  // React Router fallback — regex avoids path-to-regexp '*' issue
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
