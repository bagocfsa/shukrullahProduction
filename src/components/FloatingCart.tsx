import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, XMarkIcon, PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { usePricing } from '../context/PricingContext';

interface FloatingCartProps {
  isVisible: boolean;
  onClose: () => void;
  highlightedItemId?: string | null;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ isVisible, onClose, highlightedItemId }) => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { getProductPrice } = usePricing();
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

  useEffect(() => {
    if (highlightedItemId) {
      setHighlightedItem(highlightedItemId);
      // Remove highlight after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedItem(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedItemId]);

  if (!isVisible || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full mx-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCartIcon className="h-5 w-5" />
            <h3 className="font-semibold">Your Cart ({cart.items.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="max-h-96 overflow-y-auto">
          {cart.items.map((item) => {
            const isHighlighted = highlightedItem === item.product.id;
            return (
              <div
                key={item.product.id}
                className={`
                  p-4 border-b border-gray-100 transition-all duration-500
                  ${isHighlighted ? 'bg-yellow-50 border-yellow-200' : 'hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center space-x-3">
                  {/* Product Image */}
                  <img
                    src={item.product.images[0] || '/images/products/default.png'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      ₦{getProductPrice(item.product.price).toLocaleString()} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <MinusIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 rounded-full hover:bg-red-100 transition-colors ml-2"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="mt-2 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    ₦{(getProductPrice(item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>

                {/* Highlight indicator */}
                {isHighlighted && (
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ✨ Just added!
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3">
          {/* Total */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-lg font-semibold text-gray-900">
              ₦{cart.subtotal.toLocaleString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Link
              to="/cart"
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors text-center block"
              onClick={onClose}
            >
              View Full Cart
            </Link>
            <Link
              to="/checkout"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center block"
              onClick={onClose}
            >
              Checkout Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCart;
