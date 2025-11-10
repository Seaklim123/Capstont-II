import React from 'react';
import { Footer } from '../components/footer-component';
import '../styles/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-content">
            <span className="profile-badge">Profile</span>
            <h1 className="about-title">About Us</h1>
            <p className="about-subtitle">
              Lorem ipsum dolor sit amet consectetur.
            </p>
            <button className="order-now-btn">Order now</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Meals Sold</div>
              <div className="stat-value">100,000</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Local Farmers Partnered</div>
              <div className="stat-value">50</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Sustainable Ingredients</div>
              <div className="stat-value">90%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-left">
              <h2 className="story-title">Our Story</h2>
              <p className="story-text">
                Founded in 2021, our journey began with a passion for food and a love for community. We believe that great meals bring people together.
              </p>
              <button className="learn-more-btn">Learn More</button>
            </div>
            <div className="story-right">
              <div className="story-card">
                <h3 className="card-title">A Culinary Adventure</h3>
                <p className="card-text">
                  Our founder, Chef Jamie, has traveled the world to bring the best flavors to your table, crafting each dish with love and care.
                </p>
              </div>
              <div className="story-card">
                <h3 className="card-title">Community First</h3>
                <p className="card-text">
                  We source our ingredients from local farmers to support our community and ensure that every meal is fresh and sustainable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="team-member">
            <div className="member-avatar">
              <div className="avatar-placeholder"></div>
            </div>
            <div className="member-info">
              <h3 className="member-name">Name</h3>
              <p className="member-role">Founder - Culinary Expert</p>
              <p className="member-description">
                With over a decade of experience, Chef Jamie ensures every meal is a new experience in flavor.
              </p>
              <button className="contact-btn">Contact of Person</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;