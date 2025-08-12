// VERIFIED Apps Script for your URL: AKfycby-yfmNBOm4DPGz0s2XilD6IWJesfSXwgDhamGMjVNhDAa7bT5KghRDbeFQTMSbrD_N_g
// This matches your exact Google Sheet: 114QxBBnkZ24DkJui6llB1rLe4zUSzcM_tOHZppNunOU

const SHEET_ID = '114QxBBnkZ24DkJui6llB1rLe4zUSzcM_tOHZppNunOU';
const SHEET_GID = 738639022;
const SHEET_NAME = 'Sales'; // Target sheet name
const SHEET_NAME = 'SalesSales'; // Target sheet name

function doGet(e) {
  Logger.log('=== GET REQUEST RECEIVED ===');
  Logger.log('Parameters: ' + JSON.stringify(e.parameter));
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'running',
      message: 'Shukrullah Sales API is working perfectly',
      timestamp: new Date().toISOString(),
      version: '5.0',
      sheetId: SHEET_ID,
      sheetGid: SHEET_GID,
      url: 'AKfycby-yfmNBOm4DPGz0s2XilD6IWJesfSXwgDhamGMjVNhDAa7bT5KghRDbeFQTMSbrD_N_g'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  Logger.log('=== POST REQUEST RECEIVED ===');
  Logger.log('Content Type: ' + (e.postData ? e.postData.type : 'undefined'));
  Logger.log('Raw Contents: ' + (e.postData ? e.postData.contents : 'undefined'));
  
  try {
    // Check if we have post data
    if (!e.postData || !e.postData.contents) {
      Logger.log('❌ No post data received');
      return createResponse({
        success: false,
        error: 'No data received in POST request',
        timestamp: new Date().toISOString()
      });
    }
    
    // Parse the JSON data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
      Logger.log('✅ Parsed data successfully: ' + JSON.stringify(data));
    } catch (parseError) {
      Logger.log('❌ JSON parse error: ' + parseError.toString());
      return createResponse({
        success: false,
        error: 'Invalid JSON data: ' + parseError.toString(),
        receivedData: e.postData.contents
      });
    }
    
    // Handle the addSale action
    if (data.action === 'addSale') {
      Logger.log('🎯 Processing addSale action');
      return handleAddSale(data.data);
    } else {
      Logger.log('❌ Unknown action: ' + data.action);
      return createResponse({
        success: false,
        error: 'Unknown action: ' + data.action,
        supportedActions: ['addSale']
      });
    }
    
  } catch (error) {
    Logger.log('❌ Error in doPost: ' + error.toString());
    return createResponse({
      success: false,
      error: 'Server error: ' + error.toString(),
      timestamp: new Date().toISOString()
    });
  }
}

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
      return createResponse({
        success: false,
        error: 'Cannot access Google Sheet: ' + spreadsheetError.toString(),
        sheetId: SHEET_ID
      });
    }
    
    // Get the target sheet
    let sheet;
    try {
      const sheets = spreadsheet.getSheets();
      Logger.log('Available sheets: ' + sheets.map(s => s.getName() + ' (ID: ' + s.getSheetId() + ')').join(', '));

      // First try to find sheet by name "Sales"
      sheet = sheets.find(s => s.getName() === SHEET_NAME);

      if (!sheet) {
        // If "Sales" sheet not found, try by GID
        sheet = sheets.find(s => s.getSheetId() === SHEET_GID);
      }

      if (!sheet) {
        Logger.log('⚠️ Neither "Sales" sheet nor target GID found, using first sheet');
        sheet = sheets[0];
      }

      Logger.log('✅ Using sheet: ' + sheet.getName() + ' (ID: ' + sheet.getSheetId() + ')');
    } catch (sheetError) {
      Logger.log('❌ Cannot access sheet: ' + sheetError.toString());
      return createResponse({
        success: false,
        error: 'Cannot access sheet: ' + sheetError.toString()
      });
    }
    
    // Check if headers exist
    try {
      const headers = sheet.getRange(1, 1, 1, 15).getValues()[0];
      Logger.log('Current headers: ' + JSON.stringify(headers));
      
      // If no headers, add them
      if (!headers[0] || headers[0] === '') {
        const newHeaders = [
          'id', 'saleDate', 'salesPerson', 'customerName', 'customerPhone',
          'items', 'subtotal', 'logisticsCost', 'total', 'paymentMethod',
          'deliveryOption', 'deliveryLocation', 'customerAddress', 'status', 'createdAt'
        ];
        sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
        Logger.log('✅ Headers added to sheet');
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
      
      // Verify the data was added
      const addedData = sheet.getRange(lastRow, 1, 1, rowData.length).getValues()[0];
      Logger.log('✅ Verified data in sheet: ' + JSON.stringify(addedData));
      
    } catch (appendError) {
      Logger.log('❌ Error appending row: ' + appendError.toString());
      return createResponse({
        success: false,
        error: 'Failed to add row to sheet: ' + appendError.toString()
      });
    }
    
    // Return success response
    Logger.log('=== SALE ADDED SUCCESSFULLY ===');
    return createResponse({
      success: true,
      message: 'Sale added successfully to Google Sheets',
      saleId: saleData.id,
      timestamp: new Date().toISOString(),
      sheetName: sheet.getName(),
      rowNumber: sheet.getLastRow(),
      sheetUrl: spreadsheet.getUrl()
    });
    
  } catch (error) {
    Logger.log('❌ Error in handleAddSale: ' + error.toString());
    return createResponse({
      success: false,
      error: 'Failed to process sale: ' + error.toString(),
      timestamp: new Date().toISOString()
    });
  }
}

