import React, { useState } from 'react';
import { PlusIcon, MinusIcon, TrashIcon, PrinterIcon, UserIcon } from '@heroicons/react/24/outline';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';
import GoogleSheetsOnlyService from '../services/googleSheetsOnly';
import { usePricing } from '../context/PricingContext';
import { PaymentService } from '../services/paymentService';
import { useNotification } from '../context/NotificationContext';

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
  paymentMethod: 'cash' | 'card' | 'transfer' | 'pos' | 'online';
  customerName?: string;
  customerPhone?: string;
  salesPerson: string;
  saleDate: Date;
  deliveryOption?: 'pickup' | 'delivery';
  deliveryLocation?: string;
  customerAddress?: string;
  logisticsCost?: number;
}

const RecordSale: React.FC = () => {
  const { getProductPrice, salesChannel } = usePricing();
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useNotification();
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'pos' | 'online'>('cash');
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  // Minna delivery areas and their base prices (matching checkout system)
  const minnaDeliveryAreas = {
    'gurara': { name: 'Gurara', basePrice: 800 },
    'albishiri': { name: 'Albishiri', basePrice: 800 },
    'gidan-mugoro': { name: 'Gidan Mugoro', basePrice: 800 },
    'gbeganu': { name: 'Gbeganu', basePrice: 800 },
    'kpakungu': { name: 'Kpakungu', basePrice: 1000 },
    'mandela': { name: 'Mandela', basePrice: 1000 },
    'railway': { name: 'Railway', basePrice: 1000 },
    'tunga': { name: 'Tunga', basePrice: 1500 },
    'mobile': { name: 'Mobile', basePrice: 1500 },
    '123-quarters': { name: '123 Quarters', basePrice: 1500 },
    'abdulsalam-park': { name: 'Abdulsalam Park', basePrice: 1500 },
    'uba': { name: 'UBA', basePrice: 1500 },
    'minna-central': { name: 'Minna Central', basePrice: 1500 },
    'chanchaga': { name: 'Chanchaga', basePrice: 1500 },
    'gk': { name: 'GK', basePrice: 1500 },
    'fut': { name: 'FUT', basePrice: 1500 },
    'others': { name: 'Others (Contact Required)', basePrice: 0 }
  };

  // Convert to array for dropdown (maintaining backward compatibility)
  const deliveryLocations = Object.entries(minnaDeliveryAreas).map(([key, area]) => ({
    key,
    name: area.name,
    cost: area.basePrice
  }));

  const getDeliveryCost = () => {
    if (deliveryOption === 'pickup') return 0;
    const location = deliveryLocations.find(loc => loc.name === deliveryLocation);
    return location ? location.cost : 0;
  };

  const addProduct = () => {
    if (!selectedProductId) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const unitPrice = getProductPrice(product.price, product.physicalShopPrice);
    const existingItemIndex = saleItems.findIndex(item => item.productId === selectedProductId);

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...saleItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * unitPrice;
      setSaleItems(updatedItems);
    } else {
      // Add new item
      const newItem: SaleItem = {
        productId: selectedProductId,
        productName: product.name,
        quantity: 1,
        unitPrice,
        totalPrice: unitPrice
      };
      setSaleItems([...saleItems, newItem]);
    }
    
    setSelectedProductId('');
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setSaleItems(items => 
      items.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setSaleItems(items => items.filter(item => item.productId !== productId));
  };

  const calculateTotals = () => {
    const subtotal = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const logisticsCost = getDeliveryCost();
    const total = subtotal + logisticsCost; // No VAT, just subtotal + logistics if delivery

    return {
      subtotal: Math.round(subtotal),
      logisticsCost,
      total: Math.round(total)
    };
  };

  const { subtotal, logisticsCost, total } = calculateTotals();

  const completeSale = async () => {
    if (saleItems.length === 0) return;

    // Validate delivery information if delivery is selected
    if (deliveryOption === 'delivery') {
      if (!deliveryLocation || !customerAddress || !customerName || !customerPhone) {
        showWarning(
          'Delivery Information Required',
          'Please fill in all delivery information: customer name, phone, delivery location, and address.'
        );
        return;
      }
    }

    // Handle online payment
    if (paymentMethod === 'online') {
      if (!customerName || !customerPhone) {
        showWarning(
          'Customer Information Required',
          'Customer name and phone number are required for online payment processing.'
        );
        return;
      }

      // Simple email validation - use phone as email if no @ symbol
      const customerEmail = customerPhone.includes('@') ? customerPhone : `${customerPhone}@customer.com`;

      try {
        const paymentService = PaymentService.getInstance();
        const saleId = `SALE-${Date.now()}`;

        // Store sale data temporarily for after payment
        const saleData = {
          id: saleId,
          items: saleItems,
          subtotal,
          total,
          paymentMethod,
          customerName,
          customerPhone,
          salesPerson: `${user?.firstName} ${user?.lastName}`,
          saleDate: new Date(),
          deliveryOption,
          deliveryLocation: deliveryOption === 'delivery' ? deliveryLocation : undefined,
          customerAddress: deliveryOption === 'delivery' ? customerAddress : undefined,
          logisticsCost: deliveryOption === 'delivery' ? logisticsCost : undefined
        };

        localStorage.setItem('pendingSale', JSON.stringify(saleData));

        // Initialize Paystack payment
        await paymentService.initializePayment(
          {
            email: customerEmail,
            amount: total * 100, // Convert to kobo
            reference: saleId,
            metadata: {
              orderId: saleId,
              customerName,
              customerPhone,
              items: saleItems
            }
          },
          async (transaction: any) => {
            // Payment successful
            console.log('✅ Payment successful:', transaction);

            try {
              // Save to Google Sheets
              const saved = await GoogleSheetsOnlyService.saveSale(saleData);

              if (saved) {
                showSuccess(
                  'Payment Successful!',
                  'Your payment was processed successfully and the sale has been saved to Google Sheets.'
                );
                setCompletedSale(saleData);
                setShowReceipt(true);

                // Clear form
                setSaleItems([]);
                setCustomerName('');
                setCustomerPhone('');
                setPaymentMethod('cash');
                setDeliveryOption('pickup');
                setDeliveryLocation('');
                setCustomerAddress('');

                // Clear pending sale
                localStorage.removeItem('pendingSale');
              }
            } catch (error) {
              console.error('❌ Error saving sale after payment:', error);
              showError(
                'Payment Successful - Save Failed',
                'Your payment was processed successfully, but we failed to save the sale to Google Sheets. Please contact support with your payment confirmation.'
              );
            }
          },
          () => {
            // Payment cancelled
            console.log('❌ Payment cancelled');
            showWarning(
              'Payment Cancelled',
              'Your payment was cancelled. You can try again or choose a different payment method.'
            );
            localStorage.removeItem('pendingSale');
          }
        );

        return; // Exit here for online payment
      } catch (error) {
        console.error('❌ Payment initialization error:', error);
        showError(
          'Payment Initialization Failed',
          `Failed to initialize online payment: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or choose a different payment method.`
        );
        return;
      }
    }

    const sale: Sale = {
      id: `SALE-${Date.now()}`,
      items: saleItems,
      subtotal,
      total,
      paymentMethod,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      salesPerson: `${user?.firstName} ${user?.lastName}`,
      saleDate: new Date(),
      deliveryOption,
      deliveryLocation: deliveryOption === 'delivery' ? deliveryLocation : undefined,
      customerAddress: deliveryOption === 'delivery' ? customerAddress : undefined,
      logisticsCost: deliveryOption === 'delivery' ? logisticsCost : undefined
    };

    try {
      // Save to Google Sheets before showing receipt
      console.log('💾 Saving sale to Google Sheets...');
      console.log('📊 Sale data:', sale);

      const saved = await GoogleSheetsOnlyService.saveSale(sale);

      if (saved) {
        console.log('✅ Sale saved successfully to Google Sheets');
        // Show success notification
        showSuccess(
          'Sale Completed Successfully!',
          `Sale ID: ${sale.id} • Total: ${formatCurrency(sale.total)} • Data saved to Google Sheets`
        );
      }
    } catch (error) {
      console.error('❌ Error saving sale to Google Sheets:', error);
      showError(
        'Sale Save Failed',
        `Failed to save sale: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your internet connection and Google Sheets configuration.`,
        0 // Don't auto-dismiss error
      );

      // Don't proceed with receipt if save failed
      return;
    }

    setCompletedSale(sale);
    setShowReceipt(true);

    // Clear the form
    setSaleItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setPaymentMethod('cash');
    setDeliveryOption('pickup');
    setDeliveryLocation('');
    setCustomerAddress('');
  };

  const printReceipt = () => {
    window.print();
  };

  const startNewSale = () => {
    setShowReceipt(false);
    setCompletedSale(null);
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  if (showReceipt && completedSale) {
    return (
      <div className="max-w-md mx-auto p-4">
        {/* Receipt */}
        <div id="receipt" className="bg-white p-6 border border-gray-300 font-mono text-sm">
          <div className="text-center mb-4">
            <h1 className="text-lg font-bold">SHUKRULLAH NIGERIA LTD</h1>
            <p className="text-xs">Traditional Foods & Leather Products</p>
            <p className="text-xs">Block 39, Opposite Sanda College</p>
            <p className="text-xs">Talba Housing Estate, Minna</p>
            <p className="text-xs">Off Bida Road, Niger State</p>
            <p className="text-xs">Phone: +234-901-928-6029</p>
            <div className="border-t border-dashed border-gray-400 my-2"></div>
          </div>

          <div className="mb-4">
            <p className="text-xs">Receipt #: {completedSale.id}</p>
            <p className="text-xs">Date: {completedSale.saleDate.toLocaleString('en-NG')}</p>
            <p className="text-xs">Cashier: {completedSale.salesPerson}</p>
            {completedSale.customerName && (
              <p className="text-xs">Customer: {completedSale.customerName}</p>
            )}
            <div className="border-t border-dashed border-gray-400 my-2"></div>
          </div>

          <div className="mb-4">
            {completedSale.items.map((item, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <span className="text-xs truncate pr-2">{item.productName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{item.quantity} x {formatCurrency(item.unitPrice)}</span>
                  <span>{formatCurrency(item.totalPrice)}</span>
                </div>
              </div>
            ))}
            <div className="border-t border-dashed border-gray-400 my-2"></div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs">
              <span>Subtotal:</span>
              <span>{formatCurrency(completedSale.subtotal)}</span>
            </div>
            {completedSale.deliveryOption === 'delivery' && completedSale.logisticsCost && (
              <div className="flex justify-between text-xs">
                <span>Logistics:</span>
                <span>{formatCurrency(completedSale.logisticsCost)}</span>
              </div>
            )}
            <div className="border-t border-dashed border-gray-400 my-1"></div>
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>{formatCurrency(completedSale.total)}</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs">Payment: {completedSale.paymentMethod.toUpperCase()}</p>
            {completedSale.deliveryOption === 'delivery' && (
              <>
                <p className="text-xs">Delivery: {completedSale.deliveryLocation}</p>
                {completedSale.customerAddress && (
                  <p className="text-xs">Address: {completedSale.customerAddress}</p>
                )}
              </>
            )}
            <div className="border-t border-dashed border-gray-400 my-2"></div>
          </div>

          <div className="text-center text-xs">
            <p>Thank you for your purchase!</p>
            <p>Visit us again soon</p>
            <p className="mt-2">*** CUSTOMER COPY ***</p>
          </div>
        </div>

        {/* Print Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={printReceipt}
            className="flex-1 btn-groundnut text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print Receipt
          </button>
          <button
            onClick={startNewSale}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            New Sale
          </button>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="mb-4">
            <UserIcon className="mx-auto h-12 w-12 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">Admin Access Required</h2>
          <p className="text-yellow-700 mb-4">
            Only administrators can record new sales. This ensures proper control over sales data and Google Sheets integration.
          </p>
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">What you can do:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• View sales history and reports</li>
              <li>• Print existing receipts</li>
              <li>• Access inventory information</li>
            </ul>
          </div>
          <p className="text-xs text-yellow-600 mt-4">
            Contact your administrator if you need access to record sales.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 groundnut-texture">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Record Sale</h1>
          <p className="text-gray-600 mt-2">Point of Sale - Physical Shop (Admin Only)</p>
        </div>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          🔓 Admin Access
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add Products</h3>
            <div className="flex gap-4">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(getProductPrice(product.price, product.physicalShopPrice))}
                  </option>
                ))}
              </select>
              <button
                onClick={addProduct}
                disabled={!selectedProductId}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add
              </button>
            </div>
          </div>

          {/* Sale Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Sale Items</h3>
            {saleItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items added yet</p>
            ) : (
              <div className="space-y-4">
                {saleItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600">{formatCurrency(item.unitPrice)} each</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      <div className="w-20 text-right font-medium">
                        {formatCurrency(item.totalPrice)}
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sale Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h3 className="text-lg font-semibold mb-4">Sale Summary</h3>
            
            {/* Customer Info */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Customer (Optional)</span>
              </div>
              <input
                type="text"
                placeholder="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Delivery Options */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Delivery Option</span>
              </div>
              <div className="space-y-3">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="pickup"
                      checked={deliveryOption === 'pickup'}
                      onChange={(e) => setDeliveryOption(e.target.value as 'pickup' | 'delivery')}
                      className="mr-2"
                    />
                    <span className="text-sm">Customer Pickup</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="delivery"
                      checked={deliveryOption === 'delivery'}
                      onChange={(e) => setDeliveryOption(e.target.value as 'pickup' | 'delivery')}
                      className="mr-2"
                    />
                    <span className="text-sm">Home Delivery</span>
                  </label>
                </div>

                {deliveryOption === 'delivery' && (
                  <div className="space-y-2 mt-3 p-3 bg-blue-50 rounded-lg">
                    <select
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select delivery location</option>
                      {deliveryLocations.map((location) => (
                        <option key={location.name} value={location.name}>
                          {location.name} - ₦{location.cost.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <textarea
                      placeholder="Customer address (street, house number, landmarks)"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={2}
                      required
                    />
                    {deliveryLocation && (
                      <p className="text-sm text-blue-600">
                        Logistics cost: ₦{deliveryLocations.find(loc => loc.name === deliveryLocation)?.cost.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {deliveryOption === 'delivery' && logisticsCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Logistics Cost:</span>
                  <span className="font-medium">{formatCurrency(logisticsCost)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="pos">POS/Card</option>
                <option value="transfer">Bank Transfer</option>
                <option value="online">Online Payment (Paystack)</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            {/* Save and Print Button */}
            <button
              onClick={completeSale}
              disabled={saleItems.length === 0}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              Save and Print - {formatCurrency(total)}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Sale will be saved to Google Sheets and receipt will be generated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordSale;
