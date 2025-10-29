import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/footer-component";
import "../styles/Home.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDiscountPage, setCurrentDiscountPage] = useState(0);
  const [currentNewFoodPage, setCurrentNewFoodPage] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Sample discount items data
  const discountItems = [
    // Page 1 (items 0-3)
    { id: 1, name: "Chicken Burger", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "Best Seller" },
    { id: 2, name: "Beef Pizza", price: 3.50, originalPrice: 6.00, discount: 2.50, badge: "50+ Sold" },
    { id: 3, name: "Fish Tacos", price: 2.80, originalPrice: 5.20, discount: 2.40, badge: "Best Seller" },
    { id: 4, name: "Veggie Wrap", price: 1.90, originalPrice: 3.50, discount: 1.60, badge: "50+ Sold" },
    // Page 2 (items 4-7)
    { id: 5, name: "Grilled Salmon", price: 4.20, originalPrice: 7.50, discount: 3.30, badge: "Best Seller" },
    { id: 6, name: "Pasta Carbonara", price: 3.80, originalPrice: 6.80, discount: 3.00, badge: "50+ Sold" },
    { id: 7, name: "BBQ Ribs", price: 5.10, originalPrice: 8.90, discount: 3.80, badge: "Best Seller" },
    { id: 8, name: "Caesar Salad", price: 2.60, originalPrice: 4.50, discount: 1.90, badge: "50+ Sold" },
    // Page 3 (items 8-11)
    { id: 9, name: "Sushi Roll", price: 4.80, originalPrice: 8.20, discount: 3.40, badge: "Best Seller" },
    { id: 10, name: "Chicken Wings", price: 3.20, originalPrice: 5.80, discount: 2.60, badge: "50+ Sold" },
    { id: 11, name: "Steak Dinner", price: 6.50, originalPrice: 12.00, discount: 5.50, badge: "Best Seller" },
    { id: 12, name: "Shrimp Scampi", price: 4.90, originalPrice: 8.50, discount: 3.60, badge: "50+ Sold" },
    // Page 4 (items 12-15)
    { id: 13, name: "Lobster Roll", price: 7.20, originalPrice: 12.50, discount: 5.30, badge: "Best Seller" },
    { id: 14, name: "Duck Confit", price: 5.80, originalPrice: 10.20, discount: 4.40, badge: "50+ Sold" },
    { id: 15, name: "Lamb Chops", price: 6.80, originalPrice: 11.90, discount: 5.10, badge: "Best Seller" },
    { id: 16, name: "Tuna Tartare", price: 4.50, originalPrice: 7.80, discount: 3.30, badge: "50+ Sold" }
  ];

  // Sample new food items data  
  const newFoodItems = [
    // Page 1 (items 0-3)
    { id: 1, name: "Fresh Salad Bowl", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "New" },
    { id: 2, name: "Avocado Toast", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "50+ Sold" },
    { id: 3, name: "Smoothie Bowl", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "New" },
    { id: 4, name: "Quinoa Salad", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "50+ Sold" },
    // Page 2 (items 4-7)
    { id: 5, name: "Acai Bowl", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "New" },
    { id: 6, name: "Protein Shake", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "50+ Sold" },
    { id: 7, name: "Chia Pudding", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "New" },
    { id: 8, name: "Green Juice", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "50+ Sold" },
    // Page 3 (items 8-11)
    { id: 9, name: "Poke Bowl", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "New" },
    { id: 10, name: "Buddha Bowl", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "50+ Sold" },
    { id: 11, name: "Energy Bites", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "New" },
    { id: 12, name: "Keto Wrap", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "50+ Sold" },
    // Page 4 (items 12-15)
    { id: 13, name: "Raw Cake", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "New" },
    { id: 14, name: "Coconut Water", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "50+ Sold" },
    { id: 15, name: "Matcha Latte", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "New" },
    { id: 16, name: "Kombucha", price: 2.10, originalPrice: 4.00, discount: 1.90, badge: "50+ Sold" }
  ];

  const itemsPerPage = 4;
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
              Discover delightful meals at your fnpm run devavorite restaurant.
            </p>
            <div className="landing-buttons">
              <Link to="/menu" className="btn-outline">View Menu</Link>
              <button className="btn-solid">Order Now</button>
            </div>
          </div>
          <div className="landing-image">
            <img src="/classic-burger-fries.png" alt="Delicious Food" />
          </div>
        </div>
      </section>

      {/* Best Menu Section */}
      <section className="best-menu-section">
        <div className="best-menu-container">
          <div className="best-menu-header">
            <span className="best-menu-badge">Best Menu</span>
            <h2 className="best-menu-title">Our Menu</h2>
            <p className="best-menu-subtitle">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
          
          <div className="best-menu-grid">
            <div className="menu-item-card">
              <div className="menu-item-badge">Best Seller</div>
              <div className="menu-item-image">
                <span>Menu Image</span>
              </div>
              <div className="menu-item-info">
                <h3 className="menu-item-name">Name</h3>
                <p className="menu-item-description">
                  Lorem ipsum dolor sit amet consectetur. 
                  Libero risus feugiat ut pulvinar lorem.
                </p>
              </div>
            </div>

            <div className="menu-item-card">
              <div className="menu-item-badge">Best Seller</div>
              <div className="menu-item-image">
                <span>Menu Image</span>
              </div>
              <div className="menu-item-info">
                <h3 className="menu-item-name">Name</h3>
                <p className="menu-item-description">
                  Lorem ipsum dolor sit amet consectetur. 
                  Libero risus feugiat ut pulvinar lorem.
                </p>
              </div>
            </div>

            <div className="menu-item-card">
              <div className="menu-item-badge">Best Seller</div>
              <div className="menu-item-image">
                <span>Menu Image</span>
              </div>
              <div className="menu-item-info">
                <h3 className="menu-item-name">Name</h3>
                <p className="menu-item-description">
                  Lorem ipsum dolor sit amet consectetur. 
                  Libero risus feugiat ut pulvinar lorem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Discount Section */}
      <section className="best-discount-section">
        <div className="best-discount-container">
          <div className="best-discount-header">
            <span className="best-discount-badge">Best Discount</span>
            <h2 className="best-discount-title">Our Dish</h2>
            <p className="best-discount-subtitle">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
          
          <div className="discount-filter-tabs">
            <button className="filter-tab active">All</button>
          </div>
          
          <div className="best-discount-grid">
            {getCurrentPageItems().map((item) => (
              <div key={item.id} className="discount-item-card">
                <div className="discount-item-badge">{item.badge}</div>
                <div className="discount-item-image">
                  <span>Menu Image</span>
                </div>
                <div className="discount-item-info">
                  <h3 className="discount-item-name">{item.name}</h3>
                  <div className="discount-bottom-section">
                    <div className="discount-price-info">
                      <span className="discount-price">${item.price.toFixed(2)}</span>
                      <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                      <span className="discount-badge">${item.discount.toFixed(2)} OFF</span>
                    </div>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="discount-pagination">
            <div className="pagination-dots">
              {Array.from({ length: totalPages }, (_, index) => (
                <span 
                  key={index}
                  className={`dot ${currentDiscountPage === index ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Food Section */}
      <section className="new-food-section">
        <div className="new-food-container">
          <div className="new-food-header">
            <span className="new-food-badge">New Food</span>
            <h2 className="new-food-title">Our New Food</h2>
            <p className="new-food-subtitle">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
          
          <div className="new-food-filter-tabs">
            <button className="filter-tab active">All</button>
          </div>
          
          <div className="new-food-grid">
            {getCurrentNewFoodItems().map((item) => (
              <div key={item.id} className="new-food-item-card">
                <div className="new-food-item-badge">{item.badge}</div>
                <div className="new-food-item-image">
                  <span>Menu Image</span>
                </div>
                <div className="new-food-item-info">
                  <h3 className="new-food-item-name">{item.name}</h3>
                  <div className="new-food-bottom-section">
                    <div className="new-food-price-info">
                      <span className="new-food-price">${item.price.toFixed(2)}</span>
                      <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                      <span className="new-food-discount-badge">${item.discount.toFixed(2)} OFF</span>
                    </div>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="new-food-pagination">
            <div className="pagination-dots">
              {Array.from({ length: totalNewFoodPages }, (_, index) => (
                <span 
                  key={index}
                  className={`dot ${currentNewFoodPage === index ? 'active' : ''}`}
                  onClick={() => handleNewFoodDotClick(index)}
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
