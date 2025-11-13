import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/footer-component";
import { BestSellers } from "../components/best-sellers";
import { productApi } from "../services/api";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDiscountPage, setCurrentDiscountPage] = useState(0);
  const [currentNewFoodPage, setCurrentNewFoodPage] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for discount section (your friend is working on the real discount page)
  const discountItems = [
    {
      id: 1,
      name: "Grilled Chicken",
      price: 12.99,
      discount: 20,
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400"
    },
    {
      id: 2,
      name: "Beef Burger",
      price: 10.99,
      discount: 15,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
    },
    {
      id: 3,
      name: "Caesar Salad",
      price: 8.99,
      discount: 25,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400"
    },
    {
      id: 4,
      name: "Pasta Carbonara",
      price: 14.99,
      discount: 30,
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400"
    },
    {
      id: 5,
      name: "Salmon Steak",
      price: 18.99,
      discount: 20,
      image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400"
    },
    {
      id: 6,
      name: "Vegetable Pizza",
      price: 11.99,
      discount: 15,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"
    }
  ];

  // Fetch all products from API for "New Food" section
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll();
        
        if (response.data) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Get image URL for products
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/storage/')) return `http://127.0.0.1:8000${imagePath}`;
    if (imagePath.startsWith('storage/')) return `http://127.0.0.1:8000/${imagePath}`;
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  // Get newest products (last 16) for "New Food" section
  const newFoodItems = products.slice(-12).reverse();

  const itemsPerPage = 3;
  const totalPages = Math.ceil(discountItems.length / itemsPerPage);
  const totalNewFoodPages = Math.ceil(newFoodItems.length / itemsPerPage);
  
  const getCurrentPageItems = () => {
    const startIndex = currentDiscountPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return discountItems.slice(startIndex, endIndex);
  };

  const getCurrentNewFoodItems = () => {
    const startIndex = currentNewFoodPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return newFoodItems.slice(startIndex, endIndex);
  };

  const handleAddToCart = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  const handleDotClick = (pageIndex) => {
    setCurrentDiscountPage(pageIndex);
  };

  const handleNewFoodDotClick = (pageIndex) => {
    setCurrentNewFoodPage(pageIndex);
  };

  return (
    <div className="home-page">
      {/* Landing Hero Section */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="landing-content">
            <h1 className="landing-title">Welcome to<br />Tos Kamong Food</h1>
            <p className="landing-subtitle">
              Discover delightful meals at your favorite restaurant.
            </p>
            <div className="landing-buttons">
              <Link to="/menu" className="btn-outline">View Menu</Link>
              <button className="btn-solid">Order Now</button>
            </div>
          </div>
          <div className="landing-image">
            <img 
              src="http://127.0.0.1:8000/Image/classic-burger-fries.jpg" 
              alt="Delicious Food"
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                e.target.src = "https://via.placeholder.com/600x400?text=Delicious+Food";
              }}
            />
          </div>
        </div>
      </section>

      {/* Best Menu Section - Now fetches from API */}
      <BestSellers />

      {/* Best Discount Section */}
      <section className="best-discount-section" style={{ padding: '4rem 0', backgroundColor: '#ffffff' }}>
        <div className="best-discount-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="best-discount-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="best-discount-badge" style={{
              display: 'inline-block',
              backgroundColor: '#333',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>Best Discount</span>
            <h2 className="best-discount-title" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Our Dish</h2>
            <p className="best-discount-subtitle" style={{ color: '#666', fontSize: '1rem' }}>
              Save big on your favorite meals with our special offers.
            </p>
          </div>
          
          <div className="best-discount-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2.5rem',
            maxWidth: '1500px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            {getCurrentPageItems().map((item) => (
                <div key={item.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  border: '1px solid #f0f0f0',
                  cursor: 'pointer'
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
                    }}>{item.discount > 50 ? "Best Seller" : "50+ Sold"}</span>
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
                        src={getImageUrl(item.image || item.image_path)} 
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
                    <h3 style={{
                      fontWeight: '600',
                      fontSize: '1.05rem',
                      color: '#1a1a1a',
                      lineHeight: '1.4',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      margin: 0
                    }}>{item.name}</h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '1.4rem',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            lineHeight: 1
                          }}>${parseFloat(item.price).toFixed(2)}</span>
                          <span style={{
                            fontSize: '0.9rem',
                            color: '#999',
                            textDecoration: 'line-through',
                            fontWeight: '400'
                          }}>${(parseFloat(item.price) / (1 - item.discount / 100)).toFixed(2)}</span>
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: 'white',
                          color: '#1a1a1a',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          border: '1.5px solid #333',
                          whiteSpace: 'nowrap',
                          width: 'fit-content'
                        }}>${((parseFloat(item.price) / (1 - item.discount / 100)) - parseFloat(item.price)).toFixed(2)} OFF</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item.id);
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
                      >Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="discount-pagination" style={{ marginTop: '3rem' }}>
            <div className="pagination-dots" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <span 
                  key={index}
                  className={`dot ${currentDiscountPage === index ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  style={{
                    width: currentDiscountPage === index ? '24px' : '10px',
                    height: '10px',
                    borderRadius: currentDiscountPage === index ? '5px' : '50%',
                    backgroundColor: currentDiscountPage === index ? '#000' : '#d9d9d9',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Food Section */}
      <section className="new-food-section" style={{ padding: '4rem 0', backgroundColor: '#ffffff' }}>
        <div className="new-food-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="new-food-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="new-food-badge" style={{
              display: 'inline-block',
              backgroundColor: '#333',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>New Food</span>
            <h2 className="new-food-title" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Our New Food</h2>
            <p className="new-food-subtitle" style={{ color: '#666', fontSize: '1rem' }}>
              Explore our latest menu additions and exciting new flavors.
            </p>
          </div>
          
          <div className="new-food-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2.5rem',
            maxWidth: '1500px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '20px', gridColumn: '1/-1' }}>Loading products...</p>
            ) : getCurrentNewFoodItems().length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', gridColumn: '1/-1' }}>No new products available</p>
            ) : (
              getCurrentNewFoodItems().map((item) => (
                <div key={item.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  border: '1px solid #f0f0f0',
                  cursor: 'pointer'
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
                    }}>{item.discount > 0 ? "50+ Sold" : "New"}</span>
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
                        src={getImageUrl(item.image || item.image_path)} 
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
                    <h3 style={{
                      fontWeight: '600',
                      fontSize: '1.05rem',
                      color: '#1a1a1a',
                      lineHeight: '1.4',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      margin: 0
                    }}>{item.name}</h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '1.4rem',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            lineHeight: 1
                          }}>${parseFloat(item.price).toFixed(2)}</span>
                          {item.discount > 0 && (
                            <>
                              <span style={{
                                fontSize: '0.9rem',
                                color: '#999',
                                textDecoration: 'line-through',
                                fontWeight: '400'
                              }}>${(parseFloat(item.price) / (1 - item.discount / 100)).toFixed(2)}</span>
                            </>
                          )}
                        </div>
                        {item.discount > 0 && (
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: 'white',
                            color: '#1a1a1a',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            border: '1.5px solid #333',
                            whiteSpace: 'nowrap',
                            width: 'fit-content'
                          }}>${((parseFloat(item.price) / (1 - item.discount / 100)) - parseFloat(item.price)).toFixed(2)} OFF</span>
                        )}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item.id);
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
                      >Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="new-food-pagination" style={{ marginTop: '3rem' }}>
            <div className="pagination-dots" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {Array.from({ length: totalNewFoodPages }, (_, index) => (
                <span 
                  key={index}
                  className={`dot ${currentNewFoodPage === index ? 'active' : ''}`}
                  onClick={() => handleNewFoodDotClick(index)}
                  style={{
                    width: currentNewFoodPage === index ? '24px' : '10px',
                    height: '10px',
                    borderRadius: currentNewFoodPage === index ? '5px' : '50%',
                    backgroundColor: currentNewFoodPage === index ? '#000' : '#d9d9d9',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
