import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api';

export default function CheckoutPage() {
  const { cartItems, grandTotal, subtotal, shipping, tax, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    address: '42 Heritage Enclave, M.G. Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    paymentMethod: 'UPI'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Your bag is empty</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '16px' }}>Return to Shop</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.postalCode}, India`,
      payment_method: formData.paymentMethod,
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }))
    };

    try {
      const order = await createOrder(payload);
      clearCart();
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Return to Cart
      </Link>

      <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Secure Checkout</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Enter delivery details and select your payment method.</p>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.1fr', gap: '36px' }}>
        {/* Shipping Form */}
        <div style={{ background: 'white', padding: '32px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            1. Shipping & Contact Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>First Name *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Mobile Phone *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Delivery Street Address *</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>City *</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>State *</label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>PIN Code *</label>
              <input
                type="text"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            2. Payment Method
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['UPI (Google Pay / PhonePe / Paytm)', 'Credit or Debit Card', 'Net Banking (All Indian Banks)', 'Cash on Delivery'].map(method => (
              <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={handleChange}
                />
                <span style={{ fontWeight: 500 }}>{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Order Review & Pay */}
        <div>
          <div className="cart-summary-box">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Order Review ({cartItems.length} items)
            </h3>

            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '20px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <img src={item.image_url} alt="" style={{ width: '50px', height: '55px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flexGrow: 1, fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Express Insured Delivery</span>
              <span style={{ color: shipping === 0 ? '#059669' : 'inherit' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border)', paddingTop: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total Payable</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: '48px', fontSize: '1rem' }}
            >
              {loading ? 'Authorizing Payment...' : `Complete Order • ₹${grandTotal.toLocaleString('en-IN')}`}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Lock size={14} color="var(--primary)" /> Bank-Grade Encrypted Transaction
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
