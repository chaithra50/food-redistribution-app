const User = require('../models/User');
const Food = require('../models/Food');
const Delivery = require('../models/Delivery');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalReceivers = await User.countDocuments({ role: 'receiver' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    
    const totalFoods = await Food.countDocuments();
    const availableFoods = await Food.countDocuments({ status: 'Available' });
    const deliveredFoods = await Food.countDocuments({ status: 'Delivered' });
    
    const totalDeliveries = await Delivery.countDocuments();
    const completedDeliveries = await Delivery.countDocuments({ status: 'Delivered' });

    // Calculate total meals saved (sum of quantities of delivered food)
    const deliveredFoodsData = await Food.find({ status: 'Delivered' });
    const totalMealsSaved = deliveredFoodsData.reduce((sum, food) => sum + food.quantity, 0);

    res.json({
      totalUsers,
      userBreakdown: {
        donors: totalDonors,
        receivers: totalReceivers,
        volunteers: totalVolunteers,
      },
      foodStatistics: {
        total: totalFoods,
        available: availableFoods,
        delivered: deliveredFoods,
      },
      deliveryStatistics: {
        total: totalDeliveries,
        completed: completedDeliveries,
      },
      impact: {
        totalMealsSaved,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    let query = {};
    if (role) query.role = role;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFoods = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const foods = await Food.find(query)
      .populate('donor', 'name email organizationName')
      .populate('claimedBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Food.countDocuments(query);

    res.json({
      foods,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json({
      message: 'Food deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'verified', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json({
      message: 'User status updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
