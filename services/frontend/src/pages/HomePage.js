import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Gem, Flame } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';

export default function HomePage() {
  const [sarees, setSarees] = useState([]);
  const [makeup, setMakeup] = useState([]);
  const [bangles, setBangles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [sareeList, makeupList, bangleList, trendList] = await Promise.all([
        fetchProducts({ category: 'sarees' }),
        fetchProducts({ category: 'makeup' }),
        fetchProducts({ category: 'bangles' }),
        fetchProducts({ trending: true })
      ]);
      setSarees((sareeList || []).slice(0, 4));
      setMakeup((makeupList || []).slice(0, 4));
      setBangles((bangleList || []).slice(0, 4));
      setTrending((trendList || []).slice(0, 4));
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div>
      {/* 1. Hero Banner */}
      <section className="hero-section">
        <div className="container">
          <p className="hero-tagline">Royal Heritage Collections</p>
          <h1 className="hero-title">Timeless Elegance in Silk, Cosmetics & Royal Bangles</h1>
          <p className="hero-desc">
            Discover authentic handwoven Indian silk sarees, luxurious dermatological bridal makeup, and handcrafted regal bangles designed for festive grandeur.
          </p>
          <div className="hero-buttons">
            <Link to="/sarees" className="btn-primary">
              Explore Silk Sarees <ArrowRight size={18} />
            </Link>
            <Link to="/makeup" className="btn-secondary">
              Shop Cosmetics
            </Link>
            <Link to="/bangles" className="btn-secondary">
              View Bangles
            </Link>
          </div>
        </div>
      </section>

      {/* Category Spotlight Banners */}
      <section className="category-banners">
        <div className="container">
          <div className="grid-cols-3">
            <Link to="/sarees" className="cat-banner-card">
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80" alt="Silk Sarees" />
              <div className="cat-banner-overlay">
                <span className="badge badge-gold" style={{ width: 'fit-content', marginBottom: '8px' }}>Pure Handloom</span>
                <h3 className="cat-banner-title">Silk Sarees</h3>
                <p style={{ fontSize: '0.85rem' }}>Banarasi, Kanchipuram, Organza & Mysore</p>
              </div>
            </Link>

            <Link to="/makeup" className="cat-banner-card">
              <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80" alt="Makeup Products" />
              <div className="cat-banner-overlay">
                <span className="badge badge-red" style={{ width: 'fit-content', marginBottom: '8px' }}>Bridal Radiance</span>
                <h3 className="cat-banner-title">Cosmetics & Beauty</h3>
                <p style={{ fontSize: '0.85rem' }}>Lipsticks, Foundations, Kohl & Highlighters</p>
              </div>
            </Link>

            <Link to="/bangles" className="cat-banner-card">
              <img src="https://images.unsplash.com/photo-1611591475871-331697203b9b?auto=format&fit=crop&w=800&q=80" alt="Bangles" />
              <div className="cat-banner-overlay">
                <span className="badge badge-gold" style={{ width: 'fit-content', marginBottom: '8px' }}>Royal Jewels</span>
                <h3 className="cat-banner-title">Ethnic Bangles</h3>
                <p style={{ fontSize: '0.85rem' }}>Kundan Kadas, Glass Churis & Bridal Chooda</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Silk Sarees */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Heirloom Weaves</p>
            <h2 className="section-title">Featured Silk Sarees</h2>
            <div className="section-divider"></div>
          </div>
          <div className="grid-cols-4">
            {sarees.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/sarees" className="btn-primary">
              View All 20 Silk Sarees <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Makeup Products */}
      <section style={{ padding: '60px 0', background: '#fdf6f6' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Flawless Glamour</p>
            <h2 className="section-title">Featured Makeup & Cosmetics</h2>
            <div className="section-divider"></div>
          </div>
          <div className="grid-cols-4">
            {makeup.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/makeup" className="btn-primary">
              Explore All 20 Cosmetics <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Bangles */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Artisan Adornments</p>
            <h2 className="section-title">Featured Royal Bangles</h2>
            <div className="section-divider"></div>
          </div>
          <div className="grid-cols-4">
            {bangles.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/bangles" className="btn-primary">
              View All 20 Bangle Sets <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Trending Collections */}
      <section style={{ padding: '60px 0 80px', background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle" style={{ color: '#dc2626' }}>
              <Flame size={14} style={{ display: 'inline', marginRight: '4px' }} />
              High in Demand
            </p>
            <h2 className="section-title">Trending Festive Collections</h2>
            <div className="section-divider"></div>
          </div>
          <div className="grid-cols-4">
            {trending.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
