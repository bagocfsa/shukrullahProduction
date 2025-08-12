import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, ShieldCheckIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-groundnut-gradient mb-4">
          Terms and Conditions
        </h1>
        <p className="text-lg text-gray-600">
          Please read these terms carefully before using our services
        </p>
        <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
          <DocumentTextIcon className="h-4 w-4 mr-2" />
          Last updated: December 2024
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-primary-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-primary-800 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <a href="#acceptance" className="text-primary-600 hover:text-primary-800 transition-colors">1. Acceptance</a>
          <a href="#products" className="text-primary-600 hover:text-primary-800 transition-colors">2. Products</a>
          <a href="#ordering" className="text-primary-600 hover:text-primary-800 transition-colors">3. Ordering</a>
          <a href="#payment" className="text-primary-600 hover:text-primary-800 transition-colors">4. Payment</a>
          <a href="#delivery" className="text-primary-600 hover:text-primary-800 transition-colors">5. Delivery</a>
          <a href="#returns" className="text-primary-600 hover:text-primary-800 transition-colors">6. Returns</a>
          <a href="#privacy" className="text-primary-600 hover:text-primary-800 transition-colors">7. Privacy</a>
          <a href="#liability" className="text-primary-600 hover:text-primary-800 transition-colors">8. Liability</a>
        </div>
      </div>

      {/* Terms Content */}
      <div className="prose prose-lg max-w-none">
        
        {/* Section 1: Acceptance of Terms */}
        <section id="acceptance" className="mb-8">
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-700 mb-4">
              By accessing and using the Nutrinute website operated by <strong>Shukrullah Nigeria Ltd</strong>, 
              you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p className="text-gray-700 mb-4">
              These Terms and Conditions apply to all visitors, users, and customers who access or use our service.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Products and Services */}
        <section id="products" className="mb-8">
          <div className="flex items-center mb-4">
            <div className="h-6 w-6 text-primary-600 mr-3 flex items-center justify-center">🥜</div>
            <h2 className="text-2xl font-bold text-gray-900">2. Products and Services</h2>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Products</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Kuli-kuli:</strong> Traditional Nigerian groundnut snacks in various sizes</li>
              <li><strong>Groundnut Oil:</strong> Pure, natural cooking oil in multiple container sizes</li>
              <li><strong>Traditional Foods:</strong> Dankowa and authentic Nigerian spices</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>All products are manufactured by Shukrullah Nigeria Ltd</li>
              <li>Product images are for illustration purposes and may vary slightly from actual products</li>
              <li>We reserve the right to modify product specifications without prior notice</li>
              <li>All products are subject to availability</li>
            </ul>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                <strong>Quality Guarantee:</strong> All our products are made with premium ingredients and 
                undergo strict quality control processes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Ordering Process */}
        <section id="ordering" className="mb-8">
          <div className="flex items-center mb-4">
            <div className="h-6 w-6 text-primary-600 mr-3 flex items-center justify-center">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900">3. Ordering Process</h2>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Order</h3>
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
              <li>Browse our product catalog and add items to your cart</li>
              <li>Review your order in the shopping cart</li>
              <li>Proceed to checkout and fill in your delivery information</li>
              <li>Select your preferred payment method</li>
              <li>Confirm your order and make payment</li>
              <li>Receive order confirmation via email and WhatsApp</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Confirmation</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Orders are confirmed upon successful payment or payment arrangement</li>
              <li>You will receive an order confirmation email and WhatsApp message</li>
              <li>A downloadable invoice will be provided for your records</li>
              <li>We reserve the right to cancel orders due to product unavailability</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Modifications</h3>
            <p className="text-gray-700 mb-4">
              Order modifications or cancellations must be requested within 2 hours of order placement. 
              Contact us immediately at <strong>09019286029</strong> for any changes.
            </p>
          </div>
        </section>

        {/* Section 4: Payment Terms */}
        <section id="payment" className="mb-8">
          <div className="flex items-center mb-4">
            <CreditCardIcon className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">4. Payment Terms</h2>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Accepted Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">🏦 Bank Transfer</h4>
                <p className="text-sm text-gray-600">
                  Access Bank<br/>
                  Account: 1826076156<br/>
                  Name: Nutrinute
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">📱 Opay</h4>
                <p className="text-sm text-gray-600">
                  Opay wallet transfers<br/>
                  USSD: *955#<br/>
                  Agent payments
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">💳 Paystack</h4>
                <p className="text-sm text-gray-600">
                  Credit/Debit cards<br/>
                  Secure online payment<br/>
                  Instant confirmation
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Terms</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Payment is required before order processing and delivery</li>
              <li>For bank transfers, use your phone number as the reference</li>
              <li>Send payment confirmation screenshot via WhatsApp to 09019286029</li>
              <li>Orders will be processed within 24 hours of payment confirmation</li>
              <li>All prices are in Nigerian Naira (₦) and include applicable taxes</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Security:</strong> All online payments are processed through secure, encrypted channels. 
                We do not store your payment information.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Delivery Terms */}
        <section id="delivery" className="mb-8">
          <div className="flex items-center mb-4">
            <TruckIcon className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">5. Delivery Terms</h2>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Areas and Pricing</h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Area</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Base Rate</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Locations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Zone 1</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₦800</td>
                    <td className="px-4 py-2 text-sm text-gray-600">Gurara, Albishiri, Gidan Mugoro, Gbeganu</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Zone 2</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₦1,000</td>
                    <td className="px-4 py-2 text-sm text-gray-600">Kpakungu, Mandela, Railway</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Zone 3</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₦1,500</td>
                    <td className="px-4 py-2 text-sm text-gray-600">Tunga, Mobile, 123 Quarters, Abdulsalam Park, UBA, Minna Central, Chanchaga, GK, FUT</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">Others</td>
                    <td className="px-4 py-2 text-sm text-gray-900">Contact Us</td>
                    <td className="px-4 py-2 text-sm text-gray-600">Areas not listed above</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Schedule</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Expected Delivery:</strong> 4 business days from order confirmation</li>
              <li><strong>Delivery Hours:</strong> Monday to Saturday, 9:00 AM - 6:00 PM</li>
              <li><strong>Contact:</strong> We will call you to arrange convenient delivery time</li>
              <li><strong>Delivery Confirmation:</strong> Signature required upon delivery</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Conditions</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Delivery charges are calculated based on order value (every ₦90,000 or part thereof)</li>
              <li>Customer must be available at the delivery address</li>
              <li>If delivery fails due to customer unavailability, re-delivery charges may apply</li>
              <li>Delivery to accessible locations only (no remote or dangerous areas)</li>
            </ul>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800 text-sm">
                <strong>Note:</strong> Delivery times may be extended during peak periods, holidays, 
                or due to unforeseen circumstances. We will notify you of any delays.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Returns and Refunds */}
        <section id="returns" className="mb-8">
          <div className="flex items-center mb-4">
            <div className="h-6 w-6 text-primary-600 mr-3 flex items-center justify-center">↩️</div>
            <h2 className="text-2xl font-bold text-gray-900">6. Returns and Refunds</h2>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Policy</h3>
            <p className="text-gray-700 mb-4">
              Due to the nature of our food products, we have a limited return policy focused on quality issues.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Eligible Returns</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Products damaged during delivery</li>
              <li>Products that do not match the order description</li>
              <li>Products with quality defects or contamination</li>
              <li>Wrong products delivered</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Process</h3>
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
              <li>Contact us within 24 hours of delivery at 09019286029</li>
              <li>Provide order number and photos of the issue</li>
              <li>Keep the product in its original packaging</li>
              <li>Our team will assess and approve the return</li>
              <li>Approved returns will be collected and refunded</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Policy</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Refunds processed within 7-14 business days</li>
              <li>Refunds made to the original payment method</li>
              <li>Delivery charges are non-refundable unless the error is ours</li>
              <li>Partial refunds may apply for partially damaged orders</li>
            </ul>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <strong>Non-Returnable:</strong> Products that have been opened, consumed, or stored improperly 
                cannot be returned for hygiene and safety reasons.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <div className="bg-primary-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-primary-800 mb-2">Shukrullah Nigeria Ltd</h3>
                <p className="text-primary-700 text-sm mb-2">
                  Quality Nigerian Food Products<br/>
                  Minna, Niger State, Nigeria
                </p>
                <p className="text-primary-700 text-sm">
                  <strong>Phone:</strong> +234 901 928 6029<br/>
                  <strong>Email:</strong> orders@nutrinute.com<br/>
                  <strong>Website:</strong> www.nutrinute.com
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary-800 mb-2">Customer Support</h3>
                <p className="text-primary-700 text-sm mb-2">
                  For questions about these terms or our services:
                </p>
                <p className="text-primary-700 text-sm">
                  <strong>WhatsApp:</strong> 09019286029<br/>
                  <strong>Hours:</strong> Monday - Saturday, 8:00 AM - 7:00 PM<br/>
                  <strong>Response Time:</strong> Within 24 hours
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Footer */}
        <section className="mb-8">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              These Terms and Conditions are governed by the laws of the Federal Republic of Nigeria.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Any disputes arising from these terms will be resolved through Nigerian courts.
            </p>
            <p className="text-xs text-gray-500">
              Last updated: December 2024 | Version 1.0 | Shukrullah Nigeria Ltd
            </p>
          </div>
        </section>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
