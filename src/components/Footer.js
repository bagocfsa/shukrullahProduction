import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <div className="footer-logo">
            <span className="logo-icon">🥜</span>
            <span className="logo-text">Shukrullah Foods</span>
          </div>
          <p className="footer-description">
            Premium quality traditional Nigerian snacks made with the finest ingredients 
            and authentic recipes passed down through generations.
          </p>
          <div className="social-links">
            <a href="https://facebook.com/shukrullahfoods" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://instagram.com/shukrullahfoods" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com/shukrullahfoods" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3>Categories</h3>
          <ul className="footer-links">
            <li><Link to="/shop?category=kulikuli">Traditional Kulikuli</Link></li>
            <li><Link to="/shop?category=premium">Premium Collection</Link></li>
            <li><Link to="/shop?featured=true">Featured Products</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact Info</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>123 Market Street, Lagos, Nigeria</span>
            </div>
            <div className="contact-item">
              <FaPhone />
              <span>+234 123 456 7890</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>info@shukrullahfoods.com</span>
            </div>
          </div>
          <div className="business-hours">
            <h4>Business Hours</h4>
            <p>Mon-Sat: 8AM-6PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} Shukrullah Foods. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
