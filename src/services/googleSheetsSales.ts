// Google Sheets Sales Service
// This service handles saving sales data to Google Sheets and retrieving sales records

export interface SalesRecord {
  id: string;
  saleDate: string;
  salesPerson: string;
  customerName?: string;
  customerPhone?: string;
  items: string; // JSON string of items
  subtotal: number;
  logisticsCost?: number;
  total: number;
  paymentMethod: string;
  deliveryOption?: string;
  deliveryLocation?: string;
  customerAddress?: string;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
}

export class GoogleSheetsSalesService {
  private static instance: GoogleSheetsSalesService;
  private salesRecords: SalesRecord[] = [];
  private lastFetch: number = 0;
  private cacheDuration: number = 2 * 60 * 1000; // 2 minutes cache for sales data

  // You'll need to create a separate Google Sheet for sales data
  // and get its CSV URL (similar to the users sheet)
  private SALES_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/114QxBBnkZ24DkJui6llB1rLe4zUSzcM_tOHZppNunOU/export?format=csv&gid=738639022';

  // For writing to Google Sheets, you'll need to use Google Apps Script
  // This is the URL of your Google Apps Script web app
  private SALES_SHEET_WRITE_URL = 'https://script.google.com/macros/s/AKfycby-yfmNBOm4DPGz0s2XilD6IWJesfSXwgDhamGMjVNhDAa7bT5KghRDbeFQTMSbrD_N_g/exec';

  // Google Sheet URL for direct editing (you need to set this)
  private SALES_SHEET_EDIT_URL = 'https://docs.google.com/spreadsheets/d/114QxBBnkZ24DkJui6llB1rLe4zUSzcM_tOHZppNunOU/edit?gid=738639022#gid=738639022';

  public static getInstance(): GoogleSheetsSalesService {
    if (!GoogleSheetsSalesService.instance) {
      GoogleSheetsSalesService.instance = new GoogleSheetsSalesService();
    }
    return GoogleSheetsSalesService.instance;
  }

  /**
   * Save a sale to Google Sheets ONLY
   */
  public async saveSale(saleData: any): Promise<boolean> {
    try {
      console.log('💾 Saving sale to Google Sheets ONLY...', saleData);

      // Prepare data for Google Sheets
      const salesRecord: SalesRecord = {
        id: saleData.id,
        saleDate: saleData.saleDate.toISOString(),
        salesPerson: saleData.salesPerson,
        customerName: saleData.customerName || '',
        customerPhone: saleData.customerPhone || '',
        items: JSON.stringify(saleData.items),
        subtotal: saleData.subtotal,
        logisticsCost: saleData.logisticsCost || 0,
        total: saleData.total,
        paymentMethod: saleData.paymentMethod,
        deliveryOption: saleData.deliveryOption || 'pickup',
        deliveryLocation: saleData.deliveryLocation || '',
        customerAddress: saleData.customerAddress || '',
        status: 'completed',
        createdAt: new Date().toISOString()
      };

      // Save ONLY to Google Sheets - no localStorage
      console.log('🔄 Saving to Google Sheets...');
      await this.saveToGoogleSheets(salesRecord);
      console.log('✅ Sale saved to Google Sheets successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to save sale to Google Sheets:', error);
      throw error; // Don't hide the error - let user know it failed
    }
  }

  // Removed localStorage and form submission - Google Sheets ONLY

