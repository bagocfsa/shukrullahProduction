import React, { useState } from 'react';
import {
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const GoogleSheetsSetup: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const columnHeaders = "id\tsaleDate\tsalesPerson\tcustomerName\tcustomerPhone\titems\tsubtotal\tlogisticsCost\ttotal\tpaymentMethod\tdeliveryOption\tdeliveryLocation\tcustomerAddress\tstatus\tcreatedAt";
  
  const sampleData = `SALE-1691234567890\t2024-08-10T14:30:00.000Z\tAdmin User\tJohn Doe\t08012345678\t[{"productId":"1","productName":"Kuli-kuli 1Kg","quantity":1,"unitPrice":4000,"totalPrice":4000}]\t4000\t0\t4000\tcash\tpickup\t\t\tcompleted\t2024-08-10T14:30:00.000Z`;

  const appsScriptCode = `// Shukrullah Sales API - Google Apps Script
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
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function addSaleToSheet(saleData) {
  try {
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your Sheet ID
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    const rowData = [
      saleData.id || '', saleData.saleDate || '', saleData.salesPerson || '',
      saleData.customerName || '', saleData.customerPhone || '', saleData.items || '[]',
      saleData.subtotal || 0, saleData.logisticsCost || 0, saleData.total || 0,
      saleData.paymentMethod || '', saleData.deliveryOption || 'pickup',
      saleData.deliveryLocation || '', saleData.customerAddress || '',
      saleData.status || 'completed', saleData.createdAt || new Date().toISOString()
    ];
    
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
  return ContentService.createTextOutput('Shukrullah Sales API is running');
}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Sheets Sales Setup</h1>
        <p className="text-gray-600">Complete guide to set up Google Sheets integration for sales records</p>
      </div>

      {/* Step 1: Create Google Sheet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</div>
          <h2 className="text-xl font-semibold">Create Google Sheet</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 mb-2">1. Go to Google Sheets and create a new spreadsheet</p>
            <a 
              href="https://sheets.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              Open Google Sheets <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div>
            <p className="text-gray-700 mb-2">2. Name your sheet: <strong>"Shukrullah Sales Records"</strong></p>
          </div>
          
          <div>
            <p className="text-gray-700 mb-2">3. Copy and paste these column headers in Row 1:</p>
            <div className="bg-gray-50 p-3 rounded border">
              <div className="flex justify-between items-center">
                <code className="text-sm text-gray-800 break-all">{columnHeaders}</code>
                <button
                  onClick={() => copyToClipboard(columnHeaders, 'headers')}
                  className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                >
                  {copiedStep === 'headers' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-gray-700 mb-2">4. Add this sample data in Row 2 for testing:</p>
            <div className="bg-gray-50 p-3 rounded border">
              <div className="flex justify-between items-center">
                <code className="text-xs text-gray-800 break-all">{sampleData}</code>
                <button
                  onClick={() => copyToClipboard(sampleData, 'sample')}
                  className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                >
                  {copiedStep === 'sample' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Publish Sheet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">2</div>
          <h2 className="text-xl font-semibold">Publish Sheet for Reading</h2>
        </div>
        
        <div className="space-y-3">
          <p className="text-gray-700">1. In your Google Sheet: <strong>File → Share → Publish to web</strong></p>
          <p className="text-gray-700">2. Select: <strong>Entire Document</strong> and <strong>CSV</strong> format</p>
          <p className="text-gray-700">3. Check: <strong>"Automatically republish when changes are made"</strong></p>
          <p className="text-gray-700">4. Click <strong>"Publish"</strong> and copy the CSV URL</p>
          <p className="text-gray-700">5. Update the URL in <code>src/services/googleSheetsSales.ts</code></p>
        </div>
      </div>

      {/* Step 3: Create Apps Script */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">3</div>
          <h2 className="text-xl font-semibold">Create Google Apps Script</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 mb-2">1. Go to Google Apps Script and create a new project</p>
            <a 
              href="https://script.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              Open Google Apps Script <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div>
            <p className="text-gray-700 mb-2">2. Replace the default code with this:</p>
            <div className="bg-gray-50 p-3 rounded border max-h-64 overflow-y-auto">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-700">Apps Script Code:</span>
                <button
                  onClick={() => copyToClipboard(appsScriptCode, 'script')}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  {copiedStep === 'script' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <pre className="text-xs text-gray-800 whitespace-pre-wrap">{appsScriptCode}</pre>
            </div>
          </div>
          
          <div>
            <p className="text-gray-700">3. Replace <code>YOUR_GOOGLE_SHEET_ID_HERE</code> with your actual Sheet ID</p>
            <p className="text-gray-700">4. Deploy as Web App with "Anyone" access</p>
            <p className="text-gray-700">5. Copy the Web App URL and update it in <code>src/services/googleSheetsSales.ts</code></p>
          </div>
        </div>
      </div>

      {/* Step 4: Access Control */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">4</div>
          <h2 className="text-xl font-semibold">Set Up Access Control</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">👁️ All Users (View Only)</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Can view sales history</li>
              <li>• Can see real-time statistics</li>
              <li>• Can print receipts</li>
              <li>• Cannot edit or delete records</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">🔓 Admin Only (Full Access)</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Can record new sales</li>
              <li>• Can edit records in Google Sheets</li>
              <li>• Can delete/modify sales data</li>
              <li>• Full system configuration access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Configuration Status */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-800">Configuration Required</h3>
        </div>
        
        <div className="text-yellow-700 space-y-2">
          <p>After completing the setup above, you need to update these files:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code>src/services/googleSheetsSales.ts</code> - Add your CSV URL and Apps Script URL</li>
            <li>Test the integration using the Sales Configuration page</li>
            <li>Verify that sales are being saved to your Google Sheet</li>
          </ul>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <a
            href="/admin/sales-config"
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center"
          >
            <CogIcon className="h-5 w-5 mr-2" />
            Go to Sales Configuration
          </a>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsSetup;
