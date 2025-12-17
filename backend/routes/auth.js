const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Remove sensitive fields
function sanitizeUser(userDoc) {
  if (!userDoc) return userDoc;
  const u = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete u.password;
  delete u.otp;
  delete u.otpExpires;
  delete u.__v;
  return u;
}

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP
    await User.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { upsert: true, new: true }
    );

    // Send email with HTML template
    await transporter.sendMail({
      from: `"Canvas Clothing Store" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '🔐 Your OTP for Canvas Registration',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0;">CANVAS</h1>
          <p style="color: #666; margin-top: 5px; font-size: 14px;">Elevate Your Style, Define Your Canvas</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0; font-size: 24px;">Your One-Time Password (OTP)</h2>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 42px; font-weight: bold; color: #4F46E5; letter-spacing: 8px; font-family: monospace; margin: 15px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">
            ⏰ This OTP will expire in <strong>10 minutes</strong>
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #333; margin-top: 0;">📝 How to Use This OTP:</h3>
          <ol style="color: #555; line-height: 1.8;">
            <li>Enter the 6-digit code above in the registration form</li>
            <li>Complete your profile details (name and password)</li>
            <li>Click "Create Account" to finish registration</li>
          </ol>
        </div>
        
        <div style="border-left: 4px solid #4F46E5; padding-left: 15px; margin-bottom: 25px;">
          <h4 style="color: #333; margin-top: 0;">🎁 Welcome to Canvas! Here's what you get:</h4>
          <ul style="color: #555; line-height: 1.8;">
            <li><strong>10% OFF</strong> on your first order</li>
            <li>Free shipping on orders above LKR50</li>
            <li>Exclusive member-only deals</li>
            <li>Early access to new collections</li>
          </ul>
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
            If you didn't request this OTP, please ignore this email or contact us at 
            <a href="mailto:support@canvasclothing.com" style="color: #4F46E5;">support@canvasclothing.com</a>
          </p>
          <p style="margin-top: 10px; color: #999;">
            © 2024 Canvas Clothing Store. All rights reserved.
          </p>
        </div>
      </div>
      `,
      text: `Welcome to Canvas Clothing Store!

Your One-Time Password (OTP): ${otp}

⏰ This OTP will expire in 10 minutes.

📝 How to Use This OTP:
1. Enter the 6-digit code above in the registration form
2. Complete your profile details (name and password)
3. Click "Create Account" to finish registration

🎁 Welcome to Canvas! Here's what you get:
• 10% OFF on your first order
• Free shipping on orders above LKR50
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

If you didn't request this OTP, please ignore this email or contact us at support@canvasclothing.com

© 2024 Canvas Clothing Store. All rights reserved.`
    });

    res.json({ msg: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    // Check OTP
    const tempUser = await User.findOne({ 
      email, 
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!tempUser) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    tempUser.name = name;
    tempUser.password = hashedPassword;
    tempUser.otp = undefined;
    tempUser.otpExpires = undefined;

    await tempUser.save();

    // Create token
    const payload = { user: { id: tempUser.id, email: tempUser.email } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRE || '30d' 
    });

    res.json({
      token,
      user: sanitizeUser(tempUser)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, email: user.email } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRE || '30d' 
    });

    res.json({
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(sanitizeUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, profileImage } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    res.json(sanitizeUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete account
router.delete('/profile', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;