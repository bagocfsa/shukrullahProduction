import React, { useState } from "react";
import "./LabourCostCalculator.css";

const LABOUR_COSTS = [
  { name: "Light Toasting (plus firewood)", cost: 1500 },
  { name: "Factory Fees", cost: 750 },
  { name: "Shapping", cost: 750 },
  { name: "Frying", cost: 750 },
  { name: "Packaging", cost: 500 },
];

function LabourCostCalculator() {
  const [groundnutQty, setGroundnutQty] = useState(0);
  const [mudus, setMudus] = useState(0);

  // Assume 1 mudu = 1 unit for calculation, or adjust as needed
  const muduPerBatch = 30;
  const batches = mudus > 0 ? Math.ceil(mudus / muduPerBatch) : 0;
  const totalLabour = batches * LABOUR_COSTS.reduce((sum, item) => sum + item.cost, 0);

  // Example raw material cost calculation (customize as needed)
  const rawMaterialCost = groundnutQty * 1200; // e.g., ₦1200 per unit
  const processingCost = batches * 2000; // e.g., ₦2000 per batch

  return (
    <div className="labour-cost-container">
      <h2>Labour & Production Cost Calculator</h2>
      <div className="input-group">
        <label>Groundnut Quantity (kg):</label>
        <input
          type="number"
          value={groundnutQty}
          onChange={e => setGroundnutQty(Number(e.target.value))}
          min={0}
        />
      </div>
      <div className="input-group">
        <label>Mudus Produced:</label>
        <input
          type="number"
          value={mudus}
          onChange={e => setMudus(Number(e.target.value))}
          min={0}
        />
      </div>
      <div className="cost-summary">
        <h3>Labour Cost (per 30 mudus):</h3>
        <ul>
          {LABOUR_COSTS.map(item => (
            <li key={item.name}>{item.name}: ₦{item.cost.toLocaleString()}</li>
          ))}
        </ul>
        <p><strong>Batches:</strong> {batches}</p>
        <p><strong>Total Labour Cost:</strong> ₦{totalLabour.toLocaleString()}</p>
        <h3>Raw Material Cost:</h3>
        <p>₦{rawMaterialCost.toLocaleString()}</p>
        <h3>Processing Cost:</h3>
        <p>₦{processingCost.toLocaleString()}</p>
        <h2>Grand Total: ₦{(totalLabour + rawMaterialCost + processingCost).toLocaleString()}</h2>
      </div>
    </div>
  );
}

export default LabourCostCalculator;
