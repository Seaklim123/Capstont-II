import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Menu.css";
import { categoryApi, productApi, authCartApi } from "../services/api.js";
import toast from 'react-hot-toast';

function Menu() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 8; // Show 8 items per page

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching categories from API');
        const response = await categoryApi.getAll();
        console.log('Categories response:', response);
        console.log('First category:', response.data?.[0]);
        setCategories(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(`Backend not running. Please start your Laravel server: php artisan serve`);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        console.log('Fetching products from API');
        const response = await productApi.getAll();
        console.log('Products response:', response);
        console.log('First product:', response.data?.[0]);
        console.log('Product with image_path:', response.data?.find(p => p.image_path));
        setProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get image URL for products
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, use it directly
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it starts with a slash, use it as-is with the base URL
    if (imagePath.startsWith('/')) {
      return `http://localhost:8000${imagePath}`;
    }
    
    // Otherwise, just append to base URL
    return `http://localhost:8000/${imagePath}`;
  };

  // Render product image with fallback
  const renderProductImage = (product) => {
    // Try all possible image fields
    const imagePath = product.image_path || product.image || product.image_url || product.imageUrl || product.img;
    
    if (!imagePath) {
      return (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: '#999',
          fontSize: '0.9rem'
        }}>
          {product.name}
        </div>
      );
    }
    
    const imageUrl = getImageUrl(imagePath);
    console.log('Product:', product.name, 'Using:', imageUrl);
    
    return (
      <img 
        src={imageUrl} 
        alt={product.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => { 
          console.error('Failed:', imageUrl);
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; color: #999; font-size: 0.9rem;">${product.name}</div>`;
        }}
      />
    );
  };

  // Default icon for categories without images
  const getDefaultIcon = (categoryName) => {
    const iconMap = {
      'food': '🍽️',
      'beverage': '🥤',
      'dessert': '🍰',
      'snack': '🍿',
      'meat': '🥩',
      'vegetable': '🥬',
      'fruit': '🍎',
      'seafood': '�',
      'dairy': '🥛',
      'bakery': '🥖'
    };
    
    const lowerCaseName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerCaseName.includes(key)) {
        return icon;
      }
    }
    return '🛒'; // Default grocery icon
  };

  // Helper function to get category image URL
  const getCategoryImageUrl = (category) => {
    const imagePath = category.image_path || category.image || category.image_url || category.imageUrl || category.img;
    if (imagePath) {
      return getImageUrl(imagePath);
    }
    return null;
  };

  // Handle add to cart - try backend API first, fallback to localStorage
  const handleAddToCart = async (itemId) => {
    const product = products.find(p => p.id === itemId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (token) {
      // Authenticated user - use backend API
      try {
        const tableNumber = localStorage.getItem('tableNumber');
        
        await authCartApi.addItem({
          product_id: itemId,
          quantity: 1,
          table_id: tableNumber || null,
          status: 'starting'
        });

        toast.success(`${product.name} added to cart!`);
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add to cart. Please try again.');
      }
    } else {
      // Guest user - use localStorage
      try {
        const existingCart = localStorage.getItem('cart');
        const cart = existingCart ? JSON.parse(existingCart) : [];

        const existingItemIndex = cart.findIndex(item => item.id === itemId);

        if (existingItemIndex > -1) {
          cart[existingItemIndex].quantity += 1;
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
        toast.success(`${product.name} added to cart!`);
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (error) {
        console.error('Error adding to localStorage cart:', error);
        toast.error('Failed to add to cart');
      }
    }
  };

  // Filter products by category
  const getFilteredProducts = () => {
    if (activeCategory === "All") {
      return products;
    }
    
    // Find category ID by name
    const category = categories.find(cat => cat.name === activeCategory);
    if (!category) return [];
    
    return products.filter(product => product.category_id === category.id);
  };

  // Get products for different sections
  const allProducts = getFilteredProducts();
  const bestSellerProducts = products.filter(p => p.is_best_seller === 1 || p.is_best_seller === true);
  const discountProducts = products.filter(p => p.discount && parseFloat(p.discount) > 0);
  
  console.log('Total products:', products.length);
  console.log('Best seller products:', bestSellerProducts.length, bestSellerProducts);
  console.log('Discount products:', discountProducts.length, discountProducts);
  console.log('All products (filtered):', allProducts.length);

  // Pagination logic
  const filteredMenuItems = getFilteredProducts();
  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredMenuItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  return (
    <div className="menu-page">
      {/* Header Section */}
      <section className="menu-header-section">
        <div className="container">
          <div className="menu-header">
            <span className="menu-badge">Menu</span>
            <h1 className="menu-title">Our Menu</h1>
            <p className="menu-subtitle">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="menu-categories-section">
        <div className="container">
          {loading && (
            <div className="categories-loading">
              <p>Loading categories...</p>
            </div>
          )}
          
          {error && (
            <div className="categories-error">
              <p>⚠️ {error}</p>
              <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
                Using fallback categories for now. Categories will work when backend is connected.
              </p>
            </div>
          )}
          
          {!loading && !error && (
            <div className="menu-categories-grid">
              {/* All Categories Option */}
              <div 
                className={`menu-category-item ${activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => setActiveCategory('All')}
              >
                <div className="menu-category-circle">
                  <img 
                    src="http://127.0.0.1:8000/Image/All.jpg" 
                    alt="All"
                    className="category-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <span 
                    className="category-emoji"
                    style={{ display: 'none' }}
                  >
                    🍽️
                  </span>
                </div>
                <span className="menu-category-label">All</span>
              </div>
              
              {/* Dynamic Categories from API */}
              {categories.map(category => {
                // Use image_path from database or fallback to emoji
                const imageUrl = category.image_path || category.image || category.image_url;
                
                return (
                  <div 
                    key={category.id} 
                    className={`menu-category-item ${activeCategory === category.name ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.name)}
                  >
                    <div className="menu-category-circle">
                      {imageUrl ? (
                        <>
                          <img 
                            src={imageUrl} 
                            alt={category.name}
                            className="category-image"
                            onError={(e) => {
                              // If image fails to load, show emoji
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <span 
                            className="category-emoji"
                            style={{ display: 'none' }}
                          >
                            {getDefaultIcon(category.name)}
                          </span>
                        </>
                      ) : (
                        <span className="category-emoji">
                          {getDefaultIcon(category.name)}
                        </span>
                      )}
                    </div>
                    <span className="menu-category-label">{category.name}</span>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Show message if no categories */}
          {!loading && !error && categories.length === 0 && (
            <div className="no-categories">
              <p>No categories available. <a href="/categories">Add some categories</a> to get started.</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Dish Section */}
      <section className="popular-dish-section">
        <div className="container">
          <h2 className="section-title">Popular Dish</h2>
          {productsLoading ? (
            <p style={{textAlign: 'center', padding: '2rem'}}>Loading products...</p>
          ) : bestSellerProducts.length === 0 ? (
            <p style={{textAlign: 'center', padding: '2rem'}}>No popular dishes available</p>
          ) : (
            <div className="dish-grid">
              {bestSellerProducts.slice(0, 4).map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => handleAddToCart(product.id)}
                  style={{
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
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    {product.is_best_seller && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        zIndex: 2
                      }}>Best Seller</span>
                    )}
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#333',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      fontWeight: '600',
                      zIndex: 2
                    }}>50+ Sold</span>
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      {renderProductImage(product)}
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
                          <span style={{ 
                            fontSize: '1.4rem', 
                            fontWeight: '700', 
                            color: '#1a1a1a',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            lineHeight: 1
                          }}>
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                          {product.discount > 0 && (
                            <span style={{ 
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
                          }}>
                            ${((parseFloat(product.price) / (1 - product.discount / 100)) - parseFloat(product.price)).toFixed(2)} OFF
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
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

      {/* Discount Dish Section */}
      <section className="discount-dish-section">
        <div className="container">
          <h2 className="section-title">Discount Dish</h2>
          {productsLoading ? (
            <p style={{textAlign: 'center', padding: '2rem'}}>Loading products...</p>
          ) : discountProducts.length === 0 ? (
            <p style={{textAlign: 'center', padding: '2rem'}}>No discount dishes available</p>
          ) : (
            <div className="dish-grid">
              {discountProducts.slice(0, 4).map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => handleAddToCart(product.id)}
                  style={{
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
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    {product.is_best_seller && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        zIndex: 2
                      }}>Best Seller</span>
                    )}
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#333',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      fontWeight: '600',
                      zIndex: 2
                    }}>50+ Sold</span>
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      {renderProductImage(product)}
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
                          <span style={{ 
                            fontSize: '1.4rem', 
                            fontWeight: '700', 
                            color: '#1a1a1a',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            lineHeight: 1
                          }}>
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                          <span style={{ 
                            fontSize: '0.9rem', 
                            color: '#999',
                            textDecoration: 'line-through',
                            fontWeight: '400'
                          }}>
                            ${(parseFloat(product.price) / (1 - product.discount / 100)).toFixed(2)}
                          </span>
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
                        }}>
                          ${((parseFloat(product.price) / (1 - product.discount / 100)) - parseFloat(product.price)).toFixed(2)} OFF
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
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

      {/* All Dishes Section */}
      <section className="all-dishes-section">
        <div className="container">
          <h2 className="section-title">All Dishes</h2>
          
          {productsLoading ? (
            <p style={{textAlign: 'center', padding: '2rem'}}>Loading products...</p>
          ) : currentItems.length === 0 ? (
            <p style={{textAlign: 'center', padding: '2rem'}}>No dishes available</p>
          ) : (
            <>
              <div className="all-dishes-grid">
                {currentItems.map((product, index) => (
                  <div 
                    key={product.id} 
                    onClick={() => handleAddToCart(product.id)}
                    style={{
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
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      {product.is_best_seller && (
                        <span style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: '#333',
                          color: 'white',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          zIndex: 2
                        }}>Best Seller</span>
                      )}
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        zIndex: 2
                      }}>50+ Sold</span>
                      {index === 0 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: '500',
                          zIndex: 2
                        }}>All</div>
                      )}
                      <div style={{ height: '200px', overflow: 'hidden' }}>
                        {renderProductImage(product)}
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
                            <span style={{ 
                              fontSize: '1.4rem', 
                              fontWeight: '700', 
                              color: '#1a1a1a',
                              fontFamily: 'system-ui, -apple-system, sans-serif',
                              lineHeight: 1
                            }}>
                              ${parseFloat(product.price).toFixed(2)}
                            </span>
                            {product.discount > 0 && (
                              <span style={{ 
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
                            }}>
                              ${((parseFloat(product.price) / (1 - product.discount / 100)) - parseFloat(product.price)).toFixed(2)} OFF
                            </span>
                          )}
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
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

              <div className="pagination">
                <div className="pagination-dots">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <span 
                      key={index}
                      className={`dot ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                      style={{ cursor: 'pointer' }}
                    ></span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      
    </div>
  );
}

export default Menu;
