import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/footer-component';
import '../styles/Discount.css';

const Discount = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  // Categories for filtering
  const categories = [
    { id: 1, name: "All", icon: "🍽️" },
    { id: 2, name: "Grocery", icon: "🛒" },
    { id: 3, name: "Grocery", icon: "🛒" },
    { id: 4, name: "Grocery", icon: "🛒" },
    { id: 5, name: "Grocery", icon: "🛒" },
    { id: 6, name: "Grocery", icon: "🛒" },
    { id: 7, name: "Grocery", icon: "🛒" }
  ];

  // Sample discount dishes data (16 items for 2 pages)
  const discountDishes = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    name: "Name",
    price: "$2.10",
    originalPrice: "$4.00",
    discount: "$1.90",
    badge: i % 2 === 0 ? "Best Seller" : null,
    soldBadge: i % 3 === 0 ? "50+ Sold" : null,
    image: "Menu Image"
  }));

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 16;
  const totalPages = Math.ceil(discountDishes.length / itemsPerPage);

  const getCurrentItems = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return discountDishes.slice(start, end);
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
          <div className="discount-categories-grid">
            {categories.map(category => (
              <div 
                key={category.id} 
                className={`discount-category-item ${activeCategory === category.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.name)}
              >
                <div className="discount-category-circle">
                  <span className="category-emoji">{category.icon}</span>
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

          <div className="all-dishes-grid">
            {getCurrentItems().map(dish => (
              <div key={dish.id} className="dish-item">
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
                      <span className="discount-badge">{dish.discount} OFF</span>
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
              {Array.from({ length: totalPages }, (_, index) => (
                <span 
                  key={index}
                  className={`dot ${currentPage === index ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index)}
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

export default Discount;