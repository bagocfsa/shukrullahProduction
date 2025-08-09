import React from "react";
import Header from "../components/Header";
import './KulikuliProduction.css';
import { ProductionReceiptForm } from "./KulikuliProduction";

const PRODUCT_PRICES = {
  kulikuli: {
    'kuli-450': { pack: 450, bag: 90000 },
    'kuli-3200': { pack: 3200, bag: 95000 },
    'kuli-3500': { pack: 3500, bag: 105000 },
  },
  oil: {
    'Oil-1L': { pack: 1200, bag: 1200 },
    'Oil-5L': { pack: 5500, bag: 5500 },
    'Oil-25L': { pack: 25000, bag: 25000 },
  },
};

function ProductIssueReceiptForm() {
  const [issuedTo, setIssuedTo] = React.useState("");
  const [product, setProduct] = React.useState("kulikuli");
  const [productType, setProductType] = React.useState("kuli-450");
  const [unit, setUnit] = React.useState("pack");
  const [quantity, setQuantity] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [preview, setPreview] = React.useState(false);

  React.useEffect(() => {
    const priceObj = PRODUCT_PRICES[product][productType] || { pack: 0, bag: 0 };
    const price = priceObj[unit] || 0;
    const qty = Number(quantity) || 0;
    setAmount(price * qty);
  }, [product, productType, unit, quantity]);

  function handlePreview(e) {
    e.preventDefault();
    setPreview(true);
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    const logoUrl = '/images/NLogo2.png';
    const receiptHTML = `
      <html>
        <head>
          <title>Product Issue Receipt</title>
          <style>
            @media print { @page { margin: 0; size: 58mm auto; } body { margin: 0; } }
            body { font-family: 'Segoe UI', 'Courier New', monospace; font-size: 12px; width: 58mm; padding: 5mm; background: #fff; }
            .receipt-card { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; padding: 10px 8px; background: #fff; position: relative; overflow: hidden; }
            .receipt-logo { width: 38px; height: 38px; object-fit: contain; display: block; margin: 0 auto 4px auto; opacity: 0.7; }
            .header { text-align: center; margin-bottom: 8px; }
            .company-name { font-size: 15px; font-weight: bold; letter-spacing: 1px; }
            .company-info { font-size: 10px; margin: 1px 0; }
            .divider { border: none; border-top: 1px dashed #333; margin: 6px 0; }
            .section { font-size: 11px; line-height: 1.4; margin-bottom: 6px; }
            .section p { margin: 2px 0; }
            .footer { text-align: center; margin-top: 10px; font-size: 10px; border-top: 1px dashed #333; padding-top: 6px; color: #555; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 32px; color: #f3f3f3; opacity: 0.18; pointer-events: none; z-index: 0; font-weight: bold; letter-spacing: 2px; }
            .fade-in { animation: fadeIn 0.7s cubic-bezier(.68,-0.55,.27,1.55); }
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
          </style>
        </head>
        <body>
          <div class="receipt-card fade-in">
            <div class="watermark">RECEIPT</div>
            <img src="${logoUrl}" class="receipt-logo" alt="Logo" />
            <div class="header">
              <div class="company-name">SHUKURULLAH NIG. LTD</div>
              <div class="company-info">Block 390, Talba Estate</div>
              <div class="company-info">Off Bida Road, Minna</div>
              <div class="company-info">Tel: 09019286029</div>
            </div>
            <hr class="divider"/>
            <div class="section">
              <p><strong>Receipt Type:</strong> Product Issue</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Issued To:</strong> ${issuedTo}</p>
              <p><strong>Product:</strong> ${product === 'kulikuli' ? 'Kulikuli' : 'Oil'}</p>
              <p><strong>Product Type:</strong> ${productType}</p>
              <p><strong>Unit:</strong> ${unit.charAt(0).toUpperCase() + unit.slice(1)}</p>
              <p><strong>Quantity:</strong> ${quantity}</p>
              <p><strong>Amount:</strong> ₦${Number(amount).toLocaleString()}</p>
            </div>
            <div class="footer">
              <p>Receipt issued by <strong>Adamu Abubakar</strong></p>
              <p>for the Management</p>
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }

  return (
    <div className="receipt-form-container">
      {!preview ? (
        <form className="receipt-form" onSubmit={handlePreview}>
          <label>Issued To:
            <input value={issuedTo} onChange={e => setIssuedTo(e.target.value)} required />
          </label>
          <label>Product:
            <select value={product} onChange={e => {
              setProduct(e.target.value);
              setProductType(e.target.value === 'kulikuli' ? 'kuli-450' : 'Oil-1L');
            }}>
              <option value="kulikuli">Kulikuli</option>
              <option value="oil">Oil</option>
            </select>
          </label>
          <label>Product Type:
            <select value={productType} onChange={e => setProductType(e.target.value)}>
              {product === 'kulikuli' ? (
                <>
                  <option value="kuli-450">kuli-450</option>
                  <option value="kuli-3200">kuli-3200</option>
                  <option value="kuli-3500">kuli-3500</option>
                </>
              ) : (
                <>
                  <option value="Oil-1L">Oil-1L</option>
                  <option value="Oil-5L">Oil-5L</option>
                  <option value="Oil-25L">Oil-25L</option>
                </>
              )}
            </select>
          </label>
          <label>Unit:
            <select value={unit} onChange={e => setUnit(e.target.value)}>
              <option value="pack">Pack</option>
              <option value="bag">Bag</option>
            </select>
          </label>
          <label>Quantity:
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(e.target.value)} required />
          </label>
          <label>Amount:
            <input value={amount ? `₦${amount.toLocaleString()}` : ""} readOnly />
          </label>
          <div className="receipt-actions">
            <button type="submit">Preview Receipt</button>
          </div>
        </form>
      ) : (
        <div className="receipt-preview fade-in">
          <h3>Product Issue Receipt</h3>
          <div className="receipt-details">
            <p><strong>Issued To:</strong> {issuedTo}</p>
            <p><strong>Product:</strong> {product === 'kulikuli' ? 'Kulikuli' : 'Oil'}</p>
            <p><strong>Product Type:</strong> {productType}</p>
            <p><strong>Unit:</strong> {unit.charAt(0).toUpperCase() + unit.slice(1)}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
            <p><strong>Amount:</strong> ₦{Number(amount).toLocaleString()}</p>
          </div>
          <div className="footer" style={{textAlign:'center',marginTop:'10px',fontSize:'10px',borderTop:'1px dashed #333',paddingTop:'6px',color:'#555'}}>
            <p>Receipt issued by <strong>Adamu Abubakar</strong></p>
            <p>for the Management</p>
          </div>
          <div className="receipt-actions">
            <button onClick={handlePrint}>🖨 Print Receipt</button>
            <button onClick={() => setPreview(false)}>⬅ Edit</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ManageReceiptPage() {
  const [receiptType, setReceiptType] = React.useState("production");
  return (
    <div className="kulikuli-container">
      <Header />
      <h2 className="manage-receipt-header">Manage Receipt</h2>
      <div style={{maxWidth:'420px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'1rem'}}>
          <label htmlFor="receiptType" style={{fontWeight:'bold',marginRight:'1rem'}}>Choose Receipt Type:</label>
          <select id="receiptType" value={receiptType} onChange={e => setReceiptType(e.target.value)}>
            <option value="production">Production Receipt</option>
            <option value="product">Product Issue Receipt</option>
          </select>
        </div>
        <div className="receipt-form-wrapper">
          {receiptType === "production" ? (
            <ProductionReceiptForm type="production" />
          ) : (
            <ProductIssueReceiptForm />
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageReceiptPage;
