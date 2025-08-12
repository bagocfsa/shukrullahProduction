import React from 'react';

function AboutPage() {
  return (
    <div style={{padding: '2rem 0', minHeight: '100vh'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', padding: '0 20px'}}>
        <h1 style={{textAlign: 'center', marginBottom: '2rem', color: '#2c3e50', fontSize: '2.5rem'}}>About Shukrullah Foods</h1>
        
        <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', marginBottom: '2rem'}}>
          <h2 style={{color: '#e67e22', marginBottom: '1rem'}}>Our Story</h2>
          <p style={{lineHeight: '1.6', color: '#5a6c7d', marginBottom: '1.5rem'}}>
            Shukrullah Foods was founded with a passion for preserving and sharing the authentic flavors of traditional Nigerian cuisine. 
            Our journey began with a simple mission: to bring the finest quality Kulikuli and traditional snacks to families across Nigeria and beyond.
          </p>
          <p style={{lineHeight: '1.6', color: '#5a6c7d'}}>
            Using recipes passed down through generations and the finest locally-sourced ingredients, we craft each product with care and attention to detail. 
            Our commitment to quality and authenticity has made us a trusted name in traditional Nigerian snacks.
          </p>
        </div>

        <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', marginBottom: '2rem'}}>
          <h2 style={{color: '#e67e22', marginBottom: '1rem'}}>Our Values</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3rem', marginBottom: '0.5rem'}}>🌱</div>
              <h3 style={{color: '#2c3e50', marginBottom: '0.5rem'}}>Natural Ingredients</h3>
              <p style={{color: '#5a6c7d', fontSize: '0.9rem'}}>We use only the finest natural ingredients with no artificial preservatives.</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3rem', marginBottom: '0.5rem'}}>👨‍🍳</div>
              <h3 style={{color: '#2c3e50', marginBottom: '0.5rem'}}>Traditional Methods</h3>
              <p style={{color: '#5a6c7d', fontSize: '0.9rem'}}>Our recipes and preparation methods honor traditional Nigerian cooking.</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3rem', marginBottom: '0.5rem'}}>⭐</div>
              <h3 style={{color: '#2c3e50', marginBottom: '0.5rem'}}>Premium Quality</h3>
              <p style={{color: '#5a6c7d', fontSize: '0.9rem'}}>Every product meets our high standards for taste, texture, and freshness.</p>
            </div>
          </div>
        </div>

        <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)'}}>
          <h2 style={{color: '#e67e22', marginBottom: '1rem'}}>Contact Information</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
            <div>
              <h4 style={{color: '#2c3e50', marginBottom: '0.5rem'}}>Address</h4>
              <p style={{color: '#5a6c7d'}}>123 Market Street<br />Lagos, Nigeria</p>
            </div>
            <div>
              <h4 style={{color: '#2c3e50', marginBottom: '0.5rem'}}>Contact</h4>
              <p style={{color: '#5a6c7d'}}>Phone: +234 123 456 7890<br />Email: info@shukrullahfoods.com</p>
            </div>
            <div>
              <h4 style={{color: '#2c3e50', marginBottom: '0.5rem'}}>Business Hours</h4>
              <p style={{color: '#5a6c7d'}}>Mon-Sat: 8AM-6PM<br />Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
