// SIMPLE WORKING Apps Script - This WILL work
// Replace ALL your Apps Script code with this

function doGet() {
  return ContentService
    .createTextOutput('Shukrullah Sales API Working')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    // Your exact sheet ID
    const SHEET_ID = '114QxBBnkZ24DkJui6llB1rLe4zUSzcM_tOHZppNunOU';
    
    // Get the data
    const data = JSON.parse(e.postData.contents);
    const saleData = data.data;
    
    // Open your sheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Get the "Sales" sheet or create it
    let sheet;
    try {
      sheet = spreadsheet.getSheetByName('Sales');
    } catch (error) {
      sheet = spreadsheet.getActiveSheet();
      sheet.setName('Sales');
    }
    
    // Add headers if first row is empty
    if (sheet.getRange(1, 1).getValue() === '') {
      sheet.getRange(1, 1, 1, 15).setValues([[
        'id', 'saleDate', 'salesPerson', 'customerName', 'customerPhone',
        'items', 'subtotal', 'logisticsCost', 'total', 'paymentMethod',
        'deliveryOption', 'deliveryLocation', 'customerAddress', 'status', 'createdAt'
      ]]);
    }
    
    // Add the sale data
    const row = [
      saleData.id || '',
      saleData.saleDate || new Date().toISOString(),
      saleData.salesPerson || '',
      saleData.customerName || '',
      saleData.customerPhone || '',
      saleData.items || '[]',
      saleData.subtotal || 0,
      saleData.logisticsCost || 0,
      saleData.total || 0,
      saleData.paymentMethod || '',
      saleData.deliveryOption || 'pickup',
      saleData.deliveryLocation || '',
      saleData.customerAddress || '',
      saleData.status || 'completed',
      saleData.createdAt || new Date().toISOString()
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Sale saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - run this to test
function testSave() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        action: 'addSale',
        data: {
          id: 'TEST-' + Date.now(),
          saleDate: new Date().toISOString(),
          salesPerson: 'Test User',
          customerName: 'Test Customer',
          customerPhone: '08012345678',
          items: JSON.stringify([{productName: 'Test Product', quantity: 1, unitPrice: 1000, totalPrice: 1000}]),
          subtotal: 1000,
          total: 1000,
          paymentMethod: 'cash',
          deliveryOption: 'pickup',
          status: 'completed',
          createdAt: new Date().toISOString()
        }
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
