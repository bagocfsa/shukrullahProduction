import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to a server
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{padding: '2rem 0', minHeight: '100vh', background: '#f8f9fa'}}>
      <div style={{maxWidth: '1000px', margin: '0 auto', padding: '0 20px'}}>
        <h1 style={{textAlign: 'center', marginBottom: '2rem', color: '#2c3e50', fontSize: '2.5rem'}}>Contact Us</h1>
        <p style={{textAlign: 'center', marginBottom: '3rem', color: '#5a6c7d', fontSize: '1.1rem'}}>
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start'}}>
          {/* Contact Form */}
          <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)'}}>
            <h2 style={{marginBottom: '1.5rem', color: '#2c3e50'}}>Send us a Message</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '1rem'}}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{marginBottom: '1rem'}}>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{marginBottom: '1rem'}}>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{marginBottom: '1.5rem'}}>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: '#e67e22',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', marginBottom: '2rem'}}>
              <h2 style={{marginBottom: '1.5rem', color: '#2c3e50'}}>Get in Touch</h2>
              
              <div style={{marginBottom: '1.5rem'}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                  <FaMapMarkerAlt style={{color: '#e67e22', marginRight: '1rem', fontSize: '1.2rem'}} />
                  <div>
                    <h4 style={{margin: '0 0 0.25rem 0', color: '#2c3e50'}}>Address</h4>
                    <p style={{margin: 0, color: '#5a6c7d'}}>123 Market Street, Lagos, Nigeria</p>
                  </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                  <FaPhone style={{color: '#e67e22', marginRight: '1rem', fontSize: '1.2rem'}} />
                  <div>
                    <h4 style={{margin: '0 0 0.25rem 0', color: '#2c3e50'}}>Phone</h4>
                    <p style={{margin: 0, color: '#5a6c7d'}}>+234 123 456 7890</p>
                  </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                  <FaEnvelope style={{color: '#e67e22', marginRight: '1rem', fontSize: '1.2rem'}} />
                  <div>
                    <h4 style={{margin: '0 0 0.25rem 0', color: '#2c3e50'}}>Email</h4>
                    <p style={{margin: 0, color: '#5a6c7d'}}>info@shukrullahfoods.com</p>
                  </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <FaClock style={{color: '#e67e22', marginRight: '1rem', fontSize: '1.2rem'}} />
                  <div>
                    <h4 style={{margin: '0 0 0.25rem 0', color: '#2c3e50'}}>Business Hours</h4>
                    <p style={{margin: 0, color: '#5a6c7d'}}>Mon-Sat: 8AM-6PM<br />Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)'}}>
              <h3 style={{marginBottom: '1rem', color: '#2c3e50'}}>Why Choose Us?</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '0.5rem', color: '#5a6c7d'}}>✅ Premium quality ingredients</li>
                <li style={{marginBottom: '0.5rem', color: '#5a6c7d'}}>✅ Traditional authentic recipes</li>
                <li style={{marginBottom: '0.5rem', color: '#5a6c7d'}}>✅ Fast and reliable delivery</li>
                <li style={{marginBottom: '0.5rem', color: '#5a6c7d'}}>✅ Excellent customer service</li>
                <li style={{color: '#5a6c7d'}}>✅ Satisfaction guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
