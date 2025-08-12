# 📊 Google Sheets Sales Integration Setup Guide

This guide will help you set up Google Sheets to automatically save and retrieve sales data from your Shukrullah Nigeria Ltd system.

## 🎯 Overview

The system will:
- **Save every sale** to Google Sheets automatically
- **Display sales history** from Google Sheets
- **Show real-time statistics** from your sales data
- **Provide backup** with localStorage if Google Sheets is unavailable

## 📋 Step 1: Create Sales Google Sheet

### 1.1 Create New Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Shukrullah Sales Records"**

### 1.2 Set Up Column Headers
Add these **exact column headers** in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| id | saleDate | salesPerson | customerName | customerPhone | items | subtotal | logisticsCost | total | paymentMethod | deliveryOption | deliveryLocation | customerAddress | status | createdAt |

### 1.3 Sample Data Row
Add this sample data in Row 2 for testing:

```
SALE-1691234567890 | 2024-08-10T14:30:00.000Z | Admin User | John Doe | 08012345678 | [{"productId":"1","productName":"Kuli-kuli 1Kg","quantity":1,"unitPrice":4000,"totalPrice":4000}] | 4000 | 0 | 4000 | cash | pickup |  |  | completed | 2024-08-10T14:30:00.000Z
```

## 📤 Step 2: Publish Sheet for Reading

### 2.1 Publish to Web
1. **File** → **Share** → **Publish to web**
2. **Select**: Entire Document
3. **Format**: CSV
4. **Click**: Publish
5. **Copy the CSV URL** (ends with `?output=csv`)

### 2.2 Update Your Code
In `src/services/googleSheetsSales.ts`, replace:
```typescript
private SALES_SHEET_CSV_URL = 'YOUR_SALES_GOOGLE_SHEET_CSV_URL_HERE';
```

With your actual CSV URL:
```typescript
private SALES_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv';
```

## 🔧 Step 3: Create Google Apps Script for Writing

### 3.1 Create Apps Script Project
1. Go to [Google Apps Script](https://script.google.com)
2. **New Project**
3. Name it: **"Shukrullah Sales API"**

### 3.2 Apps Script Code
Replace the default code with:

```javascript
function doPost(e) {
  try {
    // Parse the request
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'addSale') {
      return addSaleToSheet(data.data);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Unknown action'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function addSaleToSheet(saleData) {
  try {
    // Replace with your actual Google Sheet ID
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Prepare row data in the same order as headers
    const rowData = [
      saleData.id,
      saleData.saleDate,
      saleData.salesPerson,
      saleData.customerName || '',
      saleData.customerPhone || '',
      saleData.items, // Already JSON string
      saleData.subtotal,
      saleData.logisticsCost || 0,
      saleData.total,
      saleData.paymentMethod,
      saleData.deliveryOption || 'pickup',
      saleData.deliveryLocation || '',
      saleData.customerAddress || '',
      saleData.status,
      saleData.createdAt
    ];
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Sale added successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Shukrullah Sales API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### 3.3 Deploy Apps Script
1. **Click**: Deploy → New Deployment
2. **Type**: Web app
3. **Execute as**: Me
4. **Who has access**: Anyone
5. **Click**: Deploy
6. **Copy the Web App URL**

### 3.4 Update Your Code
In `src/services/googleSheetsSales.ts`, replace:
```typescript
private SALES_SHEET_WRITE_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```

With your Apps Script URL:
```typescript
private SALES_SHEET_WRITE_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

## 🔑 Step 4: Get Your Google Sheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit#gid=0
```

The Sheet ID is: `1ABC123DEF456GHI789JKL`

Update this in your Apps Script code where it says `YOUR_GOOGLE_SHEET_ID_HERE`.

## ✅ Step 5: Test the Integration

### 5.1 Test Reading
1. Start your React app: `npm start`
2. Go to: `http://localhost:3000/shop/sales-history`
3. Click **Refresh** button
4. Check if sample data loads

### 5.2 Test Writing
1. Go to: `http://localhost:3000/shop/record-sale`
2. Add some products and complete a sale
3. Check your Google Sheet for the new row
4. Refresh sales history to see the new sale

## 🔍 Troubleshooting

### Common Issues:

1. **"Google Sheets not configured"**
   - Check that CSV URL is correctly set
   - Ensure sheet is published to web

2. **"Failed to save to Google Sheets"**
   - Verify Apps Script is deployed as web app
   - Check that "Anyone" has access to the web app
   - Ensure Sheet ID is correct in Apps Script

3. **"No data showing"**
   - Check browser console for errors
   - Verify CSV URL is accessible
   - Ensure column headers match exactly

### Debug Steps:
1. Open browser console (F12)
2. Look for error messages
3. Test CSV URL directly in browser
4. Test Apps Script URL in browser (should show "API is running")

## 🎉 Success!

Once configured, your system will:
- ✅ Automatically save every sale to Google Sheets
- ✅ Display real-time sales data from Google Sheets
- ✅ Show accurate statistics and reports
- ✅ Provide backup with localStorage
- ✅ Allow you to manage sales data directly in Google Sheets

## 📱 Mobile Access

Your sales data will be accessible from:
- **Google Sheets mobile app**
- **Any web browser**
- **Your React application**
- **Google Sheets sharing features**

This gives you complete control and access to your sales data anywhere, anytime!