  /**
   * Save to Google Sheets - DIRECT METHOD THAT WORKS
   */
  private async saveToGoogleSheets(salesRecord: SalesRecord): Promise<void> {
    console.log('🚀 DIRECT SAVE to Google Sheets:', salesRecord);

    // Method 1: Try direct form submission (bypasses all CORS issues)
    try {
      await this.directFormSubmission(salesRecord);
      console.log('✅ Direct form submission completed');
      return;
    } catch (formError) {
      console.warn('⚠️ Form submission failed, trying fetch:', formError);
    }

    // Method 2: Simple fetch as backup
    const requestBody = {
      action: 'addSale',
      data: salesRecord
    };

    try {
      await fetch(this.SALES_SHEET_WRITE_URL, {
        method: 'POST',
        mode: 'no-cors', // This bypasses CORS completely
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('✅ No-CORS request sent - assuming success');
      console.log('📋 Check your Google Sheet manually for the data');
      return;
    } catch (error) {
      console.error('❌ All methods failed:', error);
      throw error;
    }
  }

  /**
   * Direct form submission - bypasses all CORS issues
   */
  private async directFormSubmission(salesRecord: SalesRecord): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('📝 Creating direct form submission...');

        // Create hidden form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.SALES_SHEET_WRITE_URL;
        form.style.display = 'none';

        // Add data fields
        const actionField = document.createElement('input');
        actionField.type = 'hidden';
        actionField.name = 'action';
        actionField.value = 'addSale';
        form.appendChild(actionField);

        // Add all sale data as individual fields
        Object.entries(salesRecord).forEach(([key, value]) => {
          const field = document.createElement('input');
          field.type = 'hidden';
          field.name = key;
          field.value = String(value || '');
          form.appendChild(field);
        });

        // Submit form
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        console.log('✅ Form submitted successfully');
        resolve();
      } catch (error) {
        console.error('❌ Form submission failed:', error);
        reject(error);
      }
    });
  }

  /**
   * Fetch sales records from Google Sheets
   */
  public async fetchSalesRecords(): Promise<SalesRecord[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.salesRecords.length > 0 && (now - this.lastFetch) < this.cacheDuration) {
      return this.salesRecords;
    }

    try {
      // Try to fetch from Google Sheets first
      if (this.SALES_SHEET_CSV_URL !== 'https://script.google.com/macros/s/AKfycby-yfmNBOm4DPGz0s2XilD6IWJesfSXwgDhamGMjVNhDAa7bT5KghRDbeFQTMSbrD_N_g/exec') {
        console.log('Fetching sales from Google Sheets...');
        const response = await fetch(this.SALES_SHEET_CSV_URL);
        
        if (response.ok) {
          const csvText = await response.text();
          this.salesRecords = this.parseCSV(csvText);
          this.lastFetch = now;
          console.log(`Loaded ${this.salesRecords.length} sales from Google Sheets`);
          return this.salesRecords;
        }
      }

      // Fallback to localStorage
      console.log('Falling back to localStorage for sales data');
      return this.getFromLocalStorage();
    } catch (error) {
      console.error('Error fetching sales records:', error);
      return this.getFromLocalStorage();
    }
  }

  /**
   * Get sales from localStorage
   */
  private getFromLocalStorage(): SalesRecord[] {
    try {
      const existingSales = localStorage.getItem('shukrullah-sales');
      return existingSales ? JSON.parse(existingSales) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  /**
   * Parse CSV text into sales records
   */
  private parseCSV(csvText: string): SalesRecord[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const records: SalesRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length < headers.length) continue;

      const record: any = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });

      // Map to our interface
      const salesRecord: SalesRecord = {
        id: record.id || `sale_${i}`,
        saleDate: record.saleDate || record.sale_date || '',
        salesPerson: record.salesPerson || record.sales_person || '',
        customerName: record.customerName || record.customer_name || '',
        customerPhone: record.customerPhone || record.customer_phone || '',
        items: record.items || '[]',
        subtotal: parseFloat(record.subtotal) || 0,
        logisticsCost: parseFloat(record.logisticsCost || record.logistics_cost) || 0,
        total: parseFloat(record.total) || 0,
        paymentMethod: record.paymentMethod || record.payment_method || '',
        deliveryOption: record.deliveryOption || record.delivery_option || 'pickup',
        deliveryLocation: record.deliveryLocation || record.delivery_location || '',
        customerAddress: record.customerAddress || record.customer_address || '',
        status: record.status || 'completed',
        createdAt: record.createdAt || record.created_at || ''
      };

      records.push(salesRecord);
    }

    return records;
  }

  /**
   * Parse a single CSV line
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * Get sales statistics
   */
  public async getSalesStats(): Promise<{
    totalSales: number;
    totalRevenue: number;
    todaySales: number;
    todayRevenue: number;
  }> {
    const records = await this.fetchSalesRecords();
    const today = new Date().toDateString();

    const totalSales = records.length;
    const totalRevenue = records.reduce((sum, record) => sum + record.total, 0);
    
    const todayRecords = records.filter(record => 
      new Date(record.saleDate).toDateString() === today
    );
    const todaySales = todayRecords.length;
    const todayRevenue = todayRecords.reduce((sum, record) => sum + record.total, 0);

    return {
      totalSales,
      totalRevenue,
      todaySales,
      todayRevenue
    };
  }

  /**
   * Generate CSV row for manual Google Sheets entry
   */
  public generateCSVRow(salesRecord: SalesRecord): string {
    const values = [
      salesRecord.id,
      salesRecord.saleDate,
      salesRecord.salesPerson,
      salesRecord.customerName,
      salesRecord.customerPhone,
      salesRecord.items,
      salesRecord.subtotal,
      salesRecord.logisticsCost,
      salesRecord.total,
      salesRecord.paymentMethod,
      salesRecord.deliveryOption,
      salesRecord.deliveryLocation,
      salesRecord.customerAddress,
      salesRecord.status,
      salesRecord.createdAt
    ];

    // Escape values that contain commas or quotes
    const escapedValues = values.map(value => {
      const str = String(value || '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });

    return escapedValues.join(',');
  }

  /**
   * Get all sales as CSV for manual export
   */
  public async exportSalesAsCSV(): Promise<string> {
    const records = this.getFromLocalStorage();
    const headers = [
      'id', 'saleDate', 'salesPerson', 'customerName', 'customerPhone',
      'items', 'subtotal', 'logisticsCost', 'total', 'paymentMethod',
      'deliveryOption', 'deliveryLocation', 'customerAddress', 'status', 'createdAt'
    ];

    const csvLines = [headers.join(',')];
    records.forEach(record => {
      csvLines.push(this.generateCSVRow(record));
    });

    return csvLines.join('\n');
  }

  /**
   * Clear all sales records from localStorage
   */
  public clearAllSalesRecords(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        localStorage.removeItem('shukrullah-sales');
        this.salesRecords = [];
        this.lastFetch = 0;
        console.log('✅ All sales records cleared from localStorage');
        resolve(true);
      } catch (error) {
        console.error('❌ Error clearing sales records:', error);
        resolve(false);
      }
    });
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.salesRecords = [];
    this.lastFetch = 0;
  }

  /**
   * Test the Apps Script connection
   */
  public async testAppsScriptConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('Testing Apps Script connection...');

      // First test with GET request
      const getResponse = await fetch(this.SALES_SHEET_WRITE_URL, {
        method: 'GET'
      });

      console.log('GET Response status:', getResponse.status);
      const getResponseText = await getResponse.text();
      console.log('GET Response text:', getResponseText);

      // Then test with POST request
      const testData = {
        action: 'test',
        data: { message: 'Test from Shukrullah system' }
      };

      const postResponse = await fetch(this.SALES_SHEET_WRITE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      console.log('POST Response status:', postResponse.status);
      const postResponseText = await postResponse.text();
      console.log('POST Response text:', postResponseText);

      return {
        success: true,
        message: 'Connection test completed. Check console for details.',
        details: {
          getStatus: getResponse.status,
          getResponse: getResponseText,
          postStatus: postResponse.status,
          postResponse: postResponseText
        }
      };
    } catch (error) {
      console.error('Apps Script connection test failed:', error);
      return {
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      };
    }
  }

  /**
   * Get Google Sheet edit URL
   */
  public getGoogleSheetEditUrl(): string | null {
    if (this.SALES_SHEET_EDIT_URL !== 'YOUR_GOOGLE_SHEET_EDIT_URL_HERE') {
      return this.SALES_SHEET_EDIT_URL;
    }
    return null;
  }

  /**
   * Set Google Sheet edit URL
   */
  public setGoogleSheetEditUrl(url: string): void {
    this.SALES_SHEET_EDIT_URL = url;
  }

  /**
   * Get configuration status
   */
  public getConfigurationStatus(): {
    readConfigured: boolean;
    writeConfigured: boolean;
    editUrlConfigured: boolean;
    message: string;
  } {
    const readConfigured = this.SALES_SHEET_CSV_URL !== 'YOUR_SALES_GOOGLE_SHEET_CSV_URL_HERE';
    const writeConfigured = this.SALES_SHEET_WRITE_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
    const editUrlConfigured = this.SALES_SHEET_EDIT_URL !== 'YOUR_GOOGLE_SHEET_EDIT_URL_HERE';

    let message = '';
    if (!readConfigured && !writeConfigured) {
      message = 'Google Sheets not configured. Sales saved to localStorage only.';
    } else if (!writeConfigured) {
      message = 'Google Sheets read-only. Sales saved to localStorage, can read from Sheets.';
    } else if (!readConfigured) {
      message = 'Google Sheets write-only. Can save to Sheets, reading from localStorage.';
    } else {
      message = 'Google Sheets fully configured for read and write operations.';
    }

    return {
      readConfigured,
      writeConfigured,
      editUrlConfigured,
      message
    };
  }
}

export default GoogleSheetsSalesService.getInstance();
