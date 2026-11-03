import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import SareesPage from './pages/SareesPage';
import MakeupPage from './pages/MakeupPage';
import BanglesPage from './pages/BanglesPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sarees" element={<SareesPage />} />
              <Route path="/makeup" element={<MakeupPage />} />
              <Route path="/bangles" element={<BanglesPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}
