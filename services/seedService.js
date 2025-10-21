const DocumentType = require('../models/DocumentType');

exports.seedDocumentTypes = async () => {
  try {
    const count = await DocumentType.countDocuments();
    if (count > 0) return; // Already seeded

    const docTypes = [
      { name: 'Barangay Clearance', description: 'Document certifying residency and good moral character' },
      { name: 'Business Permit', description: 'License to operate a business in the barangay' },
      { name: 'Certificate of Indigency', description: 'Document certifying poor economic status' },
      { name: 'First Time Job Seeker Form', description: 'Form for first-time job seekers' }
    ];

    await DocumentType.insertMany(docTypes);
    console.log('Document types seeded successfully');
  } catch (error) {
    console.error('Error seeding document types:', error.message);
  }
};
