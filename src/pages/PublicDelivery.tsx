import React, { useState } from 'react';
import { PlusIcon, MinusIcon, TrashIcon, MapPinIcon, PhoneIcon, UserIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { products } from '../data/products';
import PaymentButton from '../components/PaymentButton';

interface DeliveryItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

interface PublicDeliveryOrder {
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
  status: 'pending';
  orderType: 'public_delivery';
}

const DELIVERY_LOCATIONS = [
  { name: 'Chanchaga', cost: 2000 },
  { name: 'City Gate', cost: 1500 },
  { name: 'Tunga', cost: 1500 },
  { name: 'Mandela', cost: 1000 },
  { name: 'Pakungu', cost: 800 },
  { name: 'Gidan Mongoro', cost: 800 },
  { name: 'Gurara', cost: 800 },
  { name: 'Albishiri', cost: 800 },
  { name: 'Gbeganu', cost: 800 },
  { name: 'GK', cost: 1200 },
  { name: 'FUT Minna', cost: 1200 },
  { name: 'Bosso', cost: 2000 },
  { name: 'Outside Minna', cost: 3000 }
];

const PublicDelivery: React.FC = () => {
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const addProduct = (product: any) => {
    // Use online prices for public delivery
    const unitPrice = product.price;
    const existingItemIndex = deliveryItems.findIndex(item => item.productId === product.id);

    if (existingItemIndex >= 0) {
      const updatedItems = [...deliveryItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * unitPrice;
      setDeliveryItems(updatedItems);
    } else {
      const newItem: DeliveryItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice,
        totalPrice: unitPrice,
        image: product.images[0]
      };
      setDeliveryItems([...deliveryItems, newItem]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setDeliveryItems(items => 
      items.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setDeliveryItems(items => items.filter(item => item.productId !== productId));
  };

  const getDeliveryCost = () => {
    const location = DELIVERY_LOCATIONS.find(loc => loc.name === selectedLocation);
    return location ? location.cost : 0;
  };

  const calculateTotals = () => {
    const subtotal = deliveryItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const logisticsCost = getDeliveryCost();
    const total = subtotal + logisticsCost; // No VAT, just subtotal + logistics

    return {
      subtotal: Math.round(subtotal),
      logisticsCost,
      total: Math.round(total)
    };
  };

  const { subtotal, logisticsCost, total } = calculateTotals();

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const saveOrderToStorage = (order: PublicDeliveryOrder) => {
    const existingOrders = JSON.parse(localStorage.getItem('shukrullah-public-delivery-orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('shukrullah-public-delivery-orders', JSON.stringify(existingOrders));
  };

  const generateWhatsAppMessage = (order: PublicDeliveryOrder) => {
    let message = `🛍️ *NEW HOME DELIVERY ORDER*\n\n`;
    message += `📋 *Order ID:* ${order.id}\n`;
    message += `📅 *Date:* ${order.orderDate.toLocaleString('en-NG')}\n\n`;
    
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${order.customerInfo.name}\n`;
    message += `Phone: ${order.customerInfo.phone}\n`;
    message += `Address: ${order.customerInfo.address}\n`;
    message += `Location: ${order.deliveryLocation}\n\n`;
    
    message += `🛒 *Items Ordered:*\n`;
    order.items.forEach(item => {
      message += `• ${item.quantity}x ${item.productName} - ${formatCurrency(item.totalPrice)}\n`;
    });
    
    message += `\n💰 *Order Summary:*\n`;
    message += `Subtotal: ${formatCurrency(order.subtotal)}\n`;
    message += `Logistics (${order.deliveryLocation}): ${formatCurrency(order.logisticsCost)}\n`;
    message += `*Total: ${formatCurrency(order.total)}*\n\n`;
    
    message += `📍 *Delivery Location:* ${order.deliveryLocation}\n`;
    message += `🏪 *From:* Shukrullah Nigeria Ltd\n`;
    message += `📍 *Shop Address:* Block 39, Opposite Sanda College, Talba Housing Estate, Minna\n`;
    message += `📞 *Contact:* +234-901-928-6029`;
    
    return encodeURIComponent(message);
  };

  const submitOrder = () => {
    if (deliveryItems.length === 0 || !customerName || !customerPhone || !customerAddress || !selectedLocation) {
      alert('Please fill all required fields and add at least one product');
      return;
    }

    const order: PublicDeliveryOrder = {
      id: `PUB-DEL-${Date.now()}`,
      items: deliveryItems,
      customerInfo: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        location: selectedLocation
      },
      deliveryLocation: selectedLocation,
      logisticsCost,
      subtotal,
      total,
      orderDate: new Date(),
      status: 'pending',
      orderType: 'public_delivery'
    };

    // Save to localStorage
    saveOrderToStorage(order);

    // Generate WhatsApp message
    const whatsappMessage = generateWhatsAppMessage(order);
    const whatsappUrl = `https://wa.me/2349019286029?text=${whatsappMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear form
    setDeliveryItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setSelectedLocation('');
    setShowCheckout(false);

    alert('Order submitted! We will contact you via WhatsApp to confirm your order.');
  };

  if (showCheckout) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowCheckout(false)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Continue Shopping
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout - Home Delivery</h2>
          
          {/* Order Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Your Order</h3>
            <div className="space-y-3">
              {deliveryItems.map((item) => (
                <div key={item.productId} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded mr-3" />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Your Information
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <textarea
                  placeholder="Delivery Address *"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Delivery Location & Totals */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Delivery Location
              </h3>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
                required
              >
                <option value="">Select delivery location...</option>
                {DELIVERY_LOCATIONS.map((location) => (
                  <option key={location.name} value={location.name}>
                    {location.name} - {formatCurrency(location.cost)}
                  </option>
                ))}
              </select>

              {/* Order Totals */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Logistics Cost:</span>
                    <span>{formatCurrency(logisticsCost)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Order */}
          <div className="mt-8">
            <button
              onClick={submitOrder}
              disabled={!customerName || !customerPhone || !customerAddress || !selectedLocation || deliveryItems.length === 0}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              Place Order via WhatsApp - {formatCurrency(total)}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              Your order will be sent via WhatsApp for confirmation. No registration required!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Home Delivery Service</h1>
        <p className="text-xl text-gray-600 mb-6">Get authentic Nigerian products delivered to your doorstep in Minna</p>
        
        {/* Company Info */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-2">Shukrullah Nigeria Ltd</h2>
          <p className="text-primary-800 mb-2">Traditional Foods & Premium Leather Products</p>
          <p className="text-sm text-primary-700">📍 Block 39, Opposite Sanda College, Talba Housing Estate, Minna, Off Bida Road</p>
          <p className="text-sm text-primary-700">📞 09019286029 | 08142970188 | 📧 info@shukrullah.com</p>
        </div>
      </div>

      {/* Delivery Areas Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <MapPinIcon className="h-5 w-5 mr-2" />
          We Deliver To These Areas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {DELIVERY_LOCATIONS.map((location) => (
            <div key={location.name} className="flex justify-between">
              <span className="text-blue-800">{location.name}:</span>
              <span className="font-semibold text-blue-900">{formatCurrency(location.cost)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-blue-700 mt-4">
          * Delivery usually takes 1-3 hours within Minna. Outside Minna may take longer.
        </p>
      </div>

      {/* Shopping Cart Summary */}
      {deliveryItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-4 z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Your Cart ({deliveryItems.length} items)
            </h3>
            <div className="flex gap-2">
              <span className="text-lg font-bold text-primary-600">{formatCurrency(total)}</span>
              <button
                onClick={() => setShowCheckout(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {deliveryItems.slice(0, 3).map((item) => (
              <div key={item.productId} className="flex items-center p-2 border border-gray-200 rounded-lg">
                <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded mr-2" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.productName}</p>
                  <p className="text-xs text-gray-600">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
                </div>
              </div>
            ))}
            {deliveryItems.length > 3 && (
              <div className="flex items-center justify-center p-2 border border-gray-200 rounded-lg text-gray-500">
                +{deliveryItems.length - 3} more items
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-6">All Products Available for Delivery</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const inCart = deliveryItems.find(item => item.productId === product.id);
            
            return (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-primary-600">{formatCurrency(product.price)}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                  </div>
                  
                  {product.physicalShopPrice && product.physicalShopPrice < product.price && (
                    <p className="text-xs text-green-600 mb-2">
                      Save ₦{(product.price - product.physicalShopPrice).toLocaleString()} at our physical shop!
                    </p>
                  )}
                  
                  {inCart ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(product.id, inCart.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{inCart.quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, inCart.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addProduct(product)}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicDelivery;
