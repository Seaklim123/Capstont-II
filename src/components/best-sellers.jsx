import { useState, useEffect } from "react"
import { productApi } from "../services/api"

export function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add responsive styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 768px) {
        .best-sellers-grid-mobile {
          display: flex !important;
          overflow-x: auto !important;
          gap: 1rem !important;
          padding: 0 1rem 1rem 1rem !important;
          scroll-snap-type: x mandatory !important;
          -webkit-overflow-scrolling: touch !important;
          scrollbar-width: none !important;
        }
        .best-sellers-grid-mobile::-webkit-scrollbar {
          display: none !important;
        }
        .best-sellers-grid-mobile > div {
          flex: 0 0 calc(50% - 0.5rem) !important;
          max-width: calc(50% - 0.5rem) !important;
          min-width: calc(50% - 0.5rem) !important;
          scroll-snap-align: start !important;
          border-radius: 12px !important;
        }
        .best-menu-section {
          padding: 2rem 0 !important;
        }
        .best-menu-container {
          padding: 0 !important;
        }
        .best-menu-header {
          margin-bottom: 1.5rem !important;
          padding: 0 1rem !important;
        }
        .best-menu-header h2 {
          font-size: 1.5rem !important;
        }
        .best-menu-header p {
          font-size: 0.875rem !important;
        }
        .best-menu-badge {
          font-size: 0.75rem !important;
          padding: 0.4rem 1rem !important;
        }
        .best-sellers-grid-mobile img {
          height: 150px !important;
        }
        .best-sellers-grid-mobile h3 {
          font-size: 0.9rem !important;
        }
        .best-sellers-grid-mobile > div > div:last-child {
          padding: 1rem !important;
        }
        .best-sellers-grid-mobile button {
          padding: 0.5rem 1rem !important;
          font-size: 0.75rem !important;
        }
        .best-sellers-grid-mobile .best-seller-badge {
          font-size: 0.65rem !important;
          padding: 0.25rem 0.6rem !important;
        }
        .best-sellers-grid-mobile .price-large {
          font-size: 1.1rem !important;
        }
        .best-sellers-grid-mobile .price-original {
          font-size: 0.8rem !important;
        }
        .best-sellers-grid-mobile .discount-badge {
          font-size: 0.65rem !important;
          padding: 0.25rem 0.5rem !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fetch best sellers from API
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching best sellers from: http://127.0.0.1:8000/api/products/best-sellers/list');
        
        const response = await productApi.getBestSellers();
        console.log('Best sellers response:', response);
        
        // Handle both response.data and direct response
        const bestSellerProducts = response.data || response;
        
        if (Array.isArray(bestSellerProducts) && bestSellerProducts.length > 0) {
          console.log('Best sellers loaded:', bestSellerProducts.length, 'products');
          setProducts(bestSellerProducts);
        } else {
          console.warn('No best sellers found in response');
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching best sellers:', err);
        setError(err.message || 'Failed to load best sellers');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Get image URL for products
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/storage/')) return `http://127.0.0.1:8000${imagePath}`;
    if (imagePath.startsWith('storage/')) return `http://127.0.0.1:8000/${imagePath}`;
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16 bg-secondary/30">
        <h2 className="text-3xl font-bold mb-8">Best Sellers</h2>
        <p className="text-center">Loading best sellers...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16 bg-secondary/30">
        <h2 className="text-3xl font-bold mb-8">Best Sellers</h2>
        <p className="text-center text-red-500">Failed to load best sellers</p>
      </section>
    );
  }

  return (
    <section className="best-menu-section" style={{ padding: '4rem 0', backgroundColor: '#f8f9fa' }}>
      <div className="best-menu-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="best-menu-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="best-menu-badge" style={{ 
            display: 'inline-block',
            backgroundColor: '#333',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>Best Menu</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Our Menu</h2>
          <p style={{ color: '#666', fontSize: '1rem' }}>Discover our chef's handpicked favorites and signature dishes.</p>
        </div>
        
        {products.length === 0 ? (
          <p className="text-center">No best sellers available</p>
        ) : (
          <div className="best-sellers-grid-mobile" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '2.5rem',
            maxWidth: '1500px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            {products.slice(0, 3).map((product) => (
              <div key={product.id} style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                border: '1px solid #f0f0f0'
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
                  <span className="best-seller-badge" style={{
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
                  }}>Best Seller</span>
                  <div style={{ 
                    height: '200px', 
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#bbb',
                    fontSize: '0.875rem',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={getImageUrl(product.image || product.image_path)}
                      alt={product.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => { 
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span>Menu Image</span>';
                      }}
                    />
                  </div>
                </div>
                <div style={{ 
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <h3 style={{ 
                    fontWeight: '600', 
                    fontSize: '1.05rem', 
                    color: '#1a1a1a',
                    lineHeight: '1.4',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    margin: 0
                  }}>{product.name}</h3>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="price-large" style={{ 
                          fontSize: '1.4rem', 
                          fontWeight: '700', 
                          color: '#1a1a1a',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          lineHeight: 1
                        }}>
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="price-original" style={{ 
                            fontSize: '0.9rem', 
                            color: '#999',
                            textDecoration: 'line-through',
                            fontWeight: '400'
                          }}>
                            ${(parseFloat(product.price) / (1 - product.discount / 100)).toFixed(2)}
                          </span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <span className="discount-badge" style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600',
                          backgroundColor: 'white',
                          color: '#1a1a1a',
                          padding: '0.3rem 0.6rem', 
                          borderRadius: '4px',
                          border: '1.5px solid #333',
                          whiteSpace: 'nowrap',
                          width: 'fit-content'
                        }}>
                          ${((parseFloat(product.price) / (1 - product.discount / 100)) - parseFloat(product.price)).toFixed(2)} OFF
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/product/${product.id}`;
                      }}
                      style={{
                        padding: '0.65rem 1.5rem',
                        backgroundColor: 'white',
                        color: '#1a1a1a',
                        border: '1.5px solid #d0d0d0',
                        borderRadius: '25px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        alignSelf: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f5f5f5';
                        e.target.style.borderColor = '#1a1a1a';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.borderColor = '#d0d0d0';
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
      </div>
    </section>
  )
}
