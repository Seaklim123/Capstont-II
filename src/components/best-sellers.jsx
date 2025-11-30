import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for best sellers
const mockBestSellers = [
  {
    id: 101,
    name: 'Spicy Ramen Bowl',
    price: 13.99,
    originalPrice: 17.49,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    is_best_seller: true
  },
  {
    id: 102,
    name: 'Margherita Pizza',
    price: 15.99,
    originalPrice: 19.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    is_best_seller: true
  },
  {
    id: 103,
    name: 'Sushi Platter',
    price: 22.99,
    originalPrice: 28.74,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    is_best_seller: true
  },
  {
    id: 104,
    name: 'Steak & Fries',
    price: 24.99,
    originalPrice: 31.24,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400',
    is_best_seller: true
  }
];

export function BestSellers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setItems(mockBestSellers);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
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
    <section className="best-sellers" style={{ padding: '4rem 0', backgroundColor: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="best-sellers-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="best-sellers-badge" style={{
            display: 'inline-block',
            backgroundColor: '#333',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>Best Sellers</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1a1a1a' }}>Best Sellers</h2>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Our customers' favorite dishes, loved by many.
          </p>
        </div>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2.5rem',
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          {items.slice(0, 3).map(item => (
            <div key={item.id} style={{ 
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              border: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
            }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  zIndex: 10,
                  color: '#333',
                  border: '1px solid rgba(0,0,0,0.05)',
                  letterSpacing: '0.3px'
                }}>50+ Sold</span>
                <div style={{ 
                  height: '200px', 
                  overflow: 'hidden',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                  />
                </div>
              </div>
              <div style={{ 
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <h4 style={{ 
                  margin: 0,
                  fontWeight: '600',
                  fontSize: '1.05rem',
                  color: '#1a1a1a',
                  lineHeight: '1.4',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>{item.name}</h4>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}>${parseFloat(item.price || 0).toFixed(2)}</span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#999',
                        textDecoration: 'line-through',
                        fontWeight: '400'
                      }}>${parseFloat(item.originalPrice || 0).toFixed(2)}</span>
                    </div>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#f0f0f0',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      color: '#333',
                      alignSelf: 'flex-start'
                    }}>${((item.originalPrice - item.price) || 0).toFixed(2)} OFF</span>
                  </div>
                  <button 
                    onClick={() => {
                      const existing = localStorage.getItem('cart');
                      const cart = existing ? JSON.parse(existing) : [];
                      const idx = cart.findIndex(ci => ci.id === item.id);
                      if (idx > -1) cart[idx].quantity += 1; 
                      else cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
                      localStorage.setItem('cart', JSON.stringify(cart));
                      window.dispatchEvent(new Event('cartUpdated'));
                    }} 
                    style={{ 
                      padding: '0.65rem 1.5rem',
                      borderRadius: '25px',
                      border: '1px solid #e0e0e0',
                      background: '#fff',
                      color: '#333',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8f8f8';
                      e.target.style.borderColor = '#ccc';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#fff';
                      e.target.style.borderColor = '#e0e0e0';
                    }}
                  >Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
