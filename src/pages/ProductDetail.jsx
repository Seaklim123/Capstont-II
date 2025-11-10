import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/footer-component';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // Sample related dishes
  const relatedDishes = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: "Name",
    price: "$2.10",
    originalPrice: "$4.00",
    discount: "$1.90 OFF",
    badge: i % 2 === 0 ? "Best Seller" : null,
    soldBadge: i % 3 === 0 ? "50+ Sold" : null,
    image: "Menu Image"
  }));

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="product-detail-page">
      {/* Product Section */}
      <section className="product-section">
        <div className="container">
          <button className="back-btn" onClick={handleBack}>
            <span>←</span>
          </button>
          
          <div className="product-grid">
            <div className="product-image-container">
              <div className="product-image">
                <span>Menu Image</span>
              </div>
            </div>

            <div className="product-info-container">
              <h1 className="product-name">Name</h1>
              
              <div className="product-pricing">
                <span className="original-price-badge">$ 4.00</span>
                <div className="current-price">${2.10}</div>
                <span className="discount-text">$1.90 OFF</span>
              </div>

              <div className="product-options">
                <div className="option-group">
                  <label className="option-label">Label</label>
                  <select className="option-select">
                    <option>Value</option>
                    <option>Value 2</option>
                    <option>Value 3</option>
                  </select>
                </div>

                <div className="option-group">
                  <label className="option-label">Label</label>
                  <select className="option-select">
                    <option>Value</option>
                    <option>Value 2</option>
                    <option>Value 3</option>
                  </select>
                </div>
              </div>

              <div className="quantity-selector">
                <button className="quantity-btn" onClick={handleDecrease}>−</button>
                <input type="number" className="quantity-input" value={quantity} readOnly />
                <button className="quantity-btn" onClick={handleIncrease}>+</button>
              </div>

              <button className="main-add-to-cart-btn">Add to Cart</button>

              <div className="product-description">
                <h3 className="description-title">Description</h3>
                <p className="description-text">
                  Lorem ipsum dolor sit amet consectetur. Senectus netus tincidunt tincidunt sed donec. Fermentum et aliquam metus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Dishes Section */}
      <section className="related-dishes-section">
        <div className="container">
          <h2 className="related-title">Related Dishes</h2>
          
          <div className="related-dishes-grid">
            {relatedDishes.map(dish => (
              <div key={dish.id} className="related-dish-item">
                <div className="dish-badges">
                  {dish.badge && <span className="badge best-seller">{dish.badge}</span>}
                  {dish.soldBadge && <span className="badge sold-badge">{dish.soldBadge}</span>}
                </div>
                <div className="dish-image">
                  <span>{dish.image}</span>
                </div>
                <div className="dish-info">
                  <h3 className="dish-name">{dish.name}</h3>
                  <div className="dish-bottom">
                    <div className="dish-price-info">
                      <span className="dish-price">{dish.price}</span>
                      <span className="original-price">{dish.originalPrice}</span>
                      <span className="discount-badge">{dish.discount}</span>
                    </div>
                    <button className="add-to-cart-btn" onClick={() => navigate(`/product/${dish.id}`)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-dots">
              {Array.from({ length: 5 }, (_, index) => (
                <span 
                  key={index}
                  className={`dot ${index === 0 ? 'active' : ''}`}
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

export default ProductDetail;
