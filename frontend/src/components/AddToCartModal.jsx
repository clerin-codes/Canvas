import { useState } from 'react';
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';
import axios from 'axios';

export default function AddToCartModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        productId: product._id,
        size: selectedSize,
        quantity,
      };

      if (token) {
        await axios.post('http://localhost:5000/api/cart/add', payload, {
          headers: { 'x-auth-token': token },
        });
      } else {
        // Guest cart in localStorage
        const key = 'guest_cart';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        // Try to find same product+size
        const idx = existing.findIndex(
          (i) => i.productId === payload.productId && i.size === payload.size
        );
        if (idx > -1) {
          existing[idx].quantity += payload.quantity;
        } else {
          existing.push(payload);
        }
        localStorage.setItem(key, JSON.stringify(existing));
      }

      setSuccess(true);
      setTimeout(() => {
        // Soft-refresh: dispatch a storage event-like update for header count consumers
        window.dispatchEvent(new Event('storage'));
        window.location.reload();
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Added to Cart!</h3>
            <p className="text-gray-600">Your item has been added successfully</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add to Cart</h2>

            <div className="mb-6">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">${product.price}</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Size *
              </label>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiMinus />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Available: {product.stock} items</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}