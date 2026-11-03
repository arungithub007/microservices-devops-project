import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, Printer } from 'lucide-react';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  return (
    <div className="container" style={{ padding: '60px 20px 100px', maxWidth: '850px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <CheckCircle2 size={72} color="#059669" style={{ margin: '0 auto 16px' }} />
        <span className="badge badge-green" style={{ marginBottom: '12px' }}>Order Confirmed & Payment Verified</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Thank You For Your Order!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          We have received your order and our artisan master weavers & warehouse team have initiated careful dispatch preparations.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order Reference Number</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
              {order.order_number || `ORD-${order.id}`}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Delivery</div>
            <div style={{ fontWeight: 600, color: '#059669' }}>
              {deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Customer Name</h4>
            <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.customer_email}</div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Shipping Address</h4>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{order.shipping_address}</div>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payment Status & Mode</div>
            <div style={{ fontWeight: 600 }}>{order.payment_status || 'Paid'} via {order.payment_method || 'Online'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount Paid</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{Number(order.total_amount).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button
          onClick={() => window.print()}
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', borderColor: 'var(--primary)' }}
        >
          <Printer size={16} /> Print Receipt
        </button>
        <Link to="/" className="btn-primary">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
