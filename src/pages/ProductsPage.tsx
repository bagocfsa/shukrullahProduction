import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { StarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { products, categories } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { usePricing } from '../context/PricingContext';
import FloatingCart from '../components/FloatingCart';
import { useNotification } from '../context/NotificationContext';

const ProductsPage: React.FC = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { addToCart } = useCart();
  const { getProductPrice, salesChannel } = usePricing();
  const { showSuccess } = useNotification();

  // Floating cart state
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<string>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [groupByCategory, setGroupByCategory] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);

  // Find current category
  const currentCategory = categories.find(cat => cat.slug === category);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (category && currentCategory) {
      filtered = filtered.filter(product => product.category === currentCategory.name);
    }

    // Enhanced search functionality
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const searchTerms = query.split(' ').filter(term => term.length > 0);

      filtered = filtered.filter(product => {
        const searchableText = [
          product.name,
          product.description,
          product.category,
          product.subcategory || '',
          ...product.tags,
          ...product.benefits,
          ...product.ingredients,
          product.usage
        ].join(' ').toLowerCase();

        // Check if all search terms are found (AND logic)
        return searchTerms.every(term =>
          searchableText.includes(term) ||
          // Also check for partial matches in product name (more weight)
          product.name.toLowerCase().includes(term)
        );
      });
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter(product => product.rating >= selectedRating);
    }

    // Sort products
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default: // popular
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return filtered;
  }, [category, currentCategory, searchQuery, priceRange, selectedRating, sortBy]);

  // Group products by category
  const groupedProducts = useMemo(() => {
    if (!groupByCategory) return null;

    const grouped = filteredProducts.reduce((acc, product) => {
      const categoryName = product.category;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    return grouped;
  }, [filteredProducts, groupByCategory]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);

    // Show success notification
    showSuccess(
      'Added to Cart!',
      `${product.name} has been added to your cart.`
    );

    // Show floating cart and highlight the added item
    setHighlightedItemId(product.id);
    setShowFloatingCart(true);

    // Cart remains visible until manually closed - no auto-hide
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 groundnut-texture">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-groundnut-gradient">
              {currentCategory ? currentCategory.name : searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-gray-600 mt-2">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-gradient-to-br from-primary-50 to-groundnut-50 p-6 rounded-lg shadow-md border border-primary-200">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="100"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={selectedRating === rating}
                      onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                      className="mr-2"
                    />
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">& up</span>
                    </div>
                  </label>
                ))}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    value={0}
                    checked={selectedRating === 0}
                    onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">All Ratings</span>
                </label>
              </div>
            </div>

            {/* Group by Category */}
            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={groupByCategory}
                  onChange={(e) => setGroupByCategory(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Group by Category</span>
              </label>
            </div>

            {/* Categories (if not already filtered) */}
            {!category && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="space-y-2">
                  <Link
                    to="/products"
                    className="block text-sm text-gray-600 hover:text-primary-600"
                  >
                    All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products/${cat.slug}`}
                      className="block text-sm text-gray-600 hover:text-primary-600"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          ) : groupByCategory && groupedProducts ? (
            // Grouped by Category View
            <div className="space-y-8">
              {Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
                <div key={categoryName} className="category-section">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-groundnut-gradient mr-4">{categoryName}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary-300 to-transparent"></div>
                    <span className="text-sm text-gray-500 ml-4">{categoryProducts.length} products</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map((product) => (
                      <div key={product.id} className="product-card bg-gradient-to-br from-white to-primary-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-primary-100">
                        <Link to={`/product/${product.id}`}>
                          <div className="h-48 bg-gray-200 overflow-hidden">
                            <img
                              src={product.images[0] || '/images/products/default.png'}
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/products/default.png';
                              }}
                            />
                          </div>
                        </Link>
                        <div className="p-6">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">({product.reviewCount})</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}</p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-primary-600">
                                ₦{getProductPrice(product.price, product.physicalShopPrice).toLocaleString()}
                              </span>
                              {product.physicalShopPrice && product.physicalShopPrice !== product.price && (
                                <div className="text-xs text-gray-500">
                                  {salesChannel === 'online' ? (
                                    <span>Shop: ₦{product.physicalShopPrice.toLocaleString()}</span>
                                  ) : (
                                    <span>Online: ₦{product.price.toLocaleString()}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to={`/product/${product.id}`}
                              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Regular Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card bg-gradient-to-br from-white to-primary-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-primary-100">
                  <Link to={`/product/${product.id}`}>
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={product.images[0] || '/images/products/default.png'}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/products/default.png';
                        }}
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.reviewCount})</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary-600">
                          ₦{getProductPrice(product.price, product.physicalShopPrice).toLocaleString()}
                        </span>
                        {product.physicalShopPrice && product.physicalShopPrice !== product.price && (
                          <div className="text-xs text-gray-500">
                            {salesChannel === 'online' ? (
                              <span>Shop: ₦{product.physicalShopPrice.toLocaleString()}</span>
                            ) : (
                              <span>Online: ₦{product.price.toLocaleString()}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart */}
      <FloatingCart
        isVisible={showFloatingCart}
        onClose={() => setShowFloatingCart(false)}
        highlightedItemId={highlightedItemId}
      />
    </div>
  );
};

export default ProductsPage;
