import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, ArrowLeft, Check } from 'lucide-react';
import { fetchProductById } from '../api';
import { useCart } from '../context/CartContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchProductById(id);
      if (data) {
        setProduct(data);
        setActiveImage(data.image_url);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '20px' }}>Back to Home</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '48px' }}>
        {/* Gallery */}
        <div>
          <div style={{ borderRadius: '8px', overflow: 'hidden', height: '480px', background: '#f5f5f5', border: '1px solid var(--border)' }}>
            <img src={activeImage || product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {product.gallery_urls && product.gallery_urls.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {product.gallery_urls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(url)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: activeImage === url ? '2px solid var(--primary)' : '1px solid var(--border)',
                    padding: 0
                  }}
                >
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-gold">{product.category_slug || 'Authentic'}</span>
            {product.is_trending && <span className="badge badge-red">Trending</span>}
            <span className="badge badge-green">In Stock</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '12px', lineHeight: '1.2' }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308' }}>
              <Star size={18} fill="#eab308" color="#eab308" />
              <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>{product.rating}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>| {product.review_count} Customer Reviews & Ratings</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compare_at_price && (
              <>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.compare_at_price.toLocaleString('en-IN')}
                </span>
                <span className="badge badge-red">{discount}% OFF</span>
              </>
            )}
          </div>

          <p style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: '1.8', marginBottom: '28px' }}>
            {product.description}
          </p>

          {/* Specifications table */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '16px', marginBottom: '28px' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Product Specifications</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
              <div><strong>SKU:</strong> {product.sku}</div>
              <div><strong>Material:</strong> {product.material || 'Traditional'}</div>
              <div><strong>Color:</strong> {product.color || 'Vibrant'}</div>
              <div><strong>Dimensions/Size:</strong> {product.size_or_dimension || 'Standard'}</div>
            </div>
          </div>

          {/* Quantity and Add to cart */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: '40px', height: '44px', background: '#f3f4f6', border: 'none', fontSize: '1.1rem' }}
              >
                -
              </button>
              <span style={{ width: '50px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ width: '40px', height: '44px', background: '#f3f4f6', border: 'none', fontSize: '1.1rem' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary"
              style={{
                flexGrow: 1,
                height: '44px',
                justifyContent: 'center',
                background: added ? '#059669' : 'var(--primary)',
                borderColor: added ? '#059669' : 'var(--primary)'
              }}
            >
              {added ? (
                <>
                  <Check size={18} /> Added {quantity} item(s) to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to Cart • ₹{(product.price * quantity).toLocaleString('en-IN')}
                </>
              )}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="var(--primary)" /> 100% Genuine Certified Quality Assurance
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={16} color="var(--primary)" /> Complimentary Insured Express Shipping in 2-4 business days
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={16} color="var(--primary)" /> 7-day hassle-free doorstep returns and exchanges
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
