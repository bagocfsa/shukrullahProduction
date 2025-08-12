import React, { useState, useEffect } from 'react';
import { CalendarIcon, CurrencyDollarIcon, ShoppingBagIcon, PrinterIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../context/NotificationContext';
import GoogleSheetsOnlyService from '../services/googleSheetsOnly';

interface DailySummary {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalItems: number;
  cashSales: number;
  cardSales: number;
  transferSales: number;
  onlineSales: number;
  deliveryOrders: number;
  pickupOrders: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

const EndOfDaySales: React.FC = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosingDay, setIsClosingDay] = useState(false);

  // Mock data for demonstration - in real app, this would come from your sales data
  const generateMockSummary = (date: string): DailySummary => {
    const isToday = date === new Date().toISOString().split('T')[0];
    const baseAmount = isToday ? Math.random() * 50000 + 20000 : Math.random() * 40000 + 15000;
    
    return {
      date,
      totalSales: Math.round(baseAmount),
      totalOrders: Math.round(baseAmount / 3000) + Math.floor(Math.random() * 10),
      totalItems: Math.round(baseAmount / 1500) + Math.floor(Math.random() * 20),
      cashSales: Math.round(baseAmount * 0.4),
      cardSales: Math.round(baseAmount * 0.2),
      transferSales: Math.round(baseAmount * 0.25),
      onlineSales: Math.round(baseAmount * 0.15),
      deliveryOrders: Math.floor(Math.random() * 8) + 2,
      pickupOrders: Math.floor(Math.random() * 15) + 5,
      topProducts: [
        { name: 'Groundnut Oil 1L', quantity: Math.floor(Math.random() * 10) + 5, revenue: Math.round(baseAmount * 0.3) },
        { name: 'Kuli-kuli 1Kg', quantity: Math.floor(Math.random() * 8) + 3, revenue: Math.round(baseAmount * 0.25) },
        { name: 'Groundnut Oil 2L', quantity: Math.floor(Math.random() * 6) + 2, revenue: Math.round(baseAmount * 0.2) },
      ]
    };
  };

  const loadDailySummary = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch this from your sales database
      // For now, we'll generate mock data
      const summary = generateMockSummary(selectedDate);
      setDailySummary(summary);
      
      showSuccess(
        'Sales Data Loaded',
        `Sales summary for ${new Date(selectedDate).toLocaleDateString()} has been loaded.`
      );
    } catch (error) {
      showError(
        'Failed to Load Sales Data',
        'Unable to retrieve sales data. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndOfDay = async () => {
    if (!dailySummary) return;
    
    setIsClosingDay(true);
    try {
      // In a real app, you would:
      // 1. Finalize all pending transactions
      // 2. Generate end-of-day report
      // 3. Backup sales data
      // 4. Reset daily counters
      // 5. Send report to management
      
      // For now, we'll simulate this process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess(
        'Day Closed Successfully',
        `Sales day for ${new Date(selectedDate).toLocaleDateString()} has been closed. Total sales: ₦${dailySummary.totalSales.toLocaleString()}`
      );
      
      // Reset for next day if closing today
      if (selectedDate === new Date().toISOString().split('T')[0]) {
        setDailySummary(null);
      }
    } catch (error) {
      showError(
        'Failed to Close Day',
        'Unable to close the sales day. Please try again or contact support.'
      );
    } finally {
      setIsClosingDay(false);
    }
  };

  const printReport = () => {
    if (!dailySummary) return;
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>End of Day Sales Report - ${new Date(selectedDate).toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
              .section { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
              .total { font-size: 24px; font-weight: bold; color: #059669; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f3f4f6; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Shukrullah Nigeria Ltd</h1>
              <h2>End of Day Sales Report</h2>
              <p>Date: ${new Date(selectedDate).toLocaleDateString()}</p>
            </div>
            
            <div class="summary">
              <div class="section">
                <h3>Sales Summary</h3>
                <p class="total">₦${dailySummary.totalSales.toLocaleString()}</p>
                <p>Total Orders: ${dailySummary.totalOrders}</p>
                <p>Total Items: ${dailySummary.totalItems}</p>
              </div>
              
              <div class="section">
                <h3>Payment Methods</h3>
                <p>Cash: ₦${dailySummary.cashSales.toLocaleString()}</p>
                <p>Card: ₦${dailySummary.cardSales.toLocaleString()}</p>
                <p>Transfer: ₦${dailySummary.transferSales.toLocaleString()}</p>
                <p>Online: ₦${dailySummary.onlineSales.toLocaleString()}</p>
              </div>
            </div>
            
            <div class="section">
              <h3>Top Products</h3>
              <table>
                <tr><th>Product</th><th>Quantity</th><th>Revenue</th></tr>
                ${dailySummary.topProducts.map(product => 
                  `<tr><td>${product.name}</td><td>${product.quantity}</td><td>₦${product.revenue.toLocaleString()}</td></tr>`
                ).join('')}
              </table>
            </div>
            
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
              Generated on ${new Date().toLocaleString()}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportToCSV = () => {
    if (!dailySummary) return;
    
    const csvContent = [
      ['End of Day Sales Report'],
      ['Date', new Date(selectedDate).toLocaleDateString()],
      [''],
      ['Summary'],
      ['Total Sales', `₦${dailySummary.totalSales.toLocaleString()}`],
      ['Total Orders', dailySummary.totalOrders.toString()],
      ['Total Items', dailySummary.totalItems.toString()],
      [''],
      ['Payment Methods'],
      ['Cash Sales', `₦${dailySummary.cashSales.toLocaleString()}`],
      ['Card Sales', `₦${dailySummary.cardSales.toLocaleString()}`],
      ['Transfer Sales', `₦${dailySummary.transferSales.toLocaleString()}`],
      ['Online Sales', `₦${dailySummary.onlineSales.toLocaleString()}`],
      [''],
      ['Top Products'],
      ['Product', 'Quantity', 'Revenue'],
      ...dailySummary.topProducts.map(product => [
        product.name,
        product.quantity.toString(),
        `₦${product.revenue.toLocaleString()}`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `end-of-day-sales-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showSuccess('Export Complete', 'Sales report has been exported to CSV file.');
  };

  useEffect(() => {
    loadDailySummary();
  }, [selectedDate]);

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-groundnut-gradient mb-2">End of Day Sales</h1>
        <p className="text-gray-600">Review daily sales performance and close the business day</p>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-6 w-6 text-gray-400" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={loadDailySummary}
              disabled={isLoading}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {dailySummary && (
        <>
          {/* Sales Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(dailySummary.totalSales)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{dailySummary.totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  #
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-purple-600">{dailySummary.totalItems}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  ₦
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Order</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(Math.round(dailySummary.totalSales / dailySummary.totalOrders))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash</span>
                  <span className="font-semibold">{formatCurrency(dailySummary.cashSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card</span>
                  <span className="font-semibold">{formatCurrency(dailySummary.cardSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transfer</span>
                  <span className="font-semibold">{formatCurrency(dailySummary.transferSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Online</span>
                  <span className="font-semibold">{formatCurrency(dailySummary.onlineSales)}</span>
                </div>
              </div>
            </div>

            {/* Order Types */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Order Types</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Orders</span>
                  <span className="font-semibold">{dailySummary.deliveryOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup Orders</span>
                  <span className="font-semibold">{dailySummary.pickupOrders}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600 font-medium">Total Orders</span>
                  <span className="font-bold">{dailySummary.deliveryOrders + dailySummary.pickupOrders}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailySummary.topProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={printReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <PrinterIcon className="h-5 w-5" />
                <span>Print Report</span>
              </button>
              
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
              
              {selectedDate === new Date().toISOString().split('T')[0] && (
                <button
                  onClick={handleEndOfDay}
                  disabled={isClosingDay}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center space-x-2"
                >
                  <CurrencyDollarIcon className="h-5 w-5" />
                  <span>{isClosingDay ? 'Closing Day...' : 'End Day & Close'}</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {!dailySummary && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No sales data available for the selected date.</p>
        </div>
      )}
    </div>
  );
};

export default EndOfDaySales;
