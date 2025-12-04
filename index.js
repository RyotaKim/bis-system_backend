require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const seedService = require('./services/seedService');

// Import routes
const authRoutes = require('./routes/auth');
const residentRoutes = require('./routes/resident');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const documentTypeRoutes = require('./routes/documentTypes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL, // Add your Vercel frontend URL here
  'https://barangay-sanjose1.vercel.app'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, true); // Allow all origins for now (can be restricted later)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Seed initial document types
seedService.seedDocumentTypes();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'BIS System API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resident', residentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/document-types', documentTypeRoutes);

// File download route
app.get('/api/files/:id', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { getFileStream } = require('./middleware/upload');
    const { ObjectId } = require('mongodb');
    
    const fileId = new ObjectId(req.params.id);
    const downloadStream = getFileStream(fileId);
    
    downloadStream.on('error', () => {
      res.status(404).json({ message: 'File not found' });
    });
    
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
