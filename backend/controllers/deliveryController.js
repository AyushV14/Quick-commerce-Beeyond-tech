const Order = require('../models/Order');

const getUnassignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      status: 'pending',
      assignedTo: null
    })
      .populate('customerId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending' || order.assignedTo !== null) {
      return res.status(400).json({ message: 'Order already assigned' });
    }

    order.status = 'accepted';
    order.assignedTo = req.user._id;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('customerId', 'name email')
      .populate('assignedTo', 'name email')
      .populate('items.productId');

    const io = req.app.get('io');
    if (io) {
      io.emit('order_accepted', populatedOrder);
      io.emit('order_locked', populatedOrder);
    }

    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.user._id })
      .populate('customerId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('customerId', 'name email')
      .populate('assignedTo', 'name email')
      .populate('items.productId');

    const io = req.app.get('io');
    if (io) {
      io.emit('order_status_updated', populatedOrder);
    }

    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUnassignedOrders, acceptOrder, updateOrderStatus, getMyDeliveries };