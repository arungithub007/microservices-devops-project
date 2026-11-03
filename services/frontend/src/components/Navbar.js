import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sparkles, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header>
      <div className="top-bar">
        ✨ Complimentary Insured Express Shipping on Orders Above ₹2,000 | 100% Authentic Handloom Silk & Certified Cosmetics
      </div>
      <nav className="navbar">
        <div className="container nav-content">
          <Link to="/" className="logo-area">
            <span className="brand-name">Sanskriti</span>
            <span className="brand-subtitle">Traditional Fashion & Beauty</span>
          </Link>

          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/sarees" className={`nav-link ${isActive('/sarees') ? 'active' : ''}`}>
                Silk Sarees
              </Link>
            </li>
            <li>
              <Link to="/makeup" className={`nav-link ${isActive('/makeup') ? 'active' : ''}`}>
                Makeup
              </Link>
            </li>
            <li>
              <Link to="/bangles" className={`nav-link ${isActive('/bangles') ? 'active' : ''}`}>
                Bangles
              </Link>
            </li>
            <li>
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <LayoutDashboard size={15} /> Admin
              </Link>
            </li>
          </ul>

          <div className="nav-actions">
            <Link to="/cart" className="cart-icon-btn" title="View Cart">
              <ShoppingBag size={24} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
