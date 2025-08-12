import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign, FaSignOutAlt, FaHome } from 'react-icons/fa';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load products
      const response = await fetch('/data.json');
      const data = await response.json();
      
      // Load orders from localStorage
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      
      // Calculate stats
      const totalProducts = data.products.length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const uniqueCustomers = new Set(orders.map(order => order.customer.email)).size;

      setStats({
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers: uniqueCustomers
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminSession');
      navigate('/admin/login');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-header-actions">
            <Link to="/" className="btn btn-outline">
              <FaHome /> View Website
            </Link>
            <button onClick={handleLogout} className="btn btn-danger">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon products">
                <FaBox />
              </div>
              <div className="stat-info">
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orders">
                <FaShoppingCart />
              </div>
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon revenue">
                <FaDollarSign />
              </div>
              <div className="stat-info">
                <h3>₦{stats.totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon customers">
                <FaUsers />
              </div>
              <div className="stat-info">
                <h3>{stats.totalCustomers}</h3>
                <p>Total Customers</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/admin/products" className="action-card">
                <div className="action-icon">
                  <FaBox />
                </div>
                <h3>Manage Products</h3>
                <p>Add, edit, or remove products from your catalog</p>
              </Link>

              <Link to="/admin/orders" className="action-card">
                <div className="action-icon">
                  <FaShoppingCart />
                </div>
                <h3>Manage Orders</h3>
                <p>View and process customer orders</p>
              </Link>

              <Link to="/admin/sales" className="action-card">
                <div className="action-icon">
                  <FaDollarSign />
                </div>
                <h3>Sales Reports</h3>
                <p>View sales analytics and reports</p>
              </Link>

              <Link to="/admin/production" className="action-card">
                <div className="action-icon">
                  <FaUsers />
                </div>
                <h3>Production Management</h3>
                <p>Manage Kulikuli production and inventory</p>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-card">
              <p>Welcome to your admin dashboard! Here you can manage all aspects of your ecommerce store.</p>
              <ul>
                <li>✅ Professional ecommerce website structure created</li>
                <li>✅ Admin access protected with access code</li>
                <li>✅ Product catalog and shopping cart implemented</li>
                <li>✅ Order management system ready</li>
                <li>✅ Data stored in JSON format as requested</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
