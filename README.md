# 🛍️ Clothing Brand E-Commerce Web App

A fully functional e-commerce web application for a fictional clothing brand built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=flat-square)
![React](https://img.shields.io/badge/React-v19+-blue?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Features in Detail](#features-in-detail)
- [Demo Products](#demo-products)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 1. **User Accounts & Authentication**
- User registration with email and password
- Secure login with JWT-based authentication
- Passwords encrypted using bcrypt
- Protected routes for authenticated users
- Session management

### 2. **Product Management**
- Browse clothing catalog with 20+ demo products
- Product details: name, description, price, image URL, category, sizes
- Categories: Men, Women, Kids
- Available sizes: S, M, L, XL
- Product detail pages with full information

### 3. **Search, Filters & Pagination**
- Search products by name and description
- Filter by category (Men/Women/Kids)
- Filter by size (S/M/L/XL)
- Filter by price range
- Combine multiple filters simultaneously
- Pagination support (?page=1&limit=10)

### 4. **Shopping Cart**
- Add items to cart with selected size
- Update item quantities
- Remove items from cart
- Cart persistence per user
- Add to cart without login (guest cart)
- Real-time cart updates

### 5. **Checkout & Orders**
- Mock checkout process (no real payment processing)
- Order creation with user reference
- Order details: items, sizes, quantities, total price, order date
- Order history for users
- Order status tracking

### 6. **Order Confirmation Email**
- Automated email notifications using Nodemailer
- Email includes:
  - Order summary with products, sizes, and quantities
  - Order ID
  - Order date
  - Total price
- Gmail SMTP configuration

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **Vite** - Build tool

---

## 📁 Project Structure

```
Canvas/
├── backend/
│   ├── server.js                 # Entry point
│   ├── .env                      # Environment variables
│   ├── .gitignore               # Git ignore rules
│   ├── package.json             # Dependencies
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Cart.js              # Cart schema
│   │   └── Order.js             # Order schema
│   |── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── products.js          # Product routes
│   │   ├── cart.js              # Cart routes
│   │   └── orders.js            # Order routes
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── productController.js # Product logic
│   │   ├── cartController.js    # Cart logic
│   │   └── orderController.js   # Order logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── utils/
│   │   ├── emailService.js      # Nodemailer setup
│   │   └── seedData.js          # Demo products
│   └── config/
│       └── db.js                # MongoDB connection
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # Entry point
│   │   ├── App.jsx              # Main component
│   │   ├── index.css            # Global styles
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Home page
│   │   │   ├── Products.jsx     # Products listing
│   │   │   ├── ProductDetail.jsx # Product details
│   │   │   ├── Cart.jsx         # Shopping cart
│   │   │   ├── Checkout.jsx     # Checkout page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Orders.jsx       # Order history
│   │   │   └── OrderConfirm.jsx # Order confirmation
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation
│   │   │   ├── ProductCard.jsx  # Product card
│   │   │   ├── Filter.jsx       # Filter sidebar
│   │   │   ├── CartItem.jsx     # Cart item
│   │   │   └── Footer.jsx       # Footer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Auth state
│   │   │   └── CartContext.jsx  # Cart state
│   │   └── utils/
│   │       └── api.js           # API calls
│   ├── index.html               # HTML template
│   ├── package.json             # Dependencies
│   ├── tailwind.config.js       # Tailwind config
│   ├── postcss.config.js        # PostCSS config
│   └── vite.config.js           # Vite config
│
└── README.md                    # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** (Local or Atlas) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/clothing-ecommerce.git
cd Canvas
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/clothing_ecommerce

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d

# Email Configuration (Nodemailer - Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@clothingstore.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer"
4. Copy the generated 16-character password
5. Paste it in `EMAIL_PASS` in your `.env` file

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or `http://localhost:3000`)

### Build for Production

**Backend:**
```bash
cd backend
npm run build
```

**Frontend:**
```bash
cd frontend
npm run build
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products with filters & pagination
- `GET /api/products/:id` - Get product details
- `GET /api/products/search?q=keyword` - Search products
- `GET /api/products/filter?category=Men&size=M&priceMin=100&priceMax=5000` - Filter products

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/status/:id` - Get order status

---

## 📊 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  category: String (Men/Women/Kids),
  sizes: [String] (S/M/L/XL),
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Schema
```javascript
{
  userId: ObjectId (ref: User),
  items: [
    {
      productId: ObjectId (ref: Product),
      quantity: Number,
      size: String,
      price: Number
    }
  ],
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  userId: ObjectId (ref: User),
  items: [
    {
      productId: ObjectId (ref: Product),
      quantity: Number,
      size: String,
      price: Number
    }
  ],
  totalPrice: Number,
  orderDate: Date,
  status: String (pending/confirmed/shipped/delivered),
  shippingAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Features in Detail

### Search & Filter
- **Search**: Find products by name or description
- **Category Filter**: Men, Women, Kids
- **Size Filter**: S, M, L, XL
- **Price Range**: Set minimum and maximum price
- **Combine Filters**: Use multiple filters together
- **Pagination**: Navigate through product pages

### Shopping Cart
- Add items with selected size
- Update quantities on the fly
- Remove individual items
- Clear entire cart
- View cart total
- Guest cart support (localStorage)

### Checkout Process
1. Review cart items
2. Enter shipping address
3. Confirm order (mock payment)
4. Receive order confirmation email
5. View order in order history

### Email Notifications
- Order confirmation with details
- Order summary with products and quantities
- Order ID and date
- Total price

---

## 📦 Demo Products

The application includes 20+ demo clothing products:

- **Men's Category**: T-shirts, Jeans, Jackets, Hoodies, Shirts
- **Women's Category**: Dresses, Tops, Jeans, Jackets, Skirts
- **Kids' Category**: T-shirts, Shorts, Jackets, Hoodies, Pants

Each product includes:
- Name and description
- Price
- Available sizes (S/M/L/XL)
- Category
- Product image URL

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---



---

## 🎓 Learning Resources

- [MERN Stack Tutorial](https://www.mongodb.com/languages/mern-stack-tutorial)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Authentication](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📅 Project Timeline

- **Phase 1**: Setup & Authentication ✅
- **Phase 2**: Product Management & Catalog
- **Phase 3**: Search, Filters & Pagination
- **Phase 4**: Shopping Cart Implementation
- **Phase 5**: Checkout & Orders
- **Phase 6**: Email Notifications
- **Phase 7**: Testing & Deployment

---

**Happy Coding! 🚀**


