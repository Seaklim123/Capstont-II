import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authCartApi, productApi, getImageUrl } from '../services/api';

export function BestSellers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        // Fetch real products from backend
        const response = await productApi.getAll();
        const products = response.data || response || [];
        
        // Filter for best sellers only
        const bestSellerProducts = products.filter(p => p.is_best_seller || p.is_bestseller);
        
        // If no best sellers found, show first 3 products
        if (bestSellerProducts.length === 0) {
          console.log('No best sellers found, showing first 3 products');
          setItems(products.slice(0, 3));
        } else {
          // Take top 3 best sellers
          setItems(bestSellerProducts.slice(0, 3));
        }
        
        // Debug: Log first product structure
        if (products.length > 0) {
          console.log('First product data:', products[0]);
          console.log('Image fields:', {
            image: products[0].image,
            image_path: products[0].image_path,
            image_url: products[0].image_url
          });
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        // Fallback to empty array if API fails
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <section className="best-sellers container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Best Sellers</h2>
        <p>Loading...</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="best-sellers container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Best Sellers</h2>
        <p>No products available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="best-sellers" style={{ 
      padding: window.innerWidth <= 768 ? '2.5rem 0' : '4rem 0', 
      backgroundColor: '#ffffff' 
    }}>
      <div className="container" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: window.innerWidth <= 768 ? '0 1.25rem' : '0 1rem'
      }}>
        <div className="best-sellers-header" style={{ 
          textAlign: 'center', 
          marginBottom: window.innerWidth <= 768 ? '2rem' : '3rem' 
        }}>
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
          <h2 style={{ 
            fontSize: window.innerWidth <= 768 ? '1.65rem' : '2rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem', 
            color: '#1a1a1a' 
          }}>Best Sellers</h2>
          <p style={{ 
            color: '#666', 
            fontSize: window.innerWidth <= 768 ? '0.95rem' : '1rem' 
          }}>
            Our customers' favorite dishes, loved by many.
          </p>
        </div>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: window.innerWidth <= 768 ? '1rem' : '1.5rem',
          maxWidth: '1500px',
          margin: '0 auto',
          padding: window.innerWidth <= 768 ? '0' : '0 1rem'
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
                  height: window.innerWidth <= 768 ? '180px' : '200px', 
                  overflow: 'hidden',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={getImageUrl(item.image_path || item.image) || 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop'} 
                    alt={item.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                    onError={(e) => { 
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop';
                    }}
                  />
                </div>
              </div>
              <div style={{ 
                padding: window.innerWidth <= 768 ? '1rem' : '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: window.innerWidth <= 768 ? '0.75rem' : '1rem'
              }}>
                <h4 style={{ 
                  margin: 0,
                  fontWeight: '600',
                  fontSize: window.innerWidth <= 768 ? '1rem' : '1.05rem',
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
                        fontSize: window.innerWidth <= 768 ? '1.1rem' : '1.25rem',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}>${parseFloat(item.price || 0).toFixed(2)}</span>
                      {item.discount > 0 && (
                        <span style={{
                          fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.875rem',
                          color: '#999',
                          textDecoration: 'line-through',
                          fontWeight: '400'
                        }}>${(parseFloat(item.price || 0) / (1 - item.discount / 100)).toFixed(2)}</span>
                      )}
                    </div>
                    {item.discount > 0 && (
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: '#f0f0f0',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        color: '#333',
                        width: 'fit-content'
                      }}>{item.discount}% OFF</span>
                    )}
                  </div>
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      console.log('🛒 Best Seller - Add to Cart clicked for:', item.name);
                      
                      const tableNumber = localStorage.getItem('tableNumber');
                      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
                      
                      console.log('🛒 Table number:', tableNumber);
                      console.log('🛒 Has token:', !!token);
                      
                      try {
                        if (token && tableNumber) {
                          // Authenticated user with table - use backend API
                          console.log('🛒 Using backend API');
                          await authCartApi.addItem({
                            product_id: item.id,
                            quantity: 1,
                            status: 'starting',
                            table_id: parseInt(tableNumber, 10)
                          });
                          console.log('✅ Added to backend cart');
                        } else {
                          // Guest user - use localStorage
                          console.log('🛒 Using localStorage cart');
                          const existing = localStorage.getItem('cart');
                          const cart = existing ? JSON.parse(existing) : [];
                          console.log('🛒 Current cart:', cart);
                          
                          const idx = cart.findIndex(ci => ci.id === item.id);
                          if (idx > -1) {
                            cart[idx].quantity += 1;
                            console.log('🛒 Updated quantity for existing item');
                          } else {
                            cart.push({ 
                              id: item.id, 
                              name: item.name, 
                              price: item.price, 
                              image_path: item.image, 
                              quantity: 1 
                            });
                            console.log('🛒 Added new item to cart');
                          }
                          localStorage.setItem('cart', JSON.stringify(cart));
                          console.log('✅ Cart saved to localStorage:', cart);
                        }
                        
                        toast.success(`${item.name} added to cart!`);
                        window.dispatchEvent(new Event('cartUpdated'));
                        console.log('🚀 Navigating to cart...');
                        setTimeout(() => navigate('/cart'), 500);
                      } catch (error) {
                        console.error('❌ Error adding to cart:', error);
                        toast.error('Failed to add to cart');
                      }
                    }} 
                    style={{ 
                      padding: window.innerWidth <= 768 ? '0.625rem 1rem' : '0.65rem 1.5rem',
                      borderRadius: '25px',
                      border: '1px solid #e0e0e0',
                      background: '#fff',
                      color: '#333',
                      fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.875rem',
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
