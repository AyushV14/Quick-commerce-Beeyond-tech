const Product = require('../models/Product');
const Order = require('../models/Order');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    const order = await Order.create({
      customerId: req.user._id,
      items,
      total,
      status: 'pending'
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('customerId', 'name email')
      .populate('items.productId');

    const io = req.app.get('io');
    if (io) {
      io.emit('order_created', populatedOrder);
      io.emit('new_order', populatedOrder);
    }

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('items.productId')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProducts, createOrder, getMyOrders };