import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEye } from 'react-icons/fa';

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(savedOrders);
  }, []);

  return (
    <div style={{minHeight: '100vh', background: '#f8f9fa', padding: '2rem 0'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
        <div style={{marginBottom: '2rem'}}>
          <Link to="/admin/dashboard" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#e67e22', textDecoration: 'none', marginBottom: '1rem'}}>
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 style={{color: '#2c3e50', margin: 0}}>Manage Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div style={{background: 'white', padding: '3rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.08)'}}>
            <h3 style={{color: '#2c3e50', marginBottom: '1rem'}}>No Orders Yet</h3>
            <p style={{color: '#5a6c7d'}}>Orders from customers will appear here.</p>
          </div>
        ) : (
          <div style={{background: 'white', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', overflow: 'hidden'}}>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: '#f8f9fa'}}>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Order ID</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Customer</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Date</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Total</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Status</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} style={{borderBottom: '1px solid #e9ecef'}}>
                      <td style={{padding: '1rem', color: '#2c3e50', fontWeight: '600'}}>#{order.id}</td>
                      <td style={{padding: '1rem', color: '#5a6c7d'}}>{order.customer.name}</td>
                      <td style={{padding: '1rem', color: '#5a6c7d'}}>{new Date(order.date).toLocaleDateString()}</td>
                      <td style={{padding: '1rem', color: '#e67e22', fontWeight: '600'}}>₦{order.total.toLocaleString()}</td>
                      <td style={{padding: '1rem'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: order.status === 'pending' ? '#fff3cd' : '#d4edda',
                          color: order.status === 'pending' ? '#856404' : '#155724'
                        }}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td style={{padding: '1rem'}}>
                        <button style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '6px 12px',
                          background: '#e67e22',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}>
                          <FaEye /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageOrders;
