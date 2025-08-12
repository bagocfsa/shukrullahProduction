// Email Service for Nutrinute Orders
// This service handles sending order confirmations and notifications

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryLocation: string;
  minnaArea?: string;
  paymentMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  deliveryCost: number;
  total: number;
  orderDate: Date;
  specialInstructions?: string;
}

export class EmailService {
  private static instance: EmailService;
  private businessEmail = 'orders@nutrinute.com'; // Replace with your actual business email

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Generate email content for order confirmation
  private generateOrderEmailContent(orderData: OrderEmailData): string {
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Confirmation - ${orderData.orderNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d4924a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #fff; padding: 20px; border: 1px solid #ddd; }
        .order-details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background: #f59e0b; color: white; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .footer { background: #f9f9f9; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
        .payment-info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .delivery-info { background: #f3e5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🥜 Nutrinute - Order Confirmation</h1>
        <h2>Order #${orderData.orderNumber}</h2>
    </div>
    
    <div class="content">
        <h3>Dear ${orderData.customerName},</h3>
        <p>Thank you for your order! We have received your order and it is being processed.</p>
        
        <div class="order-details">
            <h4>📋 Order Details</h4>
            <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
            <p><strong>Order Date:</strong> ${orderData.orderDate.toLocaleDateString()}</p>
            <p><strong>Customer:</strong> ${orderData.customerName}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
        </div>

        <div class="delivery-info">
            <h4>🚚 Delivery Information</h4>
            <p><strong>Delivery Location:</strong> ${orderData.deliveryLocation === 'within-minna' ? 'Within Minna' : 'Outside Minna'}</p>
            ${orderData.minnaArea ? `<p><strong>Minna Area:</strong> ${orderData.minnaArea}</p>` : ''}
            <p><strong>Address:</strong> ${orderData.deliveryAddress}</p>
            <p><strong>Delivery Cost:</strong> ${formatCurrency(orderData.deliveryCost)}</p>
        </div>

        <div class="payment-info">
            <h4>💳 Payment Information</h4>
            <p><strong>Payment Method:</strong> ${this.getPaymentMethodName(orderData.paymentMethod)}</p>
            ${this.getPaymentInstructions(orderData.paymentMethod, orderData.total, orderData.customerPhone)}
        </div>

        <h4>🛒 Order Items</h4>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${orderData.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.price)}</td>
                        <td>${formatCurrency(item.total)}</td>
                    </tr>
                `).join('')}
                <tr>
                    <td colspan="3"><strong>Subtotal</strong></td>
                    <td><strong>${formatCurrency(orderData.subtotal)}</strong></td>
                </tr>
                <tr>
                    <td colspan="3"><strong>Delivery</strong></td>
                    <td><strong>${formatCurrency(orderData.deliveryCost)}</strong></td>
                </tr>
                <tr class="total-row">
                    <td colspan="3"><strong>TOTAL</strong></td>
                    <td><strong>${formatCurrency(orderData.total)}</strong></td>
                </tr>
            </tbody>
        </table>

        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h4>📞 Next Steps</h4>
            <ul>
                <li>We will contact you within 2 hours to confirm your order</li>
                <li>For bank transfer payments, please send payment confirmation via WhatsApp</li>
                <li>Your order will be prepared and delivered within 24-48 hours</li>
                <li>For any questions, call us at: <strong>+234 XXX XXX XXXX</strong></li>
            </ul>
        </div>
    </div>
    
    <div class="footer">
        <p><strong>Shukrullah Nigeria Ltd</strong></p>
        <p>Quality Nigerian Food Products | Minna, Niger State</p>
        <p>Email: orders@nutrinute.com | Phone: +234 XXX XXX XXXX</p>
        <p>Thank you for choosing Nutrinute!</p>
    </div>
</body>
</html>
    `;
  }

  private getPaymentMethodName(method: string): string {
    switch (method) {
      case 'bank-transfer': return 'Bank Transfer';
      case 'opay': return 'Opay';
      case 'paystack': return 'Paystack (Card Payment)';
      default: return method;
    }
  }

  private getPaymentInstructions(method: string, total: number, phone: string): string {
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
    
    switch (method) {
      case 'bank-transfer':
        return `
          <div style="background: #e3f2fd; padding: 10px; border-radius: 3px; margin-top: 10px;">
            <p><strong>Bank Transfer Details:</strong></p>
            <p>Bank: <strong>Access Bank</strong></p>
            <p>Account Number: <strong>1826076156</strong></p>
            <p>Account Name: <strong>Nutrinute</strong></p>
            <p>Amount: <strong>${formatCurrency(total)}</strong></p>
            <p>Reference: <strong>${phone}</strong></p>
            <p style="color: #d32f2f; font-size: 12px;">⚠️ Please use your phone number as transfer reference and send confirmation via WhatsApp</p>
          </div>
        `;
      case 'opay':
        return `
          <div style="background: #e8f5e8; padding: 10px; border-radius: 3px; margin-top: 10px;">
            <p><strong>Opay Payment:</strong></p>
            <p>Amount: <strong>${formatCurrency(total)}</strong></p>
            <p>You will receive Opay payment details via SMS/WhatsApp shortly.</p>
          </div>
        `;
      case 'paystack':
        return `
          <div style="background: #f3e5f5; padding: 10px; border-radius: 3px; margin-top: 10px;">
            <p><strong>Card Payment:</strong> Payment processed successfully via Paystack</p>
            <p>Amount Paid: <strong>${formatCurrency(total)}</strong></p>
          </div>
        `;
      default:
        return '';
    }
  }

  // Send order email using EmailJS or similar service
  public async sendOrderEmail(orderData: OrderEmailData): Promise<boolean> {
    try {
      // In a real implementation, you would use EmailJS, SendGrid, or similar service
      // For now, we'll simulate the email sending and provide the email content
      
      const emailContent = this.generateOrderEmailContent(orderData);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log the email content for development
      console.log('📧 Order Email Content:', emailContent);
      
      // In production, you would integrate with an email service like:
      // - EmailJS: https://www.emailjs.com/
      // - SendGrid: https://sendgrid.com/
      // - Nodemailer (if you have a backend)
      
      // For now, we'll create a mailto link that opens the user's email client
      this.openEmailClient(orderData);
      
      return true;
    } catch (error) {
      console.error('Failed to send order email:', error);
      return false;
    }
  }

  // Open email client with pre-filled order details
  private openEmailClient(orderData: OrderEmailData): void {
    const subject = `New Order - ${orderData.orderNumber} - ${orderData.customerName}`;
    const body = this.generatePlainTextEmail(orderData);
    
    const mailtoLink = `mailto:${this.businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
  }

  // Generate plain text version for email client
  private generatePlainTextEmail(orderData: OrderEmailData): string {
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
    
    return `
NEW ORDER RECEIVED - ${orderData.orderNumber}

Customer Information:
- Name: ${orderData.customerName}
- Phone: ${orderData.customerPhone}
- Order Date: ${orderData.orderDate.toLocaleString()}

Delivery Information:
- Location: ${orderData.deliveryLocation === 'within-minna' ? 'Within Minna' : 'Outside Minna'}
${orderData.minnaArea ? `- Minna Area: ${orderData.minnaArea}` : ''}
- Address: ${orderData.deliveryAddress}
- Delivery Cost: ${formatCurrency(orderData.deliveryCost)}

Payment Information:
- Method: ${this.getPaymentMethodName(orderData.paymentMethod)}
- Total Amount: ${formatCurrency(orderData.total)}

Order Items:
${orderData.items.map(item => 
  `- ${item.name} x${item.quantity} = ${formatCurrency(item.total)}`
).join('\n')}

Order Summary:
- Subtotal: ${formatCurrency(orderData.subtotal)}
- Delivery: ${formatCurrency(orderData.deliveryCost)}
- TOTAL: ${formatCurrency(orderData.total)}

${orderData.paymentMethod === 'bank-transfer' ? `
BANK TRANSFER DETAILS:
Bank: Access Bank
Account: 1826076156
Name: Nutrinute
Reference: ${orderData.customerPhone}
` : ''}

Please process this order and contact the customer to confirm delivery details.

---
Nutrinute Order System
Shukrullah Nigeria Ltd
    `;
  }

  // Get business email for configuration
  public getBusinessEmail(): string {
    return this.businessEmail;
  }

  // Update business email
  public setBusinessEmail(email: string): void {
    this.businessEmail = email;
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();
