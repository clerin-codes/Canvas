const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/user');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send order confirmation email
const sendOrderConfirmationEmail = async (user, order) => {
  try {
    // Generate order items HTML
    const itemsHTML = order.items
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 12px; text-align: left; color: #333;">${item.productName}</td>
        <td style="padding: 12px; text-align: center; color: #666;">${item.size}</td>
        <td style="padding: 12px; text-align: center; color: #666;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; color: #666;">$${item.price.toFixed(2)}</td>
        <td style="padding: 12px; text-align: right; color: #4F46E5; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0;">CANVAS</h1>
          <p style="color: #666; margin-top: 5px; font-size: 14px;">Elevate Your Style, Define Your Canvas</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0; font-size: 24px;">🎉 Order Confirmed!</h2>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Thank you for shopping with Canvas</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #333; margin-top: 0;">📦 Order Details</h3>
          <p style="color: #555; margin: 8px 0;"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
          <p style="color: #555; margin: 8px 0;"><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</p>
          <p style="color: #555; margin: 8px 0;"><strong>Status:</strong> <span style="color: #22c55e; font-weight: bold;">✓ ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #333; margin-bottom: 15px;">🛍️ Your Items</h3>
          <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <th style="padding: 12px; text-align: left; color: white; font-weight: 600;">Product</th>
                <th style="padding: 12px; text-align: center; color: white; font-weight: 600;">Size</th>
                <th style="padding: 12px; text-align: center; color: white; font-weight: 600;">Qty</th>
                <th style="padding: 12px; text-align: right; color: white; font-weight: 600;">Price</th>
                <th style="padding: 12px; text-align: right; color: white; font-weight: 600;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr style="background-color: #f8f9fa;">
                <td colspan="4" style="padding: 15px; text-align: right; font-weight: bold; color: #333; font-size: 16px;">Total Amount:</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; color: #4F46E5; font-size: 18px;">$${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="border-left: 4px solid #22c55e; padding-left: 15px; margin-bottom: 25px; background-color: #f0fdf4; padding: 15px; border-radius: 4px;">
          <h4 style="color: #333; margin-top: 0;">✨ What Happens Next?</h4>
          <ol style="color: #555; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
            <li>We're preparing your order for shipment</li>
            <li>You'll receive a shipping confirmation email with tracking details</li>
            <li>Your order will arrive within 3-5 business days</li>
            <li>Enjoy your new Canvas items!</li>
          </ol>
        </div>
        
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e8eaf6 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e0e0e0;">
          <h4 style="color: #333; margin-top: 0;">🎁 Member Benefits Reminder:</h4>
          <ul style="color: #555; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
            <li><strong>10% OFF</strong> on your next order - Use code: <strong style="color: #4F46E5;">CANVAS10</strong></li>
            <li>Free shipping on orders above $50</li>
            <li>Exclusive member-only deals</li>
            <li>Early access to new collections</li>
          </ul>
        </div>
        
        <div style="text-align: center; background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #666; margin: 0 0 15px 0;">Need help with your order?</p>
          <a href="mailto:support@canvasclothing.com" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Contact Support</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p style="margin: 5px 0;">
            <strong>Canvas Clothing Store</strong><br>
            📍 123 Fashion Street, Style City<br>
            📞 Customer Support: 1-800-CANVAS<br>
            🕒 Mon-Fri: 9AM-6PM | Sat-Sun: 10AM-4PM
          </p>
          <p style="margin-top: 15px;">
            Follow us:
            <a href="https://instagram.com/canvasclothing" style="color: #4F46E5; text-decoration: none;">Instagram</a> •
            <a href="https://facebook.com/canvasclothing" style="color: #4F46E5; text-decoration: none;">Facebook</a> •
            <a href="https://twitter.com/canvasclothing" style="color: #4F46E5; text-decoration: none;">Twitter</a>
          </p>
          <p style="margin-top: 10px; color: #999;">
            Questions about your order? Contact us at
            <a href="mailto:support@canvasclothing.com" style="color: #4F46E5;">support@canvasclothing.com</a>
          </p>
          <p style="margin-top: 10px; color: #999;">
            © 2024 Canvas Clothing Store. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const textContent = `
Welcome to Canvas Clothing Store!

🎉 ORDER CONFIRMED!
Thank you for shopping with Canvas

📦 Order Details:
Order ID: #${order._id.toString().slice(-8).toUpperCase()}
Order Date: ${new Date(order.orderDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}
Status: ✓ ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}

🛍️ Your Items:
${order.items.map(item => `
${item.productName}
Size: ${item.size} | Quantity: ${item.quantity}
Price: $${item.price.toFixed(2)} | Total: $${(item.price * item.quantity).toFixed(2)}
`).join('\n')}

Total Amount: $${order.totalAmount.toFixed(2)}

✨ What Happens Next?
1. We're preparing your order for shipment
2. You'll receive a shipping confirmation email with tracking details
3. Your order will arrive within 3-5 business days
4. Enjoy your new Canvas items!

🎁 Member Benefits Reminder:
• 10% OFF on your next order - Use code: CANVAS10
• Free shipping on orders above $50
• Exclusive member-only deals
• Early access to new collections

Store Information:
📍 123 Fashion Street, Style City
📞 Customer Support: 1-800-CANVAS
🕒 Mon-Fri: 9AM-6PM | Sat-Sun: 10AM-4PM

Follow us on social media:
Instagram: @canvasclothing
Facebook: facebook.com/canvasclothing
Twitter: @canvasclothing

Questions about your order? Contact us at support@canvasclothing.com

© 2024 Canvas Clothing Store. All rights reserved.
    `;

    await transporter.sendMail({
      from: `"Canvas Clothing Store" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: `🎉 Order Confirmed - Order #${order._id.toString().slice(-8).toUpperCase()}`,
      html: htmlContent,
      text: textContent,
    });

    console.log(`Order confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    // Don't throw error - email failure should not break checkout
  }
};

// Checkout API
exports.checkout = async (req, res) => {
  try {
    // Verify user authentication
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Validate cart is not empty
    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Cannot proceed to checkout.',
      });
    }

    // Calculate total price server-side and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      // Verify product still exists and get current price
      const product = await Product.findById(cartItem.product._id);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${cartItem.name} is no longer available`,
        });
      }

      // Verify size is still available
      if (!product.sizes.includes(cartItem.size)) {
        return res.status(400).json({
          success: false,
          message: `Size ${cartItem.size} is no longer available for ${cartItem.name}`,
        });
      }

      // Verify stock
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${cartItem.name}. Available: ${product.stock}`,
        });
      }

      // Use current product price (server-side calculation)
      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        size: cartItem.size,
        quantity: cartItem.quantity,
        price: product.price,
      });
    }

    // Create and save order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      status: 'confirmed',
    });

    await order.save();

    // Clear the user's cart after successful order creation
    cart.items = [];
    await cart.save();

    // Trigger order confirmation email (async, don't wait)
    sendOrderConfirmationEmail(user, order).catch((err) => {
      console.error('Failed to send confirmation email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing checkout',
      error: error.message,
    });
  }
};

// Get all orders of logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate('items.productId')
      .sort({ orderDate: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify order belongs to authenticated user
    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: This order does not belong to you',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};
