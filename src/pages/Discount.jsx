import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/footer-component';
import { categoryApi, productApi } from '../services/api';
import '../styles/Discount.css';

const Discount = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getAll();
        console.log('Discount page - Categories response:', response);
        
        // Add "All" category at the beginning
        const allCategories = [
          { id: 0, name: "All", image_path: null }
        ];
        
        if (response.data && response.data.length > 0) {
          // Add categories from database
          allCategories.push(...response.data);
        } else {
          // Fallback categories if no data
          allCategories.push(
            { id: 1, name: "Food", image_path: null },
            { id: 2, name: "Beverages", image_path: null },
            { id: 3, name: "Desserts", image_path: null },
            { id: 4, name: "Snacks", image_path: null }
          );
        }
        
        setCategories(allCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Use fallback categories
        setCategories([
          { id: 0, name: "All", image_path: null },
          { id: 1, name: "Food", image_path: null },
          { id: 2, name: "Beverages", image_path: null },
          { id: 3, name: "Desserts", image_path: null },
          { id: 4, name: "Snacks", image_path: null }
        ]);
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
        const response = await productApi.getAll();
        console.log('Products response:', response);
        
        if (response.data) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProducts(products);
    } else {
      const categoryId = categories.find(cat => cat.name === activeCategory)?.id;
      if (categoryId) {
        const filtered = products.filter(product => product.category_id === categoryId);
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
    }
  }, [activeCategory, products, categories]);

  // Get product image URL
  const getProductImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/storage/')) return `http://127.0.0.1:8000${imagePath}`;
    if (imagePath.startsWith('storage/')) return `http://127.0.0.1:8000/${imagePath}`;
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  // Get category icon
  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return '🍽️';
    
    const iconMap = {
      'all': '🍽️',
      'food': '🍔',
      'beverage': '🥤',
      'beverages': '🥤',
      'dessert': '🍰',
      'desserts': '🍰',
      'snack': '🍿',
      'snacks': '🍿',
      'meat': '🥩',
      'vegetable': '🥬',
      'vegetables': '🥬',
      'fruit': '🍎',
      'fruits': '🍎',
      'seafood': '🦐',
      'grocery': '🛒'
    };
    
    return iconMap[categoryName.toLowerCase()] || '🍽️';
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 16;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const getCurrentItems = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.slice(start, end);
  };

  return (
    <div className="discount-page">
      {/* Header Section */}
      <section className="discount-header-section">
        <div className="container">
          <div className="discount-header">
            <span className="discount-badge">Discount</span>
            <h1 className="discount-title">Our Discount</h1>
            <p className="discount-subtitle">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="discount-categories-section">
        <div className="container">
          {loading ? (
            <div className="loading-text">Loading categories...</div>
          ) : (
            <div className="discount-categories-grid">
              {categories.map(category => (
                <div 
                  key={category.id} 
                  className={`discount-category-item ${activeCategory === category.name ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.name)}
                >
                  <div className="discount-category-circle">
                    <span className="category-emoji">{getCategoryIcon(category.name)}</span>
                  </div>
                  <span className="discount-category-label">{category.name}</span>
                </div>
              ))}
              {/* Filter button */}
              <div className="discount-category-item">
                <div className="discount-category-circle filter-circle">
                  <span className="filter-icon">☰</span>
                </div>
                <span className="discount-category-label">Filter</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* All Dishes Section */}
      <section className="all-dishes-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">All Dishes</h2>
            <button className="filter-button">
              <span className="filter-icon">☰</span>
            </button>
          </div>

          {loading ? (
            <div className="loading-text">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products available. Please add products in your database.</p>
            </div>
          ) : (
            <>
              <div className="all-dishes-grid">
                {getCurrentItems().map(product => {
                  const originalPrice = parseFloat(product.price) + parseFloat(product.discount || 0);
                  const hasDiscount = parseFloat(product.discount) > 0;
                  
                  return (
                    <div key={product.id} className="dish-item">
                      <div className="dish-badges">
                        {hasDiscount && <span className="badge best-seller">Discount</span>}
                        {product.status === 'available' && <span className="badge sold-badge">Available</span>}
                      </div>
                      <div className="dish-image">
                        {product.image_path ? (
                          <img 
                            src={getProductImageUrl(product.image_path)} 
                            alt={product.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span style={{display: product.image_path ? 'none' : 'flex'}}>
                          {product.name}
                        </span>
                      </div>
                      <div className="dish-info">
                        <h3 className="dish-name">{product.name}</h3>
                        <div className="dish-bottom">
                          <div className="dish-price-info">
                            <span className="dish-price">${parseFloat(product.price).toFixed(2)}</span>
                            {hasDiscount && (
                              <>
                                <span className="original-price">${originalPrice.toFixed(2)}</span>
                                <span className="discount-badge">${parseFloat(product.discount).toFixed(2)} OFF</span>
                              </>
                            )}
                          </div>
                          <button className="add-to-cart-btn" onClick={() => navigate(`/product/${product.id}`)}>Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <div className="pagination-dots">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <span 
                        key={index}
                        className={`dot ${currentPage === index ? 'active' : ''}`}
                        onClick={() => setCurrentPage(index)}
                      ></span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Discount;