const mongoose = require('mongoose');
const { initGridFS } = require('./gridfs');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_TEST_URI 
      : process.env.MONGODB_URI;

    await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Initialize GridFS immediately after connection
    if (mongoose.connection.readyState === 1) {
      initGridFS();
    } else {
      mongoose.connection.once('open', () => {
        initGridFS();
      });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

module.exports = connectDB;
