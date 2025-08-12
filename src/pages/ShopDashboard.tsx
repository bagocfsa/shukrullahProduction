import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UserIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const ShopDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Mock data - in real app, this would come from API
  const dashboardStats = {
    todaySales: 45000, // ₦45,000
    weeklySales: 320000, // ₦320,000
    monthlySales: 1250000, // ₦1,250,000
    todayOrders: 12,
    weeklyOrders: 89,
    monthlyOrders: 356,
    todayCustomers: 8,
    weeklyCustomers: 67,
    monthlyCustomers: 234,
    onlineOrders: 156,
    physicalSales: 200,
    lowStockItems: 5,
    outOfStockItems: 2
  };

  const recentSales = [
    {
      id: 'S001',
      customer: 'Amina Hassan',
      items: 'Kuli-kuli, Groundnut Oil',
      amount: 4000,
      time: '2 hours ago',
      type: 'physical'
    },
    {
      id: 'S002',
      customer: 'Online Customer',
      items: 'Leather Handbag',
      amount: 15000,
      time: '3 hours ago',
      type: 'online'
    },
    {
      id: 'S003',
      customer: 'Ibrahim Musa',
      items: 'Yaki, Dankowa',
      amount: 4300,
      time: '5 hours ago',
      type: 'physical'
    }
  ];

  const lowStockItems = [
    { name: 'Kuli-kuli', current: 15, minimum: 50, status: 'low' },
    { name: 'Groundnut Oil', current: 8, minimum: 20, status: 'low' },
    { name: 'Dankowa', current: 0, minimum: 30, status: 'out' },
    { name: 'Leather Handbag', current: 3, minimum: 10, status: 'low' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shop Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor sales, inventory, and customer activity</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {['today', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                selectedPeriod === period
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Sales Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sales Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedPeriod === 'today' && formatCurrency(dashboardStats.todaySales)}
                {selectedPeriod === 'week' && formatCurrency(dashboardStats.weeklySales)}
                {selectedPeriod === 'month' && formatCurrency(dashboardStats.monthlySales)}
              </p>
              <p className="text-sm text-gray-500">Total revenue</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedPeriod === 'today' && dashboardStats.todayOrders}
                {selectedPeriod === 'week' && dashboardStats.weeklyOrders}
                {selectedPeriod === 'month' && dashboardStats.monthlyOrders}
              </p>
              <p className="text-sm text-gray-500">Total orders</p>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedPeriod === 'today' && dashboardStats.todayCustomers}
                {selectedPeriod === 'week' && dashboardStats.weeklyCustomers}
                {selectedPeriod === 'month' && dashboardStats.monthlyCustomers}
              </p>
              <p className="text-sm text-gray-500">Unique customers</p>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardStats.lowStockItems + dashboardStats.outOfStockItems}
              </p>
              <p className="text-sm text-gray-500">Items need attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/shop/sales"
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
        >
          <ShoppingBagIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Record Sale</p>
        </Link>
        <Link
          to="/shop/inventory"
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          <ChartBarIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Manage Inventory</p>
        </Link>
        <Link
          to="/shop/customers"
          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
        >
          <UserIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Customer Records</p>
        </Link>
        <Link
          to="/shop/history"
          className="bg-yellow-600 text-white p-4 rounded-lg hover:bg-yellow-700 transition-colors text-center"
        >
          <ChartBarIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Sales History</p>
        </Link>

        <Link
          to="/shop/delivery"
          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
        >
          <MapPinIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Home Delivery</p>
        </Link>

        <Link
          to="/shop/delivery-orders"
          className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors text-center"
        >
          <TruckIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Delivery Orders</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{sale.customer}</p>
                    <p className="text-sm text-gray-600">{sale.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(sale.amount)}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {sale.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {sale.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Inventory Alerts</h3>
          <div className="space-y-4">
            {lowStockItems.map((item, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                item.status === 'out' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Current: {item.current} | Minimum: {item.minimum}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'out' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status === 'out' ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <Link
                    to={`/shop/restock/${item.name}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Request Restock →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Channel Comparison */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Channel Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-lg mb-2">
              <p className="text-2xl font-bold text-blue-600">{dashboardStats.onlineOrders}</p>
              <p className="text-sm text-gray-600">Online Orders</p>
            </div>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-lg mb-2">
              <p className="text-2xl font-bold text-green-600">{dashboardStats.physicalSales}</p>
              <p className="text-sm text-gray-600">Physical Shop Sales</p>
            </div>
            <p className="text-sm text-gray-500">This month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
