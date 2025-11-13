import React, { useState, useEffect } from "react";
import "../styles/Discount.css";
import { Footer } from "../components/footer-component";
import { categoryApi, productApi } from '../services/api';

function Discount() {
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
              <div className="dish-card" key={product.id}>
                <img 
                  src={getImageUrl(product.image || product.image_path)} 
                  alt={product.name}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                />
                <h4>{product.name}</h4>
                <p>${product.price}</p>
                {product.discount > 0 && (
                  <span className="discount-badge">{product.discount}% OFF</span>
                )}
                <button className="add-btn">Add to Cart</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
        
  );
}

export default Discount;