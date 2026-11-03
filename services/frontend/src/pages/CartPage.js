import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, shipping, tax, grandTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <ShoppingBag size={64} color="var(--accent)" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Your Shopping Bag is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px', maxWidth: '450px', margin: '0 auto 28px' }}>
          Explore our collection of handloom pure silk sarees, bridal cosmetics, and handcrafted royal bangles.
        </p>
        <Link to="/" className="btn-primary">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Your Shopping Bag</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Review your selected traditional heirloom pieces and cosmetics.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '36px' }}>
        {/* Cart items list */}
        <div>
          <table className="cart-table">
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <img src={item.image_url} alt={item.name} style={{ width: '70px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <Link to={`/products/${item.id}`} style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                          {item.name}
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>₹{item.price.toLocaleString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px', width: 'fit-content' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '4px 10px', background: '#f9f9f9', border: 'none' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '4px 12px', fontSize: '0.9rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '4px 10px', background: '#f9f9f9', border: 'none' }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', padding: '6px' }}
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div>
          <div className="cart-summary-box">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
              <span style={{ fontWeight: 600 }}>₹{tax.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Insured Express Shipping</span>
              <span style={{ fontWeight: 600, color: shipping === 0 ? '#059669' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>

            {subtotal < 2000 && (
              <p style={{ fontSize: '0.8rem', color: '#b45309', background: '#fef3c7', padding: '8px 12px', borderRadius: '4px', marginBottom: '16px' }}>
                Add ₹{(2000 - subtotal).toLocaleString('en-IN')} more to unlock free express shipping!
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border)', paddingTop: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total Payable</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <Link to="/checkout" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Proceed to Secure Checkout <ArrowRight size={18} />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="var(--primary)" /> 256-Bit SSL Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
