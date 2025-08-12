import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { products } from '../data/products';
import { Product } from '../types';
import { useNotification } from '../context/NotificationContext';

interface ProductStatus {
  [key: string]: {
    visible: boolean;
    enabled: boolean;
  };
}

const ProductManagement: React.FC = () => {
  const { showSuccess, showWarning } = useNotification();
  const [productStatuses, setProductStatuses] = useState<ProductStatus>(() => {
    // Initialize all products as visible and enabled
    const initialStatus: ProductStatus = {};
    products.forEach(product => {
      initialStatus[product.id] = {
        visible: true,
        enabled: product.inStock
      };
    });
    return initialStatus;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get unique categories
  const categorySet = new Set(products.map(p => p.category));
  const categories = Array.from(categorySet);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleVisibility = (productId: string) => {
    setProductStatuses(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        visible: !prev[productId]?.visible
      }
    }));
    
    const product = products.find(p => p.id === productId);
    const newStatus = !productStatuses[productId]?.visible;
    
    showSuccess(
      'Product Updated',
      `${product?.name} is now ${newStatus ? 'visible' : 'hidden'} to customers.`
    );
  };

  const toggleEnabled = (productId: string) => {
    setProductStatuses(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        enabled: !prev[productId]?.enabled
      }
    }));
    
    const product = products.find(p => p.id === productId);
    const newStatus = !productStatuses[productId]?.enabled;
    
    showSuccess(
      'Product Updated',
      `${product?.name} is now ${newStatus ? 'enabled' : 'disabled'} for purchase.`
    );
  };

  const handleEdit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    showWarning(
      'Edit Product',
      `Edit functionality for "${product?.name}" will be implemented in the next update.`
    );
  };

  const handleDelete = (productId: string) => {
    const product = products.find(p => p.id === productId);
    showWarning(
      'Delete Product',
      `Delete functionality for "${product?.name}" will be implemented with proper confirmation dialogs.`
    );
  };

  const getStatusBadge = (productId: string) => {
    const status = productStatuses[productId];
    if (!status?.visible) return 'Hidden';
    if (!status?.enabled) return 'Disabled';
    return 'Active';
  };

  const getStatusColor = (productId: string) => {
    const status = productStatuses[productId];
    if (!status?.visible) return 'bg-gray-100 text-gray-800';
    if (!status?.enabled) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-groundnut-gradient">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage product visibility, availability, and details</p>
          </div>
          <button
            onClick={() => showWarning('Add Product', 'Add new product functionality will be implemented in the next update.')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(productStatuses).filter(s => s.visible && s.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Active Products</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-red-600">
              {Object.values(productStatuses).filter(s => !s.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Disabled Products</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-gray-600">
              {Object.values(productStatuses).filter(s => !s.visible).length}
            </div>
            <div className="text-sm text-gray-600">Hidden Products</div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images[0] || '/images/products/default.png'}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded-lg mr-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/products/default.png';
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.subcategory}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stockQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.id)}`}>
                      {getStatusBadge(product.id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => toggleVisibility(product.id)}
                      className={`${productStatuses[product.id]?.visible ? 'text-gray-600 hover:text-gray-900' : 'text-blue-600 hover:text-blue-900'} transition-colors`}
                      title={productStatuses[product.id]?.visible ? 'Hide Product' : 'Show Product'}
                    >
                      {productStatuses[product.id]?.visible ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleEnabled(product.id)}
                      className={`px-2 py-1 text-xs rounded ${
                        productStatuses[product.id]?.enabled 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      } transition-colors`}
                    >
                      {productStatuses[product.id]?.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      title="Edit Product"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete Product"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
