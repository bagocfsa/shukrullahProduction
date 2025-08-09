import React, { useState } from "react";
import "./Parameter.css";

const defaultLabourCosts = {
  Roasting : { unit: "per 30 mudus", cost: 1500 },
  Grinding: { unit: "per 30 mudus", cost:400 },
  Mixing: { unit: "per 30 mudus", cost: 350 },
  Frying: { unit: "per 30 mudus", cost: 750 },
  Packaging: { unit: "per 30 mudus", cost: 500 },
  Fuel: { unit: "per 30 mudus", cost: 500 },
  Cleaning: { unit: "per 30 mudus", cost: 500 }
};

const LabourParameter = () => {
  const [costs, setCosts] = useState(() => {
    const saved = localStorage.getItem("labourCosts");
    return saved ? JSON.parse(saved) : defaultLabourCosts;
  });
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [toast, setToast] = useState("");

  const handleCostChange = (item, value) => {
    setCosts((prev) => ({
      ...prev,
      [item]: { ...prev[item], cost: Number(value) },
    }));
  };

  const handleSingleUpdate = (item) => {
    localStorage.setItem("labourCosts", JSON.stringify(costs));
    setHighlightedRow(item);
    setToast(`✅ ${item} cost updated!`);
    setTimeout(() => setHighlightedRow(null), 1500);
    setTimeout(() => setToast(""), 2000);
  };

  const handleUpdateAll = () => {
    localStorage.setItem("labourCosts", JSON.stringify(costs));
    setToast("✅ All labour costs updated!");
    setTimeout(() => setToast(""), 2000);
  };

  const handleReset = () => {
    if (window.confirm("⚠ Are you sure you want to reset costs to default?")) {
      setCosts(defaultLabourCosts);
      localStorage.setItem("labourCosts", JSON.stringify(defaultLabourCosts));
      setToast("🔄 Costs reset to default!");
      setTimeout(() => setToast(""), 2000);
    }
  };

  return (
    <div className="parameter-container">
      {toast && <div className="toast">{toast}</div>}
      <div className="table-wrapper">
        <table className="parameter-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Unit</th>
              <th>Cost (₦)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(costs).map(([item, { unit, cost }]) => (
              <tr key={item} className={highlightedRow === item ? "highlight" : ""}>
                <td>{item}</td>
                <td>{unit}</td>
                <td>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => handleCostChange(item, e.target.value)}
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
      <div className="mobile-parameter">
        {Object.entries(costs).map(([item, { unit, cost }]) => (
          <div key={item} className="mobile-card">
            <h4>{item}</h4>
            <p>Unit: {unit}</p>
            <input
              type="number"
              value={cost}
              onChange={(e) => handleCostChange(item, e.target.value)}
            />
            <button onClick={() => handleSingleUpdate(item)}>Update</button>
          </div>
        ))}
      </div>
      <div className="parameter-actions">
        <button className="update-all-btn" onClick={handleUpdateAll}>💾 Update All</button>
        <button className="reset-btn" onClick={handleReset}>🔄 Reset to Default</button>
      </div>
    </div>
  );
};

export default LabourParameter;
