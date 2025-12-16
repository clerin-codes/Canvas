import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiPackage className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600">You haven't placed any orders yet. Start shopping now!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div
                  onClick={() =>
                    setExpandedOrderId(expandedOrderId === order._id ? null : order._id)
                  }
                  className="p-6 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-gray-800">Order #{order._id.slice(-8)}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Order Date</p>
                        <p className="font-medium text-gray-800">{formatDate(order.orderDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Items</p>
                        <p className="font-medium text-gray-800">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                        <p className="font-bold text-blue-600">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {expandedOrderId === order._id ? (
                      <FiChevronUp size={24} className="text-gray-400" />
                    ) : (
                      <FiChevronDown size={24} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {expandedOrderId === order._id && (
                  <div className="border-t bg-gray-50 p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Order Items</h4>
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 font-semibold text-gray-700">
                              Product
                            </th>
                            <th className="text-center py-2 px-3 font-semibold text-gray-700">
                              Size
                            </th>
                            <th className="text-center py-2 px-3 font-semibold text-gray-700">
                              Quantity
                            </th>
                            <th className="text-right py-2 px-3 font-semibold text-gray-700">
                              Price
                            </th>
                            <th className="text-right py-2 px-3 font-semibold text-gray-700">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="py-3 px-3 text-gray-800">{item.productName}</td>
                              <td className="py-3 px-3 text-center text-gray-800">{item.size}</td>
                              <td className="py-3 px-3 text-center text-gray-800">
                                {item.quantity}
                              </td>
                              <td className="py-3 px-3 text-right text-gray-800">
                                ${item.price.toFixed(2)}
                              </td>
                              <td className="py-3 px-3 text-right font-semibold text-gray-800">
                                ${(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Order Summary */}
                    <div className="flex justify-end">
                      <div className="w-full md:w-64">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between mb-2 pb-2 border-b">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-800 font-semibold">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-800">Total</span>
                            <span className="font-bold text-blue-600">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
