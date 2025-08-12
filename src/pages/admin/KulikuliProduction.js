import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function KulikuliProduction() {
  const navigate = useNavigate();
  const [productions, setProductions] = useState([]);
  const [newProduction, setNewProduction] = useState({
    batchId: '',
    productName: '',
    quantity: '',
    rawMaterials: '',
    laborCost: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Check admin authentication
    try {
      const adminSession = localStorage.getItem("adminSession");
      if (!adminSession) {
        navigate("/admin/login");
        return;
      }
      const session = JSON.parse(adminSession);
      const sessionTime = new Date(session.timestamp);
      const now = new Date();
      const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
      
      if (hoursDiff >= 24 || !session.isAuthenticated) {
        localStorage.removeItem("adminSession");
        navigate("/admin/login");
        return;
      }
    } catch {
      localStorage.removeItem("adminSession");
      navigate("/admin/login");
      return;
    }

    loadProductions();
  }, [navigate]);

  const loadProductions = () => {
    const savedProductions = JSON.parse(localStorage.getItem('productions')) || [];
    setProductions(savedProductions);
  };

  const handleAddProduction = (e) => {
    e.preventDefault();
    if (!newProduction.batchId || !newProduction.productName || !newProduction.quantity) {
      alert("Please fill in all required fields");
      return;
    }

    const production = {
      id: Date.now(),
      ...newProduction,
      quantity: parseInt(newProduction.quantity),
      rawMaterials: parseFloat(newProduction.rawMaterials) || 0,
      laborCost: parseFloat(newProduction.laborCost) || 0,
      totalCost: (parseFloat(newProduction.rawMaterials) || 0) + (parseFloat(newProduction.laborCost) || 0),
      status: 'completed'
    };

    const updatedProductions = [...productions, production];
    setProductions(updatedProductions);
    localStorage.setItem('productions', JSON.stringify(updatedProductions));

    setNewProduction({
      batchId: '',
      productName: '',
      quantity: '',
      rawMaterials: '',
      laborCost: '',
      date: new Date().toISOString().split('T')[0]
    });

    alert('Production batch added successfully!');
  };

  const handleDeleteProduction = (id) => {
    if (window.confirm("Are you sure you want to delete this production batch?")) {
      const updatedProductions = productions.filter(p => p.id !== id);
      setProductions(updatedProductions);
      localStorage.setItem('productions', JSON.stringify(updatedProductions));
    }
  };

  const calculateTotalProduction = () => {
    return productions.reduce((sum, prod) => sum + prod.quantity, 0);
  };

  const calculateTotalCost = () => {
    return productions.reduce((sum, prod) => sum + prod.totalCost, 0);
  };

  return (
    <div style={{minHeight: '100vh', background: '#f8f9fa', padding: '2rem 0'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
        <div style={{marginBottom: '2rem'}}>
          <Link to="/admin/dashboard" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#e67e22', textDecoration: 'none', marginBottom: '1rem'}}>
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 style={{color: '#2c3e50', margin: 0}}>Kulikuli Production Management</h1>
        </div>

        {/* Production Stats */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#e67e22', marginBottom: '0.5rem'}}>
              {productions.length}
            </div>
            <div style={{color: '#5a6c7d', fontSize: '0.9rem'}}>Total Batches</div>
          </div>
          
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#27ae60', marginBottom: '0.5rem'}}>
              {calculateTotalProduction()}
            </div>
            <div style={{color: '#5a6c7d', fontSize: '0.9rem'}}>Total Units</div>
          </div>
          
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#3498db', marginBottom: '0.5rem'}}>
              ₦{calculateTotalCost().toLocaleString()}
            </div>
            <div style={{color: '#5a6c7d', fontSize: '0.9rem'}}>Total Cost</div>
          </div>
        </div>

        {/* Add New Production Form */}
        <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', marginBottom: '2rem'}}>
          <h3 style={{color: '#2c3e50', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <FaPlus /> Add New Production Batch
          </h3>
          <form onSubmit={handleAddProduction}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
              <input
                type="text"
                placeholder="Batch ID *"
                value={newProduction.batchId}
                onChange={(e) => setNewProduction({ ...newProduction, batchId: e.target.value })}
                required
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
              <input
                type="text"
                placeholder="Product Name *"
                value={newProduction.productName}
                onChange={(e) => setNewProduction({ ...newProduction, productName: e.target.value })}
                required
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
              <input
                type="number"
                placeholder="Quantity *"
                value={newProduction.quantity}
                onChange={(e) => setNewProduction({ ...newProduction, quantity: e.target.value })}
                required
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Raw Materials Cost"
                value={newProduction.rawMaterials}
                onChange={(e) => setNewProduction({ ...newProduction, rawMaterials: e.target.value })}
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Labor Cost"
                value={newProduction.laborCost}
                onChange={(e) => setNewProduction({ ...newProduction, laborCost: e.target.value })}
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
              <input
                type="date"
                value={newProduction.date}
                onChange={(e) => setNewProduction({ ...newProduction, date: e.target.value })}
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
            </div>
            <button type="submit" style={{
              padding: '12px 24px',
              background: '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Add Production Batch
            </button>
          </form>
        </div>

        {/* Production History */}
        <div style={{background: 'white', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', overflow: 'hidden'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #e9ecef'}}>
            <h3 style={{color: '#2c3e50', margin: 0}}>Production History</h3>
          </div>
          
          {productions.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#5a6c7d'}}>
              <p>No production batches recorded yet.</p>
            </div>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: '#f8f9fa'}}>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Batch ID</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Product</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Quantity</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Date</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Total Cost</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productions.slice().reverse().map((production) => (
                    <tr key={production.id} style={{borderBottom: '1px solid #e9ecef'}}>
                      <td style={{padding: '1rem', color: '#2c3e50', fontWeight: '600'}}>{production.batchId}</td>
                      <td style={{padding: '1rem', color: '#5a6c7d'}}>{production.productName}</td>
                      <td style={{padding: '1rem', color: '#27ae60', fontWeight: '600'}}>{production.quantity}</td>
                      <td style={{padding: '1rem', color: '#5a6c7d'}}>{new Date(production.date).toLocaleDateString()}</td>
                      <td style={{padding: '1rem', color: '#e67e22', fontWeight: '600'}}>₦{production.totalCost.toLocaleString()}</td>
                      <td style={{padding: '1rem'}}>
                        <button 
                          onClick={() => handleDeleteProduction(production.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KulikuliProduction;
