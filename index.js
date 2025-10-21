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

// Middleware
app.use(cors());
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
