import PaystackPop from '@paystack/inline-js';

// Paystack configuration
const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key_here';

export interface PaymentData {
  email: string;
  amount: number; // Amount in kobo (multiply by 100)
  currency?: string;
  reference?: string;
  callback_url?: string;
  metadata?: {
    orderId?: string;
    customerName?: string;
    customerPhone?: string;
    items?: any[];
    [key: string]: any;
  };
}

export interface PaymentResponse {
  status: 'success' | 'failed' | 'cancelled';
  reference: string;
  message?: string;
  transaction?: any;
}

export class PaymentService {
  private static instance: PaymentService;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Initialize Paystack payment
   */
  public async initializePayment(
    paymentData: PaymentData,
    onSuccess: (response: any) => void,
    onCancel: () => void
  ): Promise<void> {
    try {
      const popup = new PaystackPop();
      
      popup.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: paymentData.email,
        amount: paymentData.amount, // Amount in kobo
        currency: paymentData.currency || 'NGN',
        reference: paymentData.reference || this.generateReference(),
        callback_url: paymentData.callback_url,
        metadata: paymentData.metadata || {},
        onSuccess: (transaction: any) => {
          console.log('Payment successful:', transaction);
          onSuccess(transaction);
        },
        onCancel: () => {
          console.log('Payment cancelled');
          onCancel();
        }
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  /**
   * Generate unique payment reference
   */
  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `SHUK_${timestamp}_${random}`;
  }

  /**
   * Verify payment status (you'll need to implement backend verification)
   */
  public async verifyPayment(reference: string): Promise<PaymentResponse> {
    try {
      // In a real application, you would call your backend to verify the payment
      // For now, we'll return a mock response
      console.log('Verifying payment:', reference);
      
      // This should be replaced with actual backend verification
      return {
        status: 'success',
        reference: reference,
        message: 'Payment verified successfully'
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        status: 'failed',
        reference: reference,
        message: 'Payment verification failed'
      };
    }
  }

  /**
   * Format amount to kobo (Paystack uses kobo)
   */
  public static formatAmountToKobo(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Format amount from kobo to naira
   */
  public static formatAmountFromKobo(amount: number): number {
    return amount / 100;
  }

  /**
   * Check if Paystack is properly configured
   */
  public isConfigured(): boolean {
    return PAYSTACK_PUBLIC_KEY !== 'pk_test_your_public_key_here' && 
           PAYSTACK_PUBLIC_KEY.startsWith('pk_');
  }

  /**
   * Get configuration status
   */
  public getConfigurationStatus(): {
    configured: boolean;
    message: string;
    testMode: boolean;
  } {
    const configured = this.isConfigured();
    const testMode = PAYSTACK_PUBLIC_KEY.startsWith('pk_test_');
    
    let message = '';
    if (!configured) {
      message = 'Paystack not configured. Please add your public key to environment variables.';
    } else if (testMode) {
      message = 'Paystack configured in TEST mode. Use test cards for payments.';
    } else {
      message = 'Paystack configured in LIVE mode. Real payments will be processed.';
    }

    return {
      configured,
      message,
      testMode
    };
  }
}

export default PaymentService.getInstance();
