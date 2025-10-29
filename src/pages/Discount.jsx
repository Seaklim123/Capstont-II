import React from 'react';
import { Footer } from '../components/footer-component';
import '../styles/Discount.css';

const Discount = () => {
  return (
    <div className="discount-page">
      <div className="discount-container">
        <header className="discount-header">
          <h1 className="discount-title">Special Discounts</h1>
          <p className="discount-subtitle">
            Discover amazing deals and offers on your favorite dishes
          </p>
        </header>

        <section className="discount-offers">
          <div className="offer-card">
            <h3>50% OFF</h3>
            <p>On all burgers this week</p>
          </div>
          <div className="offer-card">
            <h3>Buy 1 Get 1 Free</h3>
            <p>Pizza deals every Friday</p>
          </div>
          <div className="offer-card">
            <h3>30% OFF</h3>
            <p>First-time customers</p>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Discount;