<<<<<<< HEAD
const Footer = () => {
  return (
    <footer className="admin-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span>&copy; 2025 QR Ordering System. All rights reserved.</span>
        </div>
        <div className="footer-right">
          <span>Version 1.0.0</span>
          <span className="footer-separator">|</span>
          <a href="#support" className="footer-link">Support</a>
          <span className="footer-separator">|</span>
          <a href="#docs" className="footer-link">Documentation</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
=======
import React from "react";
import "../styles/AboutUs.css";

export default function Footer() {
  return (
    <div className="about-container">

      {/* Top Section */}
      <section className="about-hero">
        <button className="profile-btn">Profile</button>
        <h1>About Us</h1>
        <p>Bringing fresh local flavors to your table with care and passion.</p>

        <button className="primary-btn">Order Now</button>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div>
          <h4>Meals Served</h4>
          <p>100,000+</p>
        </div>
        <div>
          <h4>Local Farmers Partnered</h4>
          <p>50</p>
        </div>
        <div>
          <h4>Sustainable Ingredients</h4>
          <p>90%</p>
        </div>
      </section>

      {/* Story + Highlights */}
      <section className="story-section">
        <div className="story-text">
          <h2>Our Story</h2>
          <p>
            Founded in 2021, our journey began with passion for cooking and love for community.
            We believe great meals bring people together.
          </p>
          <button className="outline-btn">Learn More</button>
        </div>

        <div className="highlights">
          <div className="highlight-box">
            <h4>A Culinary Adventure</h4>
            <p>Our founder traveled the world discovering flavors.</p>
          </div>
          <div className="highlight-box">
            <h4>Community First</h4>
            <p>We source fresh ingredients directly from local farmers.</p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <img
          src="https://via.placeholder.com/100"
          alt="founder"
          className="founder-img"
        />

        <div className="founder-info">
          <h3>Chef Jamie</h3>
          <span className="badge">Founder</span>
          <span className="badge">Head Chef</span>
          <p>Over 10 years of experience bringing creativity to every dish.</p>
        </div>

        <button className="outline-btn">Contact</button>
      </section>
    </div>
  );
}
>>>>>>> 6ed957fe911689b3d2f9d81384d950dd90968f33
