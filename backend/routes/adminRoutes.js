const express = require('express');
const { getAllOrders, getDeliveryPartners, getCustomers } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/orders', authMiddleware, roleMiddleware('admin'), getAllOrders);
router.get('/delivery-partners', authMiddleware, roleMiddleware('admin'), getDeliveryPartners);
router.get('/customers', authMiddleware, roleMiddleware('admin'), getCustomers);

module.exports = router;