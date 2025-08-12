import React, { useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import GoogleSheetsOnlyService from '../services/googleSheetsOnly';
import { useNotification } from '../context/NotificationContext';

const SalesConfiguration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const openGoogleSheet = () => {
    const editUrl = GoogleSheetsOnlyService.getGoogleSheetEditUrl();
    window.open(editUrl, '_blank');
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      const result = await GoogleSheetsOnlyService.testAppsScriptConnection();
      if (result.success) {
        showSuccess('Connection Test Successful', 'Apps Script is responding correctly and ready to receive data.');
      } else {
        showError('Connection Test Failed', result.message);
      }
    } catch (error) {
      showError('Connection Test Error', error instanceof Error ? error.message : 'Unknown error occurred during connection test.');
    } finally {
      setLoading(false);
    }
  };

  const testSave = async () => {
    const testSale = {
      id: `TEST-${Date.now()}`,
      items: [
        {
          productId: '1',
          productName: 'Test Product',
          quantity: 1,
          unitPrice: 1000,
          totalPrice: 1000
        }
      ],
      subtotal: 1000,
      total: 1000,
      paymentMethod: 'cash',
      customerName: 'Test Customer',
      customerPhone: '08012345678',
      salesPerson: 'Test User',
      saleDate: new Date(),
      deliveryOption: 'pickup'
    };

    try {
      setLoading(true);
      console.log('🧪 Starting test save...');
      const success = await GoogleSheetsOnlyService.saveSale(testSale);
      if (success) {
        alert('✅ Test sale saved successfully to Google Sheets! Check your Google Sheet.');
      }
    } catch (error) {
      console.error('Test save error:', error);
      alert('❌ Error saving test sale: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const configStatus = GoogleSheetsOnlyService.getConfigurationStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Configuration</h1>
          <p className="mt-2 text-gray-600">
            Configure and test Google Sheets integration for sales data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div>
              <h3 className="text-lg font-semibold">Write Status</h3>
              <p className={`text-sm ${configStatus.writeConfigured ? 'text-green-600' : 'text-red-600'}`}>
                {configStatus.writeConfigured ? 'Configured' : 'Not Configured'}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div>
              <h3 className="text-lg font-semibold">Mode</h3>
              <p className="text-sm text-gray-600">
                Google Sheets Only
              </p>
            </div>
          </div>
        </div>

        <div className={`border rounded-lg p-4 mb-8 ${
          configStatus.writeConfigured 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center">
            {configStatus.writeConfigured ? (
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
            )}
            <div>
              <h3 className={`text-sm font-medium ${
                configStatus.writeConfigured 
                  ? 'text-green-800' 
                  : 'text-yellow-800'
              }`}>
                Google Sheets Only Configuration
              </h3>
              <p className={`text-sm mt-1 ${
                configStatus.writeConfigured 
                  ? 'text-green-700' 
                  : 'text-yellow-700'
              }`}>
                {configStatus.message}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Test Connection
            </button>

            <button
              onClick={testSave}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Test Save
            </button>

            <button
              onClick={openGoogleSheet}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Open Google Sheet
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">1. Update Your Apps Script</h3>
              <p className="text-sm text-gray-600">
                Use the code from SIMPLE_WORKING_APPS_SCRIPT.js and deploy with "Anyone" access
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">2. Set Up Google Sheet</h3>
              <p className="text-sm text-gray-600">
                Create a "Sales" sheet with the proper column headers
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">3. Test the Integration</h3>
              <p className="text-sm text-gray-600">
                Use the "Test Connection" and "Test Save" buttons above
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesConfiguration;
