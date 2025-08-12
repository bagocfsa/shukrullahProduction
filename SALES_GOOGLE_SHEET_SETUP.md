# 📊 Shukrullah Sales Records - Google Sheets Setup

## 🎯 Overview
This guide will help you create a Google Sheet for sales records with proper access controls:
- **All users** can view sales history
- **Only admin** can edit/delete sales records
- **Automatic saving** of every sale to Google Sheets
- **Real-time data** synchronization

## 📋 Step 1: Create the Sales Google Sheet

### 1.1 Create New Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ Blank"** to create new sheet
3. **Rename** the sheet to: **"Shukrullah Sales Records"**

### 1.2 Set Up Column Headers
In **Row 1**, add these exact headers (copy and paste):

```
id	saleDate	salesPerson	customerName	customerPhone	items	subtotal	logisticsCost	total	paymentMethod	deliveryOption	deliveryLocation	customerAddress	status	createdAt
```

**Column Details:**
- **A**: `id` - Unique sale ID
- **B**: `saleDate` - Date and time of sale
- **C**: `salesPerson` - Name of person who made the sale
- **D**: `customerName` - Customer name (optional)
- **E**: `customerPhone` - Customer phone (optional)
- **F**: `items` - JSON array of purchased items
- **G**: `subtotal` - Subtotal amount
- **H**: `logisticsCost` - Delivery cost (if applicable)
- **I**: `total` - Total amount paid
- **J**: `paymentMethod` - cash, card, transfer, pos
- **K**: `deliveryOption` - pickup or delivery
- **L**: `deliveryLocation` - Delivery location (if delivery)
- **M**: `customerAddress` - Customer address (if delivery)
- **N**: `status` - completed, pending, cancelled
- **O**: `createdAt` - Record creation timestamp

### 1.3 Add Sample Data
In **Row 2**, add this sample data for testing:

```
SALE-1691234567890	2024-08-10T14:30:00.000Z	Admin User	John Doe	08012345678	[{"productId":"1","productName":"Kuli-kuli 1Kg","quantity":1,"unitPrice":4000,"totalPrice":4000}]	4000	0	4000	cash	pickup			completed	2024-08-10T14:30:00.000Z
```

## 🔐 Step 2: Set Up Access Controls

### 2.1 Share Settings for Reading (All Users)
1. Click **"Share"** button (top right)
2. Click **"Change to anyone with the link"**
3. Set permission to **"Viewer"**
4. Click **"Copy link"** - this is your **READ URL**

### 2.2 Share Settings for Writing (Admin Only)
1. Click **"Share"** button again
2. Add your admin email address
3. Set permission to **"Editor"**
4. Click **"Send"**

### 2.3 Publish for CSV Reading
1. **File** → **Share** → **Publish to web**
2. **Sheet**: Select your sales sheet
3. **Format**: CSV
4. Check **"Automatically republish when changes are made"**
5. Click **"Publish"**
6. **Copy the CSV URL** - this ends with `?output=csv`

## ⚙️ Step 3: Configure Your Application

### 3.1 Update Sales Service
In `src/services/googleSheetsSales.ts`, replace the URL:

```typescript
// Replace this line:
private SALES_SHEET_CSV_URL = 'YOUR_SALES_GOOGLE_SHEET_CSV_URL_HERE';

// With your actual CSV URL:
private SALES_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQaONZmV5tBSRUhpEfgqKaGatSax_lUnH4gyQpwAAnMs9Kka9p6BF_U9s5oLxcZR6kn9cPaTNXkkr9C/pub?output=csv';
```

## 🔧 Step 4: Create Google Apps Script for Writing

### 4.1 Create Apps Script Project
1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New Project"**
3. **Rename** to: **"Shukrullah Sales API"**

### 4.2 Apps Script Code
Replace the default code with this:

```javascript
// Shukrullah Sales API - Google Apps Script
// This script handles writing sales data to Google Sheets

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'addSale') {
      return addSaleToSheet(data.data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Unknown action'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function addSaleToSheet(saleData) {
  try {
    // Replace with your actual Google Sheet ID
    // Get this from your sheet URL: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Prepare row data matching the column headers
    const rowData = [
      saleData.id || '',
      saleData.saleDate || '',
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

    // Add the row to the sheet
    sheet.appendRow(rowData);

    Logger.log('Sale added successfully: ' + saleData.id);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Sale added successfully',
        saleId: saleData.id
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in addSaleToSheet: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Shukrullah Sales API is running. Version 1.0')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Test function - you can run this to test the setup
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
    total: 1000,
    paymentMethod: 'cash',
    deliveryOption: 'pickup',
    status: 'completed',
    createdAt: new Date().toISOString()
  };

  const result = addSaleToSheet(testSale);
  Logger.log('Test result: ' + result.getContent());
}
```

### 4.3 Update Sheet ID
1. Copy your Google Sheet ID from the URL
2. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID

### 4.4 Deploy Apps Script
1. Click **"Deploy"** → **"New deployment"**
2. **Type**: Web app
3. **Description**: Shukrullah Sales API v1.0
4. **Execute as**: Me (your email)
5. **Who has access**: Anyone
6. Click **"Deploy"**
7. **Copy the Web App URL**

### 4.5 Update Your Application
In `src/services/googleSheetsSales.ts`, replace:

```typescript
// Replace this line:
private SALES_SHEET_WRITE_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

// With your Apps Script URL:
private SALES_SHEET_WRITE_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

## ✅ Step 5: Test the Integration

### 5.1 Test Apps Script
1. In Apps Script, click **"Run"** → **"testAddSale"**
2. Check your Google Sheet for a new test row
3. Check the **"Execution transcript"** for any errors

### 5.2 Test Reading in App
1. Start your React app: `npm start`
2. Go to: `http://localhost:3000/shop/sales-history`
3. Click **"Refresh"** - should load your sample data

### 5.3 Test Writing in App
1. Go to: `http://localhost:3000/shop/record-sale`
2. Add products and complete a sale
3. Check your Google Sheet for the new sale
4. Refresh sales history to see the new data

## 🔒 Step 6: Access Control Implementation

### 6.1 Reading Access (All Users)
- ✅ All users can view sales history
- ✅ Data loads from Google Sheets CSV
- ✅ Real-time updates when sheet changes

### 6.2 Writing Access (Admin Only)
- ✅ Only admin users can record new sales
- ✅ Sales automatically save to Google Sheets
- ✅ Backup to localStorage if Google Sheets fails

### 6.3 Editing Access (Admin Only)
- ✅ Only admin can edit records in Google Sheets directly
- ✅ Other users have view-only access to the sheet
- ✅ Apps Script runs with admin permissions

## 🎉 Success Checklist

- [ ] Google Sheet created with correct headers
- [ ] Sample data added and visible
- [ ] Sheet published to web as CSV
- [ ] Apps Script created and deployed
- [ ] Sheet ID updated in Apps Script
- [ ] URLs updated in React application
- [ ] Test sale recorded successfully
- [ ] Sales history displays Google Sheets data
- [ ] Access controls working (admin can edit, others can view)

## 📱 Usage Instructions

### For All Users:
- **View Sales**: Go to Sales History page
- **See Statistics**: Real-time stats from Google Sheets
- **Print Receipts**: From sales history

### For Admin Only:
- **Record Sales**: Use Record Sale page
- **Edit Records**: Direct access to Google Sheets
- **Manage Data**: Full control over sales records
- **Configure System**: Access to sales configuration page

Your sales data is now fully integrated with Google Sheets with proper access controls! 🎊