import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Trust Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', paddingBottom: '40px', borderBottom: '1px solid #374151', marginBottom: '40px', textAlign: 'center' }}>
          <div>
            <Truck size={28} color="#d4af37" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Pan-India Express Delivery</h4>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Safe, insured doorstep courier</p>
          </div>
          <div>
            <ShieldCheck size={28} color="#d4af37" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Silk Mark Certified</h4>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>100% Genuine Handloom Zari</p>
          </div>
          <div>
            <RefreshCw size={28} color="#d4af37" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Easy 7-Day Returns</h4>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Hassle-free replacement policy</p>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h3 style={{ color: '#fff', marginBottom: '12px' }}>Sanskriti</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#9ca3af', marginBottom: '16px' }}>
              Celebrating Indian craftsmanship, timeless heritage handloom sarees, dermatologically formulated wedding cosmetics, and handcrafted royal bridal jewelry.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#d4af37' }}>
              Handcrafted with <Heart size={14} color="#d4af37" fill="#d4af37" /> for Indian Heritage
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/sarees">Banarasi & Kanchipuram Sarees</Link></li>
              <li><Link to="/makeup">Bridal Makeup & Kohl</Link></li>
              <li><Link to="/bangles">Kundan & Glass Bangles</Link></li>
              <li><Link to="/admin">Admin Operations</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Customer Support</h4>
            <ul className="footer-links">
              <li><a href="#care">Saree Care Instructions</a></li>
              <li><a href="#shipping">Track Your Consignment</a></li>
              <li><a href="#terms">Terms & Authenticity Guarantee</a></li>
              <li><a href="#privacy">Privacy & Security</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Boutique</h4>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: '1.6' }}>
              Heritage House, 42 Silk Market Road<br />
              Bengaluru, Karnataka 560001<br />
              Email: care@sanskriti-heritage.com<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Sanskriti Traditional Fashion & Beauty. All rights reserved. Microservices DevOps Automation Architecture.
        </div>
      </div>
    </footer>
  );
}
