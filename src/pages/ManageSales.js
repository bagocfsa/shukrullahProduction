import React, { useEffect, useState, useRef } from "react";
import productData from "../data/productData.json";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // ✅ Existing Header
import "./ManageSales.css";
import { FaArrowUp, FaArrowDown, FaArrowLeft } from "react-icons/fa";

const defaultImage = "https://via.placeholder.com/150"; // ✅ Fallback image

function ManageSales() {
  const navigate = useNavigate();
  const [attendantName, setAttendantName] = useState("Attendant");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const cartRef = useRef(null);
  const cartListRef = useRef(null);

  useEffect(() => {
    try {
      const storedAttendant = JSON.parse(localStorage.getItem("attendant"));
      if (!storedAttendant) {
        navigate("/login");
        return;
      }
      setAttendantName(storedAttendant.username || "Attendant");

      // Load products and stocks from localStorage or productData.json
      const shopData = JSON.parse(localStorage.getItem("shopData"));
      if (shopData) {
        setProducts(shopData.products || []);
        setStocks(shopData.stocks || []);
      } else {
        setProducts(productData.products || []);
        setStocks(productData.stocks || []);
      }
    } catch {
      localStorage.removeItem("attendant");
      navigate("/login");
    }
  }, [navigate]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.name === product.name);
    let newCart;
    if (existing) {
      newCart = cart.map((item) =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    setTimeout(() => {
      if (cartRef.current) {
        cartRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const removeFromCart = (name) => {
    setCart(cart.filter((item) => item.name !== name));
  };

  const increaseQty = (name) => {
    setCart(
      cart.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (name) => {
    setCart(
      cart.map((item) =>
        item.name === name && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function printReceipt(invoice) {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @media print {
              @page { margin: 0; size: 58mm auto; }
              body { margin: 0; }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              color: #000;
              line-height: 1.3;
              width: 58mm;
              margin: 0 auto;
              padding: 5mm;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 8px;
            }
            .company-name {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 2px;
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
            .receipt-info {
              font-size: 11px;
              margin: 2px 0;
            }
            .items {
              margin: 6px 0;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              margin: 1px 0;
              line-height: 1.2;
            }
            .item-name {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-right: 5px;
            }
            .item-qty {
              font-size: 10px;
              margin-left: 5px;
            }
            .item-price {
              text-align: right;
              min-width: 15mm;
            }
            .total-section {
              margin-top: 6px;
              border-top: 1px solid #333;
              padding-top: 4px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              font-size: 12px;
              margin: 2px 0;
            }
            .footer {
              text-align: center;
              margin-top: 8px;
              font-size: 10px;
              border-top: 1px dashed #333;
              padding-top: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">SHUKURULLAH NIG. LTD</div>
            <div class="company-info">Block 390, Talba Estate</div>
            <div class="company-info">Off Bida Road, Minna</div>
            <div class="company-info">Tel: 09019286029</div>
          </div>
          <hr class="divider"/>
          <div class="receipt-info">Receipt No: ${invoice.receiptNo || invoice.id}</div>
          <div class="receipt-info">Date: ${new Date(invoice.date).toLocaleString()}</div>
          <hr class="divider"/>
          <div class="items">
            ${invoice.items
              .map((item) => `
                <div class="item-row">
                  <div class="item-name">${item.name}</div>
                  <div class="item-price">₦${(item.price * item.quantity).toLocaleString()}</div>
                </div>
                <div class="item-row">
                  <div class="item-qty">${item.quantity} x ₦${item.price.toLocaleString()}</div>
                  <div></div>
                </div>
              `)
              .join("")}
          </div>
          <div class="total-section">
            <div class="total-row">
              <span>TOTAL:</span>
              <span>₦${invoice.total.toLocaleString()}</span>
            </div>
          </div>
          <div class="footer">
            <div>Thank you for your patronage!</div>
            <div>Please come again</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  const handleCheckout = () => {
    // Update stocks
    let updatedStocks = [...stocks];
    cart.forEach((cartItem) => {
      updatedStocks = updatedStocks.map((stock) =>
        stock.product === cartItem.name
          ? { ...stock, quantity: Math.max(stock.quantity - cartItem.quantity, 0) }
          : stock
      );
    });
    setStocks(updatedStocks);

    // Save updated stocks to localStorage
    const shopData = JSON.parse(localStorage.getItem("shopData")) || {};
    shopData.stocks = updatedStocks;
    localStorage.setItem("shopData", JSON.stringify(shopData));

    // Generate receipt number
    const receiptNo = `RCPT-${Date.now().toString().slice(-6)}`;
    const invoice = {
      id: Date.now(),
      receiptNo,
      items: cart,
      total: getTotal(),
      date: new Date(),
      attendant: attendantName,
    };

    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    invoices.push(invoice);
    localStorage.setItem("invoices", JSON.stringify(invoices));

    setCart([]);
    printReceipt(invoice);
  };

  // Navigation for cart items
  const scrollCartItem = (direction) => {
    if (cartListRef.current) {
      const items = cartListRef.current.querySelectorAll('.cart-item');
      if (items.length === 0) return;
      let current = Array.from(items).findIndex(item => item === document.activeElement);
      if (direction === 'up') {
        const prev = current > 0 ? current - 1 : items.length - 1;
        items[prev].focus();
        items[prev].scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        const next = current < items.length - 1 ? current + 1 : 0;
        items[next].focus();
        items[next].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="manage-sales-wrapper">
      <Header attendantName={attendantName} />
      <div className="nav-bar">
        <button className="nav-btn" onClick={() => navigate(-1)}><FaArrowLeft /> Back</button>
      </div>
      <div className="manage-sales-container">
        <h2>Manage Sales</h2>
        <div className="product-list">
          {products.length === 0 ? (
            <p>No products found. Add some in Manage Products.</p>
          ) : (
            products.map((product) => {
              const stockQty = stocks.find(s => s.product === product.name)?.quantity ?? 0;
              return (
                <div
                  className="fancy-product-card"
                  key={product.name}
                  style={{
                    backgroundImage: `url(${product.image ? `/images/${product.image}` : defaultImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '340px',
                    maxWidth: '340px',
                    width: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    boxShadow: '0 8px 32px rgba(16,185,129,0.14)',
                    borderRadius: '22px',
                    border: '1px solid #e5e7eb',
                    marginBottom: '40px',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    animation: 'cardPop 0.7s cubic-bezier(.68,-0.55,.27,1.55)'
                  }}
                >
                  <div className="fancy-card-overlay">
                    <div className="fancy-product-name">{product.name}</div>
                    <div className="fancy-product-stock">Stock: <span>{stockQty}</span></div>
                    <button
                      className="fancy-save-btn"
                      onClick={() => addToCart(product)}
                      disabled={stockQty <= 0}
                    >Add to Cart</button>
                    <div className="fancy-product-stock" style={{marginBottom: '8px'}}>Price: ₦{Number(product.price).toLocaleString()}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-section" ref={cartRef}>
          <h3>Cart</h3>
          <div className="cart-nav">
          </div>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <ul className="cart-list" ref={cartListRef}>
              {cart.map((item) => (
                <li key={item.name} className="cart-item" tabIndex={0}>
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">₦{item.price.toLocaleString()}</span>
                  <span className="cart-item-qty">x {item.quantity}</span>
                  <span className="cart-item-amount">₦{(item.price * item.quantity).toLocaleString()}</span>
                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(item.name)}>-</button>
                    <button onClick={() => increaseQty(item.name)}>+</button>
                    <button onClick={() => removeFromCart(item.name)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {cart.length > 0 && (
            <>
              <h4>Total: ₦{getTotal().toLocaleString()}</h4>
              <button onClick={handleCheckout} className="checkout-btn">
                Complete Sale
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageSales;
