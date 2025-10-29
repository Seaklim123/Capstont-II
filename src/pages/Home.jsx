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
    </div>
  );
};

export default Home;
