import React, { useState } from 'react';
import { PlusIcon, TrashIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { products } from '../data/products';

interface MaterialInput {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
}

interface LaborInput {
  id: string;
  role: string;
  hours: number;
  hourlyRate: number;
}

const CostCalculator: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productionQuantity, setProductionQuantity] = useState(100);
  const [materials, setMaterials] = useState<MaterialInput[]>([
    { id: '1', name: '', quantity: 0, unit: 'kg', costPerUnit: 0 }
  ]);
  const [labor, setLabor] = useState<LaborInput[]>([
    { id: '1', role: '', hours: 0, hourlyRate: 0 }
  ]);
  const [overheadPercentage, setOverheadPercentage] = useState(15);
  const [profitMargin, setProfitMargin] = useState(25);

  const addMaterial = () => {
    const newId = (materials.length + 1).toString();
    setMaterials([...materials, { id: newId, name: '', quantity: 0, unit: 'kg', costPerUnit: 0 }]);
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const updateMaterial = (id: string, field: keyof MaterialInput, value: any) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addLabor = () => {
    const newId = (labor.length + 1).toString();
    setLabor([...labor, { id: newId, role: '', hours: 0, hourlyRate: 0 }]);
  };

  const removeLabor = (id: string) => {
    setLabor(labor.filter(l => l.id !== id));
  };

  const updateLabor = (id: string, field: keyof LaborInput, value: any) => {
    setLabor(labor.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  // Calculations
  const totalMaterialCost = materials.reduce((sum, m) => sum + (m.quantity * m.costPerUnit), 0);
  const totalLaborCost = labor.reduce((sum, l) => sum + (l.hours * l.hourlyRate), 0);
  const overheadCost = (totalMaterialCost + totalLaborCost) * (overheadPercentage / 100);
  const totalProductionCost = totalMaterialCost + totalLaborCost + overheadCost;
  const costPerUnit = totalProductionCost / productionQuantity;
  const sellingPricePerUnit = costPerUnit * (1 + profitMargin / 100);
  const totalRevenue = sellingPricePerUnit * productionQuantity;
  const totalProfit = totalRevenue - totalProductionCost;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Production Cost Calculator</h1>
        <p className="text-gray-600 mt-2">Calculate production costs and estimate pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Product Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Production Quantity
                </label>
                <input
                  type="number"
                  value={productionQuantity}
                  onChange={(e) => setProductionQuantity(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Materials</h3>
              <button
                onClick={addMaterial}
                className="bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Material
              </button>
            </div>
            <div className="space-y-3">
              {materials.map((material) => (
                <div key={material.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material Name
                    </label>
                    <input
                      type="text"
                      value={material.name}
                      onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Groundnuts"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => updateMaterial(material.id, 'quantity', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={material.unit}
                      onChange={(e) => updateMaterial(material.id, 'unit', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="liters">liters</option>
                      <option value="pieces">pieces</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost per Unit (₦)
                    </label>
                    <input
                      type="number"
                      value={material.costPerUnit}
                      onChange={(e) => updateMaterial(material.id, 'costPerUnit', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => removeMaterial(material.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      disabled={materials.length === 1}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Labor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Labor</h3>
              <button
                onClick={addLabor}
                className="bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Labor
              </button>
            </div>
            <div className="space-y-3">
              {labor.map((laborItem) => (
                <div key={laborItem.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role/Task
                    </label>
                    <input
                      type="text"
                      value={laborItem.role}
                      onChange={(e) => updateLabor(laborItem.id, 'role', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Production Worker"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hours
                    </label>
                    <input
                      type="number"
                      value={laborItem.hours}
                      onChange={(e) => updateLabor(laborItem.id, 'hours', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate per Hour (₦)
                    </label>
                    <input
                      type="number"
                      value={laborItem.hourlyRate}
                      onChange={(e) => updateLabor(laborItem.id, 'hourlyRate', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => removeLabor(laborItem.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      disabled={labor.length === 1}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overhead and Profit */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Additional Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overhead Percentage (%)
                </label>
                <input
                  type="number"
                  value={overheadPercentage}
                  onChange={(e) => setOverheadPercentage(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Utilities, equipment, maintenance</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profit Margin (%)
                </label>
                <input
                  type="number"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Desired profit percentage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="flex items-center mb-4">
              <CalculatorIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold">Cost Summary</h3>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Material Costs:</span>
                  <span className="font-medium">{formatCurrency(totalMaterialCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Labor Costs:</span>
                  <span className="font-medium">{formatCurrency(totalLaborCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overhead ({overheadPercentage}%):</span>
                  <span className="font-medium">{formatCurrency(overheadCost)}</span>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-3">
                <div className="flex justify-between font-semibold">
                  <span>Total Production Cost:</span>
                  <span className="text-primary-600">{formatCurrency(totalProductionCost)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Cost per Unit:</span>
                  <span>{formatCurrency(costPerUnit)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selling Price per Unit:</span>
                  <span className="font-medium">{formatCurrency(sellingPricePerUnit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-medium text-green-600">{formatCurrency(totalRevenue)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Profit:</span>
                  <span className="text-green-600">{formatCurrency(totalProfit)}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Profit Margin: {profitMargin}%
                </p>
                <p className="text-sm text-gray-600 text-center">
                  ROI: {totalProductionCost > 0 ? ((totalProfit / totalProductionCost) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
