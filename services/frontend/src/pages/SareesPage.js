import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function SareesPage() {
  const [products, setProducts] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSarees() {
      setLoading(true);
      const data = await fetchProducts({ category: 'sarees' });
      setProducts(data || []);
      setLoading(false);
    }
    loadSarees();
  }, []);

  const materials = [
    'All Materials',
    'Pure Katan Silk',
    'Pure Mulberry Silk',
    'Mysore Crepe Silk',
    'Organza Silk',
    'Paithani Pure Silk',
    'Chanderi Silk',
    'Tussar Silk',
    'Pure Silk Ikkat',
    'Khaddi Georgette Silk',
    'Uppada Silk',
    'Gadwal Silk',
    'Baluchari Silk'
  ];

  const filteredProducts = products.filter(p => {
    if (!selectedMaterial || selectedMaterial === 'All Materials') return true;
    return p.material && p.material.toLowerCase().includes(selectedMaterial.toLowerCase());
  }).sort((a, b) => {
    if (selectedSort === 'price-low') return a.price - b.price;
    if (selectedSort === 'price-high') return b.price - a.price;
    if (selectedSort === 'rating') return b.rating - a.rating;
    return b.is_featured ? 1 : -1;
  });

  return (
    <div className="container">
      {/* Category Header Banner */}
      <div style={{
        marginTop: '30px',
        padding: '40px',
        borderRadius: '8px',
        background: 'linear-gradient(rgba(139,0,0,0.85), rgba(80,0,0,0.9)), url("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80") center/cover',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '8px' }}>Pure Handloom Silk Sarees</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: '#fcd34d', fontSize: '1.05rem' }}>
          Certified Silk Mark Handloom masterpieces: Banarasi, Kanchipuram, Mysore, Organza, Paithani, and Tussar silk.
        </p>
      </div>

      <div className="page-layout">
        {/* Filters Sidebar */}
        <aside className="filter-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <SlidersHorizontal size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Filters</h3>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Fabric & Weave</h4>
            <div className="filter-options">
              {materials.map(mat => (
                <label key={mat} className="filter-label">
                  <input
                    type="radio"
                    name="material"
                    checked={selectedMaterial === (mat === 'All Materials' ? '' : mat)}
                    onChange={() => setSelectedMaterial(mat === 'All Materials' ? '' : mat)}
                  />
                  <span>{mat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Sort By</h4>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              Showing <strong>{filteredProducts.length}</strong> Silk Sarees
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>Loading authentic silk sarees...</div>
          ) : (
            <div className="grid-cols-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
