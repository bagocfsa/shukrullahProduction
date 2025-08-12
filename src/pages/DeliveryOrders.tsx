import React, { useState, useEffect } from 'react';
import { EyeIcon, PhoneIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface DeliveryItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

interface DeliveryOrder {
  id: string;
  items: DeliveryItem[];
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    location: string;
  };
  deliveryLocation: string;
  logisticsCost: number;
  subtotal: number;
  total: number;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  staffMember: string;
}

const DeliveryOrders: React.FC = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('shukrullah-delivery-orders') || '[]');
    // Convert date strings back to Date objects
    const ordersWithDates = savedOrders.map((order: any) => ({
      ...order,
      orderDate: new Date(order.orderDate)
    }));
    setOrders(ordersWithDates);
  };

  const updateOrderStatus = (orderId: string, newStatus: DeliveryOrder['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('shukrullah-delivery-orders', JSON.stringify(updatedOrders));
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const callCustomer = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const sendWhatsAppUpdate = (order: DeliveryOrder) => {
    let message = `📦 *ORDER UPDATE*\n\n`;
    message += `Order ID: ${order.id}\n`;
    message += `Status: ${getStatusText(order.status).toUpperCase()}\n`;
    message += `Total: ${formatCurrency(order.total)}\n\n`;
    message += `Dear ${order.customerInfo.name}, your order status has been updated.\n\n`;
    message += `📍 Delivery to: ${order.deliveryLocation}\n`;
    message += `📞 Contact us: +234-901-928-6029\n\n`;
    message += `Thank you for choosing Shukrullah Nigeria Ltd!`;
    
    const whatsappUrl = `https://wa.me/${order.customerInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const viewOrderDetails = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  if (showDetails && selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowDetails(false)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Delivery Orders
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Delivery Order Details</h2>
              <p className="text-gray-600">Order #{selectedOrder.id}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => callCustomer(selectedOrder.customerInfo.phone)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <PhoneIcon className="h-4 w-4 mr-2" />
                Call
              </button>
              <button
                onClick={() => sendWhatsAppUpdate(selectedOrder)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                WhatsApp
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Name:</span> {selectedOrder.customerInfo.name}</p>
                <p><span className="text-gray-600">Phone:</span> {selectedOrder.customerInfo.phone}</p>
                <p><span className="text-gray-600">Address:</span> {selectedOrder.customerInfo.address}</p>
                <p><span className="text-gray-600">Location:</span> {selectedOrder.deliveryLocation}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Order Date:</span> {formatDate(selectedOrder.orderDate)}</p>
                <p><span className="text-gray-600">Staff Member:</span> {selectedOrder.staffMember}</p>
                <p><span className="text-gray-600">Logistics Cost:</span> {formatCurrency(selectedOrder.logisticsCost)}</p>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Update Order Status</h3>
            <div className="flex gap-2 flex-wrap">
              {['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(selectedOrder.id, status as any)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedOrder.status === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {getStatusText(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Unit Price: {formatCurrency(item.unitPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Logistics ({selectedOrder.deliveryLocation}):</span>
                  <span>{formatCurrency(selectedOrder.logisticsCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatCurrency(selectedOrder.total)}</span>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Orders Management</h1>
        <p className="text-gray-600 mt-2">Manage home delivery orders and track delivery status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Delivery Orders</h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No delivery orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{order.customerInfo.name}</p>
                        <p className="text-gray-500">{order.customerInfo.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {order.deliveryLocation}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-primary-600 hover:text-primary-700"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => callCustomer(order.customerInfo.phone)}
                          className="text-green-600 hover:text-green-700"
                          title="Call Customer"
                        >
                          <PhoneIcon className="h-5 w-5" />
                        </button>
                        {order.status !== 'delivered' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="text-blue-600 hover:text-blue-700"
                            title="Mark as Delivered"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryOrders;
