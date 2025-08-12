// Invoice Generator Service for Nutrinute Orders
// This service generates and downloads PDF invoices

export interface InvoiceData {
  orderNumber: string;
  invoiceNumber: string;
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
  packagingCost: number;
  packagingType: 'sack' | 'carton';
  total: number;
  orderDate: Date;
  invoiceDate: Date;
  expectedDeliveryDate: Date;
  dueDate?: Date;
  notes?: string;
}

export class InvoiceService {
  private static instance: InvoiceService;

  private constructor() {}

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  // Generate and send invoice via WhatsApp
  public generateInvoice(invoiceData: InvoiceData): void {
    const invoiceHTML = this.generateCompactInvoiceHTML(invoiceData);
    this.sendInvoiceViaWhatsApp(invoiceData, invoiceHTML);
  }

  // Generate compact invoice for WhatsApp sharing
  public generateCompactInvoice(invoiceData: InvoiceData): void {
    const invoiceHTML = this.generateCompactInvoiceHTML(invoiceData);
    this.downloadInvoice(invoiceHTML, invoiceData.invoiceNumber);
  }

  // Generate compact invoice HTML content for WhatsApp sharing
  private generateCompactInvoiceHTML(data: InvoiceData): string {
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
    const formatDate = (date: Date) => date.toLocaleDateString('en-GB');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice ${data.invoiceNumber}</title>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }

        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.3;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 15px;
            background: #fff;
            font-size: 12px;
        }

        .invoice-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f59e0b;
        }

        .company-logo {
            font-size: 20px;
            font-weight: bold;
            color: #f59e0b;
            margin-bottom: 5px;
        }

        .invoice-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 10px 0;
        }

        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 11px;
        }

        .info-box {
            flex: 1;
            margin-right: 10px;
            background: #f9f9f9;
            padding: 8px;
            border-radius: 3px;
        }

        .info-box:last-child {
            margin-right: 0;
        }

        .section-title {
            font-size: 10px;
            font-weight: bold;
            color: #f59e0b;
            margin-bottom: 3px;
            text-transform: uppercase;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 11px;
        }

        .items-table th {
            background: #f59e0b;
            color: white;
            padding: 6px 4px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
        }

        .items-table td {
            padding: 5px 4px;
            border-bottom: 1px solid #eee;
        }

        .items-table .text-right {
            text-align: right;
        }

        .totals-section {
            margin-top: 15px;
            text-align: right;
        }

        .totals-table {
            width: 200px;
            margin-left: auto;
            font-size: 11px;
        }

        .totals-table td {
            padding: 3px 8px;
            border-bottom: 1px solid #eee;
        }

        .totals-table .total-row {
            background: #f59e0b;
            color: white;
            font-weight: bold;
        }

        .delivery-info {
            background: #e3f2fd;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
            font-size: 11px;
        }

        .payment-info {
            background: #f0f8ff;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
            font-size: 11px;
        }

        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 9px;
            color: #666;
        }

        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            background: #4caf50;
            color: white;
            border-radius: 10px;
            font-size: 9px;
            font-weight: bold;
        }

        .delivery-date {
            background: #fff3cd;
            padding: 8px;
            border-radius: 3px;
            margin: 10px 0;
            text-align: center;
            font-weight: bold;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="invoice-header">
        <div class="company-logo">🥜 NUTRINUTE</div>
        <div style="font-size: 10px; color: #666;">Shukrullah Nigeria Ltd - Quality Nigerian Food Products</div>
        <div class="invoice-title">INVOICE</div>
        <div style="font-size: 11px;">
            <strong>Invoice #:</strong> ${data.invoiceNumber} |
            <strong>Order #:</strong> ${data.orderNumber} |
            <span class="status-badge">CONFIRMED</span>
        </div>
    </div>

    <div class="info-section">
        <div class="info-box">
            <div class="section-title">Customer</div>
            <strong>${data.customerName}</strong><br>
            ${data.customerPhone}<br>
            ${formatDate(data.orderDate)}
        </div>
        <div class="info-box">
            <div class="section-title">Delivery</div>
            ${data.deliveryLocation === 'within-minna' ? 'Minna' : 'Outside Minna'}<br>
            ${data.minnaArea ? `${data.minnaArea}<br>` : ''}
            ${data.deliveryAddress.length > 30 ? data.deliveryAddress.substring(0, 30) + '...' : data.deliveryAddress}
        </div>
    </div>

    <div class="delivery-date">
        📅 Expected Delivery: ${formatDate(data.expectedDeliveryDate)}
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 50%">Product</th>
                <th style="width: 15%" class="text-right">Qty</th>
                <th style="width: 20%" class="text-right">Price</th>
                <th style="width: 15%" class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            ${data.items.map(item => `
                <tr>
                    <td>${item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">${formatCurrency(item.price)}</td>
                    <td class="text-right">${formatCurrency(item.total)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="totals-section">
        <table class="totals-table">
            <tr>
                <td>Subtotal:</td>
                <td class="text-right">${formatCurrency(data.subtotal)}</td>
            </tr>
            <tr>
                <td>Delivery:</td>
                <td class="text-right">${formatCurrency(data.deliveryCost)}</td>
            </tr>
            <tr>
                <td>Packaging (${data.packagingType}):</td>
                <td class="text-right">${formatCurrency(data.packagingCost)}</td>
            </tr>
            <tr class="total-row">
                <td><strong>TOTAL:</strong></td>
                <td class="text-right"><strong>${formatCurrency(data.total)}</strong></td>
            </tr>
        </table>
    </div>

    <div class="payment-info">
        <div class="section-title">Payment: ${this.getPaymentMethodName(data.paymentMethod)}</div>
        ${this.getCompactPaymentDetails(data.paymentMethod, data.total, data.customerPhone)}
    </div>

    <div class="footer">
        <p><strong>Nutrinute - Shukrullah Nigeria Ltd</strong></p>
        <p>Phone: +234 XXX XXX XXXX | Email: orders@nutrinute.com</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
    `;
  }

  // Generate full invoice HTML content (original format)
  private generateInvoiceHTML(data: InvoiceData): string {
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
    const formatDate = (date: Date) => date.toLocaleDateString('en-GB');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice ${data.invoiceNumber}</title>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #f59e0b;
        }
        
        .company-info {
            flex: 1;
        }
        
        .company-logo {
            font-size: 28px;
            font-weight: bold;
            color: #f59e0b;
            margin-bottom: 5px;
        }
        
        .company-details {
            font-size: 12px;
            color: #666;
            line-height: 1.3;
        }
        
        .invoice-info {
            text-align: right;
            flex: 1;
        }
        
        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        
        .invoice-details {
            font-size: 14px;
            color: #666;
        }
        
        .customer-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        
        .customer-info, .delivery-info {
            flex: 1;
            margin-right: 20px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #f59e0b;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-box {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #f59e0b;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }
        
        .items-table th {
            background: #f59e0b;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
        }
        
        .items-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #eee;
        }
        
        .items-table tr:nth-child(even) {
            background: #f9f9f9;
        }
        
        .items-table .text-right {
            text-align: right;
        }
        
        .totals-section {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
        }
        
        .totals-table {
            width: 300px;
            font-size: 14px;
        }
        
        .totals-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #eee;
        }
        
        .totals-table .total-row {
            background: #f59e0b;
            color: white;
            font-weight: bold;
            font-size: 16px;
        }
        
        .payment-info {
            margin-top: 30px;
            padding: 20px;
            background: #f0f8ff;
            border-radius: 5px;
            border: 1px solid #e3f2fd;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        
        .print-button {
            background: #f59e0b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin: 20px 0;
        }
        
        .print-button:hover {
            background: #d4924a;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background: #4caf50;
            color: white;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="no-print">
        <button class="print-button" onclick="window.print()">🖨️ Print Invoice</button>
        <button class="print-button" onclick="window.close()" style="background: #666;">✖️ Close</button>
    </div>

    <div class="invoice-header">
        <div class="company-info">
            <div class="company-logo">🥜 NUTRINUTE</div>
            <div class="company-details">
                <strong>Shukrullah Nigeria Ltd</strong><br>
                Quality Nigerian Food Products<br>
                Minna, Niger State, Nigeria<br>
                Phone: +234 XXX XXX XXXX<br>
                Email: orders@nutrinute.com
            </div>
        </div>
        <div class="invoice-info">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-details">
                <strong>Invoice #:</strong> ${data.invoiceNumber}<br>
                <strong>Order #:</strong> ${data.orderNumber}<br>
                <strong>Date:</strong> ${formatDate(data.invoiceDate)}<br>
                <span class="status-badge">CONFIRMED</span>
            </div>
        </div>
    </div>

    <div class="customer-section">
        <div class="customer-info">
            <div class="section-title">Bill To</div>
            <div class="info-box">
                <strong>${data.customerName}</strong><br>
                Phone: ${data.customerPhone}<br>
                ${data.customerEmail ? `Email: ${data.customerEmail}<br>` : ''}
                Order Date: ${formatDate(data.orderDate)}
            </div>
        </div>
        <div class="delivery-info">
            <div class="section-title">Deliver To</div>
            <div class="info-box">
                <strong>Delivery Location:</strong><br>
                ${data.deliveryLocation === 'within-minna' ? 'Within Minna' : 'Outside Minna'}<br>
                ${data.minnaArea ? `Area: ${data.minnaArea}<br>` : ''}
                <strong>Address:</strong><br>
                ${data.deliveryAddress}
            </div>
        </div>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 50%">Product Description</th>
                <th style="width: 15%" class="text-right">Qty</th>
                <th style="width: 20%" class="text-right">Unit Price</th>
                <th style="width: 15%" class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            ${data.items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">${formatCurrency(item.price)}</td>
                    <td class="text-right">${formatCurrency(item.total)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="totals-section">
        <table class="totals-table">
            <tr>
                <td><strong>Subtotal:</strong></td>
                <td class="text-right">${formatCurrency(data.subtotal)}</td>
            </tr>
            <tr>
                <td><strong>Delivery:</strong></td>
                <td class="text-right">${formatCurrency(data.deliveryCost)}</td>
            </tr>
            <tr class="total-row">
                <td><strong>TOTAL:</strong></td>
                <td class="text-right"><strong>${formatCurrency(data.total)}</strong></td>
            </tr>
        </table>
    </div>

    <div class="payment-info">
        <div class="section-title">Payment Information</div>
        <p><strong>Payment Method:</strong> ${this.getPaymentMethodName(data.paymentMethod)}</p>
        ${this.getPaymentDetails(data.paymentMethod, data.total, data.customerPhone)}
    </div>

    ${data.notes ? `
        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px;">
            <div class="section-title">Notes</div>
            <p>${data.notes}</p>
        </div>
    ` : ''}

    <div class="footer">
        <p><strong>Thank you for your business!</strong></p>
        <p>This is a computer-generated invoice. No signature required.</p>
        <p>For any queries regarding this invoice, please contact us at orders@nutrinute.com</p>
        <p style="margin-top: 15px; font-size: 10px;">
            Generated on ${new Date().toLocaleString()} | Nutrinute Invoice System v1.0
        </p>
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

  private getCompactPaymentDetails(method: string, total: number, phone: string): string {
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

    switch (method) {
      case 'bank-transfer':
        return `
          <div style="font-size: 10px;">
            <strong>Access Bank:</strong> 1826076156 (Nutrinute)<br>
            <strong>Amount:</strong> ${formatCurrency(total)}<br>
            <strong>Reference:</strong> ${phone}
          </div>
        `;
      case 'opay':
        return `
          <div style="font-size: 10px;">
            <strong>Amount:</strong> ${formatCurrency(total)}<br>
            Use Opay app or *955# USSD
          </div>
        `;
      case 'paystack':
        return `
          <div style="font-size: 10px;">
            <strong>Amount:</strong> ${formatCurrency(total)}<br>
            <span style="color: #4caf50;">✓ PAID via Card</span>
          </div>
        `;
      default:
        return '';
    }
  }

  private getPaymentDetails(method: string, total: number, phone: string): string {
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
    
    switch (method) {
      case 'bank-transfer':
        return `
          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <p><strong>Bank Transfer Details:</strong></p>
            <table style="width: 100%; font-size: 14px;">
              <tr><td><strong>Bank:</strong></td><td>Access Bank</td></tr>
              <tr><td><strong>Account Number:</strong></td><td>1826076156</td></tr>
              <tr><td><strong>Account Name:</strong></td><td>Nutrinute</td></tr>
              <tr><td><strong>Amount:</strong></td><td>${formatCurrency(total)}</td></tr>
              <tr><td><strong>Reference:</strong></td><td>${phone}</td></tr>
            </table>
            <p style="color: #d32f2f; font-size: 12px; margin-top: 10px;">
              ⚠️ Please use your phone number as transfer reference
            </p>
          </div>
        `;
      case 'opay':
        return `
          <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <p><strong>Opay Payment Details:</strong></p>
            <p>Amount: <strong>${formatCurrency(total)}</strong></p>
            <p>Payment will be processed via Opay platform.</p>
          </div>
        `;
      case 'paystack':
        return `
          <div style="background: #f3e5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <p><strong>Card Payment:</strong> Processed via Paystack</p>
            <p>Amount: <strong>${formatCurrency(total)}</strong></p>
            <p>Status: <span style="color: #4caf50; font-weight: bold;">PAID</span></p>
          </div>
        `;
      default:
        return '';
    }
  }

  // Download invoice as HTML file
  private downloadInvoice(htmlContent: string, invoiceNumber: string): void {
    // Create a new window with the invoice
    const invoiceWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (invoiceWindow) {
      invoiceWindow.document.write(htmlContent);
      invoiceWindow.document.close();
      
      // Focus the new window
      invoiceWindow.focus();
      
      // Optional: Auto-print after a short delay
      setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals
        if (window.confirm('Would you like to print the invoice now?')) {
          invoiceWindow.print();
        }
      }, 1000);
    } else {
      // Fallback: Download as HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoiceNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  }

  // Generate invoice number in format: inv-CustomerName0812-30000
  public generateInvoiceNumber(customerFirstName: string, totalAmount: number): string {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Clean customer name (remove spaces, special characters, keep only letters)
    const cleanName = customerFirstName.replace(/[^a-zA-Z]/g, '');

    // Format: inv-CustomerName0812-30000
    return `inv-${cleanName}${month}${day}-${Math.round(totalAmount)}`;
  }

  // Send invoice via WhatsApp
  private sendInvoiceViaWhatsApp(invoiceData: InvoiceData, invoiceHTML: string): void {
    const whatsappNumber = '2349019286029'; // Your WhatsApp number

    // Create order summary for WhatsApp message
    const orderSummary = this.createOrderSummary(invoiceData);

    // Create WhatsApp message with order summary
    const whatsappMessage = encodeURIComponent(orderSummary);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    // Create the compact invoice for download/sharing
    this.downloadInvoice(invoiceHTML, invoiceData.invoiceNumber);

    // Show notification about WhatsApp sending
    console.log('📱 Sending invoice to WhatsApp:', whatsappNumber);
    console.log('📄 Invoice Number:', invoiceData.invoiceNumber);
    console.log('💰 Total Amount:', invoiceData.total);

    // Open WhatsApp with the message immediately
    window.open(whatsappURL, '_blank');

    // Also provide a backup link in case the first one doesn't work
    setTimeout(() => {
      const backupMessage = `🥜 NUTRINUTE ORDER\n\nInvoice: ${invoiceData.invoiceNumber}\nCustomer: ${invoiceData.customerName}\nTotal: ₦${invoiceData.total.toLocaleString()}\n\nFull details sent separately.`;
      const backupURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(backupMessage)}`;

      // Store backup URL for manual use if needed
      (window as any).nutrinute_backup_whatsapp = backupURL;
      console.log('📱 Backup WhatsApp URL available:', backupURL);
    }, 2000);
  }

  // Create order summary for WhatsApp
  private createOrderSummary(data: InvoiceData): string {
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
    const formatDate = (date: Date) => date.toLocaleDateString('en-GB');

    const itemsList = data.items.map(item =>
      `• ${item.name} x${item.quantity} = ${formatCurrency(item.total)}`
    ).join('\n');

    return `🥜 *NUTRINUTE - NEW ORDER RECEIVED*

📋 *ORDER DETAILS*
Order #: ${data.orderNumber}
Invoice #: *${data.invoiceNumber}*
Date: ${formatDate(data.orderDate)}
Time: ${data.orderDate.toLocaleTimeString()}

👤 *CUSTOMER INFORMATION*
Name: *${data.customerName}*
Phone: *${data.customerPhone}*
${data.customerEmail ? `Email: ${data.customerEmail}` : ''}

🛒 *PRODUCTS ORDERED*
${itemsList}

💰 *PAYMENT SUMMARY*
Subtotal: ${formatCurrency(data.subtotal)}
Delivery: ${formatCurrency(data.deliveryCost)}
Packaging (${data.packagingType}): ${formatCurrency(data.packagingCost)}
*TOTAL AMOUNT: ${formatCurrency(data.total)}*

🚚 *DELIVERY INFORMATION*
Location: ${data.deliveryLocation === 'within-minna' ? 'Within Minna' : 'Outside Minna'}${data.minnaArea ? ` (${data.minnaArea})` : ''}
Address: ${data.deliveryAddress}
📅 *Expected Delivery: ${formatDate(data.expectedDeliveryDate)}*

💳 *PAYMENT METHOD: ${this.getPaymentMethodName(data.paymentMethod)}*
${this.getWhatsAppPaymentInfo(data.paymentMethod, data.total, data.customerPhone)}

📄 *INVOICE ATTACHED*
Invoice Number: *${data.invoiceNumber}*
Download link will be provided separately

⚠️ *ACTION REQUIRED*
1. Verify payment (if bank transfer/Opay)
2. Prepare order for delivery
3. Contact customer to confirm delivery time
4. Update order status

---
🥜 *Shukrullah Nigeria Ltd*
Quality Nigerian Food Products
📞 Customer Service: 09019286029`;
  }

  // Get payment info for WhatsApp message
  private getWhatsAppPaymentInfo(method: string, total: number, phone: string): string {
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

    switch (method) {
      case 'bank-transfer':
        return `
🏦 *Bank Transfer Details:*
Bank: Access Bank
Account: 1826076156
Name: Nutrinute
Amount: ${formatCurrency(total)}
Reference: ${phone}

⚠️ Please send payment confirmation screenshot`;
      case 'opay':
        return `
📱 *Opay Payment:*
Amount: ${formatCurrency(total)}
Use Opay app or dial *955#

⚠️ Please send payment confirmation screenshot`;
      case 'paystack':
        return `
💳 *Card Payment:*
Amount: ${formatCurrency(total)}
✅ Payment completed successfully`;
      default:
        return '';
    }
  }

  // Calculate expected delivery date (4 days from order date)
  public calculateExpectedDeliveryDate(orderDate: Date): Date {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    return deliveryDate;
  }

  // Generate order number
  public generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = String(date.getTime()).slice(-4);

    return `ORD-${year}${month}${day}-${time}`;
  }
}

// Export singleton instance
export const invoiceService = InvoiceService.getInstance();
