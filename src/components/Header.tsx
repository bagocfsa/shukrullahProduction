import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/products';
import SalesChannelSelector from './SalesChannelSelector';
import SearchSuggestions from './SearchSuggestions';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { getCartItemsCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cartItemsCount = getCartItemsCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
  };

  return (
    <header className="bg-gradient-to-r from-primary-50 to-groundnut-50 shadow-lg sticky top-0 z-50 border-b-2 border-primary-200">
      {/* Top bar - Mobile First */}
      <div className="bg-gradient-to-r from-primary-600 to-groundnut-600 text-white py-1 sm:py-2">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <p className="truncate">Free delivery within Minna!</p>
            <div className="hidden sm:flex space-x-2 sm:space-x-4">
              <Link to="/support" className="hover:text-primary-200 transition-colors">Support</Link>
              <Link to="/track-order" className="hover:text-primary-200 transition-colors">Track Order</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header - Mobile First */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-4">
          {/* Logo - Responsive */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/images/Logo.png"
              alt="Shukrullah Nigeria Ltd"
              className="h-8 w-auto sm:h-10 lg:h-12 mr-2 sm:mr-3"
            />
            <div className="flex flex-col">
              <div className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-primary-600 to-groundnut-600 bg-clip-text text-transparent">
                Shukrullah
              </div>
              <div className="text-xs sm:text-xs lg:text-sm text-groundnut-600 font-medium -mt-1">
                Nigeria Ltd
              </div>
            </div>
          </Link>

          {/* Search bar - Desktop Only (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-1 max-w-md xl:max-w-lg mx-4 xl:mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  placeholder="Search for groundnut oil, kuli-kuli..."
                  className="w-full pl-3 pr-10 py-2 text-sm border border-groundnut-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-300 bg-primary-50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>

                {/* Search Suggestions */}
                <SearchSuggestions
                  query={searchQuery}
                  onSuggestionClick={handleSuggestionClick}
                  onClose={() => setShowSuggestions(false)}
                  isVisible={showSuggestions}
                />
              </div>
            </form>
          </div>

          {/* Right side icons - Mobile Optimized */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Sales Channel Selector - Hidden on small mobile */}
            <div className="hidden sm:block">
              <SalesChannelSelector />
            </div>

            {/* Cart - Touch Friendly */}
            <Link
              to="/cart"
              className="relative p-2 sm:p-2 text-gray-600 hover:text-primary-600 transition-colors touch-manipulation"
            >
              <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu - Mobile Optimized */}
            {isAuthenticated ? (
              <div className="relative">
                <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                  <span className="text-xs sm:text-sm text-gray-700 hidden md:block truncate max-w-24 lg:max-w-none">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="px-1 sm:px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full hidden sm:block">
                      {user?.role.replace('_', ' ')}
                    </span>
                    <button
                      onClick={logout}
                      className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-1 rounded-md hover:bg-gray-100 transition-colors touch-manipulation"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-gray-700 hover:text-primary-600 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-gray-100 transition-colors touch-manipulation"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button - Touch Optimized */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors touch-manipulation"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation - Desktop Only */}
        <nav className="hidden lg:block border-t border-gray-200">
          <div className="flex space-x-4 xl:space-x-8 py-3 lg:py-4 overflow-x-auto">
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors whitespace-nowrap text-sm lg:text-base"
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products/${category.slug}`}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors whitespace-nowrap text-sm lg:text-base"
              >
                {category.name}
              </Link>
            ))}
            {isAuthenticated && (
              <div className="border-l border-gray-300 pl-4 xl:pl-8 ml-4 xl:ml-8">
                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'staff') && (
                  <Link
                    to="/factory"
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors mr-3 xl:mr-6 whitespace-nowrap text-sm lg:text-base"
                  >
                    Factory
                  </Link>
                )}
                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'staff') && (
                  <Link
                    to="/shop"
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors mr-3 xl:mr-6 whitespace-nowrap text-sm lg:text-base"
                  >
                    Shop
                  </Link>
                )}
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <Link
                    to="/analytics"
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors mr-3 xl:mr-6 whitespace-nowrap text-sm lg:text-base"
                  >
                    Analytics
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/google-sheets"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors mr-3 xl:mr-6 whitespace-nowrap text-sm lg:text-base"
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/sales-config"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors mr-3 xl:mr-6 whitespace-nowrap text-sm lg:text-base"
                    >
                      Sales Config
                    </Link>
                    <Link
                      to="/admin/setup-sheets"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors mr-3 xl:mr-6 whitespace-nowrap text-sm lg:text-base"
                    >
                      Setup Guide
                    </Link>
                    <Link
                      to="/admin/products"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors mr-3 xl:mr-6 whitespace-nowrap text-sm lg:text-base"
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/end-of-day"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors mr-3 xl:mr-6 whitespace-nowrap text-sm lg:text-base"
                    >
                      End of Day
                    </Link>
                    <Link
                      to="/admin/access-control"
                      className="text-gray-700 hover:text-primary-600 font-medium transition-colors whitespace-nowrap text-sm lg:text-base"
                    >
                      Access Control
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile menu - Perfectly Responsive */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          {/* Mobile search - Always visible on mobile */}
          <div className="px-3 sm:px-4 py-3 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base touch-manipulation"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors touch-manipulation"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>

                {/* Mobile Search Suggestions */}
                <SearchSuggestions
                  query={searchQuery}
                  onSuggestionClick={handleSuggestionClick}
                  onClose={() => setShowSuggestions(false)}
                  isVisible={showSuggestions}
                />
              </div>
            </form>
          </div>

          {/* Mobile navigation - Touch Optimized */}
          <nav className="px-3 sm:px-4 py-2">
            <Link
              to="/products"
              className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-manipulation border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products/${category.slug}`}
                className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-manipulation border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}

            {/* Sales Channel Selector for Mobile */}
            <div className="sm:hidden py-3 border-b border-gray-100">
              <SalesChannelSelector />
            </div>
            {isAuthenticated && (
              <div className="border-t border-gray-200 mt-2 pt-2 bg-gray-50">
                <div className="px-2 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Dashboard Access
                </div>
                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'staff') && (
                  <Link
                    to="/factory"
                    className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-manipulation border-b border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Factory Dashboard
                  </Link>
                )}
                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'staff') && (
                  <Link
                    to="/shop"
                    className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-manipulation border-b border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shop Dashboard
                  </Link>
                )}
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <Link
                    to="/analytics"
                    className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-manipulation border-b border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Analytics Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <>
                    <div className="px-2 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide border-t border-gray-200 mt-2 pt-4">
                      Admin Controls
                    </div>
                    <Link
                      to="/admin/google-sheets"
                      className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-manipulation border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      User Management
                    </Link>
                    <Link
                      to="/admin/sales-config"
                      className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-manipulation border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sales Configuration
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-manipulation border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Product Management
                    </Link>
                    <Link
                      to="/admin/end-of-day"
                      className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-manipulation border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      End of Day Sales
                    </Link>
                    <Link
                      to="/admin/access-control"
                      className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-manipulation border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Access Control
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Support Links */}
            <div className="border-t border-gray-200 mt-2 pt-2 bg-gray-50">
              <div className="px-2 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
                Support
              </div>
              <Link
                to="/support"
                className="block py-3 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Customer Support
              </Link>
              <Link
                to="/track-order"
                className="block py-3 text-gray-700 hover:text-primary-600 transition-colors touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Your Order
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
