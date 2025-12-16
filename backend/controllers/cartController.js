const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper: add or update a single item in a cart doc (no save)
async function upsertCartItem(cart, { productId, size, quantity }) {
  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  if (!product.sizes.includes(size)) {
    throw new Error('Size not available');
  }
  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === String(productId) && item.size === size
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      size,
      quantity,
    });
  }
}

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json({
      success: true,
      cart,
      total: cart.getTotal(),
      totalItems: cart.getTotalItems(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message,
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    await upsertCartItem(cart, { productId, size, quantity });

    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart,
      total: cart.getTotal(),
      totalItems: cart.getTotalItems(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message,
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check stock
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Cart updated',
      cart,
      total: cart.getTotal(),
      totalItems: cart.getTotalItems()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items.pull(itemId);
    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart,
      total: cart.getTotal(),
      totalItems: cart.getTotalItems()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart,
      total: 0,
      totalItems: 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

// Merge guest cart items into user's cart
exports.mergeCart = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, size, quantity }]
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items must be an array' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    for (const guestItem of items) {
      const { productId, size, quantity = 1 } = guestItem || {};
      if (!productId || !size || !quantity) continue;
      await upsertCartItem(cart, { productId, size, quantity });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Cart merged',
      cart,
      total: cart.getTotal(),
      totalItems: cart.getTotalItems(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error merging cart', error: error.message });
  }
};