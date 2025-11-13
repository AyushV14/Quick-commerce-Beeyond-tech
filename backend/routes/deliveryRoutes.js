const express = require('express');
const { getUnassignedOrders, acceptOrder, updateOrderStatus , getMyDeliveries } = require('../controllers/deliveryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/unassigned', authMiddleware, roleMiddleware('delivery'), getUnassignedOrders);
router.post('/accept/:orderId', authMiddleware, roleMiddleware('delivery'), acceptOrder);
router.get('/my-deliveries', authMiddleware, roleMiddleware('delivery'), getMyDeliveries);
router.patch('/update/:orderId', authMiddleware, roleMiddleware('delivery'), updateOrderStatus);

module.exports = router;