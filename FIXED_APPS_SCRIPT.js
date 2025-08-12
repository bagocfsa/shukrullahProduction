// FIXED Google Apps Script for Shukrullah Sales - CORS Compatible
// This version properly handles CORS and preflight requests

function doGet(e) {
  Logger.log('Received GET request');

  // Handle both regular GET and preflight requests
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'running',
      message: 'Shukrullah Sales API is running',
      timestamp: new Date().toISOString(),
      version: '2.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // Log the incoming request for debugging
    Logger.log('Received POST request');
    Logger.log('Content Type: ' + (e.postData ? e.postData.type : 'undefined'));
    Logger.log('Contents: ' + (e.postData ? e.postData.contents : 'undefined'));

    // Handle case where postData might be undefined
    if (!e.postData || !e.postData.contents) {
      Logger.log('No post data received');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'No data received'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Parse the request data
    const data = JSON.parse(e.postData.contents);
    Logger.log('Parsed data: ' + JSON.stringify(data));

    if (data.action === 'addSale') {
      return addSaleToSheet(data.data);
    }

    // Return error for unknown actions
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Unknown action: ' + data.action
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Server error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function addSaleToSheet(saleData) {
  try {
    Logger.log('Adding sale to sheet: ' + JSON.stringify(saleData));
    
    // IMPORTANT: Replace this with your actual Google Sheet ID
    // Get this from your sheet URL: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
    const SHEET_ID = 'YOUR_ACTUAL_GOOGLE_SHEET_ID_HERE';
    
    if (SHEET_ID === 'YOUR_ACTUAL_GOOGLE_SHEET_ID_HERE') {
      throw new Error('Please update the SHEET_ID in the Apps Script code with your actual Google Sheet ID');
    }
    
    // Open the spreadsheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Prepare the row data in the exact order of your column headers
    const rowData = [
      saleData.id || '',
      saleData.saleDate || new Date().toISOString(),
      saleData.salesPerson || '',
      saleData.customerName || '',
      saleData.customerPhone || '',
      saleData.items || '[]',
      parseFloat(saleData.subtotal) || 0,
      parseFloat(saleData.logisticsCost) || 0,
      parseFloat(saleData.total) || 0,
      saleData.paymentMethod || '',
      saleData.deliveryOption || 'pickup',
      saleData.deliveryLocation || '',
      saleData.customerAddress || '',
      saleData.status || 'completed',
      saleData.createdAt || new Date().toISOString()
    ];
    
    Logger.log('Row data to append: ' + JSON.stringify(rowData));
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    Logger.log('Sale added successfully with ID: ' + saleData.id);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Sale added successfully',
        saleId: saleData.id,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in addSaleToSheet: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Failed to add sale: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// doGet function is already defined above

// Test function - you can run this manually to test the setup
function testAddSale() {
  const testSale = {
    id: 'TEST-' + Date.now(),
    saleDate: new Date().toISOString(),
    salesPerson: 'Test User',
    customerName: 'Test Customer',
    customerPhone: '08012345678',
    items: JSON.stringify([{
      productId: '1',
      productName: 'Test Product',
      quantity: 1,
      unitPrice: 1000,
      totalPrice: 1000
    }]),
    subtotal: 1000,
    logisticsCost: 0,
    total: 1000,
    paymentMethod: 'cash',
    deliveryOption: 'pickup',
    deliveryLocation: '',
    customerAddress: '',
    status: 'completed',
    createdAt: new Date().toISOString()
  };
  
  Logger.log('Running test...');
  const result = addSaleToSheet(testSale);
  Logger.log('Test result: ' + result.getContent());
  
  return result;
}

// Function to check if the sheet is properly configured
function checkConfiguration() {
  try {
    const SHEET_ID = 'YOUR_ACTUAL_GOOGLE_SHEET_ID_HERE';
    
    if (SHEET_ID === 'YOUR_ACTUAL_GOOGLE_SHEET_ID_HERE') {
      Logger.log('❌ SHEET_ID not configured');
      return false;
    }
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const headers = sheet.getRange(1, 1, 1, 15).getValues()[0];
    
    Logger.log('✅ Sheet accessible');
    Logger.log('Headers found: ' + JSON.stringify(headers));
    
    const expectedHeaders = [
      'id', 'saleDate', 'salesPerson', 'customerName', 'customerPhone',
      'items', 'subtotal', 'logisticsCost', 'total', 'paymentMethod',
      'deliveryOption', 'deliveryLocation', 'customerAddress', 'status', 'createdAt'
    ];
    
    const headersMatch = expectedHeaders.every((header, index) => 
      headers[index] && headers[index].toString().toLowerCase() === header.toLowerCase()
    );
    
    if (headersMatch) {
      Logger.log('✅ Headers match expected format');
    } else {
      Logger.log('❌ Headers do not match. Expected: ' + JSON.stringify(expectedHeaders));
      Logger.log('❌ Found: ' + JSON.stringify(headers));
    }
    
    return headersMatch;
    
  } catch (error) {
    Logger.log('❌ Configuration check failed: ' + error.toString());
    return false;
  }
}
