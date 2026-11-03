import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';
import { SlidersHorizontal } from 'lucide-react';

export default function BanglesPage() {
  const [products, setProducts] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBangles() {
      setLoading(true);
      const data = await fetchProducts({ category: 'bangles' });
      setProducts(data || []);
      setLoading(false);
    }
    loadBangles();
  }, []);

  const materials = [
    'All',
    'Gold Plated',
    'Glass',
    'Kundan',
    'Stone / Diamond',
    'Oxidised Silver',
    'Pearl',
    'Velvet',
    'Lac',
    'Silk Thread'
  ];

  const colors = [
    'All',
    'Gold',
    'Red',
    'Green',
    'Silver',
    'Ivory',
    'Blue',
    'Purple'
  ];

  const filtered = products.filter(p => {
    const matMatch = selectedMaterial === 'All' ||
      (p.material && p.material.toLowerCase().includes(selectedMaterial.toLowerCase())) ||
      (p.name.toLowerCase().includes(selectedMaterial.toLowerCase()));

    const colMatch = selectedColor === 'All' ||
      (p.color && p.color.toLowerCase().includes(selectedColor.toLowerCase())) ||
      (p.name.toLowerCase().includes(selectedColor.toLowerCase()));

    return matMatch && colMatch;
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
        background: 'linear-gradient(rgba(100,70,10,0.85), rgba(60,40,5,0.9)), url("https://images.unsplash.com/photo-1611591475871-331697203b9b?auto=format&fit=crop&w=1200&q=80") center/cover',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '8px' }}>Ethnic & Bridal Royal Bangles</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: '#fef08a', fontSize: '1.05rem' }}>
          Handcrafted bridal kadas, chiming festive glass churis, uncut kundan stone sets, and antique temple nakshi jewelry.
        </p>
      </div>

      <div className="page-layout">
        {/* Filters Sidebar */}
        <aside className="filter-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <SlidersHorizontal size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Bangle Filters</h3>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Material</h4>
            <div className="filter-options">
              {materials.map(mat => (
                <label key={mat} className="filter-label">
                  <input
                    type="radio"
                    name="bangle-material"
                    checked={selectedMaterial === mat}
                    onChange={() => setSelectedMaterial(mat)}
                  />
                  <span>{mat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Color</h4>
            <div className="filter-options">
              {colors.map(col => (
                <label key={col} className="filter-label">
                  <input
                    type="radio"
                    name="bangle-color"
                    checked={selectedColor === col}
                    onChange={() => setSelectedColor(col)}
                  />
                  <span>{col}</span>
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
              Showing <strong>{filtered.length}</strong> Bangle Sets
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>Loading bangles...</div>
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
