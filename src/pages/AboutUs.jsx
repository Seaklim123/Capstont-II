import React from "react";
import "../styles/AboutUs.css";

function AboutUs() {
  return (
    <div className="about-container font-sans">
      {/* Top Section */}
      <section className="about-hero text-center py-12">
        <button className="profile-btn">Profile</button>
        <h1>About Us</h1>
        <p>Lorem ipsum dolor sit amet consectetur.</p>
        <button className="primary-btn">Order now</button>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-box">
          <h4>Meals Sold</h4>
          <p>100,000</p>
        </div>
        <div className="stat-box">
          <h4>Local Farmers Partnered</h4>
          <p>50</p>
        </div>
        <div className="stat-box">
          <h4>Sustainable Ingredients</h4>
          <p>90%</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-left">
          <h2>Our Story</h2>
          <p>
            Founded in 2021, our journey began with a passion for food and a love
            for community. We believe that great meals bring people together.
          </p>
          <button className="outline-btn">Learn More</button>
        </div>

        <div className="story-right">
          <div className="highlight-box">
            <h4>A Culinary Adventure</h4>
            <p>
              Our founder, Chef Jamie, has traveled the world to bring the best
              flavors to your table, crafting each dish with love and care.
            </p>
          </div>

          <div className="highlight-box">
            <h4>Community First</h4>
            <p>
              We source our ingredients from local farmers to support our
              community and ensure every meal is fresh and sustainable.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="founder-info">
          <img
            src="https://via.placeholder.com/100"
            alt="founder"
            className="founder-img"
          />
          <div>
            <h3>Name</h3>
            <span className="badge">Founder</span>
            <span className="badge">Culinary Expert</span>
            <p>
              With over a decade of experience, Chef Jamie ensures every meal is
              a new experience in flavor.
            </p>
          </div>
        </div>
        <button className="contact-btn">Contact of Person</button>
      </section>

    
    </div>
  );
}

export default AboutUs;