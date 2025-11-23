const DocumentType = require('../models/DocumentType');

exports.seedDocumentTypes = async () => {
  try {
    // First, remove the old "First Time Job Seeker Form" if it exists
    await DocumentType.deleteOne({ name: 'First Time Job Seeker Form' });
    
    const docTypes = [
      { 
        name: 'Barangay Clearance', 
        description: 'Document certifying residency and good moral character',
        requiredFields: []
      },
      { 
        name: 'Business Permit', 
        description: 'License to operate a business in the barangay',
        requiredFields: []
      },
      { 
        name: 'Certificate of Indigency', 
        description: 'Document certifying poor economic status',
        requiredFields: []
      },
      { 
        name: 'First-time Job Seeker', 
        description: 'Form for first-time job seekers (RA 11261)',
        requiredFields: ['eduAttainment', 'eduCourse']
      }
    ];

    // Use updateOne with upsert for each document type
    for (const docType of docTypes) {
      await DocumentType.updateOne(
        { name: docType.name },
        { $set: docType },
        { upsert: true }
      );
    }
    
    console.log('Document types seeded/updated successfully');
  } catch (error) {
    console.error('Error seeding document types:', error.message);
  }
};
