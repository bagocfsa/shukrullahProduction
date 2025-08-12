import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, StarIcon, TruckIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';
import { categories, products } from '../data/products';
import { usePricing } from '../context/PricingContext';

const HomePage: React.FC = () => {
  const { getProductPrice } = usePricing();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-groundnut-600 to-oil-700 text-white relative overflow-hidden">
        {/* Groundnut pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-8 h-12 bg-white rounded-full transform rotate-12"></div>
          <div className="absolute top-32 right-20 w-6 h-10 bg-white rounded-full transform -rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-10 h-14 bg-white rounded-full transform rotate-30"></div>
          <div className="absolute bottom-32 right-1/3 w-7 h-11 bg-white rounded-full transform -rotate-12"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Premium <span className="text-oil-200">Groundnut Products</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-100 max-w-3xl mx-auto px-4">
              From farm to table - Traditional Kuli-kuli, Pure Groundnut Oil from Shukrullah Nigeria Ltd
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link
                to="/products"
                className="bg-gradient-to-r from-oil-400 to-primary-500 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:from-oil-500 hover:to-primary-600 transition-all duration-300 inline-flex items-center justify-center shadow-lg"
              >
                Shop Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/products"
                className="bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
              >
                Home Delivery
                <TruckIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile First */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TruckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm sm:text-base text-gray-600">Quick delivery within Minna and surrounding areas</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <ShieldCheckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-sm sm:text-base text-gray-600">Authentic Nigerian products with traditional quality</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <HeartIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Local Business</h3>
              <p className="text-sm sm:text-base text-gray-600">Supporting Nigerian craftsmanship and tradition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Discover authentic Nigerian products and quality leather goods</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products/${category.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="h-32 sm:h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative overflow-hidden">
                  {/* Show actual product images */}
                  {category.name.includes('Kuli-kuli') && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-yellow-200 flex items-center justify-center">
                      <img
                        src="/images/products/kuli1kg.jpeg"
                        alt="Kuli-kuli products"
                        className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg shadow-md opacity-90"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) nextElement.style.display = 'block';
                        }}
                      />
                      <div className="text-4xl sm:text-6xl hidden">🥜</div>
                    </div>
                  )}
                  {category.name.includes('Oils') && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-amber-200 flex items-center justify-center">
                      <img
                        src="/images/products/1litreOil.PNG"
                        alt="Groundnut oil products"
                        className="w-16 h-16 sm:w-24 sm:h-24 object-contain opacity-90 drop-shadow-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) nextElement.style.display = 'block';
                        }}
                      />
                      <div className="text-4xl sm:text-6xl hidden">🫒</div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Mobile First */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Featured Products</h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">Our most popular Nigerian products</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="h-32 sm:h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) nextElement.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-primary-100 flex items-center justify-center text-2xl sm:text-4xl hidden">
                    🥜
                  </div>
                </div>
                <div className="p-3 sm:p-6">
                  <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-1 sm:mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">({product.reviewCount})</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-base sm:text-xl font-bold text-primary-600">
                      ₦{getProductPrice(product.price, product.physicalShopPrice).toLocaleString()}
                    </span>
                    {product.physicalShopPrice && product.physicalShopPrice !== product.price && (
                      <span className="text-xs text-gray-500 hidden sm:block">
                        (Shop: ₦{product.physicalShopPrice.toLocaleString()})
                      </span>
                    )}
                  </div>
                  <div className="mt-2 sm:mt-4">
                    <div className="w-full bg-primary-600 text-white py-1 sm:py-2 px-2 sm:px-4 rounded text-center text-xs sm:text-sm font-medium group-hover:bg-primary-700 transition-colors">
                      View Details
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-12">
            <Link
              to="/products"
              className="bg-primary-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center text-sm sm:text-base"
            >
              View All Products
              <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Mobile First */}
      <section className="py-8 sm:py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Stay in the Loop</h2>
          <p className="text-base sm:text-xl text-primary-100 mb-6 sm:mb-8 px-4">
            Get updates on new products and exclusive offers
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 sm:py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-white text-primary-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
