import { useState } from 'react';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import axios from 'axios';
import AddToCartModal from './AddToCartModal';

export default function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);

  const handleAddToCartClick = () => {
    // Open modal for both guests and logged-in users
    setShowModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-yellow-500">
              <FiStar className="fill-current" />
              <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">Sizes:</span>
            <div className="flex gap-1">
              {product.sizes.map((size) => (
                <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">LKR{product.price}</span>
            <button
              onClick={handleAddToCartClick}
              disabled={product.stock === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FiShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <AddToCartModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}