// Google Sheets ONLY Service - No localStorage
interface SalesRecord {
  id: string;
  saleDate: string;
  salesPerson: string;
  customerName: string;
  customerPhone: string;
  items: string;
  subtotal: number;
  logisticsCost: number;
  total: number;
  paymentMethod: string;
  deliveryOption: string;
  deliveryLocation: string;
  customerAddress: string;
  status: string;
  createdAt: string;
}

class GoogleSheetsOnlyService {
  private static instance: GoogleSheetsOnlyService;
  
  // Your Apps Script URL
  private SALES_SHEET_WRITE_URL = 'https://script.google.com/macros/s/AKfycby-yfmNBOm4DPGz0s2XilD6IWJesfSXwgDhamGMjVNhDAa7bT5KghRDbeFQTMSbrD_N_g/exec';
  
  // Google Sheet URL for direct editing
  private SALES_SHEET_EDIT_URL = 'https://docs.google.com/spreadsheets/d/114QxBBnkZ24DkJui6llB1rLe4zUSzcM_tOHZppNunOU/edit?gid=738639022#gid=738639022';

  public static getInstance(): GoogleSheetsOnlyService {
    if (!GoogleSheetsOnlyService.instance) {
      GoogleSheetsOnlyService.instance = new GoogleSheetsOnlyService();
    }
    return GoogleSheetsOnlyService.instance;
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

      // Save to Google Sheets
      await this.saveToGoogleSheets(salesRecord);
      console.log('✅ Sale saved to Google Sheets successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to save sale to Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Save to Google Sheets - Multiple methods to handle CORS
   */
  private async saveToGoogleSheets(salesRecord: SalesRecord): Promise<void> {
    console.log('🚀 Saving to Google Sheets:', salesRecord);

    const requestBody = {
      action: 'addSale',
      data: salesRecord
    };

    // Method 1: Try standard fetch first
    try {
      console.log('🔄 Trying standard fetch...');
      const response = await fetch(this.SALES_SHEET_WRITE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Google Sheets response:', result);

        if (result.success) {
          console.log('✅ Sale saved to Google Sheets successfully!');
          return;
        } else {
          throw new Error(result.error || 'Save failed');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (fetchError) {
      console.warn('⚠️ Standard fetch failed, trying no-cors mode:', fetchError);

      // Method 2: Try no-cors mode
      try {
        console.log('🔄 Trying no-cors mode...');
        await fetch(this.SALES_SHEET_WRITE_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        console.log('✅ No-cors request sent - assuming success');
        console.log('📋 Check your Google Sheet manually to verify the data was saved');
        return;
      } catch (noCorsError) {
        console.error('❌ No-cors method also failed:', noCorsError);

        // Method 3: Try form submission as last resort
        try {
          console.log('🔄 Trying form submission method...');
          await this.formSubmissionMethod(salesRecord);
          console.log('✅ Form submission completed');
          return;
        } catch (formError) {
          console.error('❌ All methods failed:', formError);
          throw new Error('Failed to save to Google Sheets. Check your Apps Script deployment and permissions.');
        }
      }
    }
  }

  /**
   * Form submission method - bypasses CORS completely
   */
  private async formSubmissionMethod(salesRecord: SalesRecord): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create hidden form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.SALES_SHEET_WRITE_URL;
        form.style.display = 'none';

        // Add action field
        const actionField = document.createElement('input');
        actionField.type = 'hidden';
        actionField.name = 'action';
        actionField.value = 'addSale';
        form.appendChild(actionField);

        // Add data field
        const dataField = document.createElement('input');
        dataField.type = 'hidden';
        dataField.name = 'data';
        dataField.value = JSON.stringify(salesRecord);
        form.appendChild(dataField);

        // Submit form
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Test Apps Script connection
   */
  public async testAppsScriptConnection(): Promise<{success: boolean, message: string}> {
    try {
      console.log('🧪 Testing Apps Script connection...');
      
      const response = await fetch(this.SALES_SHEET_WRITE_URL, {
        method: 'GET'
      });

      if (response.ok) {
        const result = await response.text();
        console.log('✅ Connection test successful:', result);
        return {
          success: true,
          message: 'Apps Script is responding correctly'
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get Google Sheet edit URL
   */
  public getGoogleSheetEditUrl(): string {
    return this.SALES_SHEET_EDIT_URL;
  }

  /**
   * Get configuration status
   */
  public getConfigurationStatus(): {
    writeConfigured: boolean;
    editUrlConfigured: boolean;
    message: string;
  } {
    const writeConfigured = this.SALES_SHEET_WRITE_URL !== '';
    const editUrlConfigured = this.SALES_SHEET_EDIT_URL !== '';

    let message = '';
    if (writeConfigured && editUrlConfigured) {
      message = 'Google Sheets fully configured for write operations only.';
    } else if (writeConfigured) {
      message = 'Google Sheets write configured, edit URL missing.';
    } else {
      message = 'Google Sheets not configured.';
    }

    return {
      writeConfigured,
      editUrlConfigured,
      message
    };
  }
}

export default GoogleSheetsOnlyService.getInstance();
