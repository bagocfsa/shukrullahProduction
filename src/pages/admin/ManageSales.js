import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaCalendarAlt } from 'react-icons/fa';

function ManageSales() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrder: 0,
    todaySales: 0
  });

  useEffect(() => {
    // Check admin authentication
    try {
      const adminSession = localStorage.getItem("adminSession");
      if (!adminSession) {
        navigate("/admin/login");
        return;
      }
      const session = JSON.parse(adminSession);
      const sessionTime = new Date(session.timestamp);
      const now = new Date();
      const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
      
      if (hoursDiff >= 24 || !session.isAuthenticated) {
        localStorage.removeItem("adminSession");
        navigate("/admin/login");
        return;
      }
    } catch {
      localStorage.removeItem("adminSession");
      navigate("/admin/login");
      return;
    }

    loadSalesData();
  }, [navigate]);

  const loadSalesData = () => {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(savedOrders);

    // Calculate stats
    const totalSales = savedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = savedOrders.length;
    const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Today's sales
    const today = new Date().toDateString();
    const todaySales = savedOrders
      .filter(order => new Date(order.date).toDateString() === today)
      .reduce((sum, order) => sum + order.total, 0);

    setStats({
      totalSales,
      totalOrders,
      averageOrder,
      todaySales
    });
  };

  const exportSalesData = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Date', 'Total', 'Status'],
      ...orders.map(order => [
        order.id,
        order.customer.name,
        new Date(order.date).toLocaleDateString(),
        order.total,
        order.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{minHeight: '100vh', background: '#f8f9fa', padding: '2rem 0'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
        <div style={{marginBottom: '2rem'}}>
          <Link to="/admin/dashboard" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#e67e22', textDecoration: 'none', marginBottom: '1rem'}}>
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
            <h1 style={{color: '#2c3e50', margin: 0}}>Sales Reports</h1>
            <button 
              onClick={exportSalesData}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '10px 20px',
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>

        {/* Sales Stats */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', textAlign: 'center'}}>
            <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#e67e22', marginBottom: '0.5rem'}}>
              ₦{stats.totalSales.toLocaleString()}
            </div>
            <div style={{color: '#5a6c7d', fontSize: '0.9rem'}}>Total Sales</div>
          </div>
          
          <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', textAlign: 'center'}}>
            <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#3498db', marginBottom: '0.5rem'}}>
              {stats.totalOrders}
            </div>
            <div style={{color: '#5a6c7d', fontSize: '0.9rem'}}>Total Orders</div>
          </div>
          
          <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', textAlign: 'center'}}>
            <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#9b59b6', marginBottom: '0.5rem'}}>
              ₦{Math.round(stats.averageOrder).toLocaleString()}
            </div>
            <div style={{color: '#5a6c7d', fontSize: '0.9rem'}}>Average Order</div>
          </div>
          
          <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', textAlign: 'center'}}>
            <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#27ae60', marginBottom: '0.5rem'}}>
              ₦{stats.todaySales.toLocaleString()}
            </div>
            <div style={{color: '#5a6c7d', fontSize: '0.9rem'}}>Today's Sales</div>
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{background: 'white', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', overflow: 'hidden'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #e9ecef', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <FaCalendarAlt style={{color: '#e67e22'}} />
            <h3 style={{color: '#2c3e50', margin: 0}}>Recent Orders</h3>
          </div>
          
          {orders.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#5a6c7d'}}>
              <p>No sales data available yet.</p>
            </div>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: '#f8f9fa'}}>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Order ID</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Customer</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Date</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Items</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Total</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice().reverse().map((order) => (
                    <tr key={order.id} style={{borderBottom: '1px solid #e9ecef'}}>
                      <td style={{padding: '1rem', color: '#2c3e50', fontWeight: '600'}}>#{order.id}</td>
                      <td style={{padding: '1rem'}}>
                        <div>
                          <div style={{fontWeight: '600', color: '#2c3e50'}}>{order.customer.name}</div>
                          <div style={{fontSize: '0.8rem', color: '#5a6c7d'}}>{order.customer.email}</div>
                        </div>
                      </td>
                      <td style={{padding: '1rem', color: '#5a6c7d'}}>{new Date(order.date).toLocaleDateString()}</td>
                      <td style={{padding: '1rem', color: '#5a6c7d'}}>{order.items.length} items</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageSales;
