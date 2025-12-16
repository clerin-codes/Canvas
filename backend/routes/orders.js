const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  checkout,
  getMyOrders,
  getOrderById,
} = require('../controllers/checkoutController');

// All order routes require authentication
router.use(auth);

// Checkout API
router.post('/checkout', checkout);

// Get all orders of logged-in user
router.get('/my-orders', getMyOrders);

// Get single order by ID
router.get('/:id', getOrderById);

module.exports = router;
