import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/Discount.css";
import { categoryApi, productApi, authCartApi, getImageUrl as getImageUrlHelper } from '../services/api';
import toast from 'react-hot-toast';

function Discount() {
  const navigate = useNavigate();
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // STEP 1: Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products from: http://127.0.0.1:8000/api/products');
        const response = await productApi.getAll();
        console.log('Products response:', response);
        
        if (response.data) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter to show only products with discount (dollar value)
  const discountProducts = products.filter(p => p.discount && parseFloat(p.discount) > 0);

  // Use shared helper for consistent image URLs
  const getImageUrl = (imagePath) => getImageUrlHelper(imagePath) || "https://via.placeholder.com/150";

  if (loading) {
    return (
      <div className="discount-container font-sans">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading products...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discount-container font-sans">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <h2>{error}</h2>
          <p>Make sure your backend is running on http://127.0.0.1:8000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="discount-container font-sans">
      {/* Top Section */}
      <section className="discount-hero text-center py-12">
        <button className="discount-btn">Discount</button>
        <h1>Our Discount</h1>
        <p className="subtitle">Save big with our exclusive limited-time offers.</p>
      </section>

      {/* Dishes Section */}
      <section className="dishes-section">
        <h2 className="section-title">Discount Dishes ({discountProducts.length})</h2>
        {discountProducts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>No discount products available</p>
          ) : (
          <div className="dishes-grid">
            {discountProducts.map((product) => (
              <div className="dish-card" key={product.id} style={{ cursor: 'pointer' }}>
                <div style={{ position: 'relative' }}>
                  {product.is_best_seller && (
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: '#1f2937',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      zIndex: 2,
                      letterSpacing: '0.5px'
                    }}>BEST SELLER</span>
                  )}
                  {product.sold_count > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      backgroundColor: '#1f2937',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      zIndex: 2
                    }}>{product.sold_count}+ Sold</span>
                  )}

                  <div style={{ height: '240px', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
                    <img
                      src={getImageUrl(product.image_path || product.image)}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=No+Image"; }}
                    />
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '600', color: '#1f2937', lineHeight: '1.4' }}>{product.name}</h4>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: '700', color: '#1f2937' }}>${parseFloat(product.price).toFixed(2)}</span>
                        {parseFloat(product.discount) > 0 && (
                          <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.95rem' }}>${(parseFloat(product.price) + parseFloat(product.discount)).toFixed(2)}</span>
                        )}
                      </div>
                      {parseFloat(product.discount) > 0 && (
                        <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '600', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>${parseFloat(product.discount).toFixed(2)} OFF</span>
                      )}
                    </div>

                    <button 
                      onClick={async (e) => { 
                        e.stopPropagation();
                        
                        const tableNumber = localStorage.getItem('tableNumber');
                        if (!tableNumber) {
                          toast.error('Please enter your table number first', { duration: 4000, icon: '🔢' });
                          navigate('/menu');
                          return;
                        }
                        
                        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
                        
                        try {
                          if (token && tableNumber) {
                            await authCartApi.addItem({
                              product_id: product.id,
                              quantity: 1,
                              status: 'starting',
                              table_id: parseInt(tableNumber, 10)
                            });
                          } else {
                            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                            const existingIndex = cart.findIndex(item => item.id === product.id);
                            
                            if (existingIndex > -1) {
                              cart[existingIndex].quantity += 1;
                            } else {
                              cart.push({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image_path: product.image_path || product.image,
                                quantity: 1
                              });
                            }
                            
                            localStorage.setItem('cart', JSON.stringify(cart));
                          }
                          
                          toast.success('Added to cart!');
                          window.dispatchEvent(new Event('cartUpdated'));
                          setTimeout(() => navigate('/cart'), 500);
                        } catch (error) {
                          console.error('Error adding to cart:', error);
                          toast.error('Failed to add to cart');
                        }
                      }}
                      style={{
                        padding: '0.7rem 1.75rem',
                        backgroundColor: '#1f2937',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#111827';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#1f2937';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      
    </div>
        
  );
}

export default Discount;