declare module '@paystack/inline-js' {
  interface PaystackTransactionData {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    reference?: string;
    callback_url?: string;
    metadata?: any;
    onSuccess: (transaction: any) => void;
    onCancel: () => void;
  }

  interface PaystackTransaction {
    reference: string;
    trans: string;
    status: string;
    message: string;
    transaction: string;
    trxref: string;
    redirecturl: string;
  }

  class PaystackPop {
    constructor();
    newTransaction(data: PaystackTransactionData): void;
  }

  export default PaystackPop;
}
