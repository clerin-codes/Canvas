import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Load guest cart from localStorage with hydration
      const guest = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      if (guest.length === 0) {
        setCart({ items: [] });
        setLoading(false);
        return;
      }
      const hydrate = async () => {
        try {
          const items = await Promise.all(
            guest.map(async (g) => {
              try {
                const res = await axios.get(`http://localhost:5000/api/products/${g.productId}`);
                const p = res.data.product;
                return {
                  _id: `${g.productId}_${g.size}`,
                  product: { _id: g.productId },
                  name: p.name,
                  imageUrl: p.imageUrl,
                  price: p.price,
                  size: g.size,
                  quantity: g.quantity,
                };
              } catch (e) {
                return {
                  _id: `${g.productId}_${g.size}`,
                  product: { _id: g.productId },
                  name: 'Product',
                  imageUrl: 'https://via.placeholder.com/96x96?text=Item',
                  price: 0,
                  size: g.size,
                  quantity: g.quantity,
                };
              }
            })
          );
          setCart({ items });
        } finally {
          setLoading(false);
        }
      };
      hydrate();
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { 'x-auth-token': token }
      });
      setCart(res.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const guest = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const [pid, size] = itemId.split('_');
        const idx = guest.findIndex((i) => i.productId === pid && i.size === size);
        if (idx > -1) {
          guest[idx].quantity = newQuantity;
          localStorage.setItem('guest_cart', JSON.stringify(guest));
          setCart((prev) => ({
            ...prev,
            items: prev.items.map((it) =>
              it._id === itemId ? { ...it, quantity: newQuantity } : it
            ),
          }));
        }
      } else {
        const res = await axios.put(
          `http://localhost:5000/api/cart/item/${itemId}`,
          { quantity: newQuantity },
          { headers: { 'x-auth-token': token } }
        );
        setCart(res.data.cart);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    if (!confirm('Remove this item from cart?')) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const guest = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const [pid, size] = itemId.split('_');
        const next = guest.filter((i) => !(i.productId === pid && i.size === size));
        localStorage.setItem('guest_cart', JSON.stringify(next));
        setCart((prev) => ({ ...prev, items: prev.items.filter((it) => it._id !== itemId) }));
      } else {
        const res = await axios.delete(`http://localhost:5000/api/cart/item/${itemId}`, {
          headers: { 'x-auth-token': token }
        });
        setCart(res.data.cart);
      }
    } catch (error) {
      alert('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!confirm('Clear all items from cart?')) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.removeItem('guest_cart');
        setCart({ items: [] });
      } else {
        const res = await axios.delete('http://localhost:5000/api/cart/clear', {
          headers: { 'x-auth-token': token }
        });
        setCart(res.data.cart);
      }
    } catch (error) {
      alert('Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
  };

  const getTotalItems = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {!cart?.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get started</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Items ({getTotalItems()})</h2>
                <button
                  onClick={clearCart}
                  disabled={updating}
                  className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>

              {cart.items.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/96x96?text=Item'}
                    alt={item.name || 'Item'}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name || 'Product'}</h3>
                    <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">LKR{item.price || 0}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={updating || item.quantity <= 1}
                        className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition disabled:opacity-50"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={updating}
                        className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition disabled:opacity-50"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <button
                      onClick={() => removeItem(item._id)}
                      disabled={updating}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <FiTrash2 size={20} />
                    </button>
                    <p className="text-lg font-bold text-gray-800">
                      LKR{(((item.price || 0) * item.quantity)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>LKR{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{calculateTotal() >= 50 ? 'FREE' : 'LKR5.00'}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      LKR{(calculateTotal() + (calculateTotal() >= 50 ? 0 : 5)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {calculateTotal() < 50 && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      Add LKR{(50 - calculateTotal()).toFixed(2)} more for FREE shipping!
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (!token) {
                      alert('Please login to proceed to checkout');
                      navigate('/login');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block text-center text-blue-600 hover:text-blue-700 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}