import React, { useState, useEffect } from "react";
import "./Parameter.css";

const defaultPrices = {
  Groundnut: { unit: "per mudu", price: 2275 },
  Pepper: { unit: "per mudu", price: 2250 },
  Ginja: { unit: "per cup", price: 1000 },
  Salt: { unit: "per sachet", price: 150 },
  Sugar: { unit: "per mudu", price: 3300 },
  Onions: { unit: "per rap", price: 500 },
  Lather: { unit: "per pack", price: 1500 },
  Gas: { unit: "per kg", price: 1050 },
  Sack: { unit: "per sack", price: 1500 },
};

const Parameter = () => {
  const [prices, setPrices] = useState(() => {
    const saved = localStorage.getItem("rawMaterialPrices");
    return saved ? JSON.parse(saved) : defaultPrices;
  });
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [toast, setToast] = useState("");

  const handlePriceChange = (item, value) => {
    setPrices((prev) => ({
      ...prev,
      [item]: { ...prev[item], price: Number(value) },
    }));
  };

  const handleSingleUpdate = (item) => {
    localStorage.setItem("rawMaterialPrices", JSON.stringify(prices));
    setHighlightedRow(item);
    setToast(`✅ ${item} price updated!`);
    setTimeout(() => setHighlightedRow(null), 1500);
    setTimeout(() => setToast(""), 2000);
  };

  const handleUpdateAll = () => {
    localStorage.setItem("rawMaterialPrices", JSON.stringify(prices));
    setToast("✅ All raw material prices updated!");
    setTimeout(() => setToast(""), 2000);
  };

  const handleReset = () => {
    if (window.confirm("⚠ Are you sure you want to reset prices to default?")) {
      setPrices(defaultPrices);
      localStorage.setItem("rawMaterialPrices", JSON.stringify(defaultPrices));
      setToast("🔄 Prices reset to default!");
      setTimeout(() => setToast(""), 2000);
    }
  };

  return (
    <div className="parameter-container">
      <h2 className="parameter-title">⚙ Raw Material Prices</h2>

      {/* ✅ Toast Notification */}
      {toast && <div className="toast">{toast}</div>}

      {/* Desktop Table */}
      <div className="table-wrapper">
        <table className="parameter-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit</th>
              <th>Price (₦)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(prices).map(([item, { unit, price }]) => (
              <tr key={item} className={highlightedRow === item ? "highlight" : ""}>
                <td>{item}</td>
                <td>{unit}</td>
                <td>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => handlePriceChange(item, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleSingleUpdate(item)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-Friendly Cards */}
      <div className="mobile-parameter">
        {Object.entries(prices).map(([item, { unit, price }]) => (
          <div key={item} className="mobile-card">
            <h4>{item}</h4>
            <p>Unit: {unit}</p>
            <input
              type="number"
              value={price}
              onChange={(e) => handlePriceChange(item, e.target.value)}
            />
            <button onClick={() => handleSingleUpdate(item)}>Update</button>
          </div>
        ))}
      </div>

      {/* Buttons Section */}
      <div className="parameter-actions">
        <button className="update-all-btn" onClick={handleUpdateAll}>💾 Update All</button>
        <button className="reset-btn" onClick={handleReset}>🔄 Reset to Default</button>
      </div>
    </div>
  );
};

export default Parameter;
