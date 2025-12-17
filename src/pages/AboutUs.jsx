import React from "react";
import "../styles/AboutUs.css";
import { ChefHat, Heart, Users, Award, Leaf, MapPin } from "lucide-react";

function AboutUs() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <div className="hero-badge">Our Story</div>
          <h1 className="hero-title">Crafting Memorable Dining Experiences</h1>
          <p className="hero-subtitle">
            Where passion meets flavor, and every dish tells a story of tradition, 
            quality, and exceptional taste.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={32} />
            </div>
            <h3 className="stat-number">100K+</h3>
            <p className="stat-label">Happy Customers</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Leaf size={32} />
            </div>
            <h3 className="stat-number">50+</h3>
            <p className="stat-label">Local Farmers</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Award size={32} />
            </div>
            <h3 className="stat-number">90%</h3>
            <p className="stat-label">Sustainable Ingredients</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <ChefHat size={32} />
            </div>
            <h3 className="stat-number">15+</h3>
            <p className="stat-label">Years Experience</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-text">
            <h2 className="section-title">Our Journey</h2>
            <p className="story-description">
              Founded in 2021, our restaurant was born from a simple yet powerful vision: 
              to create a dining experience that brings people together through exceptional food. 
              What started as a small family kitchen has blossomed into a beloved culinary destination.
            </p>
            <p className="story-description">
              Every dish we serve is a celebration of flavors, carefully crafted using the finest 
              local ingredients. We believe that great food is more than sustenance—it's an experience 
              that creates memories and strengthens bonds.
            </p>
            <div className="story-features">
              <div className="feature-item">
                <Heart className="feature-icon" size={24} />
                <div>
                  <h4>Made with Love</h4>
                  <p>Every dish is prepared with passion and attention to detail</p>
                </div>
              </div>
              <div className="feature-item">
                <MapPin className="feature-icon" size={24} />
                <div>
                  <h4>Local & Fresh</h4>
                  <p>We source ingredients from trusted local farmers</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="story-image">
            <div className="image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" 
                alt="Restaurant interior" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2 className="section-title center">What Drives Us</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌱</div>
            <h3>Sustainability</h3>
            <p>Committed to eco-friendly practices and supporting local communities</p>
          </div>
          <div className="value-card">
            <div className="value-icon">✨</div>
            <h3>Quality First</h3>
            <p>Only the finest ingredients make it to your plate</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Community</h3>
            <p>Building lasting relationships with customers and suppliers</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2 className="section-title center">Meet Our Founder</h2>
        <div className="founder-card">
          <div className="founder-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80"
              alt="Chef Jamie"
              className="founder-image"
            />
          </div>
          <div className="founder-content">
            <h3 className="founder-name">Chef Jamie Anderson</h3>
            <div className="founder-badges">
              <span className="founder-badge">Executive Chef</span>
              <span className="founder-badge">Culinary Director</span>
            </div>
            <p className="founder-bio">
              With over 15 years of culinary experience across three continents, Chef Jamie 
              brings a unique blend of traditional techniques and modern innovation to every dish. 
              His passion for food and commitment to excellence have made our restaurant a 
              destination for food lovers.
            </p>
            <p className="founder-bio">
              "Cooking is not just about feeding people—it's about creating experiences that 
              touch the heart and soul. Every plate that leaves our kitchen carries a piece 
              of our passion and dedication."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;