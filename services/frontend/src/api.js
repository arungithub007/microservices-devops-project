/**
 * API Service Client for Traditional Fashion & Beauty Store
 * Communicates with the Flask Backend API with graceful offline fallback.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'DEGRADED', error: err.message };
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Backend unavailable, using static categories fallback', err);
    return [
      { id: 1, name: 'Silk Sarees', slug: 'sarees', description: 'Handcrafted pure silk sarees', image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
      { id: 2, name: 'Makeup Products', slug: 'makeup', description: 'Bridal & festive beauty essentials', image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80' },
      { id: 3, name: 'Bangles', slug: 'bangles', description: 'Kundan, stone & festive bangles', image_url: 'https://images.unsplash.com/photo-1611591475871-331697203b9b?auto=format&fit=crop&w=800&q=80' }
    ];
  }
}

export async function fetchProducts(params = {}) {
  try {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.material) searchParams.append('material', params.material);
    if (params.color) searchParams.append('color', params.color);
    if (params.featured) searchParams.append('featured', 'true');
    if (params.trending) searchParams.append('trending', 'true');
    if (params.q) searchParams.append('q', params.q);

    const res = await fetch(`${API_BASE_URL}/products?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Backend unavailable, generating responsive fallback data', err);
    return getFallbackProducts(params);
  }
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    const data = await res.json();
    return data.data;
  } catch (err) {
    const all = getFallbackProducts({});
    return all.find(p => p.id === parseInt(id)) || all[0];
  }
}

export async function createOrder(orderPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) throw new Error('Failed to submit order');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Backend offline, generating mock order confirmation', err);
    return {
      id: Math.floor(Math.random() * 1000) + 10,
      order_number: `ORD-${Date.now().toString().slice(-8)}`,
      total_amount: orderPayload.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0),
      customer_name: orderPayload.customer_name,
      customer_email: orderPayload.customer_email,
      shipping_address: orderPayload.shipping_address,
      status: 'Processing',
      payment_status: 'Paid',
      created_at: new Date().toISOString()
    };
  }
}

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.data;
  } catch (err) {
    return [
      { id: 1, order_number: 'ORD-20261103-001', customer_name: 'Priya Sharma', total_amount: 23398.00, status: 'Processing', payment_status: 'Paid', created_at: '2026-11-03T09:30:00Z' }
    ];
  }
}

// Fallback catalog for offline / disconnected UI development
function getFallbackProducts(filters) {
  const catalog = [
    { id: 1, category_id: 1, category_slug: 'sarees', name: 'Royal Crimson Banarasi Katan Silk Saree', price: 18499, compare_at_price: 22999, sku: 'SAR-BAN-001', material: 'Pure Katan Silk', color: 'Crimson Red', rating: 4.9, review_count: 128, is_featured: true, is_trending: true, image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', description: 'Pure handwoven Banarasi Katan silk in deep crimson red.' },
    { id: 2, category_id: 1, category_slug: 'sarees', name: 'Temple Gold Kanchipuram Bridal Silk Saree', price: 26500, compare_at_price: 31000, sku: 'SAR-KAN-002', material: 'Pure Mulberry Silk', color: 'Mustard Gold', rating: 5.0, review_count: 94, is_featured: true, is_trending: true, image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', description: 'Traditional South Indian bridal Kanchipuram heavy silk saree.' },
    { id: 3, category_id: 1, category_slug: 'sarees', name: 'Royal Navy Mysore Crepe Silk Saree', price: 12200, compare_at_price: 14500, sku: 'SAR-MYS-003', material: 'Mysore Crepe Silk', color: 'Navy Blue', rating: 4.8, review_count: 76, is_featured: true, is_trending: false, image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', description: 'Lightweight lustrous KSIC Mysore silk saree.' },
    { id: 4, category_id: 1, category_slug: 'sarees', name: 'Pastel Mint Sheer Organza Silk Saree', price: 9800, compare_at_price: 11500, sku: 'SAR-ORG-004', material: 'Organza Silk', color: 'Mint Green', rating: 4.7, review_count: 52, is_featured: true, is_trending: true, image_url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80', description: 'Delicate organza silk draped with hand-painted floral motifs.' },
    { id: 21, category_id: 2, category_slug: 'makeup', name: 'Velvet Matte Long-Wear Lipstick - Royal Crimson', price: 1199, compare_at_price: 1499, sku: 'MKP-LIP-021', material: 'Liquid Matte', color: 'Royal Crimson', rating: 4.9, review_count: 310, is_featured: true, is_trending: true, image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80', description: 'Ultra-pigmented transfer-proof matte liquid lipstick.' },
    { id: 22, category_id: 2, category_slug: 'makeup', name: 'Luminous Radiance Serum Foundation', price: 1850, compare_at_price: 2200, sku: 'MKP-FND-022', material: 'Serum Base', color: 'Warm Honey', rating: 4.8, review_count: 245, is_featured: true, is_trending: true, image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80', description: 'Breathable medium-to-full coverage liquid foundation.' },
    { id: 23, category_id: 2, category_slug: 'makeup', name: 'Flawless Finish Oil-Control Compact Powder', price: 899, compare_at_price: 1100, sku: 'MKP-CMP-023', material: 'Pressed Powder', color: 'Natural Beige', rating: 4.7, review_count: 180, is_featured: true, is_trending: false, image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80', description: 'Micro-milled silky mineral pressed powder.' },
    { id: 24, category_id: 2, category_slug: 'makeup', name: '24-Hour Waterproof Jet Black Kohl Eyeliner', price: 499, compare_at_price: 650, sku: 'MKP-EYE-024', material: 'Kohl Pencil', color: 'Jet Black', rating: 4.9, review_count: 520, is_featured: true, is_trending: true, image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80', description: 'Intense carbon black smudge-proof kajal pencil.' },
    { id: 41, category_id: 3, category_slug: 'bangles', name: 'Royal Kundan & Ruby Bridal Kada Set (Set of 2)', price: 4899, compare_at_price: 5999, sku: 'BAN-KUN-041', material: 'Brass & Gold Plated', color: 'Ruby Red & Gold', rating: 4.9, review_count: 114, is_featured: true, is_trending: true, image_url: 'https://images.unsplash.com/photo-1611591475871-331697203b9b?auto=format&fit=crop&w=800&q=80', description: 'Opulent bridal kada studded with uncut kundan stones.' },
    { id: 42, category_id: 3, category_slug: 'bangles', name: 'Traditional 22K Gold Plated Filigree Bangles (Set of 4)', price: 2450, compare_at_price: 2999, sku: 'BAN-GLD-042', material: 'Gold Plated Alloy', color: 'Shining Gold', rating: 4.8, review_count: 98, is_featured: true, is_trending: false, image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', description: 'Graceful filigree lattice work bangles with micro pearls.' },
    { id: 43, category_id: 3, category_slug: 'bangles', name: 'Emerald Green Festive Glass Bangles (Set of 24)', price: 499, compare_at_price: 699, sku: 'BAN-GLS-043', material: 'Glass', color: 'Emerald Green', rating: 4.7, review_count: 210, is_featured: true, is_trending: true, image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', description: 'Traditional chiming handcrafted Firozabad glass bangles.' }
  ];

  let res = [...catalog];
  if (filters.category) {
    res = res.filter(p => p.category_slug === filters.category);
  }
  if (filters.featured) {
    res = res.filter(p => p.is_featured);
  }
  if (filters.trending) {
    res = res.filter(p => p.is_trending);
  }
  return res;
}
