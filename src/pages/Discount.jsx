import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/Discount.css";
import { categoryApi, productApi } from '../services/api';

function Discount() {
  const navigate = useNavigate();
  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
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

  // STEP 2: Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        console.log('Categories response:', response);
        
        if (response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // STEP 3: Filter products by category
  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(product => product.category_id === categories.find(cat => cat.name === activeCategory)?.id);

  // STEP 4: Get image URL for products
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/storage/')) return `http://127.0.0.1:8000${imagePath}`;
    if (imagePath.startsWith('storage/')) return `http://127.0.0.1:8000/${imagePath}`;
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

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
        <p className="subtitle">Learn wonderful or smart connection.</p>

        {/* Category Buttons */}
        <div className="category-buttons">
          <button 
            className={`category-btn ${activeCategory === "All" ? "active" : ""}`}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              className={`category-btn ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Dishes Section */}
      <section className="dishes-section">
        <h2 className="section-title">All Dishes ({filteredProducts.length})</h2>
        {filteredProducts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>No products found</p>
          ) : (
          <div className="dishes-grid">
            {filteredProducts.map((product) => (
              <div className="dish-card" key={product.id} style={{ cursor: 'pointer' }}>
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
                  {product.sold_count > 0 && (
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
                    }}>{product.sold_count}+ Sold</span>
                  )}

                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={getImageUrl(product.image || product.image_path)}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=No+Image"; }}
                    />
                  </div>
                </div>

                <div style={{ padding: '1.0rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ margin: 0 }}>{product.name}</h4>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>${parseFloat(product.price).toFixed(2)}</span>
                        {product.discount > 0 && (
                          <span style={{ textDecoration: 'line-through', color: '#777' }}>${(parseFloat(product.price) / (1 - product.discount / 100)).toFixed(2)}</span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <span style={{ fontSize: '0.85rem', color: '#d9534f' }}>{product.discount}% OFF</span>
                      )}
                    </div>

                    <button className="add-btn" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}>Add to Cart</button>
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