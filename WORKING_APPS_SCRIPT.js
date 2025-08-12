// WORKING Google Apps Script for Shukrullah Sales
// This version is simplified and tested to work with CORS

// IMPORTANT: Replace this with your actual Google Sheet ID
// Get it from your sheet URL: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
const SHEET_ID = '114QxBBnkZ24DkJui6llB1rLe4zUSzcM_tOHZppNunOU';

function doGet(e) {
  Logger.log('GET request received');
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'running',
      message: 'Shukrullah Sales API is working',
      timestamp: new Date().toISOString(),
      version: '3.0'
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
        error: 'No data received'
      });
    }
    
    Logger.log('Post data contents: ' + e.postData.contents);
    
    // Parse the JSON data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      Logger.log('JSON parse error: ' + parseError.toString());
      return createResponse({
        success: false,
        error: 'Invalid JSON data'
      });
    }
    
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
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
  Logger.log('Handling add sale request');
  
  try {
    // Check if SHEET_ID is configured
    if (SHEET_ID === 'YOUR_ACTUAL_GOOGLE_SHEET_ID_HERE') {
      Logger.log('ERROR: SHEET_ID not configured');
      return createResponse({
        success: false,
        error: 'Sheet ID not configured in Apps Script'
      });
    }
    
    // Open the spreadsheet
    let sheet;
    try {
      sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
      Logger.log('Sheet opened successfully');
    } catch (sheetError) {
      Logger.log('Error opening sheet: ' + sheetError.toString());
      return createResponse({
        success: false,
        error: 'Cannot access Google Sheet. Check Sheet ID and permissions.'
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
      Logger.log('Row added successfully');
    } catch (appendError) {
      Logger.log('Error appending row: ' + appendError.toString());
      return createResponse({
        success: false,
        error: 'Failed to add row to sheet: ' + appendError.toString()
      });
    }
    
    // Return success response
    return createResponse({
      success: true,
      message: 'Sale added successfully',
      saleId: saleData.id,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    Logger.log('Error in handleAddSale: ' + error.toString());
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
  
  // Test 1: Check Sheet ID
  if (SHEET_ID === 'YOUR_ACTUAL_GOOGLE_SHEET_ID_HERE') {
    Logger.log('❌ SHEET_ID not configured');
    return false;
  }
  Logger.log('✅ SHEET_ID configured: ' + SHEET_ID);
  
  // Test 2: Try to open sheet
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    Logger.log('✅ Sheet accessible: ' + sheet.getName());
  } catch (error) {
    Logger.log('❌ Cannot access sheet: ' + error.toString());
    return false;
  }
  
  // Test 3: Try to add a test row
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
}

// Function to check column headers
function checkHeaders() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const headers = sheet.getRange(1, 1, 1, 15).getValues()[0];
    
    Logger.log('Current headers: ' + JSON.stringify(headers));
    
    const expectedHeaders = [
      'id', 'saleDate', 'salesPerson', 'customerName', 'customerPhone',
      'items', 'subtotal', 'logisticsCost', 'total', 'paymentMethod',
      'deliveryOption', 'deliveryLocation', 'customerAddress', 'status', 'createdAt'
    ];
    
    Logger.log('Expected headers: ' + JSON.stringify(expectedHeaders));
    
    const headersMatch = expectedHeaders.every((header, index) => 
      headers[index] && headers[index].toString().toLowerCase() === header.toLowerCase()
    );
    
    if (headersMatch) {
      Logger.log('✅ Headers match perfectly');
    } else {
      Logger.log('❌ Headers do not match');
      Logger.log('Please ensure your sheet has these exact headers in row 1:');
      Logger.log(expectedHeaders.join('\t'));
    }
    
    return headersMatch;
  } catch (error) {
    Logger.log('❌ Error checking headers: ' + error.toString());
    return false;
  }
}
