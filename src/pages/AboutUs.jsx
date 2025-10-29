import React from 'react';
import { Footer } from '../components/footer-component';
import '../styles/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <header className="about-header">
          <h1 className="about-title">About Tos Kamong Food</h1>
          <p className="about-subtitle">
            Your favorite restaurant for delicious meals and great experiences
          </p>
        </header>

        <section className="about-content">
          <div className="about-section">
            <h3>Our Story</h3>
            <p>
              Tos Kamong Food has been serving delicious meals to our community for years. 
              We pride ourselves on fresh ingredients, excellent service, and a warm atmosphere.
            </p>
          </div>
          
          <div className="about-section">
            <h3>Our Mission</h3>
            <p>
              To provide exceptional dining experiences through quality food, 
              outstanding service, and a welcoming environment for all our guests.
            </p>
          </div>
          
          <div className="about-section">
            <h3>Why Choose Us</h3>
            <ul>
              <li>Fresh, high-quality ingredients</li>
              <li>Fast and reliable service</li>
              <li>Competitive prices</li>
              <li>Wide variety of menu options</li>
            </ul>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;