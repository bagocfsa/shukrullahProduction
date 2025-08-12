// COMPLETE WORKING Google Apps Script for Shukrullah Sales
// Replace ALL your Apps Script code with this

// Your Google Sheet ID (from your URL)
const SHEET_ID = '114QxBBnkZ24DkJui6llB1rLe4zUSzcM_tOHZppNunOU';
const SHEET_NAME = 'Sales'; // Target sheet name

/**
 * Entry point for GET requests — simple health check
 */
function doGet(e) {
  Logger.log('GET request received');
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'running',
      message: 'Shukrullah Sales API is working',
      timestamp: new Date().toISOString(),
      version: '6.0',
      sheetId: SHEET_ID,
      sheetName: SHEET_NAME
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Entry point for POST requests — handle sale data
 */
function doPost(e) {
  Logger.log('=== POST REQUEST RECEIVED ===');
  Logger.log('Request parameters: ' + JSON.stringify(e.parameter));
  Logger.log('Post data type: ' + (e.postData ? e.postData.type : 'undefined'));

  try {
    let data;

    // Handle form submission (from form method)
    if (e.parameter && e.parameter.action) {
      Logger.log('📝 Form submission detected');
      data = {
        action: e.parameter.action,
        data: e.parameter.data ? JSON.parse(e.parameter.data) : e.parameter
      };
      Logger.log('✅ Form data parsed successfully');
    }
    // Handle JSON submission (from fetch method)
    else if (e.postData && e.postData.contents) {
      Logger.log('📡 JSON submission detected');
      Logger.log('Raw post data: ' + e.postData.contents);

      try {
        data = JSON.parse(e.postData.contents);
        Logger.log('✅ JSON data parsed successfully');
      } catch (parseError) {
        Logger.log('❌ JSON parse error: ' + parseError.toString());
        return createJsonResponse({
          success: false,
          error: 'Invalid JSON data: ' + parseError.toString()
        });
      }
    }
    // No data received
    else {
      Logger.log('❌ No post data received');
      return createJsonResponse({
        success: false,
        error: 'No data received in POST request'
      });
    }

    // Handle the addSale action
    if (data.action === 'addSale') {
      Logger.log('🎯 Processing addSale action');
      return handleAddSale(data.data);
    } else {
      Logger.log('❌ Unknown action: ' + data.action);
      return createJsonResponse({
        success: false,
        error: 'Unknown action: ' + data.action
      });
    }

  } catch (error) {
    Logger.log('❌ Error in doPost: ' + error.toString());
    return createJsonResponse({
      success: false,
      error: 'Server error: ' + error.toString()
    });
  }
}

/**
 * Handle adding a sale to the Google Sheet
 */
function handleAddSale(saleData) {
  Logger.log('=== HANDLING ADD SALE ===');
  Logger.log('Sale data: ' + JSON.stringify(saleData));
  
  try {
    // Open the spreadsheet
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      Logger.log('✅ Spreadsheet opened: ' + spreadsheet.getName());
    } catch (spreadsheetError) {
      Logger.log('❌ Cannot open spreadsheet: ' + spreadsheetError.toString());
      return createJsonResponse({
        success: false,
        error: 'Cannot access Google Sheet: ' + spreadsheetError.toString()
      });
    }
    
    // Get or create the Sales sheet
    let sheet;
    try {
      sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) {
        Logger.log('⚠️ Sales sheet not found, creating it...');
        sheet = spreadsheet.insertSheet(SHEET_NAME);
        
        // Add headers to new sheet
        const headers = [
          'id', 'saleDate', 'salesPerson', 'customerName', 'customerPhone',
          'items', 'subtotal', 'logisticsCost', 'total', 'paymentMethod',
          'deliveryOption', 'deliveryLocation', 'customerAddress', 'status', 'createdAt'
        ];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        Logger.log('✅ Headers added to new Sales sheet');
      }
      
      Logger.log('✅ Using sheet: ' + sheet.getName());
    } catch (sheetError) {
      Logger.log('❌ Cannot access sheet: ' + sheetError.toString());
      return createJsonResponse({
        success: false,
        error: 'Cannot access Sales sheet: ' + sheetError.toString()
      });
    }
    
    // Check if headers exist, add them if not
    try {
      const firstRow = sheet.getRange(1, 1, 1, 15).getValues()[0];
      if (!firstRow[0] || firstRow[0] === '') {
        const headers = [
          'id', 'saleDate', 'salesPerson', 'customerName', 'customerPhone',
          'items', 'subtotal', 'logisticsCost', 'total', 'paymentMethod',
          'deliveryOption', 'deliveryLocation', 'customerAddress', 'status', 'createdAt'
        ];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        Logger.log('✅ Headers added to existing sheet');
      }
    } catch (headerError) {
      Logger.log('⚠️ Header check failed: ' + headerError.toString());
    }
    
    // Prepare the data row
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
    
    Logger.log('Row data to add: ' + JSON.stringify(rowData));
    
    // Add the row to the sheet
    try {
      sheet.appendRow(rowData);
      const lastRow = sheet.getLastRow();
      Logger.log('✅ Row added successfully at row: ' + lastRow);
      
    } catch (appendError) {
      Logger.log('❌ Error appending row: ' + appendError.toString());
      return createJsonResponse({
        success: false,
        error: 'Failed to add row to sheet: ' + appendError.toString()
      });
    }
    
    // Return success response
    Logger.log('=== SALE ADDED SUCCESSFULLY ===');
    return createJsonResponse({
      success: true,
      message: 'Sale added successfully to Google Sheets',
      saleId: saleData.id,
      timestamp: new Date().toISOString(),
      sheetName: sheet.getName(),
      rowNumber: sheet.getLastRow()
    });
    
  } catch (error) {
    Logger.log('❌ Error in handleAddSale: ' + error.toString());
    return createJsonResponse({
      success: false,
      error: 'Failed to process sale: ' + error.toString()
    });
  }
}

/**
 * Helper to generate JSON responses with correct MIME type
 */
function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this manually to test your setup
 */
function testSetup() {
  Logger.log('=== TESTING SETUP ===');
  
  try {
    // Test 1: Check if we can open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    Logger.log('✅ Spreadsheet accessible: ' + spreadsheet.getName());
    
    // Test 2: Get or create Sales sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      Logger.log('⚠️ Sales sheet not found, creating it...');
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Add headers
      const headers = [
        'id', 'saleDate', 'salesPerson', 'customerName', 'customerPhone',
        'items', 'subtotal', 'logisticsCost', 'total', 'paymentMethod',
        'deliveryOption', 'deliveryLocation', 'customerAddress', 'status', 'createdAt'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      Logger.log('✅ Sales sheet created with headers');
    } else {
      Logger.log('✅ Sales sheet found: ' + sheet.getName());
    }
    
    // Test 3: Try to add a test sale
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
    
    const result = handleAddSale(testSale);
    const response = JSON.parse(result.getContent());
    
    if (response.success) {
      Logger.log('✅ Test sale added successfully');
      Logger.log('=== SETUP TEST PASSED ===');
      return true;
    } else {
      Logger.log('❌ Test sale failed: ' + response.error);
      Logger.log('=== SETUP TEST FAILED ===');
      return false;
    }
    
  } catch (error) {
    Logger.log('❌ Setup test error: ' + error.toString());
    Logger.log('=== SETUP TEST FAILED ===');
    return false;
  }
}
