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

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'OTP for Registration',
      html: `<h1>Your OTP: ${otp}</h1><p>Valid for 10 minutes</p>`
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