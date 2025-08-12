import React, { useState } from 'react';
import { CreditCardIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import PaymentService, { PaymentData, PaymentService as PaymentServiceClass } from '../services/paymentService';

interface PaymentButtonProps {
  amount: number; // Amount in Naira
  email: string;
  customerName?: string;
  customerPhone?: string;
  orderId?: string;
  items?: any[];
  onSuccess: (transaction: any) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  email,
  customerName,
  customerPhone,
  orderId,
  items,
  onSuccess,
  onCancel,
  onError,
  disabled = false,
  className = '',
  children
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentService = PaymentService;
  const configStatus = paymentService.getConfigurationStatus();

  const handlePayment = async () => {
    if (!email || !amount) {
      onError?.('Email and amount are required for payment');
      return;
    }

    if (!configStatus.configured) {
      onError?.(configStatus.message);
      return;
    }

    setIsProcessing(true);

    try {
      const paymentData: PaymentData = {
        email: email,
        amount: PaymentServiceClass.formatAmountToKobo(amount),
        currency: 'NGN',
        reference: `SHUK_${orderId || Date.now()}_${Math.floor(Math.random() * 1000)}`,
        metadata: {
          orderId: orderId,
          customerName: customerName,
          customerPhone: customerPhone,
          items: items,
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: customerName || "N/A"
            },
            {
              display_name: "Order ID",
              variable_name: "order_id", 
              value: orderId || "N/A"
            }
          ]
        }
      };

      await paymentService.initializePayment(
        paymentData,
        (transaction) => {
          setIsProcessing(false);
          onSuccess(transaction);
        },
        () => {
          setIsProcessing(false);
          onCancel?.();
        }
      );
    } catch (error) {
      setIsProcessing(false);
      onError?.(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  const defaultClassName = `
    inline-flex items-center justify-center px-6 py-3 border border-transparent 
    text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
    disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
  `;

  if (!configStatus.configured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Payment Not Configured</h3>
            <p className="text-sm text-yellow-700 mt-1">{configStatus.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {configStatus.testMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-4 w-4 text-blue-400 mr-2" />
            <p className="text-sm text-blue-700">
              <strong>Test Mode:</strong> Use test card: 4084084084084081, CVV: 408, Expiry: 12/25
            </p>
          </div>
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        className={className || defaultClassName}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <CreditCardIcon className="h-5 w-5 mr-2" />
            {children || `Pay ₦${amount.toLocaleString()}`}
          </>
        )}
      </button>
    </div>
  );
};

export default PaymentButton;