function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function - run this to verify everything works
function testConnection() {
  Logger.log('=== TESTING CONNECTION ===');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    Logger.log('✅ Spreadsheet accessible: ' + spreadsheet.getName());
    Logger.log('✅ Spreadsheet URL: ' + spreadsheet.getUrl());
    
    const sheets = spreadsheet.getSheets();
    Logger.log('✅ Available sheets: ' + sheets.length);

    sheets.forEach((sheet, index) => {
      Logger.log(`  ${index + 1}. ${sheet.getName()} (ID: ${sheet.getSheetId()})`);
      if (sheet.getName() === SHEET_NAME) {
        Logger.log('    ⭐ This is our target "Sales" sheet!');
      } else if (sheet.getSheetId() === SHEET_GID) {
        Logger.log('    ⭐ This matches our target GID!');
      }
    });
    
    return true;
  } catch (error) {
    Logger.log('❌ Connection test failed: ' + error.toString());
    return false;
  }
}

// Test adding a sale
function testAddSale() {
  Logger.log('=== TESTING ADD SALE ===');
  
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
  
  Logger.log('Test sale data: ' + JSON.stringify(testSale));
  
  const result = handleAddSale(testSale);
  const response = JSON.parse(result.getContent());
  
  Logger.log('Test result: ' + JSON.stringify(response));
  
  if (response.success) {
    Logger.log('✅ Test sale added successfully!');
    Logger.log('✅ Check your Google Sheet for the test data');
    return true;
  } else {
    Logger.log('❌ Test sale failed: ' + response.error);
    return false;
  }
}

// Complete setup verification
function verifySetup() {
  Logger.log('=== COMPLETE SETUP VERIFICATION ===');
  
  Logger.log('1. Testing connection...');
  const connectionOk = testConnection();
  
  if (connectionOk) {
    Logger.log('2. Testing add sale...');
    const addSaleOk = testAddSale();
    
    if (addSaleOk) {
      Logger.log('🎉 SETUP VERIFICATION PASSED!');
      Logger.log('Your Apps Script is ready to receive sales from the React app.');
      return true;
    }
  }
  
  Logger.log('❌ SETUP VERIFICATION FAILED!');
  Logger.log('Check the logs above for specific error details.');
  return false;
}
