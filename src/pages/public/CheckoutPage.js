import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      navigate('/cart');
    }
    setCartItems(cart);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create order
    const order = {
      id: Date.now(),
      items: cartItems,
      customer: customerInfo,
      total: calculateTotal(),
      date: new Date().toISOString(),
      status: 'pending'
    };

    // Save order to localStorage (in real app, send to server)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));

    alert('Order placed successfully! Thank you for your purchase.');
    navigate('/');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.075;
    const shipping = subtotal >= 5000 ? 0 : 500;
    return subtotal + tax + shipping;
  };

  return (
    <div style={{padding: '2rem 0', minHeight: '100vh', background: '#f8f9fa'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', padding: '0 20px'}}>
        <h1 style={{textAlign: 'center', marginBottom: '2rem', color: '#2c3e50'}}>Checkout</h1>
        
        <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)'}}>
          <form onSubmit={handleSubmit}>
            <h3 style={{marginBottom: '1.5rem', color: '#2c3e50'}}>Customer Information</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
              <input
                type="text"
                placeholder="Full Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                required
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
              <input
                type="email"
                placeholder="Email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                required
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
            </div>
            
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              required
              style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', marginBottom: '1rem', boxSizing: 'border-box'}}
            />
            
            <textarea
              placeholder="Delivery Address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              required
              rows="3"
              style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', marginBottom: '1rem', boxSizing: 'border-box', resize: 'vertical'}}
            />
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem'}}>
              <input
                type="text"
                placeholder="City"
                value={customerInfo.city}
                onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                required
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
              <input
                type="text"
                placeholder="State"
                value={customerInfo.state}
                onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                required
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
            </div>

            <div style={{background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem'}}>
              <h4 style={{marginBottom: '1rem', color: '#2c3e50'}}>Order Summary</h4>
              {cartItems.map(item => (
                <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <hr style={{margin: '1rem 0'}} />
              <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', color: '#e67e22'}}>
                <span>Total:</span>
                <span>₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                background: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.3s ease'
              }}
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
