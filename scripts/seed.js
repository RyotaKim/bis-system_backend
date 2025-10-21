require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const DocumentType = require('../models/DocumentType');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Seed document types
    const docTypeCount = await DocumentType.countDocuments();
    if (docTypeCount === 0) {
      const docTypes = [
        { name: 'Barangay Clearance', description: 'Document certifying residency and good moral character' },
        { name: 'Business Permit', description: 'License to operate a business in the barangay' },
        { name: 'Certificate of Indigency', description: 'Document certifying poor economic status' },
        { name: 'First Time Job Seeker Form', description: 'Form for first-time job seekers' }
      ];
      await DocumentType.insertMany(docTypes);
      console.log('✓ Document types seeded');
    }

    // Seed admin user
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: 'admin',
        passwordHash,
        name: 'System Administrator',
        role: 'admin',
        contactNumber: '+1234567890'
      });
      await admin.save();
      console.log('✓ Admin user created (username: admin, password: admin123)');
    }

    console.log('✓ Database seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
