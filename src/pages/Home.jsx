import React, { useState } from "react";
import "../styles/Home.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            "url('/classic-burger-drawing.jpg')",
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Order Food Online</h1>
            <p className="hero-subtitle">
              Get your favorite meals delivered right to your door with Foodie
              Express. Explore a wide range of delicious food and reliable
              service.
            </p>

            <form onSubmit={handleSearch} className="search-form">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Enter your delivery address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  Find Food
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Popular Categories</h2>
          <div className="categories-grid">
            <div className="category-item">
              <div className="category-icon">
                <span className="icon-emoji">🍕</span>
              </div>
              <span className="category-label">Pizza</span>
            </div>
            <div className="category-item">
              <div className="category-icon">
                <span className="icon-emoji">🍔</span>
              </div>
              <span className="category-label">Burgers</span>
            </div>
            <div className="category-item">
              <div className="category-icon">
                <span className="icon-emoji">🍣</span>
              </div>
              <span className="category-label">Sushi</span>
            </div>
            <div className="category-item">
              <div className="category-icon">
                <span className="icon-emoji">🌮</span>
              </div>
              <span className="category-label">Tacos</span>
            </div>
            <div className="category-item">
              <div className="category-icon">
                <span className="icon-emoji">🍰</span>
              </div>
              <span className="category-label">Desserts</span>
            </div>
            <div className="category-item">
              <div className="category-icon">
                <span className="icon-emoji">🥤</span>
              </div>
              <span className="category-label">Drinks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="best-sellers-section">
        <div className="container">
          <h2 className="section-title">Best Sellers</h2>
          <div className="best-sellers-grid">
            <div className="food-item">
              <img src="/classic-burger-fries.png" alt="The Classic Burger" className="food-image" />
              <div className="food-info">
                <h3 className="food-name">The Classic Burger</h3>
                <p className="food-description">Juicy beef patty with all the fixings</p>
                <p className="food-price">$12.99</p>
              </div>
            </div>
            <div className="food-item">
              <img src="/assorted-sushi.png" alt="Assorted Sushi Platter" className="food-image" />
              <div className="food-info">
                <h3 className="food-name">Assorted Sushi Platter</h3>
                <p className="food-description">Fresh and flavorful sushi selection</p>
                <p className="food-price">$24.99</p>
              </div>
            </div>
            <div className="food-item">
              <img src="/street-tacos-on-plate.jpg" alt="Street Style Tacos" className="food-image" />
              <div className="food-info">
                <h3 className="food-name">Street Style Tacos</h3>
                <p className="food-description">Authentic tacos with a variety of fillings</p>
                <p className="food-price">$8.99</p>
              </div>
            </div>
            <div className="food-item">
              <img src="/chocolate-layer-cake-slice.jpg" alt="Decadent Chocolate Cake" className="food-image" />
              <div className="food-info">
                <h3 className="food-name">Decadent Chocolate Cake</h3>
                <p className="food-description">Rich and moist chocolate cake</p>
                <p className="food-price">$6.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="promotions-section">
        <div className="container">
          <h2 className="section-title">Promotions</h2>
          <div className="promotion-card">
            <div className="promotion-image">
              <img src="/illustrated-burger-drawing.jpg" alt="Special Offer" />
            </div>
            <div className="promotion-content">
              <h3 className="promotion-title">20% Off Your First Order</h3>
              <p className="promotion-description">Use code WELCOME20 at checkout</p>
              <button className="promotion-btn">Order Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="featured-restaurants-section">
        <div className="container">
          <h2 className="section-title">Featured Restaurants</h2>
          <div className="restaurants-grid">
            <div className="restaurant-item">
              <img src="/modern-restaurant-interior-with-wooden-decor.jpg" alt="The Burger Joint" className="restaurant-image" />
              <div className="restaurant-info">
                <h3 className="restaurant-name">The Burger Joint</h3>
                <p className="restaurant-description">Best burgers in town</p>
              </div>
            </div>
            <div className="restaurant-item">
              <img src="/japanese-restaurant-interior-minimalist.jpg" alt="Sushi Central" className="restaurant-image" />
              <div className="restaurant-info">
                <h3 className="restaurant-name">Sushi Central</h3>
                <p className="restaurant-description">Fresh and authentic sushi</p>
              </div>
            </div>
            <div className="restaurant-item">
              <img src="/mexican-restaurant-tacos-on-table.jpg" alt="Taco Heaven" className="restaurant-image" />
              <div className="restaurant-info">
                <h3 className="restaurant-name">Taco Heaven</h3>
                <p className="restaurant-description">Delicious tacos and more</p>
              </div>
            </div>
            <div className="restaurant-item">
              <img src="/bakery-croissants-and-pastries.jpg" alt="Sweet Treats Bakery" className="restaurant-image" />
              <div className="restaurant-info">
                <h3 className="restaurant-name">Sweet Treats Bakery</h3>
                <p className="restaurant-description">Cakes, cookies, and pastries</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
