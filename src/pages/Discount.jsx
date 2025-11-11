import React from "react";
import "../styles/Discount.css";
import { Footer } from "../components/footer-component";

function Discount() {
  const dishes = [
    { id: 1, name: "Spaghetti", price: "$12.99", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Grilled Chicken", price: "$10.99", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Sushi Roll", price: "$8.99", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Burger Deluxe", price: "$9.99", image: "https://via.placeholder.com/150" },
    { id: 5, name: "Salad Bowl", price: "$7.99", image: "https://via.placeholder.com/150" },
    { id: 6, name: "Tacos", price: "$11.99", image: "https://via.placeholder.com/150" },
    // add more if needed
  ];

  return (
    <div className="discount-container font-sans">
      {/* Top Section */}
      <section className="discount-hero text-center py-12">
        <button className="discount-btn">Discount</button>
        <h1>Our Discount</h1>
        <p className="subtitle">Learn wonderful or smart connection.</p>

        {/* Category Buttons */}
        <div className="category-buttons">
          {["All", "Starter", "Main", "Drinks", "Snacks", "Desserts"].map((cat, index) => (
            <button key={index} className="category-btn">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Dishes Section */}
      <section className="dishes-section">
        <h2 className="section-title">All Dishes</h2>
        <div className="dishes-grid">
          {dishes.map((dish) => (
            <div className="dish-card" key={dish.id}>
              <img src={dish.image} alt={dish.name} />
              <h4>{dish.name}</h4>
              <p>{dish.price}</p>
              <button className="add-btn">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
        
  );
}

export default Discount;