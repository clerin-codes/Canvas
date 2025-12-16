# 🛍️ Canvas - Modern E-Commerce Clothing Store

A fully functional, production-ready e-commerce web application for a clothing brand built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). Features include user authentication with OTP verification, shopping cart with MongoDB persistence, product filtering, search functionality, and automated email notifications.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-v20+-green?style=flat-square)
![React](https://img.shields.io/badge/React-v19+-blue?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-v3-38bdf8?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Running the Application](#️-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Implementation Notes](#-implementation-notes)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 User Authentication & Authorization
- **OTP-based Registration**: Secure email verification with 6-digit OTP (10-minute expiry)
- **JWT Authentication**: Token-based secure authentication (30-day sessions)
- **Password Encryption**: bcryptjs with salt rounds for secure password hashing
- **Protected Routes**: Middleware for authenticated-only access
- **Session Management**: Persistent login with localStorage
- **User Profile Management**: Update profile, change password, delete account

### 🛒 Shopping Experience
- **Product Catalog**: Browse clothing products with images and details
- **Product Details**: Comprehensive product information with sizes (S, M, L, XL)
- **Categories**: Men, Women, Kids collections
- **Search Functionality**: Real-time search by product name and description
- **Advanced Filters**: 
  - Filter by category (Men/Women/Kids)
  - Filter by size (S/M/L/XL)
  - Price range filtering (min/max)
  - **Multiple filters work simultaneously**
- **Pagination Support**: Efficient product browsing with page limits

### 🛍️ Shopping Cart (MongoDB Persisted)
- **User-Specific Cart**: Cart saved per registered user in MongoDB
- **Add to Cart Modal**: Interactive popup for size and quantity selection
- **Cart Management**: 
  - Add items with size selection (required)
  - Update quantities with +/- buttons
  - Remove individual items
  - Clear entire cart
- **Cart Persistence**: Cart data persists after logout/login
- **Stock Validation**: Prevents adding more items than available
- **Real-time Cart Count**: Red badge notification in header showing item count
- **Automatic Sync**: Cart updates reflected immediately across all pages

### 💳 Checkout & Payment
- **Stripe Payment Integration**: Secure payment processing (ready for implementation)
- **Order Summary**: Complete breakdown of items, prices, and totals
- **Free Shipping**: Orders over $50 qualify for free shipping
- **Order Creation**: Automatic order generation with unique IDs

### 📧 Email Notifications
- **Beautiful HTML Emails**: Professional gradient-styled templates with Canvas branding
- **OTP Emails**: Registration verification codes with expiry information
- **Order Confirmation**: Detailed order summaries with item lists
- **Email Content**:
  - Order ID and date
  - Complete item list with sizes and quantities
  - Total amount and shipping info
  - Member benefits (10% off first order, free shipping over $50)
  - Contact information and social media links

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach, works on all devices
- **Tailwind CSS**: Modern utility-first styling
- **React Icons**: Comprehensive icon library (FiShoppingCart, FiUser, etc.)
- **Smooth Scrolling**: Navigate sections smoothly on homepage
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Modal Dialogs**: Interactive popups for cart and product details

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v20+ | JavaScript runtime environment |
| **Express.js** | v5.2.1 | Web application framework |
| **MongoDB** | Latest | NoSQL database for data storage |
| **Mongoose** | v9.0.1 | MongoDB object modeling and schemas |
| **JWT (jsonwebtoken)** | v9.0.3 | JSON Web Token authentication |
| **bcryptjs** | v3.0.3 | Password hashing and encryption |
| **Nodemailer** | v7.0.11 | Email sending service (SMTP) |
| **dotenv** | v17.2.3 | Environment variable management |
| **cors** | v2.8.5 | Cross-origin resource sharing |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | v19.2.0 | UI library for building components |
| **Vite** | v7.2.4 | Fast build tool and dev server |
| **React Router** | v7.10.1 | Client-side routing |
| **Axios** | v1.13.2 | HTTP client for API calls |
| **Tailwind CSS** | v3.4.19 | Utility-first CSS framework |
| **React Icons** | v5.5.0 | Icon components library |

---

## 📁 Project Structure

```
Canvas/
├── backend/
│   ├── server.js                      # Express server entry point
│   ├── .env                           # Environment variables (gitignored)
│   ├── package.json                   # Backend dependencies
│   │
│   ├── models/
│   │   ├── user.js                    # User schema with OTP fields
│   │   ├── Product.js                 # Product schema with categories/sizes
│   │   └── Cart.js                    # Cart schema with user reference
│   │
│   ├── routes/
│   │   ├── auth.js                    # Auth routes (OTP, register, login)
│   │   ├── products.js                # Product routes with filters
│   │   └── cart.js                    # Cart management routes
│   │
│   ├── controllers/
│   │   ├── productController.js       # Product business logic
│   │   └── cartController.js          # Cart operations (add/update/remove)
│   │
│   └── middleware/
│       └── auth.js                    # JWT verification middleware
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                   # React entry point
│   │   ├── App.jsx                    # Main app with routes
│   │   ├── index.css                  # Global styles & Tailwind
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Landing page
│   │   │   ├── Products.jsx           # Product listing with filters
│   │   │   ├── Cart.jsx               # Shopping cart page
│   │   │   ├── Login.jsx              # Login page
│   │   │   ├── Register.jsx           # Multi-step registration with OTP
│   │   │   └── Profile.jsx            # User profile management
│   │   │
│   │   ├── components/
│   │   │   ├── Header.jsx             # Navigation with cart badge
│   │   │   ├── Footer.jsx             # Footer section
│   │   │   ├── HeroBanner.jsx         # Hero section
│   │   │   ├── Categories.jsx         # Category cards
│   │   │   ├── FeaturedProducts.jsx   # Featured products
│   │   │   ├── Features.jsx           # Feature highlights
│   │   │   ├── ProductCard.jsx        # Product card component
│   │   │   └── AddToCartModal.jsx     # Add to cart popup modal
│   │   │
│   │   └── assets/
│   │       └── canvas-logo.png        # Brand logo
│   │
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind configuration
│   └── postcss.config.js              # PostCSS configuration
│
└── README.md                          # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **npm** (v10+) - Comes with Node.js
- **MongoDB** (Local or Atlas) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Gmail Account** (for email notifications) - [Gmail](https://gmail.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/clerin-codes/Canvas.git
cd Canvas
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

**Or install dependencies individually:**

```bash
# Core dependencies
npm install express@5.2.1
npm install mongoose@9.0.1
npm install cors@2.8.5
npm install dotenv@17.2.3

# Authentication & Security
npm install jsonwebtoken@9.0.3
npm install bcryptjs@3.0.3

# Email service
npm install nodemailer@7.0.11

# Development dependency
npm install --save-dev nodemon@3.1.11
```

**Backend Dependencies Installed:**
- ✅ **express** (v5.2.1) - Web framework for Node.js
- ✅ **mongoose** (v9.0.1) - MongoDB object modeling
- ✅ **bcryptjs** (v3.0.3) - Password hashing library
- ✅ **jsonwebtoken** (v9.0.3) - JWT token generation/verification
- ✅ **nodemailer** (v7.0.11) - Email sending via SMTP
- ✅ **cors** (v2.8.5) - Cross-origin resource sharing
- ✅ **dotenv** (v17.2.3) - Environment variable loader
- ✅ **nodemon** (v3.1.11) - Development auto-restart (dev dependency)

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

**Frontend Dependencies Installed:**
- ✅ **react** (v19.2.0) - UI library
- ✅ **react-dom** (v19.2.0) - React DOM renderer
- ✅ **react-router-dom** (v7.10.1) - Routing library
- ✅ **vite** (v7.2.4) - Build tool and dev server
- ✅ **tailwindcss** (v3.4.19) - CSS framework
- ✅ **axios** (v1.13.2) - HTTP client
- ✅ **react-icons** (v5.5.0) - Icon library

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/canvas_clothing_store

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
EMAIL_FROM=Canvas@clothingstore.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 📧 Gmail App Password Setup (Required for Nodemailer)

**Important:** You must use an App Password, not your regular Gmail password.

#### Step-by-Step Guide:

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Scroll to "2-Step Verification"
   - Click "Get Started" and follow instructions
   - Enable 2FA using phone number

2. **Generate App Password**
   - Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
   - You might need to sign in again
   - Select "Mail" from the app dropdown
   - Select "Other (Custom name)" from device dropdown
   - Enter "Canvas Clothing Store" as the custom name
   - Click "Generate"
   - Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

3. **Update .env File**
   - Paste the app password in `EMAIL_PASS` (remove all spaces)
   - Example: `EMAIL_PASS=abcdabcdabcdabcd`

**Common Issues:**
- If you don't see "App Passwords" option, enable 2FA first
- App passwords only work with 2FA enabled
- Don't share your app password

### 🗄️ MongoDB Setup

**Option 1: Local MongoDB**

```bash
# Install MongoDB Community Edition
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community@7.0
# Linux: sudo apt-get install mongodb-org

# Start MongoDB service
# Windows: Runs automatically as a service
# Mac: brew services start mongodb-community@7.0
# Linux: sudo systemctl start mongod

# Verify MongoDB is running
mongosh
# You should see MongoDB shell prompt
```

**Option 2: MongoDB Atlas (Cloud - Recommended)**

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Free tier)
3. Create database user (username/password)
4. Add IP to whitelist:
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"
5. Get connection string:
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
6. Update `MONGODB_URI` in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/canvas_clothing_store?retryWrites=true&w=majority
   ```
   - Replace `username` with your database username
   - Replace `password` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster address

---

## ▶️ Running the Application

### Development Mode (Recommended)

You'll need **two terminal windows** open:

**Terminal 1 - Backend Server:**

```bash
cd backend
npm start
# Or for auto-restart on file changes:
npx nodemon server.js
```

✅ **Backend running on:** `http://localhost:5000`

**Expected output:**
```
Server running on port 5000
Connected to MongoDB
```

**Terminal 2 - Frontend Dev Server:**

```bash
cd frontend
npm run dev
```

✅ **Frontend running on:** `http://localhost:5173` (or 5174)

**Expected output:**
```
VITE v7.2.4  ready in 300 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

### Production Build

**Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST | `/send-otp` | Send OTP to email | ❌ | `{ email }` |
| POST | `/register` | Complete registration | ❌ | `{ name, email, password, otp }` |
| POST | `/login` | Login user | ❌ | `{ email, password }` |
| GET | `/profile` | Get current user | ✅ | - |
| PUT | `/profile` | Update profile | ✅ | `{ name, profileImage }` |
| POST | `/change-password` | Change password | ✅ | `{ currentPassword, newPassword }` |
| DELETE | `/profile` | Delete account | ✅ | - |

### Product Routes (`/api/products`)

| Method | Endpoint | Description | Auth Required | Query Params |
|--------|----------|-------------|---------------|--------------|
| GET | `/` | Get all products | ❌ | `?category=&size=&priceMin=&priceMax=&search=` |
| GET | `/featured` | Get featured products | ❌ | - |
| GET | `/search` | Search products | ❌ | `?q=keyword` |
| GET | `/category/:category` | Get by category | ❌ | - |
| GET | `/:id` | Get product by ID | ❌ | - |

### Cart Routes (`/api/cart`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| GET | `/` | Get user cart | ✅ | - |
| POST | `/add` | Add item to cart | ✅ | `{ productId, size, quantity }` |
| PUT | `/item/:itemId` | Update cart item | ✅ | `{ quantity }` |
| DELETE | `/item/:itemId` | Remove cart item | ✅ | - |
| DELETE | `/clear` | Clear entire cart | ✅ | - |

**Authentication Header Required:**
```javascript
headers: {
  'x-auth-token': 'your_jwt_token_here'
}
```

---

## 📊 Database Schema

### User Schema (`models/user.js`)

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  profileImage: String (base64 encoded),
  otp: String (6-digit code),
  otpExpires: Date (10 minutes from generation),
  createdAt: Date (default: Date.now)
}
```

### Product Schema (`models/Product.js`)

```javascript
{
  name: String (required, max 100 chars),
  description: String (required, max 500 chars),
  price: Number (required, min 0),
  imageUrl: String (required),
  category: String (enum: ['Men', 'Women', 'Kids']),
  sizes: [String] (enum: ['S', 'M', 'L', 'XL']),
  stock: Number (default: 0, min 0),
  rating: Number (default: 4.5, min 0, max 5),
  reviews: Number (default: 0),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Cart Schema (`models/Cart.js`)

```javascript
{
  user: ObjectId (ref: 'User', required, unique),
  items: [{
    product: ObjectId (ref: 'Product', required),
    name: String (product name),
    price: Number (product price),
    imageUrl: String (product image),
    size: String (enum: ['S', 'M', 'L', 'XL'], required),
    quantity: Number (min: 1, default: 1)
  }],
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}

// Virtual Methods:
cart.getTotal() // Returns total price
cart.getTotalItems() // Returns total item count
```

---

## 📝 Implementation Notes

### ✅ Priorities & Key Decisions

1. **User-Centric Cart Design**
   - Chose MongoDB persistence over localStorage for registered users
   - Ensures cart data survives across sessions and devices
   - Trade-off: Requires authentication to maintain cart

2. **Security First Approach**
   - OTP-based email verification prevents fake registrations
   - JWT tokens with 30-day expiry for session management
   - bcrypt password hashing with salt rounds
   - Protected routes with authentication middleware

3. **Filter System Architecture**
   - Server-side filtering for optimal performance
   - Multiple filters work simultaneously (category + size + price)
   - MongoDB queries optimized with proper indexing

4. **Real-time Cart Updates**
   - Cart count badge updates immediately after any cart operation
   - Page refresh maintains cart state
   - Automatic sync between frontend and backend

### ⚠️ Known Limitations

1. **Payment Integration**
   - Stripe payment is prepared but not fully integrated
   - Requires Stripe account and API keys
   - Current implementation is mock/placeholder

2. **Image Hosting**
   - Product images use external URLs
   - No built-in image upload functionality
   - Future: Implement Cloudinary or AWS S3

3. **Stock Management**
   - No real-time stock updates
   - No low-stock warnings
   - Stock validation only at checkout

4. **Email Rate Limiting**
   - No rate limiting on OTP requests
   - Potential for abuse without CAPTCHA
   - Gmail SMTP has daily sending limits

5. **Search Optimization**
   - Basic text search (case-insensitive regex)
   - No advanced search features (fuzzy matching, synonyms)
   - No search result ranking

### 🚀 Next Steps (If More Time)

**High Priority:**
1. ✅ Complete Stripe payment integration
2. ✅ Add product reviews and ratings
3. ✅ Implement order tracking system
4. ✅ Add wishlist functionality
5. ✅ Build admin dashboard for product management

**Medium Priority:**
6. Add pagination to product listing
7. Implement image upload with Cloudinary
8. Add password reset via email
9. Create order history page
10. Add product recommendations

**Low Priority:**
11. Social media login (Google, Facebook)
12. Multi-language support (i18n)
13. Dark mode toggle
14. Product comparison feature
15. Gift card system

### 🏗️ Architecture Decisions

**Why MongoDB?**
- Flexible schema for evolving product attributes
- Excellent for cart and order data structures
- Easy integration with Mongoose ODM
- Scalable for future growth

**Why JWT?**
- Stateless authentication (no server sessions)
- Easy to scale horizontally
- Works well with mobile apps
- Secure when implemented correctly

**Why Nodemailer with Gmail?**
- Free for development and testing
- Reliable email delivery
- Easy HTML template support
- Widely documented

**Why Tailwind CSS?**
- Rapid UI development
- Consistent design system
- Small bundle size with purge
- Responsive design utilities

---

## 🔧 Scripts

### Backend Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

**Usage:**
```bash
npm start      # Start production server
npm run dev    # Start with auto-reload (development)
```

### Frontend Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

**Usage:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

---

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare package.json:**
   ```json
   {
     "scripts": {
       "start": "node server.js"
     },
     "engines": {
       "node": "20.x"
     }
   }
   ```

2. **Environment Variables:**
   Set all `.env` variables in hosting platform:
   - `NODE_ENV=production`
   - `MONGODB_URI` (use MongoDB Atlas)
   - `JWT_SECRET`
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`
   - `FRONTEND_URL` (production frontend URL)

3. **Deploy:**
   - Connect GitHub repository
   - Select backend folder
   - Deploy automatically

### Frontend Deployment (Vercel/Netlify)

1. **Update API URLs:**
   Replace `http://localhost:5000` with production backend URL in:
   - `src/components/Header.jsx`
   - `src/components/ProductCard.jsx`
   - `src/components/AddToCartModal.jsx`
   - `src/pages/*.jsx`

2. **Build Configuration:**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: 20.x

3. **Deploy:**
   - Connect GitHub repository
   - Configure build settings
   - Deploy

---

## 🧪 Testing the Application

### 1. Test User Registration

```bash
# Step 1: Navigate to registration
http://localhost:5173/register

# Step 2: Enter email
Email: test@example.com

# Step 3: Click "Send OTP"
# Check email inbox for OTP code

# Step 4: Enter OTP and complete profile
OTP: 123456 (from email)
Name: Test User
Password: password123
Confirm Password: password123

# Step 5: Click "Create Account"
# Should redirect to homepage with logged-in state
```

### 2. Test Shopping Cart Flow

```bash
# Step 1: Login with test account

# Step 2: Browse products
http://localhost:5173/products

# Step 3: Click "Add to Cart" on any product

# Step 4: Select size and quantity in modal
Size: M
Quantity: 2

# Step 5: Click "Add to Cart"
# Modal shows success message

# Step 6: Check cart icon in header
# Should show red badge with item count

# Step 7: Navigate to cart
http://localhost:5173/cart

# Step 8: Verify items are listed
# Should show product with selected size and quantity

# Step 9: Test quantity update
# Click + and - buttons

# Step 10: Test item removal
# Click trash icon

# Step 11: Logout and login again
# Cart should persist (data in MongoDB)
```

### 3. Test Search and Filters

```bash
# Test search
1. Click search icon in header
2. Type: "shirt"
3. Press Enter
4. Should show filtered results

# Test category filter
1. Navigate to /products
2. Select category: "Men"
3. Products should filter immediately

# Test multiple filters
1. Category: "Women"
2. Size: "M"
3. Price Min: 20
4. Price Max: 50
5. All filters should work together
```

---

## 🛑 Troubleshooting

### Common Issues

**1. Backend Won't Start**
```bash
# Error: Cannot find module 'express'
Solution: cd backend && npm install

# Error: MONGODB_URI is not defined
Solution: Create .env file with MONGODB_URI

# Error: Port 5000 already in use
Solution: Change PORT in .env or kill process:
# Mac/Linux: lsof -ti:5000 | xargs kill -9
# Windows: netstat -ano | findstr :5000, then taskkill /PID <PID> /F
```

**2. Frontend Won't Start**
```bash
# Error: Cannot find module 'react'
Solution: cd frontend && npm install

# Error: Network request failed
Solution: Ensure backend is running on port 5000
```

**3. MongoDB Connection Issues**
```bash
# Error: connect ECONNREFUSED 127.0.0.1:27017
Solution: Start MongoDB service:
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: MongoDB runs as service automatically

# Error: Authentication failed
Solution: Check MongoDB Atlas credentials in MONGODB_URI
```

**4. Email Not Sending**
```bash
# Error: Invalid login
Solution:
1. Enable 2FA on Gmail
2. Generate new App Password
3. Update EMAIL_PASS in .env (no spaces)

# Error: Connection refused
Solution: Check EMAIL_PORT=587 and EMAIL_HOST=smtp.gmail.com
```

**5. Cart Not Saving**
```bash
# Cart empties after logout
Solution:
1. Ensure you're logged in (JWT token present)
2. Check browser console for errors
3. Verify Cart model exists in backend/models/
4. Check cart routes are registered in server.js
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📝 License

This project is **Proprietary** and licensed under **All Rights Reserved**.

The source code, documentation, and all related materials in this repository are part of the **Canvas** project and are the intellectual property of **Clerin Balakrishnan**.

🚫 **Unauthorized use is strictly prohibited**, including but not limited to:
- Copying or redistributing the code
- Modifying or creating derivative works
- Using the code for commercial or non-commercial purposes

Any usage, modification, or distribution of this project **requires explicit written permission** from the owner.

© 2025 Clerin Balakrishnan. All rights reserved.

---

## 👥 Contact & Support

**Developer:** Clerin Balakrishnan  
**Email:** sheronclerin1805@gmail.com  
**GitHub:** [@clerin-codes](https://github.com/clerin-codes)

### Get Help

- 📧 Email: support@canvas.com
- 🐛 Issues: [GitHub Issues](https://github.com/clerin-codes/Canvas/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/clerin-codes/Canvas/discussions)

---

## 🎉 Acknowledgments

- React team for the amazing library
- MongoDB for the powerful database
- Tailwind CSS for beautiful styling
- Vite for lightning-fast builds
- All open-source contributors

---

**Built with ❤️ using MERN Stack**

**Happy Coding! 🚀**