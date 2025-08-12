import React, { useState, useEffect } from 'react';
import { EyeIcon, PrinterIcon, CalendarIcon, ArrowPathIcon, UserIcon, CurrencyDollarIcon, PencilIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import GoogleSheetsSalesService, { SalesRecord } from '../services/googleSheetsSales';

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'pos';
  customerName?: string;
  customerPhone?: string;
  salesPerson: string;
  saleDate: Date;
}

const SalesHistory: React.FC = () => {
  const { user } = useAuth();
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    todaySales: 0,
    todayRevenue: 0
  });

  // Load sales data from Google Sheets
  const loadSalesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await GoogleSheetsSalesService.fetchSalesRecords();
      setSalesRecords(records);

      const salesStats = await GoogleSheetsSalesService.getSalesStats();
      setStats(salesStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalesData();
  }, []);

  // Convert SalesRecord to Sale format for display
  const convertToSaleFormat = (record: SalesRecord): Sale => {
    let items: SaleItem[] = [];
    try {
      items = JSON.parse(record.items);
    } catch (e) {
      console.error('Error parsing items:', e);
      items = [];
    }

    return {
      id: record.id,
      items: items,
      subtotal: record.subtotal,
      total: record.total,
      paymentMethod: record.paymentMethod as any,
      customerName: record.customerName || undefined,
      customerPhone: record.customerPhone || undefined,
      salesPerson: record.salesPerson,
      saleDate: new Date(record.saleDate)
    };
  };

  // Mock sales data for fallback - keeping some for demo
  const [fallbackSales] = useState<Sale[]>([
    {
      id: 'SALE-1691234567890',
      items: [
        { productId: '1b', productName: 'Kuli-kuli 125g (Local Nylon)', quantity: 2, unitPrice: 450, totalPrice: 900 },
        { productId: '2', productName: 'Pure Groundnut Oil (1 Liter)', quantity: 1, unitPrice: 2500, totalPrice: 2500 }
      ],
      subtotal: 3400,
      total: 3400,
      paymentMethod: 'cash',
      customerName: 'Amina Hassan',
      customerPhone: '+234-901-928-6029',
      salesPerson: 'Shop Assistant',
      saleDate: new Date('2024-08-10T14:30:00')
    },
    {
      id: 'SALE-1691234567891',
      items: [
        { productId: '1d', productName: 'Kuli-kuli 250g (Fancy Pouch)', quantity: 1, unitPrice: 2200, totalPrice: 2200 }
      ],
      subtotal: 2200,
      total: 2200,
      paymentMethod: 'pos',
      salesPerson: 'Shop Assistant',
      saleDate: new Date('2024-08-10T15:45:00')
    },
    {
      id: 'SALE-1691234567892',
      items: [
        { productId: '1', productName: 'Kuli-kuli 1Kg (Local Nylon)', quantity: 1, unitPrice: 4000, totalPrice: 4000 },
        { productId: '1c', productName: 'Kuli-kuli 130g (Fancy Pouch)', quantity: 3, unitPrice: 600, totalPrice: 1800 }
      ],
      subtotal: 5800,
      total: 5800,
      paymentMethod: 'transfer',
      customerName: 'Ibrahim Musa',
      salesPerson: 'Shop Assistant',
      saleDate: new Date('2024-08-10T16:20:00')
    }
  ]);

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewSaleDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setShowDetails(true);
  };

  const printReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Use Google Sheets data if available, otherwise fallback
  const displaySales = salesRecords.length > 0
    ? salesRecords.map(convertToSaleFormat)
    : fallbackSales;

  const totalSales = stats.totalRevenue || displaySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = stats.totalSales || displaySales.length;

  if (showDetails && selectedSale) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowDetails(false)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Sales History
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sale Details</h2>
              <p className="text-gray-600">Receipt #{selectedSale.id}</p>
            </div>
            <button
              onClick={() => printReceipt(selectedSale)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print Receipt
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Sale Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Date:</span> {formatDate(selectedSale.saleDate)}</p>
                <p><span className="text-gray-600">Sales Person:</span> {selectedSale.salesPerson}</p>
                <p><span className="text-gray-600">Payment Method:</span> {selectedSale.paymentMethod.toUpperCase()}</p>
              </div>
            </div>
            {selectedSale.customerName && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Name:</span> {selectedSale.customerName}</p>
                  {selectedSale.customerPhone && (
                    <p><span className="text-gray-600">Phone:</span> {selectedSale.customerPhone}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Items Purchased</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedSale.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(selectedSale.subtotal)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales History</h1>
          <p className="text-gray-600 mt-2">View and manage completed sales transactions from Google Sheets</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadSalesData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => {
                const editUrl = GoogleSheetsSalesService.getGoogleSheetEditUrl();
                if (editUrl) {
                  window.open(editUrl, '_blank');
                } else {
                  const sheetUrl = prompt(
                    'Enter your Google Sheet URL (the full edit URL):\nExample: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit'
                  );
                  if (sheetUrl) {
                    GoogleSheetsSalesService.setGoogleSheetEditUrl(sheetUrl);
                    window.open(sheetUrl, '_blank');
                  }
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit in Google Sheets
              <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-800">
              <h3 className="font-medium">Error Loading Sales Data</h3>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-1">Showing fallback data from localStorage.</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Source Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-blue-800">
            <h3 className="font-medium">Data Source & Access</h3>
            <p className="text-sm mt-1">
              {salesRecords.length > 0
                ? `Showing ${salesRecords.length} sales records from Google Sheets`
                : 'Showing fallback data (Google Sheets not configured or empty)'}
            </p>
            <p className="text-xs mt-1">
              {user?.role === 'admin'
                ? '🔓 Admin: You can edit records in Google Sheets'
                : '👁️ View Only: Contact admin to edit sales records'}
            </p>
          </div>
          {user?.role === 'admin' && (
            <div className="text-blue-600">
              <PencilIcon className="h-6 w-6" />
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Sales</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.todayRevenue)}</p>
          <p className="text-sm text-gray-500">{stats.todaySales} transactions</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-sm text-gray-500">All time</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalSales}</p>
          <p className="text-sm text-gray-500">transactions</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Sale</h3>
          <p className="text-3xl font-bold text-orange-600">
            {formatCurrency(stats.totalSales > 0 ? stats.totalRevenue / stats.totalSales : 0)}
          </p>
          <p className="text-sm text-gray-500">per transaction</p>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Recent Sales
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displaySales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(sale.saleDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.customerName || 'Walk-in Customer'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {sale.paymentMethod.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewSaleDetails(sale)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => printReceipt(sale)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <PrinterIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
