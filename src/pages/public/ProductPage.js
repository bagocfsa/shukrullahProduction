import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const foundProduct = data.products.find(p => p.id === parseInt(id));
        setProduct(foundProduct);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading product:', error);
        setIsLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return <div style={{padding: '2rem', textAlign: 'center'}}>Loading...</div>;
  }

  if (!product) {
    return (
      <div style={{padding: '2rem', textAlign: 'center'}}>
        <h2>Product not found</h2>
        <Link to="/shop">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div style={{padding: '2rem 0', minHeight: '100vh'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
        <Link to="/shop" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#e67e22', textDecoration: 'none'}}>
          <FaArrowLeft /> Back to Shop
        </Link>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start'}}>
          <div style={{background: '#f8f9fa', height: '400px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', color: '#e67e22'}}>
            🥜
          </div>
          
          <div>
            <h1 style={{fontSize: '2.5rem', color: '#2c3e50', marginBottom: '1rem'}}>{product.name}</h1>
            <p style={{fontSize: '1.1rem', color: '#5a6c7d', lineHeight: '1.6', marginBottom: '1.5rem'}}>{product.description}</p>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} style={{color: '#f39c12'}} />
              ))}
              <span style={{color: '#5a6c7d'}}>(4.8)</span>
            </div>
            
            <div style={{marginBottom: '1.5rem'}}>
              <span style={{fontSize: '2rem', fontWeight: '700', color: '#e67e22'}}>₦{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span style={{fontSize: '1.2rem', color: '#95a5a6', textDecoration: 'line-through', marginLeft: '1rem'}}>₦{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            
            <div style={{marginBottom: '2rem'}}>
              <p><strong>Weight:</strong> {product.weight}</p>
              <p><strong>Stock:</strong> {product.stock} available</p>
              <p><strong>Category:</strong> {product.category}</p>
            </div>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                style={{padding: '8px 12px', border: '2px solid #e9ecef', borderRadius: '8px', width: '80px'}}
              />
            </div>
            
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '16px 32px',
                background: product.stock === 0 ? '#95a5a6' : '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <FaShoppingCart />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
