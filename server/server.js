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
  const localUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/college-erp';
  let connected = false;

  // 1. Try primary MONGODB_URI (e.g. Atlas)
  if (mongoUri) {
    try {
      console.log('Connecting to primary MongoDB URI...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000
      });
      console.log('✅ Connected to primary MongoDB successfully');
      connected = true;
    } catch (error) {
      console.warn('⚠️ Primary MongoDB connection failed:', error.message);
    }
  }

  // 2. If primary failed, attempt local MongoDB fallback
  if (!connected && localUri) {
    try {
      console.log(`Connecting to local MongoDB fallback at ${localUri}...`);
      await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 3000
      });
      console.log('✅ Connected to local MongoDB fallback successfully');
      connected = true;
    } catch (localError) {
      console.error('❌ Local MongoDB fallback failed:', localError.message);
    }
  }

  if (!connected) {
    // Disable Mongoose command buffering so queries fail immediately with 500/503 rather than timing out after 10s
    mongoose.set('bufferCommands', false);
    console.error('⚠️ Server running in degraded mode on http://localhost:' + PORT + ' (MongoDB not connected)');
  }

  app.listen(PORT, () => {
    console.log(`🚀 College ERP Backend running on http://localhost:${PORT} [Database: ${connected ? 'Connected' : 'Disconnected'}]`);
  });
};

startServer();

module.exports = app;
