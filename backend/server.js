const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const apiRoutes = require('./routes/api');
const webhookRoutes = require('./routes/webhook');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API routes
app.use('/api', apiRoutes);
app.use('/webhook', webhookRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Path to Vite build output
  const frontendPath = path.resolve(__dirname, '..', 'frontend', 'dist');
  console.log(`📂 Serving frontend from: ${frontendPath}`);

  app.use(express.static(frontendPath));

  // Fallback for React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
