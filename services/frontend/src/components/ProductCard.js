import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-img-wrapper">
        <img src={product.image_url} alt={product.name} className="product-img" loading="lazy" />
        <div className="product-badge-overlay">
          {product.is_featured && <span className="badge badge-gold" style={{ marginRight: '6px' }}>Featured</span>}
          {discount && <span className="badge badge-red">{discount}% OFF</span>}
        </div>
      </Link>

      <div className="product-info">
        <div className="product-category-meta">{product.material || product.category_slug}</div>
        <Link to={`/products/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <div className="product-rating">
          <Star size={14} fill="#eab308" color="#eab308" />
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{product.rating}</span>
          <span style={{ color: 'var(--text-muted)' }}>({product.review_count})</span>
        </div>

        <div className="price-row">
          <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.compare_at_price && (
            <span className="original-price">₹{product.compare_at_price.toLocaleString('en-IN')}</span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className="add-cart-btn"
          style={added ? { background: '#059669', color: '#fff', borderColor: '#059669' } : {}}
        >
          {added ? (
            <>
              <Check size={16} /> Added to Bag
            </>
          ) : (
            <>
              <ShoppingBag size={16} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
