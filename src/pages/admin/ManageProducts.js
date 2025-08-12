import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    weight: "",
    stock: "",
    category: "Kulikuli",
    featured: false,
    tags: ""
  });
  const [editingProduct, setEditingProduct] = useState(null);

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

    loadProducts();
  }, [navigate]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/data.json');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const saveProducts = (updatedProducts) => {
    try {
      setProducts(updatedProducts);
      localStorage.setItem("productsData", JSON.stringify({ products: updatedProducts }));
      alert("Products updated successfully!");
    } catch (error) {
      console.error("Error saving products:", error);
      alert("Error saving products. Please try again.");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all required fields");
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : parseFloat(newProduct.price),
      weight: newProduct.weight,
      stock: parseInt(newProduct.stock),
      category: newProduct.category,
      featured: newProduct.featured,
      images: ["/images/placeholder.jpg"],
      ingredients: [],
      nutritionFacts: {},
      tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    const updatedProducts = [...products, product];
    saveProducts(updatedProducts);

    setNewProduct({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      weight: "",
      stock: "",
      category: "Kulikuli",
      featured: false,
      tags: ""
    });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter(p => p.id !== id);
      saveProducts(updatedProducts);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#f8f9fa', padding: '2rem 0'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
        <div style={{marginBottom: '2rem'}}>
          <Link to="/admin/dashboard" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#e67e22', textDecoration: 'none', marginBottom: '1rem'}}>
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 style={{color: '#2c3e50', margin: 0}}>Manage Products</h1>
        </div>

        {/* Add New Product Form */}
        <div style={{background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', marginBottom: '2rem'}}>
          <h3 style={{color: '#2c3e50', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <FaPlus /> Add New Product
          </h3>
          <form onSubmit={handleAddProduct}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
              <input
                type="text"
                placeholder="Product Name *"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
              <input
                type="text"
                placeholder="Weight (e.g., 125g)"
                value={newProduct.weight}
                onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
              <input
                type="number"
                placeholder="Price *"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
                style={{padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px'}}
              />
              <input
                type="number"
                placeholder="Stock Quantity *"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
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
              Add Product
            </button>
          </form>
        </div>

        {/* Products List */}
        <div style={{background: 'white', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', overflow: 'hidden'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #e9ecef'}}>
            <h3 style={{color: '#2c3e50', margin: 0}}>Current Products ({products.length})</h3>
          </div>
          
          {products.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#5a6c7d'}}>
              <p>No products available. Add some products to get started.</p>
            </div>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: '#f8f9fa'}}>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Product</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Price</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Stock</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Category</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Status</th>
                    <th style={{padding: '1rem', textAlign: 'left', color: '#2c3e50', fontWeight: '600'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} style={{borderBottom: '1px solid #e9ecef'}}>
                      <td style={{padding: '1rem'}}>
                        <div>
                          <div style={{fontWeight: '600', color: '#2c3e50', marginBottom: '0.25rem'}}>{product.name}</div>
                          <div style={{fontSize: '0.9rem', color: '#5a6c7d'}}>{product.weight}</div>
                        </div>
                      </td>
                      <td style={{padding: '1rem', color: '#e67e22', fontWeight: '600'}}>₦{product.price.toLocaleString()}</td>
                      <td style={{padding: '1rem', color: product.stock > 0 ? '#27ae60' : '#e74c3c'}}>{product.stock}</td>
                      <td style={{padding: '1rem', color: '#5a6c7d'}}>{product.category}</td>
                      <td style={{padding: '1rem'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: product.featured ? '#d4edda' : '#f8f9fa',
                          color: product.featured ? '#155724' : '#5a6c7d'
                        }}>
                          {product.featured ? 'Featured' : 'Regular'}
                        </span>
                      </td>
                      <td style={{padding: '1rem'}}>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <button style={{
                            padding: '6px 12px',
                            background: '#e67e22',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <FaEdit /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
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
                        </div>
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

export default ManageProducts;
