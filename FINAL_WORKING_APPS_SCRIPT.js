// FINAL WORKING Google Apps Script for Shukrullah Sales
// This is the exact code that will work with your Google Sheet

// Your Google Sheet ID (extracted from your URL)
const SHEET_ID = '114QxBBnkZ24DkJui6llB1rLe4zUSzcM_tOHZppNunOU';
const SHEET_GID = 738639022; // Your specific tab ID

function doGet(e) {
  Logger.log('GET request received');
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'running',
      message: 'Shukrullah Sales API is working perfectly',
      timestamp: new Date().toISOString(),
      version: '4.0',
      sheetId: SHEET_ID,
      sheetGid: SHEET_GID
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  Logger.log('POST request received');
  
  try {
    // Check if we have post data
    if (!e.postData || !e.postData.contents) {
      Logger.log('No post data received');
      return createResponse({
        success: false,
        error: 'No data received in POST request'
      });
    }
    
    Logger.log('Raw post data: ' + e.postData.contents);
    
    // Parse the JSON data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
      Logger.log('Parsed data: ' + JSON.stringify(data));
    } catch (parseError) {
      Logger.log('JSON parse error: ' + parseError.toString());
      return createResponse({
        success: false,
        error: 'Invalid JSON data: ' + parseError.toString()
      });
    }
    
    // Handle the addSale action
    if (data.action === 'addSale') {
      return handleAddSale(data.data);
    } else {
      Logger.log('Unknown action: ' + data.action);
      return createResponse({
        success: false,
        error: 'Unknown action: ' + data.action
      });
    }
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse({
      success: false,
      error: 'Server error: ' + error.toString()
    });
  }
}

function handleAddSale(saleData) {
  Logger.log('=== HANDLING ADD SALE ===');
  Logger.log('Sale data received: ' + JSON.stringify(saleData));
  
  try {
    // Open the spreadsheet and get the specific sheet
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      Logger.log('✅ Spreadsheet opened successfully');
    } catch (spreadsheetError) {
      Logger.log('❌ Error opening spreadsheet: ' + spreadsheetError.toString());
      return createResponse({
        success: false,
        error: 'Cannot access Google Sheet. Check Sheet ID and permissions: ' + spreadsheetError.toString()
      });
    }
    
    // Get the specific sheet by GID
    let sheet;
    try {
      const sheets = spreadsheet.getSheets();
      sheet = sheets.find(s => s.getSheetId() === SHEET_GID);
      
      if (!sheet) {
        // If specific sheet not found, use the first sheet
        sheet = spreadsheet.getActiveSheet();
        Logger.log('⚠️ Specific sheet not found, using active sheet: ' + sheet.getName());
      } else {
        Logger.log('✅ Found target sheet: ' + sheet.getName());
      }
    } catch (sheetError) {
      Logger.log('❌ Error accessing sheet: ' + sheetError.toString());
      return createResponse({
        success: false,
        error: 'Cannot access sheet: ' + sheetError.toString()
      });
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
    
    Logger.log('Row data prepared: ' + JSON.stringify(rowData));
    
    // Add the row to the sheet
    try {
      sheet.appendRow(rowData);
      Logger.log('✅ Row added successfully to sheet');
      
      // Get the row number that was just added
      const lastRow = sheet.getLastRow();
      Logger.log('✅ Sale added to row: ' + lastRow);
      
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
      rowNumber: sheet.getLastRow()
    });
    
  } catch (error) {
    Logger.log('❌ Error in handleAddSale: ' + error.toString());
    return createResponse({
      success: false,
      error: 'Failed to process sale: ' + error.toString()
    });
  }
}

function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function - run this manually to test your setup
function testSetup() {
  Logger.log('=== TESTING SETUP ===');
  
  try {
    // Test 1: Check if we can open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    Logger.log('✅ Spreadsheet accessible: ' + spreadsheet.getName());
    
    // Test 2: Check if we can access the specific sheet
    const sheets = spreadsheet.getSheets();
    const targetSheet = sheets.find(s => s.getSheetId() === SHEET_GID);
    
    if (targetSheet) {
      Logger.log('✅ Target sheet found: ' + targetSheet.getName());
    } else {
      Logger.log('⚠️ Target sheet not found, available sheets:');
      sheets.forEach(sheet => {
        Logger.log('  - ' + sheet.getName() + ' (ID: ' + sheet.getSheetId() + ')');
      });
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

// Function to check and display sheet information
function checkSheetInfo() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    Logger.log('Spreadsheet: ' + spreadsheet.getName());
    Logger.log('URL: ' + spreadsheet.getUrl());
    
    const sheets = spreadsheet.getSheets();
    Logger.log('Available sheets:');
    
    sheets.forEach((sheet, index) => {
      Logger.log(`${index + 1}. ${sheet.getName()} (ID: ${sheet.getSheetId()})`);
      
      if (sheet.getSheetId() === SHEET_GID) {
        Logger.log('   ⭐ This is our target sheet!');
        
        // Check headers
        const headers = sheet.getRange(1, 1, 1, 15).getValues()[0];
        Logger.log('   Headers: ' + JSON.stringify(headers));
        
        const expectedHeaders = [
          'id', 'saleDate', 'salesPerson', 'customerName', 'customerPhone',
          'items', 'subtotal', 'logisticsCost', 'total', 'paymentMethod',
          'deliveryOption', 'deliveryLocation', 'customerAddress', 'status', 'createdAt'
        ];
        
        const headersMatch = expectedHeaders.every((header, index) => 
          headers[index] && headers[index].toString().toLowerCase() === header.toLowerCase()
        );
        
        if (headersMatch) {
          Logger.log('   ✅ Headers match perfectly');
        } else {
          Logger.log('   ❌ Headers do not match expected format');
          Logger.log('   Expected: ' + JSON.stringify(expectedHeaders));
          Logger.log('   Found: ' + JSON.stringify(headers));
        }
      }
    });
    
  } catch (error) {
    Logger.log('Error checking sheet info: ' + error.toString());
  }
}
