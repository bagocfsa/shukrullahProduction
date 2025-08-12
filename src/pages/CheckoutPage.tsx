import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockClosedIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import PaymentButton from '../components/PaymentButton';
import { invoiceService, InvoiceData } from '../services/invoiceService';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  deliveryLocation: 'within-minna' | 'outside-minna';
  minnaArea?: string;
  waybillCompany?: string;
  specificLocation: string;
  paymentMethod: 'bank-transfer' | 'opay' | 'paystack';
  packaging: 'sack' | 'carton';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  agreeToTerms: boolean;
}

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    deliveryLocation: 'within-minna',
    minnaArea: '',
    waybillCompany: '',
    specificLocation: '',
    paymentMethod: 'bank-transfer',
    packaging: 'sack',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    agreeToTerms: false,
  });

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <Link
            to="/products"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Define Minna delivery areas and their base prices
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

  // Calculate logistics cost based on delivery location and order value
  const getLogisticsCost = () => {
    if (formData.deliveryLocation === 'outside-minna') {
      return 0; // Waybill company handles outside Minna (customer pays separately)
    }

    if (formData.deliveryLocation === 'within-minna' && formData.minnaArea) {
      const area = minnaDeliveryAreas[formData.minnaArea as keyof typeof minnaDeliveryAreas];
      if (!area) return 0;

      if (area.basePrice === 0) {
        return 0; // "Others" - contact required
      }

      // Calculate multiplier based on order value
      const orderValue = cart.subtotal;
      const multiplier = Math.ceil(orderValue / 90000);

      return area.basePrice * multiplier;
    }

    return 0;
  };

  // Calculate packaging cost
  const getPackagingCost = (): number => {
    if (formData.packaging === 'carton') {
      // Calculate total weight of items (assuming each item has weight or using quantity as proxy)
      const totalWeight = cart.items.reduce((total, item) => {
        // Estimate weight based on product type and quantity
        let itemWeight = 0;
        if (item.product.name.toLowerCase().includes('oil')) {
          // Oil products: 1L = ~1kg, 2L = ~2kg, etc.
          if (item.product.name.includes('1L')) itemWeight = 1;
          else if (item.product.name.includes('2L')) itemWeight = 2;
          else if (item.product.name.includes('4L')) itemWeight = 4;
          else if (item.product.name.includes('25L')) itemWeight = 25;
          else itemWeight = 1; // default
        } else if (item.product.name.toLowerCase().includes('kuli')) {
          // Kuli-kuli products: estimate based on package size
          if (item.product.name.includes('1Kg')) itemWeight = 1;
          else if (item.product.name.includes('500g')) itemWeight = 0.5;
          else if (item.product.name.includes('250g')) itemWeight = 0.25;
          else itemWeight = 0.5; // default
        } else {
          // Other products: default weight
          itemWeight = 0.5;
        }
        return total + (itemWeight * item.quantity);
      }, 0);

      // Calculate carton cost: ₦1000 for every 20kg or part thereof
      const cartonUnits = Math.ceil(totalWeight / 20);
      return cartonUnits * 1000;
    }
    return 0; // Sack packaging is free
  };

  const logisticsCost = getLogisticsCost();
  const packagingCost = getPackagingCost();
  const finalTotal = cart.subtotal + logisticsCost + packagingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      showWarning('Terms Required', 'Please agree to our Terms and Conditions before placing your order.');
      return;
    }

    setIsProcessing(true);

    try {
      // Generate order and invoice numbers
      const orderNumber = invoiceService.generateOrderNumber();
      const invoiceNumber = invoiceService.generateInvoiceNumber(formData.firstName, finalTotal);
      const orderDate = new Date();



      // Prepare invoice data
      const expectedDeliveryDate = invoiceService.calculateExpectedDeliveryDate(orderDate);
      const invoiceData: InvoiceData = {
        orderNumber,
        invoiceNumber,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phone,
        customerEmail: `${formData.phone}@customer.com`,
        deliveryAddress: formData.address,
        deliveryLocation: formData.deliveryLocation,
        minnaArea: formData.minnaArea,
        paymentMethod: formData.paymentMethod,
        items: cart.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity
        })),
        subtotal: cart.subtotal,
        deliveryCost: logisticsCost,
        packagingCost: packagingCost,
        packagingType: formData.packaging,
        total: finalTotal,
        orderDate,
        invoiceDate: orderDate,
        expectedDeliveryDate,
        notes: formData.specificLocation
      };

      // Process order (no email, only WhatsApp)
      showWarning('Processing Order', 'Preparing order details for WhatsApp...');

      // Generate invoice and send via WhatsApp
      setTimeout(() => {
        showSuccess('Generating Invoice', 'Your invoice is being prepared and will be sent via WhatsApp...');
        invoiceService.generateInvoice(invoiceData);
      }, 1500);

      // Show success message and redirect
      setTimeout(() => {
        showSuccess(
          'Order Placed Successfully!',
          `Order ${orderNumber} confirmed! Invoice sent via WhatsApp to 09019286029. Expected delivery: ${invoiceService.calculateExpectedDeliveryDate(orderDate).toLocaleDateString()}`
        );
        clearCart();
        navigate('/order-confirmation', {
          state: {
            orderNumber,
            total: finalTotal,
            invoiceNumber,
            customerName: `${formData.firstName} ${formData.lastName}`,
            paymentMethod: formData.paymentMethod
          }
        });
      }, 3000);

    } catch (error) {
      console.error('Order processing error:', error);
      showError(
        'Order Processing Failed',
        'There was an error processing your order. Please try again or contact support.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaystackSuccess = async (transaction: any) => {
    console.log('Paystack payment successful:', transaction);

    try {
      // Generate order and invoice numbers
      const orderNumber = invoiceService.generateOrderNumber();
      const invoiceNumber = invoiceService.generateInvoiceNumber(formData.firstName, finalTotal);
      const orderDate = new Date();



      // Prepare invoice data
      const expectedDeliveryDate = invoiceService.calculateExpectedDeliveryDate(orderDate);
      const invoiceData: InvoiceData = {
        orderNumber,
        invoiceNumber,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phone,
        customerEmail: `${formData.phone}@customer.com`,
        deliveryAddress: formData.address,
        deliveryLocation: formData.deliveryLocation,
        minnaArea: formData.minnaArea,
        paymentMethod: 'paystack',
        items: cart.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity
        })),
        subtotal: cart.subtotal,
        deliveryCost: logisticsCost,
        packagingCost: packagingCost,
        packagingType: formData.packaging,
        total: finalTotal,
        orderDate,
        invoiceDate: orderDate,
        expectedDeliveryDate,
        notes: `Payment Reference: ${transaction.reference} | Transaction ID: ${transaction.trans}`
      };

      // Process payment success
      showSuccess('Payment Successful!', 'Preparing WhatsApp invoice...');

      // Generate invoice and send via WhatsApp
      setTimeout(() => {
        showSuccess('Generating Invoice', 'Your invoice is being prepared and will be sent via WhatsApp...');
        invoiceService.generateInvoice(invoiceData);
      }, 1500);

      // Save order details to localStorage
      const orderData = {
        orderNumber,
        invoiceNumber,
        paymentReference: transaction.reference,
        transactionId: transaction.trans,
        customer: {
          email: `${formData.phone}@customer.com`,
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          address: formData.address,
          deliveryLocation: formData.deliveryLocation,
          minnaArea: formData.minnaArea,
          specificLocation: formData.specificLocation,
          deliveryCost: logisticsCost
        },
        items: cart.items,
        total: finalTotal,
        paymentMethod: 'paystack',
        paymentStatus: 'completed',
        orderDate: orderDate.toISOString()
      };

      localStorage.setItem('lastOrder', JSON.stringify(orderData));

      // Clear cart and navigate to confirmation
      setTimeout(() => {
        clearCart();
        navigate('/order-confirmation', {
          state: {
            orderNumber,
            total: finalTotal,
            paymentReference: transaction.reference,
            paymentMethod: 'paystack',
            invoiceNumber
          }
        });
      }, 2500);

    } catch (error) {
      console.error('Post-payment processing error:', error);
      showError('Processing Error', 'Payment successful but there was an issue with order processing. You will be contacted directly.');

      // Still navigate to confirmation even if email/invoice fails
      clearCart();
      navigate('/order-confirmation', {
        state: {
          orderNumber: `ORD-${Date.now()}`,
          total: finalTotal,
          paymentReference: transaction.reference,
          paymentMethod: 'paystack'
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <div className="flex items-center mt-4 text-sm text-gray-600">
          <LockClosedIcon className="h-4 w-4 mr-1" />
          Secure checkout
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Customer & Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 08012345678"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Location *
                </label>
                <select
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="within-minna">Within Minna (Area-based pricing)</option>
                  <option value="outside-minna">Outside Minna (Waybill company charges apply)</option>
                </select>
              </div>

              {formData.deliveryLocation === 'within-minna' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minna Area *
                  </label>
                  <select
                    name="minnaArea"
                    value={formData.minnaArea || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select your area</option>
                    <optgroup label="₦800 Base Rate">
                      <option value="gurara">Gurara</option>
                      <option value="albishiri">Albishiri</option>
                      <option value="gidan-mugoro">Gidan Mugoro</option>
                      <option value="gbeganu">Gbeganu</option>
                    </optgroup>
                    <optgroup label="₦1,000 Base Rate">
                      <option value="kpakungu">Kpakungu</option>
                      <option value="mandela">Mandela</option>
                      <option value="railway">Railway</option>
                    </optgroup>
                    <optgroup label="₦1,500 Base Rate">
                      <option value="tunga">Tunga</option>
                      <option value="mobile">Mobile</option>
                      <option value="123-quarters">123 Quarters</option>
                      <option value="abdulsalam-park">Abdulsalam Park</option>
                      <option value="uba">UBA</option>
                      <option value="minna-central">Minna Central</option>
                      <option value="chanchaga">Chanchaga</option>
                      <option value="gk">GK</option>
                      <option value="fut">FUT</option>
                    </optgroup>
                    <optgroup label="Contact Required">
                      <option value="others">Others (You will be contacted by logistics unit)</option>
                    </optgroup>
                  </select>

                  {formData.minnaArea && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>Delivery Cost Calculation:</strong>
                        <br />
                        {formData.minnaArea === 'others' ? (
                          <span className="text-orange-600">
                            You will be contacted by our logistics unit for delivery arrangements.
                          </span>
                        ) : (
                          <>
                            Base rate: ₦{minnaDeliveryAreas[formData.minnaArea as keyof typeof minnaDeliveryAreas]?.basePrice.toLocaleString()}
                            <br />
                            Order value: ₦{cart.subtotal.toLocaleString()}
                            <br />
                            Multiplier: {Math.ceil(cart.subtotal / 90000)}x (every ₦90,000 or part thereof)
                            <br />
                            <strong>Total delivery cost: ₦{getLogisticsCost().toLocaleString()}</strong>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {formData.deliveryLocation === 'outside-minna' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Waybill Company
                  </label>
                  <select
                    name="waybillCompany"
                    value={formData.waybillCompany || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Waybill Company</option>
                    <option value="gig-logistics">GIG Logistics</option>
                    <option value="dhl">DHL</option>
                    <option value="fedex">FedEx</option>
                    <option value="ups">UPS</option>
                    <option value="other">Other (specify in address)</option>
                  </select>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.deliveryLocation === 'within-minna' ? 'Delivery Address in Minna *' : 'Full Delivery Address *'}
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder={formData.deliveryLocation === 'within-minna'
                    ? "e.g., No. 123 Bosso Road, Behind GTBank, Minna"
                    : "Full address including city, state, and any special instructions"
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Location/Landmark
                </label>
                <input
                  type="text"
                  name="specificLocation"
                  value={formData.specificLocation}
                  onChange={handleInputChange}
                  placeholder="e.g., Near NYSC Lodge, Opposite Police Station"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

            </div>

            {/* Packaging Options */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <div className="h-5 w-5 mr-2 flex items-center justify-center">📦</div>
                Packaging Options
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="packaging"
                      value="sack"
                      checked={formData.packaging === 'sack'}
                      onChange={handleInputChange}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-brown-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          🛍️
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Sack Packaging</div>
                          <div className="text-sm text-gray-600">Traditional sack packaging</div>
                          <div className="text-sm font-medium text-green-600">FREE</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="packaging"
                      value="carton"
                      checked={formData.packaging === 'carton'}
                      onChange={handleInputChange}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          📦
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Carton Packaging</div>
                          <div className="text-sm text-gray-600">Premium carton packaging</div>
                          <div className="text-sm font-medium text-orange-600">₦1,000 per 20kg</div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {formData.packaging === 'carton' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">Carton Packaging Details</h3>
                    <p className="text-orange-800 text-sm mb-2">
                      Premium carton packaging provides better protection for your products during delivery.
                    </p>
                    <p className="text-orange-800 text-sm">
                      <strong>Cost:</strong> ₦1,000 for every 20kg or part thereof
                    </p>
                    {packagingCost > 0 && (
                      <div className="mt-2 p-2 bg-orange-100 rounded">
                        <p className="text-orange-900 text-sm font-medium">
                          Your packaging cost: ₦{packagingCost.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2" />
                Payment Information
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === 'bank-transfer'}
                      onChange={handleInputChange}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          🏦
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Bank Transfer</div>
                          <div className="text-sm text-gray-600">Transfer to Access Bank account</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="opay"
                      checked={formData.paymentMethod === 'opay'}
                      onChange={handleInputChange}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          O
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Opay</div>
                          <div className="text-sm text-gray-600">Pay with Opay wallet or app</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paystack"
                      checked={formData.paymentMethod === 'paystack'}
                      onChange={handleInputChange}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <CreditCardIcon className="h-10 w-10 text-blue-600 mr-3" />
                        <div>
                          <div className="font-semibold text-gray-900">Paystack</div>
                          <div className="text-sm text-gray-600">Credit/Debit Card via Paystack</div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Bank Transfer Details */}
              {formData.paymentMethod === 'bank-transfer' && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm mr-2">
                      🏦
                    </div>
                    Bank Transfer Details
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-blue-600 font-medium uppercase">Bank Name</div>
                        <div className="text-lg font-bold text-blue-900">Access Bank</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-blue-600 font-medium uppercase">Account Number</div>
                        <div className="text-lg font-bold text-blue-900">1826076156</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-blue-600 font-medium uppercase">Account Name</div>
                        <div className="text-lg font-bold text-blue-900">Nutrinute</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-xs text-blue-600 font-medium uppercase">Amount to Transfer</div>
                        <div className="text-lg font-bold text-green-600">₦{finalTotal.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-start">
                        <div className="text-yellow-600 mr-2">⚠️</div>
                        <div>
                          <p className="text-yellow-800 text-sm font-medium">Important Instructions:</p>
                          <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                            <li>• Use your phone number <strong>({formData.phone || 'your phone number'})</strong> as transfer reference</li>
                            <li>• Send screenshot of transfer receipt to WhatsApp after payment</li>
                            <li>• Your order will be processed after payment confirmation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Opay Details */}
              {formData.paymentMethod === 'opay' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                    <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm mr-2">
                      O
                    </div>
                    Opay Payment Instructions
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border">
                      <div className="text-xs text-green-600 font-medium uppercase">Amount to Pay</div>
                      <div className="text-2xl font-bold text-green-600">₦{finalTotal.toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-green-800 space-y-2">
                      <p><strong>Payment Options:</strong></p>
                      <ul className="space-y-1 ml-4">
                        <li>• Open your Opay app and transfer to our Opay account</li>
                        <li>• Use Opay USSD code: *955# to make payment</li>
                        <li>• Visit any Opay agent near you</li>
                      </ul>
                      <div className="mt-3 p-2 bg-green-100 rounded">
                        <p className="text-green-800 text-xs">
                          <strong>Note:</strong> You will receive Opay payment details after clicking "Place Order"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'paystack' && (
                <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              )}

              {formData.paymentMethod === 'paystack' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <CreditCardIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">Secure Payment with Paystack</h3>
                      <p className="text-sm text-green-600">
                        Pay securely with your debit card, bank transfer, or USSD
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-green-700">
                    <p>✓ 256-bit SSL encryption</p>
                    <p>✓ PCI DSS compliant</p>
                    <p>✓ Instant payment confirmation</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-lg">🥤</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {formData.deliveryLocation === 'within-minna'
                      ? `Delivery (${formData.minnaArea ? minnaDeliveryAreas[formData.minnaArea as keyof typeof minnaDeliveryAreas]?.name || 'Minna' : 'Minna'})`
                      : 'Logistics'
                    }
                  </span>
                  <span>
                    {formData.deliveryLocation === 'within-minna'
                      ? (formData.minnaArea === 'others'
                          ? 'Contact required'
                          : `₦${logisticsCost.toLocaleString()}`
                        )
                      : 'Waybill charges apply'
                    }
                  </span>
                </div>
                {formData.deliveryLocation === 'outside-minna' && (
                  <div className="text-xs text-gray-500 mt-1">
                    * Waybill company will charge separately for delivery outside Minna
                  </div>
                )}
                {formData.deliveryLocation === 'within-minna' && formData.minnaArea === 'others' && (
                  <div className="text-xs text-orange-600 mt-1">
                    * Our logistics unit will contact you to arrange delivery and pricing
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Packaging ({formData.packaging === 'carton' ? 'Carton' : 'Sack'})
                  </span>
                  <span>
                    {formData.packaging === 'carton'
                      ? `₦${packagingCost.toLocaleString()}`
                      : 'FREE'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order Button */}
              {formData.paymentMethod === 'paystack' ? (
                <div className="mt-6">
                  <PaymentButton
                    amount={finalTotal}
                    email={`${formData.phone}@customer.com`}
                    customerName={`${formData.firstName} ${formData.lastName}`}
                    customerPhone={formData.phone}
                    orderId={`ORDER_${Date.now()}`}
                    items={cart.items}
                    onSuccess={handlePaystackSuccess}
                    onCancel={() => {
                      console.log('Payment cancelled');
                    }}
                    onError={(error) => {
                      console.error('Payment error:', error);
                      alert('Payment failed: ' + error);
                    }}
                    disabled={
                      !formData.firstName ||
                      !formData.lastName ||
                      !formData.phone ||
                      !formData.address ||
                      (formData.deliveryLocation === 'within-minna' && !formData.minnaArea)
                    }
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  />
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Place Order - ₦${cart.total.toLocaleString()}`}
                </button>
              )}

              {/* Terms and Conditions Agreement */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    required
                  />
                  <div className="text-sm text-gray-700">
                    <p>
                      I agree to the{' '}
                      <Link
                        to="/terms"
                        target="_blank"
                        className="text-primary-600 hover:text-primary-800 underline font-medium"
                      >
                        Terms and Conditions
                      </Link>
                      {' '}and confirm that I have read and understood the delivery terms,
                      payment policies, and return conditions.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      * Required to complete your order
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
