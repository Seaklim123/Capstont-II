import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';

export function BestSellers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchBest = async () => {
      try {
        setLoading(true);
        const res = await productApi.getBestSellers();
        // debug log to help verify mock responses
        console.debug('BestSellers API response:', res);
        // API returns either { data: [...] } or an array depending on implementation
        const data = res && res.data ? res.data : res;
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load best sellers', err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBest();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <section className="best-sellers container" style={{ padding: '24px 20px' }}>
        <h2>Best Sellers</h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="best-sellers container" style={{ padding: '24px 20px' }}>
      <h2 style={{ marginBottom: 12 }}>Best Sellers</h2>
      {items.length === 0 ? (
        <p style={{ color: '#666' }}>No best sellers available.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
          {items.map(item => (
            <div key={item.id} className="best-item" style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                {item.image ? (
                  // If image is a path, show it; otherwise placeholder
                  <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6 }} />
                ) : (
                  <div style={{ width: 100, height: 80, background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', borderRadius: 6 }}>
                    Image
                  </div>
                )}
              </div>
              <h4 style={{ margin: '6px 0', fontSize: 16 }}>{item.name}</h4>
              <div style={{ color: '#333', marginBottom: 8 }}>${parseFloat(item.price || 0).toFixed(2)}</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button onClick={() => navigate(`/product/${item.id}`)} style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}>View</button>
                <button onClick={() => {
                  // add to localStorage cart as fallback when no auth
                  const existing = localStorage.getItem('cart');
                  const cart = existing ? JSON.parse(existing) : [];
                  const idx = cart.findIndex(ci => ci.id === item.id);
                  if (idx > -1) cart[idx].quantity += 1; else cart.push({ id: item.id, name: item.name, price: item.price, quantity: 1 });
                  localStorage.setItem('cart', JSON.stringify(cart));
                  window.dispatchEvent(new Event('cartUpdated'));
                }} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #007bff', background: '#fff', color: '#007bff', cursor: 'pointer' }}>Add</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default BestSellers;
