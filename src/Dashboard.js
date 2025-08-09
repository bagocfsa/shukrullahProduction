import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import products from "./data/products"; // Adjust the path as needed
import productData from "./data/productData.json";
import Header from "./components/Header";
import LabourCostCalculator from "./components/LabourCostCalculator";

function Dashboard() {
  const navigate = useNavigate();
  const [attendantName, setAttendantName] = useState("Attendant");
  const [todaySales, setTodaySales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    try {
      const storedAttendant = localStorage.getItem("attendant");
      if (!storedAttendant) {
        navigate("/login");
        return;
      }
      const parsedAttendant = JSON.parse(storedAttendant);
      setAttendantName(parsedAttendant?.username || "Attendant");
    } catch {
      localStorage.removeItem("attendant");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    try {
      const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
      const today = new Date().toDateString();
      // Support both string and Date invoice.date
      const sales = invoices
        .filter((inv) => {
          const invDate =
            typeof inv.date === "string" ? new Date(inv.date) : inv.date;
          return new Date(invDate).toDateString() === today;
        })
        .reduce((sum, inv) => sum + inv.total, 0);

      setTodaySales(sales);
    } catch {
      setTodaySales(0);
      localStorage.removeItem("invoices");
    }
  }, []);

  useEffect(() => {
    // Update total products from localStorage or productData.json
    let productsArr = [];
    const shopData = JSON.parse(localStorage.getItem("shopData"));
    if (shopData && shopData.products) {
      productsArr = shopData.products.filter((p) => !p.hidden);
    } else {
      productsArr = productData.products.filter((p) => !p.hidden);
    }
    setTotalProducts(productsArr.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("attendant");
    navigate("/login");
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This will clear sales, products, and history."
      )
    ) {
      localStorage.removeItem("invoices");
      localStorage.removeItem("shopData");
      localStorage.removeItem("invoiceCounter");
      setTodaySales(0);
      setTotalProducts(productData.products.filter((p) => !p.hidden).length);
      window.location.reload();
    }
  };

  return (
    <>
      <Header attendantName={attendantName} />
      <div className="dashboard-container">
        <h2>Welcome, {attendantName}</h2>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="card">
            <h3>Today's Sales</h3>
            <p>₦{todaySales.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="button-group">
          <button onClick={() => navigate("/manage-sales")}>
            📊 Manage Sales
          </button>
          <button onClick={() => navigate("/manage-products")}>
            📦 Manage Products
          </button>
        
          <button onClick={() => navigate("/kulikuli-production")}>
            🏭 Manage Production
          </button>
          <button onClick={handleResetData} className="reset-btn">
            🧹 Reset All Data
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
