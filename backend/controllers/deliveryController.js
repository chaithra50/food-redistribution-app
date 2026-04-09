const Delivery = require('../models/Delivery');
const Food = require('../models/Food');

exports.getDeliveries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const deliveries = await Delivery.find(query)
      .populate('food', 'foodName quantity status')
      .populate('donor', 'name phone')
      .populate('receiver', 'name phone address')
      .populate('volunteer', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Delivery.countDocuments(query);

    res.json({
      deliveries,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVolunteerDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      $or: [
        { volunteer: req.user.id },
        { status: 'Pending' },
      ],
    })
      .populate('food', 'foodName quantity status')
      .populate('donor', 'name phone address')
      .populate('receiver', 'name phone address')
      .sort({ createdAt: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (delivery.status !== 'Pending') {
      return res.status(400).json({ message: 'Delivery cannot be accepted' });
    }

    delivery.volunteer = req.user.id;
    delivery.status = 'Accepted';
    delivery.updatedAt = Date.now();

    await delivery.save();

    res.json({
      message: 'Delivery accepted successfully',
      delivery,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Accepted', 'PickedUp', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Check if user is volunteer or donor
    if (delivery.volunteer?.toString() !== req.user.id && delivery.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    delivery.status = status;
    delivery.updatedAt = Date.now();

    if (status === 'PickedUp') {
      delivery.pickupTime = Date.now();
    } else if (status === 'Delivered') {
      delivery.deliveryTime = Date.now();
    }

    await delivery.save();

    // Update food status accordingly
    const food = await Food.findById(delivery.food);
    if (food) {
      food.status = status === 'Delivered' ? 'Delivered' : status === 'PickedUp' ? 'PickedUp' : 'Claimed';
      food.assignedVolunteer = delivery.volunteer;
      await food.save();
    }

    res.json({
      message: 'Delivery status updated successfully',
      delivery,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('food')
      .populate('donor', 'name phone address')
      .populate('receiver', 'name phone address')
      .populate('volunteer', 'name phone');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
