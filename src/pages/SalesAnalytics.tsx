import React, { useState } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const SalesAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedChannel, setSelectedChannel] = useState('all');

  // Mock analytics data
  const analyticsData = {
    totalRevenue: {
      current: 1250000, // ₦1,250,000
      previous: 980000,  // ₦980,000
      growth: 27.6
    },
    totalOrders: {
      current: 356,
      previous: 289,
      growth: 23.2
    },
    avgOrderValue: {
      current: 3511, // ₦3,511
      previous: 3391,
      growth: 3.5
    },
    customerCount: {
      current: 234,
      previous: 198,
      growth: 18.2
    }
  };

  const channelData = [
    { channel: 'Physical Shop', revenue: 750000, orders: 200, percentage: 60 },
    { channel: 'Online', revenue: 500000, orders: 156, percentage: 40 }
  ];

  const topProducts = [
    { name: 'Kuli-kuli 125g (Local Nylon)', sales: 450, revenue: 202500, growth: 15.2 },
    { name: 'Groundnut Oil 1L', sales: 180, revenue: 450000, growth: 8.7 },
    { name: 'Kuli-kuli 250g (Fancy Pouch)', sales: 89, revenue: 195800, growth: 22.1 },
    { name: 'Leather Handbag', sales: 12, revenue: 180000, growth: -5.3 },
    { name: 'Kuli-kuli 1Kg (Local Nylon)', sales: 45, revenue: 180000, growth: 12.8 }
  ];

  const dailySales = [
    { date: '2024-08-01', online: 15000, shop: 25000 },
    { date: '2024-08-02', online: 18000, shop: 28000 },
    { date: '2024-08-03', online: 12000, shop: 22000 },
    { date: '2024-08-04', online: 20000, shop: 30000 },
    { date: '2024-08-05', online: 16000, shop: 26000 },
    { date: '2024-08-06', online: 22000, shop: 32000 },
    { date: '2024-08-07', online: 19000, shop: 29000 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth > 0;
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
        ) : (
          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
        )}
        <span className="text-sm font-medium">
          {isPositive ? '+' : ''}{growth.toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
        <p className="text-gray-600 mt-2">Comprehensive insights into your business performance</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sales Channel</label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Channels</option>
              <option value="online">Online Only</option>
              <option value="shop">Physical Shop Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.totalRevenue.current)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            {formatGrowth(analyticsData.totalRevenue.growth)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalOrders.current}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            {formatGrowth(analyticsData.totalOrders.growth)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.avgOrderValue.current)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            {formatGrowth(analyticsData.avgOrderValue.growth)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.customerCount.current}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <UserIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            {formatGrowth(analyticsData.customerCount.growth)}
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales by Channel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Sales by Channel</h3>
          <div className="space-y-4">
            {channelData.map((channel, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    channel.channel === 'Physical Shop' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{channel.channel}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(channel.revenue)}
                  </p>
                  <p className="text-xs text-gray-500">{channel.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Physical Shop</span>
              <span>60%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} units sold</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </p>
                  {formatGrowth(product.growth)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Sales Trend */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Daily Sales Trend (Last 7 Days)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Date</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Online Sales</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Shop Sales</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {dailySales.map((day, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-NG', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(day.online)}
                  </td>
                  <td className="py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(day.shop)}
                  </td>
                  <td className="py-3 text-sm font-semibold text-gray-900 text-right">
                    {formatCurrency(day.online + day.shop)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export and Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 inline mr-1" />
          Last updated: {new Date().toLocaleDateString('en-NG')}
        </div>
        <div className="space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export PDF
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
