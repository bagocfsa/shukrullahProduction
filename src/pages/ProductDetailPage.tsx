import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarIcon, HeartIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { usePricing } from '../context/PricingContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { getProductPrice, salesChannel } = usePricing();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary-600 hover:text-primary-700">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
          <li>/</li>
          <li><Link to="/products" className="hover:text-primary-600">Products</Link></li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-8xl">🥤</div>
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center ${
                    selectedImage === index ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className="text-2xl">🥤</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary-600">
                ₦{getProductPrice(product.price, product.physicalShopPrice).toLocaleString()}
              </span>
              {product.physicalShopPrice && product.physicalShopPrice !== product.price && (
                <div className="text-sm text-gray-500">
                  {salesChannel === 'online' ? (
                    <span>Physical Shop: ₦{product.physicalShopPrice.toLocaleString()}</span>
                  ) : (
                    <span>Online: ₦{product.price.toLocaleString()}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">
                {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </p>
              <p className="text-sm text-primary-600 font-medium">
                {salesChannel === 'online' ? 'Online Price' : 'Physical Shop Price'}
              </p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Serving Size:</span>
                <p className="text-gray-600">{product.servingSize}</p>
              </div>
              <div>
                <span className="font-medium">Servings:</span>
                <p className="text-gray-600">{product.servingsPerContainer}</p>
              </div>
              {product.nutritionFacts && (
                <>
                  <div>
                    <span className="font-medium">Protein:</span>
                    <p className="text-gray-600">{product.nutritionFacts.protein}g</p>
                  </div>
                  <div>
                    <span className="font-medium">Calories:</span>
                    <p className="text-gray-600">{product.nutritionFacts.calories}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                {isFavorite ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                Buy Now
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <TruckIcon className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-sm text-gray-600">Free shipping over $50</span>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-sm text-gray-600">Quality guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['description', 'ingredients', 'nutrition', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">{product.description}</p>
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="text-gray-600">{benefit}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold mb-2 mt-6">Usage</h3>
              <p className="text-gray-600">{product.usage}</p>
              {product.warnings && (
                <>
                  <h3 className="text-lg font-semibold mb-2 mt-6">Warnings</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {product.warnings.map((warning, index) => (
                      <li key={index} className="text-gray-600">{warning}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">{product.ingredients.join(', ')}</p>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && product.nutritionFacts && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Nutrition Facts</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md">
                <div className="border-b-2 border-black pb-2 mb-4">
                  <h4 className="font-bold text-lg">Nutrition Facts</h4>
                  <p className="text-sm">Serving Size: {product.servingSize}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span className="font-medium">Calories</span>
                    <span>{product.nutritionFacts.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span>{product.nutritionFacts.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Carbohydrates</span>
                    <span>{product.nutritionFacts.carbohydrates}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Fat</span>
                    <span>{product.nutritionFacts.fat}g</span>
                  </div>
                  {product.nutritionFacts.fiber && (
                    <div className="flex justify-between">
                      <span>Dietary Fiber</span>
                      <span>{product.nutritionFacts.fiber}g</span>
                    </div>
                  )}
                  {product.nutritionFacts.sugar && (
                    <div className="flex justify-between">
                      <span>Sugars</span>
                      <span>{product.nutritionFacts.sugar}g</span>
                    </div>
                  )}
                  {product.nutritionFacts.sodium && (
                    <div className="flex justify-between">
                      <span>Sodium</span>
                      <span>{product.nutritionFacts.sodium}mg</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              <div className="text-center py-8 text-gray-500">
                <p>Reviews feature coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
