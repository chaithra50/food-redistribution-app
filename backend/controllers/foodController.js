const Food = require('../models/Food');
const User = require('../models/User');
const Delivery = require('../models/Delivery');

exports.addDonation = async (req, res) => {
  try {
    const { foodName, quantity, unit, foodType, cookedTime, expiryTime, description, location, latitude, longitude } = req.body;

    const food = new Food({
      foodName,
      quantity,
      unit,
      foodType,
      cookedTime,
      expiryTime,
      description,
      location,
      coordinates: {
        latitude: latitude || null,
        longitude: longitude || null,
      },
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      donor: req.user.id,
    });

    await food.save();

    res.status(201).json({
      message: 'Food donation added successfully',
      food,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const { status, location, foodType, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (foodType) query.foodType = foodType;

    const skip = (page - 1) * limit;

    const foods = await Food.find(query)
      .populate('donor', 'name phone organizationName address')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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

exports.getDonationById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('donor', 'name phone organizationName address email')
      .populate('claimedBy', 'name email phone')
      .populate('assignedVolunteer', 'name phone');

    if (!food) {
      return res.status(404).json({ message: 'Food donation not found' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDonorDonations = async (req, res) => {
  try {
    const foods = await Food.find({ donor: req.user.id })
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.claimFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food donation not found' });
    }

    if (food.status !== 'Available') {
      return res.status(400).json({ message: 'This food is no longer available' });
    }

    food.status = 'Claimed';
    food.claimedBy = req.user.id;
    food.claimedAt = Date.now();
    food.updatedAt = Date.now();

    await food.save();

    // Create delivery record
    const donation = await Food.findById(req.params.id).populate('donor');
    const receiver = await User.findById(req.user.id);

    const delivery = new Delivery({
      food: food._id,
      donor: food.donor._id,
      receiver: req.user.id,
      status: 'Pending',
      pickupLocation: food.location,
      deliveryLocation: receiver.address,
    });

    await delivery.save();

    res.json({
      message: 'Food claimed successfully',
      food,
      delivery,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFoodStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Available', 'Claimed', 'PickedUp', 'Delivered', 'Expired'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Check if user is donor
    if (food.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    food.status = status;
    food.updatedAt = Date.now();

    if (status === 'PickedUp') {
      food.deliveryDetails.pickupTime = Date.now();
    } else if (status === 'Delivered') {
      food.deliveryDetails.deliveryTime = Date.now();
    }

    await food.save();

    res.json({
      message: 'Food status updated successfully',
      food,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    if (food.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Food donation deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Get top 10 donors
    const topDonors = await Food.aggregate([
      { $group: { _id: '$donor', totalDonations: { $sum: 1 } } },
      { $sort: { totalDonations: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'donorInfo',
        },
      },
      { $unwind: '$donorInfo' },
      {
        $project: {
          rank: 0,
          name: '$donorInfo.name',
          organizationName: '$donorInfo.organizationName',
          email: '$donorInfo.email',
          phone: '$donorInfo.phone',
          totalDonations: 1,
          _id: 0,
          userId: '$_id',
        },
      },
    ]);

    // Get top 10 volunteers
    const topVolunteers = await Delivery.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: '$assignedVolunteer', deliveriesCompleted: { $sum: 1 } } },
      { $sort: { deliveriesCompleted: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'volunteerInfo',
        },
      },
      { $unwind: '$volunteerInfo' },
      {
        $project: {
          name: '$volunteerInfo.name',
          email: '$volunteerInfo.email',
          phone: '$volunteerInfo.phone',
          deliveriesCompleted: 1,
          _id: 0,
          userId: '$_id',
        },
      },
    ]);

    res.json({
      topDonors: topDonors.map((donor, index) => ({ rank: index + 1, ...donor })),
      topVolunteers: topVolunteers.map((volunteer, index) => ({ rank: index + 1, ...volunteer })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
