
import React, { useState } from "react";
import LabourCostCalculator from "../components/LabourCostCalculator";
import Header from "../components/Header";
import { FaBoxOpen, FaCog, FaFileInvoiceDollar, FaReceipt } from "react-icons/fa";
import ManageProducts from "./ManageProducts";
import Parameter from "../components/Parameter";
import "./KulikuliProduction.css";
import "./KulikuliProduction.print.css";





function ProductionReceiptForm({ type }) {
	const today = new Date().toISOString().slice(0, 10);
	// All hooks at top level
	// Production Receipt fields
	const [dateIssued] = useState(today); // not editable
	const [productionDate, setProductionDate] = useState(today); // editable
	const [name, setName] = useState("");
	const [numBags, setNumBags] = useState("");
	const [bagType, setBagType] = useState("small"); // small: 60 mudus, big: 90 mudus
	const [factoryFees, setFactoryFees] = useState("");
	const [gasRequired, setGasRequired] = useState("");
	const [fuel, setFuel] = useState("");
	// Auto-fill values for every 30 mudus
	React.useEffect(() => {
		let mudus = 0;
		const bags = Number(numBags);
		if (bagType === "small") mudus = bags * 60;
		else if (bagType === "big") mudus = bags * 90;
		if (type === "production" && mudus > 0) {
			const batches = Math.ceil(mudus / 30);
			const gas = batches * 3000;
			const fuelVal = batches * 1000;
			const factory = batches * 1000;
			setGasRequired(gas.toString());
			setFuel(fuelVal.toString());
			setFactoryFees(factory.toString());
			setTotal((gas + fuelVal + factory).toString());
		} else if (type === "production") {
			setGasRequired("");
			setFuel("");
			setFactoryFees("");
			setTotal("");
		}
	}, [numBags, bagType, type]);
	const [total, setTotal] = useState("");
	// Product Receipt fields
	const [batchNo, setBatchNo] = useState("");
	const [date, setDate] = useState(today);
	const [product, setProduct] = useState("");
	const [quantity, setQuantity] = useState("");
	const [issuedTo, setIssuedTo] = useState("");
	// Shared
	const [preview, setPreview] = useState(false);

	function handlePreview(e) {
		e.preventDefault();
		setPreview(true);
	}
	function handlePrint() {
		const printWindow = window.open("", "_blank");
		const isProduction = type === "production";
		const totalMudus = bagType === "small" ? Number(numBags) * 60 : Number(numBags) * 90;
		const logoUrl = '/images/NLogo2.png'; // Use your logo path if available
			const receiptHTML = `
					<html>
						<head>
							<title>${isProduction ? "Production" : "Product Issue"} Receipt</title>
					<style>
						@media print {
							@page { margin: 0; size: 58mm auto; }
							body { margin: 0; }
						}
						body {
							font-family: 'Segoe UI', 'Courier New', monospace;
							font-size: 12px;
							width: 58mm;
							padding: 5mm;
							background: #fff;
						}
						.receipt-card {
							border-radius: 12px;
							box-shadow: 0 2px 12px rgba(0,0,0,0.08);
							border: 1px solid #e5e7eb;
							padding: 10px 8px;
							background: #fff;
							position: relative;
							overflow: hidden;
						}
						.receipt-logo {
							width: 38px;
							height: 38px;
							object-fit: contain;
							display: block;
							margin: 0 auto 4px auto;
							opacity: 0.7;
						}
						.header {
							text-align: center;
							margin-bottom: 8px;
						}
						.company-name {
							font-size: 15px;
							font-weight: bold;
							letter-spacing: 1px;
						}
						.company-info {
							font-size: 10px;
							margin: 1px 0;
						}
						.divider {
							border: none;
							border-top: 1px dashed #333;
							margin: 6px 0;
						}
						.section {
							font-size: 11px;
							line-height: 1.4;
							margin-bottom: 6px;
						}
						.section p {
							margin: 2px 0;
						}
						.footer {
							text-align: center;
							margin-top: 10px;
							font-size: 10px;
							border-top: 1px dashed #333;
							padding-top: 6px;
							color: #555;
						}
						.watermark {
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							font-size: 32px;
							color: #f3f3f3;
							opacity: 0.18;
							pointer-events: none;
							z-index: 0;
							font-weight: bold;
							letter-spacing: 2px;
						}
						.fade-in {
							animation: fadeIn 0.7s cubic-bezier(.68,-0.55,.27,1.55);
						}
						@keyframes fadeIn {
							from { opacity: 0; transform: scale(0.98); }
							to { opacity: 1; transform: scale(1); }
						}
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
										<p><strong>Receipt Type:</strong> ${isProduction ? "Production" : "Product Issue"}</p>
							<p><strong>Date:</strong> ${isProduction ? dateIssued : date}</p>
							${
								isProduction
									? `
								<p><strong>Production Date:</strong> ${productionDate}</p>
								<p><strong>Name:</strong> ${name}</p>
								<p><strong>Bag Type:</strong> ${bagType === "small" ? "Small (60 mudus)" : "Big (90 mudus)"}</p>
								<p><strong>Number of Bags:</strong> ${numBags}</p>
								<p><strong>Approximated number of Mudus:</strong> ${totalMudus}</p>
								<p><strong>Factory Fees:</strong> ₦${Number(factoryFees).toLocaleString()}</p>
								<p><strong>Gas Required:</strong> ₦${Number(gasRequired).toLocaleString()}</p>
								<p><strong>Fuel:</strong> ₦${Number(fuel).toLocaleString()}</p>
								<p><strong>Total Amount Payable:</strong> ₦${Number(total).toLocaleString()}</p>
							`
									: `
								<p><strong>Batch No:</strong> ${batchNo}</p>
								<p><strong>Product:</strong> ${product}</p>
								<p><strong>Quantity:</strong> ${quantity}</p>
								<p><strong>Issued To:</strong> ${issuedTo}</p>
							`
							}
						</div>
						${
							isProduction
								? `
							<div class="footer">
								<p>Processed by <strong>Adamu Abubakar</strong></p>
								<p>For the Management</p>
							</div>
						`
								: ""
						}
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
					{type === "production" ? (
						<>
							<label>Date Issued:<input value={dateIssued} readOnly /></label>
							<label>Production Date:<input type="date" value={productionDate} onChange={e => setProductionDate(e.target.value)} required /></label>
							<label>Name:<input value={name} onChange={e => setName(e.target.value)} required /></label>
							<label>Bag Type:
								<select value={bagType} onChange={e => setBagType(e.target.value)}>
									<option value="small">Small Bag (60 mudus)</option>
									<option value="big">Big Bag (90 mudus)</option>
								</select>
							</label>
							<label>Number of Bags:<input type="number" value={numBags} onChange={e => setNumBags(e.target.value)} min={0} required /></label>
							<label>Factory Fees:<input type="number" value={factoryFees} readOnly /></label>
							<label>Gas Required:<input type="number" value={gasRequired} readOnly /></label>
							<label>Fuel:<input type="number" value={fuel} readOnly /></label>
							<label>Total:<input type="number" value={total} readOnly /></label>
						</>
					) : (
						<>
							<label>Batch No:<input value={batchNo} onChange={e => setBatchNo(e.target.value)} required /></label>
							<label>Date:<input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label>
							<label>Product Name:<input value={product} onChange={e => setProduct(e.target.value)} required /></label>
							<label>Quantity:<input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required /></label>
							<label>Issued To:<input value={issuedTo} onChange={e => setIssuedTo(e.target.value)} required /></label>
						</>
					)}
					<div className="receipt-actions">
						<button type="submit">Preview Receipt</button>
					</div>
				</form>
			) : (
								<div className="receipt-preview fade-in" style={{maxWidth:'340px',margin:'0 auto',borderRadius:'12px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',border:'1px solid #e5e7eb',background:'#fff',padding:'10px 8px',position:'relative',overflow:'hidden'}}>
									<div className="watermark" style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%, -50%)',fontSize:'32px',color:'#f3f3f3',opacity:0.18,pointerEvents:'none',zIndex:0,fontWeight:'bold',letterSpacing:'2px'}}>RECEIPT</div>
									<img src={'/images/NLogo2.png'} alt="Logo" style={{width:'38px',height:'38px',objectFit:'contain',display:'block',margin:'0 auto 4px auto',opacity:0.7}} />
									<div className="header" style={{textAlign:'center',marginBottom:'8px'}}>
										<div className="company-name" style={{fontSize:'15px',fontWeight:'bold',letterSpacing:'1px'}}>SHUKURULLAH NIG. LTD</div>
										<div className="company-info" style={{fontSize:'10px',margin:'1px 0'}}>Block 390, Talba Estate</div>
										<div className="company-info" style={{fontSize:'10px',margin:'1px 0'}}>Off Bida Road, Minna</div>
										<div className="company-info" style={{fontSize:'10px',margin:'1px 0'}}>Tel: 09019286029</div>
									</div>
									<hr className="divider" style={{border:'none',borderTop:'1px dashed #333',margin:'6px 0'}}/>
									<div className="section" style={{fontSize:'11px',lineHeight:'1.4',marginBottom:'6px'}}>
										<p><strong>Receipt Type:</strong> {type === "production" ? "Production" : "Product Issue"}</p>
										<p><strong>Date:</strong> {type === "production" ? dateIssued : date}</p>
										{type === "production" ? (
									<>
										<p><strong>Production Date:</strong> {productionDate}</p>
										<p><strong>Name:</strong> {name}</p>
										<p><strong>Bag Type:</strong> {bagType === "small" ? "Small (60 mudus)" : "Big (90 mudus)"}</p>
										<p><strong>Number of Bags:</strong> {numBags}</p>
										<p><strong>Approximated number of Mudus:</strong> {(() => {
											const bags = Number(numBags);
											return bagType === "small" ? bags * 60 : bags * 90;
										})()}</p>
										<p><strong>Factory Fees:</strong> ₦{Number(factoryFees).toLocaleString()}</p>
										<p><strong>Gas Required:</strong> ₦{Number(gasRequired).toLocaleString()}</p>
										<p><strong>Fuel:</strong> ₦{Number(fuel).toLocaleString()}</p>
										<p><strong>Total Amount Payable:</strong> ₦{Number(total).toLocaleString()}</p>
									</>
								) : (
									<>
										<p><strong>Batch No:</strong> {batchNo}</p>
										<p><strong>Date:</strong> {date}</p>
										<p><strong>Product Name:</strong> {product}</p>
										<p><strong>Quantity:</strong> {quantity}</p>
										<p><strong>Issued To:</strong> {issuedTo}</p>
									</>
								)}
							</div>
							{type === "production" && (
								<div className="footer" style={{textAlign:'center',marginTop:'10px',fontSize:'10px',borderTop:'1px dashed #333',paddingTop:'6px',color:'#555'}}>
									<p>Processed by <strong>Adamu Abubakar</strong></p>
									<p>For the Management</p>
								</div>
							)}
							<div className="receipt-actions" style={{marginTop:'12px',textAlign:'center'}}>
								<button onClick={handlePrint} style={{marginRight:'8px'}}>🖨 Print Receipt</button>
								<button onClick={() => setPreview(false)}>⬅ Edit</button>
							</div>
						</div>
			)}
		</div>
	);
}

function ManageReceipt() {
	const [receiptType, setReceiptType] = useState("production");
	return (
		<div>
			<div style={{ marginBottom: "1rem", textAlign: "center" }}>
				<label htmlFor="receiptType" style={{ fontWeight: "bold", marginRight: "1rem" }}>Choose Receipt Type:</label>
				<select id="receiptType" value={receiptType} onChange={e => setReceiptType(e.target.value)}>
					<option value="production">Production Receipt</option>
					<option value="product">Product Receipt</option>
				</select>
			</div>
			<ProductionReceiptForm type={receiptType} />
		</div>
	);
}

const KulikuliProduction = () => {
	const [view, setView] = useState("dashboard");
	const navigate = require('react-router-dom').useNavigate();
	return (
		<div className="kulikuli-container">
			<Header />
			<h1>Kulikuli Production Dashboard</h1>
			<div className="cards-grid">
				<div className="card-group">
					<div className="card" onClick={() => setView("products")}> <FaBoxOpen className="card-icon" size={40} /> <h3>Manage Products</h3> <p>View, add, and edit products.</p> </div>
					<div className="card" onClick={() => navigate("/manage-receipt")}> <FaReceipt className="card-icon" size={40} /> <h3>Manage Receipt</h3> <p>Issue production/product receipts.</p> </div>
				</div>
				<div className="card-group">
					<div className="card" onClick={() => setView("raw-materials")}> <FaCog className="card-icon" size={40} /> <h3>Manage Raw Materials</h3> <p>Edit raw material prices.</p> </div>
					<div className="card" onClick={() => setView("cost")}> <FaFileInvoiceDollar className="card-icon" size={40} /> <h3>Manage Production Cost</h3> <p>Calculate labour and production costs.</p> </div>
				</div>
			</div>
			{view === "products" && <ManageProducts />}
			{view === "raw-materials" && <Parameter />}
			{view === "cost" && <LabourCostCalculator />}
		</div>
	);
};

export { ManageReceipt, ProductionReceiptForm };
export default KulikuliProduction;
