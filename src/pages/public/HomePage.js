import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import './HomePage.css';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});

  useEffect(() => {
    // Load data from JSON file
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setFeaturedProducts(data.products.filter(product => product.featured));
        setSiteSettings(data.siteSettings);
      })
      .catch(error => {
        console.error('Error loading data:', error);
      });
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message (you can implement a toast notification here)
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              {siteSettings.siteName || 'Shukrullah Premium Foods'}
            </h1>
            <p className="hero-subtitle">
              {siteSettings.tagline || 'Authentic Nigerian Kulikuli & Traditional Snacks'}
            </p>
            <p className="hero-description">
              {siteSettings.description || 'Premium quality traditional Nigerian snacks made with the finest ingredients and authentic recipes passed down through generations.'}
            </p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary">
                Shop Now <FaArrowRight />
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-placeholder">
              <span className="hero-emoji">🥜</span>
              <p>Premium Kulikuli</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>100% Natural</h3>
              <p>Made with premium groundnuts and natural ingredients</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🍳</div>
              <h3>Traditional Recipe</h3>
              <p>Authentic recipes passed down through generations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Premium Quality</h3>
              <p>Carefully crafted for the perfect taste and texture</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Discover our most popular traditional snacks</p>
          </div>
          
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <div className="product-image-placeholder">
                    <span>🥜</span>
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="discount-badge">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="star filled" />
                    ))}
                    <span className="rating-text">(4.8)</span>
                  </div>
                  <div className="product-price">
                    <span className="current-price">₦{product.price.toLocaleString()}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">₦{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="btn btn-outline">
                      View Details
                    </Link>
                    <button 
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="section-footer">
            <Link to="/shop" className="btn btn-primary">
              View All Products <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Taste Authentic Nigerian Flavors?</h2>
            <p>Join thousands of satisfied customers who trust Shukrullah Foods for premium quality snacks</p>
            <Link to="/shop" className="btn btn-primary btn-large">
              Start Shopping <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
