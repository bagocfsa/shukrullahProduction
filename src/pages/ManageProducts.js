import React, { useEffect, useState, useRef } from "react";
import "./ManageProducts.css";
import productData from "../data/productData.json";
import Header from "../components/Header"; // adjust the path if different
import { FaEdit, FaEye, FaEyeSlash, FaPlus, FaSave, FaSync } from "react-icons/fa";

const ACCESS_CODE = "23411";

const ManageProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [stockHistory, setStockHistory] = useState(() => {
  const savedHistory = localStorage.getItem("stockHistory");
  return savedHistory ? JSON.parse(savedHistory) : [];
});
  const [activeTab, setActiveTab] = useState("categories");
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "", image: "" });
  const [toast, setToast] = useState("");
  const [attendantName, setAttendantName] = useState("Attendant");

  /** ✅ Access Code Modal */
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessDigits, setAccessDigits] = useState(["", "", "", "", ""]);
  const digitRefs = useRef([]);

  /** ✅ Pending action storage */
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingProductEdits, setPendingProductEdits] = useState({});
  const [pendingStockQty, setPendingStockQty] = useState({});

  const [showFullHistory, setShowFullHistory] = useState(false);

  // Load from localStorage or defaults
  useEffect(() => {
    let shopData;
    try {
      shopData = JSON.parse(localStorage.getItem("shopData"));
    } catch {
      shopData = null;
    }
    // If shopData is missing, corrupted, or has no products, use productData.json
    if (!shopData || !Array.isArray(shopData.products) || shopData.products.length === 0) {
      setCategories(productData.categories || []);
      setProducts(productData.products || []);
      setStocks(productData.stocks || []);
    } else {
      setCategories(shopData.categories || []);
      setProducts(shopData.products || []);
      setStocks(shopData.stocks || []);
    }

    // Get attendant name
    try {
      const storedAttendant = localStorage.getItem("attendant");
      if (storedAttendant) {
        const parsedAttendant = JSON.parse(storedAttendant);
        setAttendantName(parsedAttendant?.username || "Attendant");
      }
    } catch {
      setAttendantName("Attendant");
    }
  }, []);

  // Save changes to localStorage and sync stocks with products
  useEffect(() => {
    // Ensure all products have corresponding stock entries
    const productNames = products.map(p => p.name);
    const existingStockProducts = stocks.map(s => s.product);

    // Add missing stock entries
    const missingStocks = productNames.filter(name => !existingStockProducts.includes(name));
    const newStocks = missingStocks.map(name => ({ product: name, quantity: 0 }));

    // Remove orphaned stock entries
    const validStocks = stocks.filter(s => productNames.includes(s.product));

    const updatedStocks = [...validStocks, ...newStocks];

    if (updatedStocks.length !== stocks.length ||
        !updatedStocks.every((s, i) => stocks[i] && s.product === stocks[i].product)) {
      setStocks(updatedStocks);
    }

    const shopData = { categories, products, stocks: updatedStocks };
    localStorage.setItem("shopData", JSON.stringify(shopData));
  }, [categories, products, stocks]);
  useEffect(() => {
  localStorage.setItem("stockHistory", JSON.stringify(stockHistory));
}, [stockHistory]);

  /** ✅ Toast Notification */
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  /** ✅ Reset All Data */
const resetAllData = () => {
  const accessCode = prompt("🔐 Enter Access Code to reset all data:");
  if (accessCode !== ACCESS_CODE) {
    showToast("❌ Invalid Access Code. Reset cancelled.");
    return;
  }

  if (window.confirm("⚠ Are you sure you want to reset all data?")) {
    setCategories(productData.categories);
    setProducts(productData.products);
    setStocks(productData.stocks);
    setStockHistory([]); // ✅ Clear stock history

    localStorage.removeItem("shopData");
    localStorage.removeItem("stockHistory"); // ✅ Also remove persisted history

    showToast("🔄 All data reset to default!");
  }
};




  /** ✅ Toggle category visibility */
  const toggleCategoryVisibility = (index) => {
    const updated = [...categories];
    updated[index].hidden = !updated[index].hidden;
    setCategories(updated);
    showToast(`Category "${updated[index].name}" is now ${updated[index].hidden ? "hidden" : "visible"}`);
  };

  /** ✅ Toggle product visibility */
  const toggleProductVisibility = (index) => {
    const updated = [...products];
    updated[index].hidden = !updated[index].hidden;
    setProducts(updated);
    showToast(`Product "${updated[index].name}" is now ${updated[index].hidden ? "hidden" : "visible"}`);
  };

  /** ✅ Add category */
  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, { name: newCategory, hidden: false }]);
    setNewCategory("");
    showToast(`Category "${newCategory}" added successfully!`);
  };

  /** ✅ Add product */
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) return;

    // Add product
    const newProd = { ...newProduct, hidden: false };
    setProducts([...products, newProd]);

    // Add corresponding stock entry
    const newStock = { product: newProduct.name, quantity: 0 };
    setStocks([...stocks, newStock]);

    setNewProduct({ name: "", price: "", category: "", image: "" });
    showToast(`Product "${newProduct.name}" added successfully!`);
  };

  /** ✅ Handle product field edits (without applying yet) */
  const handleProductChange = (index, field, value) => {
    setPendingProductEdits((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: value }
    }));
  };

  /** ✅ Request Product Update (with Access Code) */
  const requestProductUpdate = (index) => {
    setPendingAction({ type: "product", index });
    setShowAccessModal(true);
  };

  const confirmProductUpdate = () => {
    const { index } = pendingAction;
    const updated = [...products];
    updated[index] = { ...updated[index], ...pendingProductEdits[index] };
    setProducts(updated);
    setPendingProductEdits((prev) => {
      const newEdits = { ...prev };
      delete newEdits[index];
      return newEdits;
    });
    showToast(`✅ Product "${updated[index].name}" updated successfully!`);
    setPendingAction(null);
  };

  /** ✅ Handle stock input (without applying yet) */
  const handleStockChange = (index, value) => {
    if (!isNaN(value)) {
      setPendingStockQty((prev) => ({ ...prev, [index]: Number(value) }));
    }
  };

  /** ✅ Request Stock Update (with Access Code) */
  const requestStockUpdate = (index) => {
    setPendingAction({ type: "stock", index });
    setShowAccessModal(true);
  };

  const confirmStockUpdate = () => {
    const { index } = pendingAction;
    const updated = [...stocks];
    updated[index].quantity += pendingStockQty[index] || 0;
    setStocks(updated);

    // Add to stock history
    const newHistory = {
      product: updated[index].product,
      change: `+${pendingStockQty[index]}`,
      date: new Date().toLocaleString(),
    };
    setStockHistory([newHistory, ...stockHistory]);

    // Clear input after update
    setPendingStockQty((prev) => {
      const newQty = { ...prev };
      delete newQty[index];
      return newQty;
    });

    showToast(`📦 Stock for "${updated[index].product}" updated successfully!`);
    setPendingAction(null);
  };

  /** ✅ Access Code Handlers */
  const handleDigitChange = (i, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newDigits = [...accessDigits];
      newDigits[i] = value;
      setAccessDigits(newDigits);
      if (value && i < 4) digitRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !accessDigits[i] && i > 0) digitRefs.current[i - 1].focus();
    if (e.key === "ArrowLeft" && i > 0) digitRefs.current[i - 1].focus();
    if (e.key === "ArrowRight" && i < 4) digitRefs.current[i + 1].focus();
    if (e.key === "Enter") verifyAccessCode();
  };

  const verifyAccessCode = () => {
    if (accessDigits.join("") === ACCESS_CODE) {
      setShowAccessModal(false);
      setAccessDigits(["", "", "", "", ""]);
      if (pendingAction.type === "product") confirmProductUpdate();
      else if (pendingAction.type === "stock") confirmStockUpdate();
    } else {
      showToast("❌ Incorrect Access Code!");
    }
  };

  /** ✅ Stock Level Class */
  const getStockLevelClass = (qty) => {
    if (qty <= 10) return "low-stock";
    if (qty <= 30) return "medium-stock";
    return "high-stock";
  };

  return (
    <div className="manage-products-container">
      <Header attendantName={attendantName} />
      <h2>📦 Manage Products & Categories</h2>
      {toast && <div className="toast-notice show">{toast}</div>}

      {/* ✅ Tabs */}
      <div className="tabs">
        <button className={activeTab === "categories" ? "active" : ""} onClick={() => setActiveTab("categories")}>Manage Categories</button>
        <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>Manage Products</button>
        <button className={activeTab === "stock" ? "active" : ""} onClick={() => setActiveTab("stock")}>Stock Records</button>
        <button className="reset-btn" onClick={resetAllData}><FaSync /> Reset All Data</button>
      </div>

      {/* ✅ Categories */}
      {activeTab === "categories" && (
        <div className="section">
          <h3>📂 All Categories</h3>
          <div className="category-list">
            {categories.map((cat, idx) => (
              <div key={idx} className={`category-card ${cat.hidden ? "hidden" : ""}`}>
                <h4>{cat.name}</h4>
                <div className="actions">
                  <button onClick={() => toggleCategoryVisibility(idx)}>
                    {cat.hidden ? <FaEye /> : <FaEyeSlash />} {cat.hidden ? "Show" : "Hide"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="add-category">
            <input type="text" placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            <button onClick={addCategory}><FaPlus /> Add Category</button>
          </div>
        </div>
      )}

      {/* ✅ Products */}
      {activeTab === "products" && (
        <div className="section">
          <h3>🛒 All Products</h3>

          {/* Add New Product Form */}
          <div className="add-product-form">
            <h4>Add New Product</h4>
            <div className="form-row">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Image filename (optional)"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
              <button onClick={addProduct} disabled={!newProduct.name || !newProduct.price || !newProduct.category}>
                <FaPlus /> Add Product
              </button>
            </div>
          </div>
          {categories.map((cat) => {
            // Get products for this category and their global index
            const productsForCategory = products
              .map((prod, idx) => ({ ...prod, _idx: idx }))
              .filter((p) => p.category === cat.name);
            return (
              <div key={cat.name} className="category-group">
                <h4 className="category-title">{cat.name}</h4>
                <div className="product-list">
                  {productsForCategory.length === 0 ? (
                    <div className="no-products">No products in this category.</div>
                  ) : (
                    productsForCategory.map((prod) => {
                      const edit = pendingProductEdits[prod._idx] || {};
                      // Always show Save button, never disable
                      return (
                        <div
                          key={prod._idx}
                          className={`vertical-product-card${prod.hidden ? " hidden" : ""}`}
                          style={{
                            backgroundImage: `url(${prod.image ? `/images/${prod.image}` : '/images/default-bg.jpg'})`,
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
                          <div className="vertical-card-overlay" style={{
                            background: 'rgba(0,0,0,0.45)',
                            color: '#fff',
                            padding: '28px 16px 18px 16px',
                            borderRadius: '0 0 22px 22px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            position: 'relative',
                            zIndex: 2
                          }}>
                            <h4 style={{
                              fontSize: '1.35rem',
                              fontWeight: 800,
                              marginBottom: '10px',
                              textShadow: '0 2px 8px rgba(0,0,0,0.18)',
                              letterSpacing: '0.5px',
                              background: 'rgba(255,255,255,0.18)',
                              padding: '6px 18px',
                              borderRadius: '10px',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
                            }}>{prod.name}</h4>
                            <div style={{
                              fontSize: '1.12rem',
                              fontWeight: 700,
                              background: 'rgba(255,255,255,0.22)',
                              padding: '6px 18px',
                              borderRadius: '10px',
                              marginBottom: '8px',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                              letterSpacing: '0.3px',
                              color: '#fff'
                            }}>Stock: <span style={{ fontWeight: 900, color: '#fbbf24', fontSize: '1.18rem', textShadow: '0 1px 4px rgba(239,68,68,0.12)' }}>{stocks.find(s => s.product === prod.name)?.quantity ?? 0}</span></div>
                            {/* Save button directly below name and quantity */}
                            <button onClick={() => requestProductUpdate(prod._idx)} className="fancy-action-btn fancy-save-btn" style={{ margin: '12px 0 8px 0', alignSelf: 'center', padding: '12px 32px', borderRadius: '14px', fontWeight: 700, background: 'linear-gradient(90deg, #10b981 60%, #059669 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: '1.12rem', cursor: 'pointer', transition: 'background 0.2s, box-shadow 0.2s' }}>
                              <FaSave /> Save
                            </button>
                            <div style={{
                              fontSize: '1.08rem',
                              fontWeight: 600,
                              background: 'rgba(255,255,255,0.18)',
                              padding: '5px 14px',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              color: '#fff',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
                            }}>Price: ₦{Number(prod.price).toLocaleString()}</div>
                            <div style={{
                              fontSize: '1.05rem',
                              fontWeight: 500,
                              background: 'rgba(255,255,255,0.12)',
                              padding: '4px 12px',
                              borderRadius: '8px',
                              color: '#fff',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
                            }}>Category: {prod.category}</div>
                          </div>
                          <div className="vertical-product-actions" style={{
                            display: 'flex',
                            gap: '16px',
                            padding: '16px 20px',
                            background: 'rgba(255,255,255,0.92)',
                            borderRadius: '0 0 22px 22px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            zIndex: 3
                          }}>
                            <input
                              type="text"
                              className="fancy-edit-input"
                              value={edit.name ?? prod.name}
                              onChange={(e) => handleProductChange(prod._idx, "name", e.target.value)}
                              placeholder="Product Name"
                              style={{ fontWeight: 600, fontSize: '1.08rem', borderRadius: '10px', border: '1.5px solid #d1d5db', padding: '10px 16px', width: '120px', background: '#f9fafb', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                            />
                            <input
                              type="number"
                              className="fancy-edit-input"
                              value={edit.price ?? prod.price}
                              onChange={(e) => handleProductChange(prod._idx, "price", e.target.value)}
                              placeholder="Price"
                              style={{ fontWeight: 600, fontSize: '1.08rem', borderRadius: '10px', border: '1.5px solid #d1d5db', padding: '10px 16px', width: '120px', background: '#f9fafb', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                            />
                            <button onClick={() => toggleProductVisibility(prod._idx)} className="fancy-action-btn fancy-vis-btn" style={{ padding: '12px 22px', borderRadius: '12px', fontWeight: 700, background: 'linear-gradient(90deg, #2563eb 60%, #1e40af 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: '1.08rem', cursor: 'pointer', transition: 'background 0.2s, box-shadow 0.2s' }}>
                              {prod.hidden ? <FaEye /> : <FaEyeSlash />} {prod.hidden ? "Show" : "Hide"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Stock Records */}
      {activeTab === "stock" && (
        <div className="section">
          <h3>📦 Stock Records</h3>
          {stocks.map((stock, idx) => (
            <div key={idx} className="stock-row">
              <span>{stock.product}</span>
              <span className={getStockLevelClass(stock.quantity)}>{stock.quantity}</span>
              <input type="number" placeholder="+Qty" value={pendingStockQty[idx] ?? ""} onChange={(e) => handleStockChange(idx, e.target.value)} />
              <button onClick={() => requestStockUpdate(idx)} disabled={!pendingStockQty[idx] || pendingStockQty[idx] === 0}>
                <FaSave /> Update
              </button>
            </div>
          ))}

          {/* ✅ Stock History */}
          <div className="stock-history">
            <h4>📜 Stock Update History</h4>
            <ul>
              {(showFullHistory ? stockHistory : stockHistory.slice(0, 5)).map((entry, idx) => (
                <li key={idx}>{entry.date} ➝ <strong>{entry.product}</strong> updated {entry.change}</li>
              ))}
            </ul>
            {stockHistory.length > 5 && (
              <button onClick={() => setShowFullHistory(!showFullHistory)}>
                {showFullHistory ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ✅ Access Code Modal */}
      {showAccessModal && (
        <div className="access-modal">
          <div className="modal-content animate">
            <h3>🔑 Enter Access Code</h3>
            <div className="digit-inputs">
              {accessDigits.map((digit, i) => (
                <input
                  key={i}
                  type="password"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (digitRefs.current[i] = el)}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
            </div>
            <button onClick={verifyAccessCode}>Submit</button>
            <button className="cancel-btn" onClick={() => setShowAccessModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
