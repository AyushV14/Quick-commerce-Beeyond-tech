const express = require('express');
const { getProducts, createOrder, getMyOrders } = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.post('/', authMiddleware, roleMiddleware('customer'), createOrder);
router.get('/my-orders', authMiddleware, roleMiddleware('customer'), getMyOrders);

module.exports = router;