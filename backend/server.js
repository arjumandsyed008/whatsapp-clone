const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const apiRoutes = require('./routes/api');
const webhookRoutes = require('./routes/webhook');

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: [
    'https://whatsapp-clone-lake-sigma.vercel.app/', // your Vercel frontend URL
    'http://localhost:5173' // for local dev
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
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

  // React Router fallback
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
