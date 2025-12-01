const Request = require('../models/Request');
const Complaint = require('../models/Complaint');

exports.getWeeklyRequestStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Group requests by day and document type
    const requestStats = await Request.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $lookup: { from: 'documenttypes', localField: 'docTypeId', foreignField: '_id', as: 'docType' } },
      { 
        $group: { 
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            docType: { $arrayElemAt: ['$docType.name', 0] }
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json({ requestStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaintResolutionRate = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const complaintStats = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { 
        $group: { 
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$status'
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json({ complaintStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAnalytics = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const requestStats = await Request.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $lookup: { from: 'documenttypes', localField: 'docTypeId', foreignField: '_id', as: 'docType' } },
      { 
        $group: { 
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            docType: { $arrayElemAt: ['$docType.name', 0] }
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { '_id.date': 1 } }
    ]);

    const complaintStats = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { 
        $group: { 
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$status'
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { '_id.date': 1 } }
    ]);

    const totalRequests = await Request.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

    res.json({
      requestStats,
      complaintStats,
      summary: { totalRequests, totalComplaints, pendingRequests, resolvedComplaints }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
