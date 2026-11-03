import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';
import { SlidersHorizontal } from 'lucide-react';

export default function MakeupPage() {
  const [products, setProducts] = useState([]);
  const [selectedSubtype, setSelectedSubtype] = useState('All');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMakeup() {
      setLoading(true);
      const data = await fetchProducts({ category: 'makeup' });
      setProducts(data || []);
      setLoading(false);
    }
    loadMakeup();
  }, []);

  const subtypes = [
    'All',
    'Lipstick',
    'Foundation',
    'Powder',
    'Eyeliner',
    'Blush',
    'Mascara',
    'Primer',
    'Palette',
    'Highlighter'
  ];

  const filtered = products.filter(p => {
    if (selectedSubtype === 'All') return true;
    return p.name.toLowerCase().includes(selectedSubtype.toLowerCase()) ||
           (p.material && p.material.toLowerCase().includes(selectedSubtype.toLowerCase()));
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
        background: 'linear-gradient(rgba(100,20,40,0.85), rgba(70,10,30,0.9)), url("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80") center/cover',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '8px' }}>Bridal & Festive Cosmetics</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: '#fbcfe8', fontSize: '1.05rem' }}>
          Long-wearing, dermatologically tested pigments: Velvet Matte Lipsticks, Serum Foundations, Organic Kohl, and Highlighters.
        </p>
      </div>

      <div className="page-layout">
        {/* Filters Sidebar */}
        <aside className="filter-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <SlidersHorizontal size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Category Filters</h3>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Product Type</h4>
            <div className="filter-options">
              {subtypes.map(sub => (
                <label key={sub} className="filter-label">
                  <input
                    type="radio"
                    name="makeup-type"
                    checked={selectedSubtype === sub}
                    onChange={() => setSelectedSubtype(sub)}
                  />
                  <span>{sub}</span>
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
              Showing <strong>{filtered.length}</strong> Makeup Products
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>Loading cosmetics...</div>
          ) : (
            <div className="grid-cols-3">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
