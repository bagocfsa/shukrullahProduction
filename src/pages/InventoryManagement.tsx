import React, { useState } from 'react';
import { PlusIcon, MinusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { products } from '../data/products';

interface InventoryItem {
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  onlinePrice: number;
  shopPrice: number;
  category: string;
  lastRestocked: Date;
}

const InventoryManagement: React.FC = () => {
  // Mock inventory data based on our products
  const [inventory, setInventory] = useState<InventoryItem[]>([
    // Kuli-kuli Products
    {
      productId: '1',
      productName: 'Kuli-kuli 1Kg (Local Nylon)',
      currentStock: 50,
      minimumStock: 20,
      onlinePrice: 4000,
      shopPrice: 4000,
      category: 'Traditional Foods',
      lastRestocked: new Date('2024-08-05')
    },
    {
      productId: '1b',
      productName: 'Kuli-kuli 125g (Local Nylon)',
      currentStock: 200,
      minimumStock: 100,
      onlinePrice: 500,
      shopPrice: 450,
      category: 'Traditional Foods',
      lastRestocked: new Date('2024-08-07')
    },
    {
      productId: '1c',
      productName: 'Kuli-kuli 130g (Fancy Pouch)',
      currentStock: 150,
      minimumStock: 50,
      onlinePrice: 700,
      shopPrice: 600,
      category: 'Traditional Foods',
      lastRestocked: new Date('2024-08-06')
    },
    {
      productId: '1d',
      productName: 'Kuli-kuli 250g (Fancy Pouch)',
      currentStock: 80,
      minimumStock: 30,
      onlinePrice: 2500,
      shopPrice: 2200,
      category: 'Traditional Foods',
      lastRestocked: new Date('2024-08-04')
    },
    // Groundnut Oil Products
    {
      productId: '2a',
      productName: 'Pure Groundnut Oil (75cl)',
      currentStock: 120,
      minimumStock: 50,
      onlinePrice: 2600,
      shopPrice: 2600,
      category: 'Cooking Oils',
      lastRestocked: new Date('2024-08-08')
    },
    {
      productId: '2b',
      productName: 'Pure Groundnut Oil (1 Liter)',
      currentStock: 180,
      minimumStock: 80,
      onlinePrice: 3800,
      shopPrice: 3800,
      category: 'Cooking Oils',
      lastRestocked: new Date('2024-08-08')
    },
    {
      productId: '2c',
      productName: 'Pure Groundnut Oil (2 Liters)',
      currentStock: 90,
      minimumStock: 40,
      onlinePrice: 7500,
      shopPrice: 7500,
      category: 'Cooking Oils',
      lastRestocked: new Date('2024-08-07')
    },
    {
      productId: '2d',
      productName: 'Pure Groundnut Oil (4 Liters)',
      currentStock: 45,
      minimumStock: 20,
      onlinePrice: 15000,
      shopPrice: 15000,
      category: 'Cooking Oils',
      lastRestocked: new Date('2024-08-06')
    },
    {
      productId: '2e',
      productName: 'Pure Groundnut Oil (10 Liters)',
      currentStock: 25,
      minimumStock: 10,
      onlinePrice: 37500,
      shopPrice: 37500,
      category: 'Cooking Oils',
      lastRestocked: new Date('2024-08-05')
    },
    {
      productId: '2f',
      productName: 'Pure Groundnut Oil (25 Liters)',
      currentStock: 12,
      minimumStock: 5,
      onlinePrice: 93750,
      shopPrice: 93750,
      category: 'Cooking Oils',
      lastRestocked: new Date('2024-08-03')
    },
    // Other Traditional Foods
    {
      productId: '3',
      productName: 'Traditional Dankowa (Per Piece)',
      currentStock: 500,
      minimumStock: 200,
      onlinePrice: 150,
      shopPrice: 150,
      category: 'Traditional Foods',
      lastRestocked: new Date('2024-08-09')
    },
    {
      productId: '4',
      productName: 'Spiced Yaki (Beef Jerky)',
      currentStock: 85,
      minimumStock: 30,
      onlinePrice: 3500,
      shopPrice: 3500,
      category: 'Traditional Foods',
      lastRestocked: new Date('2024-08-07')
    },
    {
      productId: '4b',
      productName: 'Yaji Spice Mix (1Kg)',
      currentStock: 150,
      minimumStock: 50,
      onlinePrice: 1200,
      shopPrice: 1200,
      category: 'Traditional Foods',
      lastRestocked: new Date('2024-08-08')
    }
  ]);

  const updateStock = (productId: string, change: number) => {
    setInventory(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, currentStock: Math.max(0, item.currentStock + change) }
        : item
    ));
  };

  const getStockStatus = (current: number, minimum: number) => {
    if (current === 0) return { status: 'out', color: 'text-red-600', bg: 'bg-red-50' };
    if (current <= minimum) return { status: 'low', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-2">Monitor and manage product stock levels</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-primary-600">{inventory.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {inventory.filter(item => item.currentStock <= item.minimumStock && item.currentStock > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-600">
            {inventory.filter(item => item.currentStock === 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Value</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(inventory.reduce((sum, item) => sum + (item.currentStock * item.onlinePrice), 0))}
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Products Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Online Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Restocked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => {
                const stockStatus = getStockStatus(item.currentStock, item.minimumStock);
                return (
                  <tr key={item.productId} className={stockStatus.bg}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-semibold">{item.currentStock}</span>
                        <span className="text-gray-500"> / {item.minimumStock} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {stockStatus.status === 'out' && (
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        {stockStatus.status === 'low' && (
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        )}
                        <span className={`text-sm font-medium ${stockStatus.color}`}>
                          {stockStatus.status === 'out' ? 'Out of Stock' : 
                           stockStatus.status === 'low' ? 'Low Stock' : 'In Stock'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.onlinePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.shopPrice)}
                      {item.shopPrice !== item.onlinePrice && (
                        <div className="text-xs text-green-600">
                          Save ₦{(item.onlinePrice - item.shopPrice).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.lastRestocked)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateStock(item.productId, -1)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          disabled={item.currentStock === 0}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStock(item.productId, 1)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStock(item.productId, 50)}
                          className="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700"
                        >
                          Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Alerts</h3>
        <div className="space-y-3">
          {inventory
            .filter(item => item.currentStock <= item.minimumStock)
            .map(item => (
              <div key={item.productId} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">{item.productName}</p>
                    <p className="text-sm text-yellow-700">
                      {item.currentStock === 0 ? 'Out of stock' : `Only ${item.currentStock} left (minimum: ${item.minimumStock})`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateStock(item.productId, 50)}
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  Restock Now
                </button>
              </div>
            ))}
          {inventory.filter(item => item.currentStock <= item.minimumStock).length === 0 && (
            <p className="text-gray-500 text-center py-4">All products are well stocked! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
