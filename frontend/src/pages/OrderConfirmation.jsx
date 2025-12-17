import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiCheckCircle, FiDownload, FiArrowRight } from 'react-icons/fi';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      // If no order in state, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const calculateItemTotal = (price, quantity) => price * quantity;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <FiCheckCircle className="text-green-500" size={64} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg mb-4">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-lg font-semibold text-gray-800 break-all">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="text-lg font-semibold text-gray-800">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-lg font-semibold text-green-600 capitalize">
                {order.status}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Size</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-800">{item.productName}</td>
                      <td className="py-4 px-4 text-center text-gray-800">{item.size}</td>
                      <td className="py-4 px-4 text-center text-gray-800">{item.quantity}</td>
                      <td className="py-4 px-4 text-right text-gray-800">LKR{item.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-800">
                        LKR{calculateItemTotal(item.price, item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-full md:w-80">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between mb-3 pb-3 border-b">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800 font-semibold">
                    LKR{order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-3 pb-3 border-b">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    LKR{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-800">
              <strong>What's next?</strong> Your order is being processed. You'll receive a shipping notification once your items are dispatched.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View All Orders
            <FiArrowRight size={18} />
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Continue Shopping
            <FiArrowRight size={18} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
