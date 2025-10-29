import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
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
    </div>
  );
};

export default Home;
