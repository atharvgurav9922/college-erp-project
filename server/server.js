require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load generated URI from parts or use raw URI
let mongoUri = process.env.MONGODB_URI;
if (mongoUri && mongoUri.includes('${')) {
  // Simple variable replacement for Atlas if users stick to template
  mongoUri = mongoUri
    .replace('${MONGO_USERNAME}', process.env.MONGO_USERNAME)
    .replace('${MONGO_PASSWORD}', process.env.MONGO_PASSWORD)
    .replace('${MONGO_CLUSTER}', process.env.MONGO_CLUSTER);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!mongoUri) throw new Error("MONGODB_URI is not defined in .env");
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
