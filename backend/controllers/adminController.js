const Order = require('../models/Order');
const User = require('../models/User');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .populate('assignedTo', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getDeliveryPartners = async (req, res) => {
  try {
    const deliveryPartners = await User.find({ role: 'delivery' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(deliveryPartners);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllOrders, getDeliveryPartners, getCustomers };