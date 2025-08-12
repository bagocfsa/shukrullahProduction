import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  CogIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const FactoryDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Mock data - in real app, this would come from API
  const dashboardStats = {
    todayProduction: 450,
    weeklyProduction: 2800,
    monthlyProduction: 12500,
    activeBatches: 8,
    completedBatches: 156,
    totalWorkers: 24,
    activeWorkers: 18,
    todayCosts: 125000, // ₦125,000
    weeklyCosts: 850000, // ₦850,000
    monthlyCosts: 3200000, // ₦3,200,000
    pendingTransfers: 5,
    lowStockItems: 3
  };

  const recentBatches = [
    {
      id: 'B001',
      product: 'Kuli-kuli',
      quantity: 500,
      status: 'in_progress',
      completion: 75,
      estimatedCompletion: '2 hours'
    },
    {
      id: 'B002',
      product: 'Groundnut Oil',
      quantity: 200,
      status: 'completed',
      completion: 100,
      estimatedCompletion: 'Completed'
    },
    {
      id: 'B003',
      product: 'Dankowa',
      quantity: 300,
      status: 'planned',
      completion: 0,
      estimatedCompletion: '6 hours'
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Factory Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor production, costs, and operations</p>
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
        {/* Production Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Production</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedPeriod === 'today' && dashboardStats.todayProduction}
                {selectedPeriod === 'week' && dashboardStats.weeklyProduction}
                {selectedPeriod === 'month' && dashboardStats.monthlyProduction}
              </p>
              <p className="text-sm text-gray-500">Units produced</p>
            </div>
          </div>
        </div>

        {/* Active Batches */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CogIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Batches</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeBatches}</p>
              <p className="text-sm text-gray-500">In production</p>
            </div>
          </div>
        </div>

        {/* Workers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Workers</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardStats.activeWorkers}/{dashboardStats.totalWorkers}
              </p>
              <p className="text-sm text-gray-500">On duty today</p>
            </div>
          </div>
        </div>

        {/* Costs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Production Costs</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedPeriod === 'today' && formatCurrency(dashboardStats.todayCosts)}
                {selectedPeriod === 'week' && formatCurrency(dashboardStats.weeklyCosts)}
                {selectedPeriod === 'month' && formatCurrency(dashboardStats.monthlyCosts)}
              </p>
              <p className="text-sm text-gray-500">Total costs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/factory/production"
          className="bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-colors text-center"
        >
          <ClipboardDocumentListIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Manage Production</p>
        </Link>
        <Link
          to="/factory/costs"
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
        >
          <CurrencyDollarIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Cost Calculator</p>
        </Link>
        <Link
          to="/factory/workers"
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          <UserGroupIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Manage Workers</p>
        </Link>
        <Link
          to="/factory/transfers"
          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
        >
          <TruckIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">Inventory Transfer</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Batches */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Production Batches</h3>
          <div className="space-y-4">
            {recentBatches.map((batch) => (
              <div key={batch.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{batch.product}</p>
                    <p className="text-sm text-gray-600">Batch #{batch.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    batch.status === 'completed' ? 'bg-green-100 text-green-800' :
                    batch.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {batch.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">{batch.quantity} units</p>
                  <p className="text-sm text-gray-600">{batch.estimatedCompletion}</p>
                </div>
                {batch.status === 'in_progress' && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${batch.completion}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{batch.completion}% complete</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Alerts & Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
                <p className="text-sm text-yellow-700">3 items are running low in shop inventory</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <TruckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Pending Transfers</p>
                <p className="text-sm text-blue-700">5 inventory transfers awaiting approval</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CogIcon className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Production Complete</p>
                <p className="text-sm text-green-700">Batch B002 (Groundnut Oil) completed successfully</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryDashboard;
