import { useState } from "react";
import "../styles/Menu.css";

function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 items per page

  // Top categories data
  const topCategories = [
    { id: 1, name: "Grocery", icon: "🛒" },
    { id: 2, name: "Pizza", icon: "🍕" },
    { id: 3, name: "Pharmacy", icon: "💊" },
    { id: 4, name: "Convenience", icon: "🏪" },
    { id: 5, name: "Pet Supplies", icon: "🐕" },
    { id: 6, name: "Fast Food", icon: "🍔" },
    { id: 7, name: "Taco", icon: "🌮" }
  ];

  // Popular items data
  const popularItems = [
    {
      id: 1,
      name: "Burger Blast",
      image: "/classic-burger-fries.png",
      time: "30 minutes",
      price: "$2.99"
    },
    {
      id: 2,
      name: "Taco Twister",
      image: "/street-tacos-on-plate.jpg",
      time: "25 minutes",
      price: "$1.99"
    },
    {
      id: 3,
      name: "Fries Frenzy",
      image: "/bakery-croissants-and-pastries.jpg",
      time: "20 minutes",
      price: "$1.49"
    },
    {
      id: 4,
      name: "Wrap Rapids",
      image: "/modern-restaurant-interior-with-wooden-decor.jpg",
      time: "15 minutes",
      price: "$3.50"
    }
  ];

  // Full menu categories
  const menuCategories = ["All", "Burgers", "Taco", "Fries", "Wraps"];

  // Full menu items (expanded for pagination)
  const fullMenuItems = [
    // Page 1
    {
      id: 1,
      name: "Classic Burger",
      image: "/classic-burger-fries.png",
      price: "$7.99",
      category: "Burgers"
    },
    {
      id: 2,
      name: "Spicy Taco",
      image: "/street-tacos-on-plate.jpg",
      price: "$5.99",
      category: "Taco"
    },
    {
      id: 3,
      name: "Crispy Fries",
      image: "/bakery-croissants-and-pastries.jpg",
      price: "$3.99",
      category: "Fries"
    },
    {
      id: 4,
      name: "Chicken Wrap",
      image: "/assorted-sushi.png",
      price: "$6.99",
      category: "Wraps"
    },
    {
      id: 5,
      name: "Veggie Burger",
      image: "/illustrated-burger-drawing.jpg",
      price: "$8.99",
      category: "Burgers"
    },
    // Page 2
    {
      id: 6,
      name: "Fish Taco",
      image: "/mexican-restaurant-tacos-on-table.jpg",
      price: "$4.99",
      category: "Taco"
    },
    {
      id: 7,
      name: "Sweet Potato Fries",
      image: "/chocolate-layer-cake-slice.jpg",
      price: "$2.99",
      category: "Fries"
    },
    {
      id: 8,
      name: "Beef Wrap",
      image: "/japanese-restaurant-interior-minimalist.jpg",
      price: "$7.49",
      category: "Wraps"
    },
    {
      id: 9,
      name: "Double Burger",
      image: "/classic-burger-fries.png",
      price: "$9.99",
      category: "Burgers"
    },
    {
      id: 10,
      name: "Loaded Fries",
      image: "/bakery-croissants-and-pastries.jpg",
      price: "$5.99",
      category: "Fries"
    },
    // Page 3
    {
      id: 11,
      name: "BBQ Taco",
      image: "/street-tacos-on-plate.jpg",
      price: "$6.49",
      category: "Taco"
    },
    {
      id: 12,
      name: "Turkey Wrap",
      image: "/assorted-sushi.png",
      price: "$7.99",
      category: "Wraps"
    },
    {
      id: 13,
      name: "Mushroom Burger",
      image: "/illustrated-burger-drawing.jpg",
      price: "$8.49",
      category: "Burgers"
    },
    {
      id: 14,
      name: "Cheese Fries",
      image: "/chocolate-layer-cake-slice.jpg",
      price: "$4.49",
      category: "Fries"
    },
    {
      id: 15,
      name: "Breakfast Taco",
      image: "/mexican-restaurant-tacos-on-table.jpg",
      price: "$3.99",
      category: "Taco"
    },
    // Page 4
    {
      id: 16,
      name: "Bacon Burger",
      image: "/classic-burger-fries.png",
      price: "$10.99",
      category: "Burgers"
    },
    {
      id: 17,
      name: "Spicy Fries",
      image: "/bakery-croissants-and-pastries.jpg",
      price: "$4.99",
      category: "Fries"
    },
    {
      id: 18,
      name: "Veggie Wrap",
      image: "/japanese-restaurant-interior-minimalist.jpg",
      price: "$6.49",
      category: "Wraps"
    },
    {
      id: 19,
      name: "Fish Burger",
      image: "/illustrated-burger-drawing.jpg",
      price: "$8.99",
      category: "Burgers"
    },
    {
      id: 20,
      name: "Deluxe Taco",
      image: "/street-tacos-on-plate.jpg",
      price: "$7.99",
      category: "Taco"
    }
  ];

  const filteredMenuItems = activeCategory === "All" 
    ? fullMenuItems 
    : fullMenuItems.filter(item => item.category === activeCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredMenuItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  return (
    <div className="menu-page">
      {/* Top Categories */}
      <section className="top-categories-section">
        <div className="container">
          <div className="top-categories-grid">
            {topCategories.map(category => (
              <div key={category.id} className="top-category-item">
                <div className="top-category-icon">
                  <span className="category-emoji">{category.icon}</span>
                </div>
                <span className="top-category-label">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="popular-items-section">
        <div className="container">
          <h2 className="section-title">Popular Items</h2>
          <div className="popular-items-grid">
            {popularItems.map(item => (
              <div key={item.id} className="popular-item">
                <img src={item.image} alt={item.name} className="popular-item-image" />
                <div className="popular-item-info">
                  <h3 className="popular-item-name">{item.name}</h3>
                  <div className="popular-item-details">
                    <span className="popular-item-time">{item.time}</span>
                    <span className="popular-item-price">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Menu */}
      <section className="full-menu-section">
        <div className="container">
          <h2 className="section-title">Full Menu</h2>
          
          {/* Category Filter */}
          <div className="menu-filter">
            {menuCategories.map(category => (
              <button
                key={category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="menu-items-grid">
            {currentItems.map(item => (
              <div key={item.id} className="menu-item">
                <img src={item.image} alt={item.name} className="menu-item-image" />
                <div className="menu-item-info">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-price">{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Menu;