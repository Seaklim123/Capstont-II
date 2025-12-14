import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Menu.css";
import { categoryApi, productApi, authCartApi, tableApi } from "../services/api.js";
import toast from 'react-hot-toast';
import TableNumberModal from '../components/TableNumberModal';

function Menu() {
  // Clear cart on page load to prevent pre-populated items
  useEffect(() => {
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  }, []);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [pendingItemId, setPendingItemId] = useState(null);
  const itemsPerPage = 9; // Show 9 items per page (3 rows × 3 columns)

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching categories from API');
        const response = await categoryApi.getAll();
        console.log('Categories response:', response);
        console.log('First category:', response.data?.[0]);
        
        // Remove duplicate categories by ID
        const uniqueCategories = [];
        const seenIds = new Set();
        
        (response.data || []).forEach(category => {
          if (!seenIds.has(category.id)) {
            seenIds.add(category.id);
            uniqueCategories.push(category);
          }
        });
        
        console.log('Unique categories:', uniqueCategories);
        setCategories(uniqueCategories);
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
        setProducts([]); // Clear old data before fetching new
        console.log('Fetching products from API');
        const response = await productApi.getAll();
        // Always use response.data if it's an array, otherwise use response as array
        let productsArr = [];
        if (response && Array.isArray(response.data)) {
          productsArr = response.data;
        } else if (Array.isArray(response)) {
          productsArr = response;
        } else {
          // Try to handle edge cases (e.g., Laravel resource returns {data: [...], meta: {...}})
          if (response && typeof response === 'object') {
            // Find first array property
            for (const key in response) {
              if (Array.isArray(response[key])) {
                productsArr = response[key];
                break;
              }
            }
          }
        }
        console.log('Products array:', productsArr);
        setProducts(productsArr);
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
      return `${import.meta.env.VITE_STORAGE_URL || ''}${imagePath}`;
    }
    
    // Otherwise, just append to base URL
    return `${import.meta.env.VITE_STORAGE_URL || ''}/${imagePath}`;
  };

  // Render product image with fallback
  const renderProductImage = (product) => {
    // Try all possible product image fields
    let imagePath = product.image_path || product.image || product.image_url || product.imageUrl || product.img;

    // Fallback to category image if product image is missing
    if (!imagePath && product.category) {
      imagePath = product.category.image_url || product.category.image || product.category.image_path;
    }

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
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `<div style=\"width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; color: #999; font-size: 0.9rem;\">${product.name}</div>`;
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
    console.log('🛒 handleAddToCart called with itemId:', itemId);
    
    // Check for table number first
    const tableId = localStorage.getItem('tableId');
    if (!tableId) {
      toast.error('Please enter your table ID first', {
        duration: 4000,
        icon: '🔢',
      });
      // Show modal instead of prompt
      setPendingItemId(itemId);
      setShowTableModal(true);
      return;
    }
    
    // Continue with adding to cart
    await addItemToCart(itemId);
  };

  const handleTableIdSubmit = async (userTableId) => {
    setShowTableModal(false);
    
    if (!userTableId || !userTableId.trim()) {
      toast.error('Table ID is required to order. Redirecting to home...', {
        duration: 3000,
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }
    // Save table ID and proceed (skip verification if API not available)
    try {
      toast.loading('Verifying table ID...', { id: 'verify-table' });
      // Try to verify, but don't fail if API not available
      try {
        const response = await tableApi.verify(userTableId);
        if (response.exists || response.data?.exists || response.valid) {
          localStorage.setItem('tableId', userTableId);
          toast.success(`Table ${userTableId} confirmed!`, { id: 'verify-table' });
          window.dispatchEvent(new Event('cartUpdated'));
          // Add the pending item to cart
          if (pendingItemId) {
            await addItemToCart(pendingItemId);
            setPendingItemId(null);
          }
        } else {
          toast.error(`Table ${userTableId} not found. Please check your table ID.`, { id: 'verify-table', duration: 3000 });
        }
      } catch (apiError) {
        // If API fails, allow anyway (backend might not be ready)
        console.log('Table verification API not available, allowing table ID:', apiError);
        localStorage.setItem('tableId', userTableId);
        toast.success(`Table ${userTableId} set!`, { id: 'verify-table' });
        window.dispatchEvent(new Event('cartUpdated'));
        // Add the pending item to cart
        if (pendingItemId) {
          await addItemToCart(pendingItemId);
          setPendingItemId(null);
        }
      }
    } catch (error) {
      console.error('Error in table ID submission:', error);
      // Allow proceeding anyway
      localStorage.setItem('tableId', userTableId);
      toast.success(`Table ${userTableId} set!`);
      window.dispatchEvent(new Event('cartUpdated'));
      // Add the pending item to cart
      if (pendingItemId) {
        await addItemToCart(pendingItemId);
        setPendingItemId(null);
      }
    }
  };

  const addItemToCart = async (itemId) => {
    const product = products.find(p => p.id === itemId);
    console.log('🛒 Product found:', product);
    
    if (!product) {
      console.error('❌ Product not found for id:', itemId);
      toast.error('Product not found');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const tableId = localStorage.getItem('tableId');
    console.log('🛒 Token exists:', !!token);
    console.log('🛒 Table ID:', tableId);
    // Only use backend API if user has a valid table ID
    if (token && tableId) {
      // Authenticated user with table - use backend API
      console.log('🛒 Using authenticated cart (backend API)');
      try {
        const cartData = {
          product_id: itemId,
          quantity: 1,
          status: 'starting',
          table_id: parseInt(tableId, 10)
        };
        console.log('🛒 Sending cart data:', cartData);
        const response = await authCartApi.addItem(cartData);
        console.log('✅ Cart API response:', response);
        toast.success(`${product.name} added to cart!`);
        window.dispatchEvent(new Event('cartUpdated'));
        // Only navigate to cart if you want to redirect after adding
        // setTimeout(() => navigate('/cart'), 500);
      } catch (error) {
        console.error('❌ Error adding to cart:', error);
        console.error('❌ Error details:', error.response?.data);
        toast.error('Failed to add to cart. Please try again.');
      }
    } else {
      // Guest user - use localStorage
      console.log('🛒 Using guest cart (localStorage)');
      try {
        const existingCart = localStorage.getItem('cart');
        const cart = existingCart ? JSON.parse(existingCart) : [];
        console.log('🛒 Current cart:', cart);

        const existingItemIndex = cart.findIndex(item => item.id === itemId);

        if (existingItemIndex > -1) {
          cart[existingItemIndex].quantity += 1;
          console.log('🛒 Updated existing item quantity');
        } else {
          const newItem = {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image_path: product.image_path || product.image,
            quantity: 1,
            product: {
              id: product.id,
              name: product.name,
              price: parseFloat(product.price),
              image_path: product.image_path || product.image
            }
          };
          cart.push(newItem);
          console.log('🛒 Added new item:', newItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('✅ Cart saved to localStorage:', cart);
        
        toast.success(`${product.name} added to cart!`);
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Navigate to cart page
        setTimeout(() => navigate('/cart'), 500);
      } catch (error) {
        console.error('❌ Error adding to localStorage cart:', error);
        toast.error('Failed to add to cart');
      }
    }
  };

  // Filter products by category
  // Show all products regardless of category selection (for debug)
  const getFilteredProducts = () => {
    // If you want to filter by category, uncomment below:
    // if (activeCategory !== 'All') {
    //   return products.filter(p => p.category && p.category.name === activeCategory);
    // }
    return products;
  };

  // Get products for different sections
  const allProducts = getFilteredProducts();
  const bestSellerProducts = products.filter(p => p.is_best_seller === 1 || p.is_best_seller === true);
  const discountProducts = products.filter(p => p.discount && parseFloat(p.discount) > 0);
  
  // Debug: print product counts
  console.log('Total products:', products.length, products);
  console.log('Best seller products:', bestSellerProducts.length, bestSellerProducts);
  console.log('Discount products:', discountProducts.length, discountProducts);
  console.log('All products (filtered):', allProducts.length, allProducts);

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
              Discover our signature dishes and innovative new creations.
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
                // Use transformed image_url first (from API), then fallback to other fields
                const imageUrl = category.image_url || category.image || category.image_path;
                console.log('Category:', category.name, 'Image URL:', imageUrl);
                
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

      {/* All Dishes Section */}
      <section className="all-dishes-section">
        <div className="container">
          
          
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
                            console.log('🔘 [All Dishes Grid] Button clicked! Product ID:', product.id);
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

      {/* Table Number Modal */}
      <TableNumberModal 
        isOpen={showTableModal}
        onClose={() => {
          setShowTableModal(false);
          setPendingItemId(null);
        }}
        onSubmit={handleTableIdSubmit}
      />
    </div>
  );
}

export default Menu;
