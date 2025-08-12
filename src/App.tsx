import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/groundnut-theme.css';
import { CartProvider } from './context/CartContext';
import { PricingProvider } from './context/PricingContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import GroundnutBackground from './components/GroundnutBackground';
import NotificationContainer from './components/NotificationContainer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import FactoryDashboard from './pages/FactoryDashboard';
import ShopDashboard from './pages/ShopDashboard';
import CostCalculator from './pages/CostCalculator';
import InventoryManagement from './pages/InventoryManagement';
import SalesAnalytics from './pages/SalesAnalytics';
import RecordSale from './pages/RecordSale';
import SalesHistory from './pages/SalesHistory';
import HomeDelivery from './pages/HomeDelivery';
import DeliveryOrders from './pages/DeliveryOrders';
import PublicDelivery from './pages/PublicDelivery';
import LoginPage from './pages/LoginPage';
import GoogleSheetsStatus from './pages/GoogleSheetsStatus';
import SalesConfiguration from './pages/SalesConfiguration';
import GoogleSheetsSetup from './pages/GoogleSheetsSetup';
import ProductManagement from './pages/ProductManagement';
import EndOfDaySales from './pages/EndOfDaySales';
import AccessControlDashboard from './pages/AccessControlDashboard';
import TermsAndConditions from './pages/TermsAndConditions';
import ProtectedRoute from './components/ProtectedRoute';
import { PERMISSIONS } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PricingProvider>
        <CartProvider>
          <NotificationProvider>
          <Router>
            <GroundnutBackground variant="light" pattern="subtle">
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:category" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/delivery" element={<PublicDelivery />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin/google-sheets" element={<GoogleSheetsStatus />} />
                  <Route path="/admin/sales-config" element={<SalesConfiguration />} />
                  <Route path="/admin/setup-sheets" element={<GoogleSheetsSetup />} />

                  {/* Protected Routes */}
                  <Route
                    path="/factory"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_PRODUCTION}>
                        <FactoryDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shop"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.PROCESS_SALES}>
                        <ShopDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/factory/costs"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_COSTS}>
                        <CostCalculator />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shop/inventory"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_INVENTORY}>
                        <InventoryManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ANALYTICS}>
                        <SalesAnalytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shop/analytics"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_SHOP_REPORTS}>
                        <SalesAnalytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shop/sales"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.PROCESS_SALES}>
                        <RecordSale />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shop/history"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ORDERS}>
                        <SalesHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shop/delivery"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.PROCESS_SALES}>
                        <HomeDelivery />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shop/delivery-orders"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ORDERS}>
                        <DeliveryOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_INVENTORY}>
                        <ProductManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/end-of-day"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ANALYTICS}>
                        <EndOfDaySales />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/access-control"
                    element={
                      <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_INVENTORY}>
                        <AccessControlDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/terms" element={<TermsAndConditions />} />
                </Routes>
              </main>
              <Footer />
              </div>
              <NotificationContainer />
            </GroundnutBackground>
          </Router>
          </NotificationProvider>
        </CartProvider>
      </PricingProvider>
    </AuthProvider>
  );
}

export default App;
