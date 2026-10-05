require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Construct MongoDB URI securely if template is used
let mongoUri = process.env.MONGODB_URI;
if (mongoUri && mongoUri.includes('${')) {
  const user = encodeURIComponent(process.env.MONGO_USERNAME || '');
  const pass = encodeURIComponent(process.env.MONGO_PASSWORD || '');
  const cluster = process.env.MONGO_CLUSTER || '';
  mongoUri = mongoUri
    .replace('${MONGO_USERNAME}', user)
    .replace('${MONGO_PASSWORD}', pass)
    .replace('${MONGO_CLUSTER}', cluster);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const dbState = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    database: states[dbState] || 'Unknown',
    databaseConnected: dbState === 1,
    timestamp: new Date().toISOString()
  });
});

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Connect to MongoDB
const startServer = async () => {
  try {
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables or .env");
    }
    
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ Connected to MongoDB Atlas successfully');

    app.listen(PORT, () => {
      console.log(`🚀 College ERP Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Please verify your MONGODB_URI in server/.env or environment variables.');
    // Keep app running so health check can report the DB issue
    app.listen(PORT, () => {
      console.log(`⚠️ Server running in degraded mode on http://localhost:${PORT} (MongoDB not connected)`);
    });
  }
};

startServer();

module.exports = app;
