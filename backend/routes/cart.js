const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(auth);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCart);

// Update cart item quantity
router.put('/item/:itemId', updateCartItem);

// Remove item from cart
router.delete('/item/:itemId', removeFromCart);

// Clear cart
router.delete('/clear', clearCart);

// Merge guest cart into user cart
router.post('/merge', mergeCart);

module.exports = router;