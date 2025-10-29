import { useState } from "react";
import "../styles/Menu.css";

function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 items per page

  // Top categories data - updated to match design
  const topCategories = [
    { id: 1, name: "Grocery", icon: "🛒" },
    { id: 2, name: "Grocery", icon: "🛒" },
    { id: 3, name: "Grocery", icon: "�" },
    { id: 4, name: "Grocery", icon: "🛒" },
    { id: 5, name: "Grocery", icon: "�" },
    { id: 6, name: "Grocery", icon: "🛒" },
    { id: 7, name: "Grocery", icon: "🛒" }
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
      {/* Header Section */}
      <section className="menu-header-section">
        <div className="container">
          <div className="menu-header">
            <span className="menu-badge">Menu</span>
            <h1 className="menu-title">Our Menu</h1>
            <p className="menu-subtitle">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="menu-categories-section">
        <div className="container">
          <div className="menu-categories-grid">
            {topCategories.map(category => (
              <div key={category.id} className="menu-category-item">
                <div className="menu-category-circle">
                  <span className="category-emoji">{category.icon}</span>
                </div>
                <span className="menu-category-label">{category.name}</span>
              </div>
            ))}
            {/* Filter button */}
            <div className="menu-category-item">
              <div className="menu-category-circle filter-circle">
                <span className="filter-icon">☰</span>
              </div>
              <span className="menu-category-label">Filter</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dish Section */}
      <section className="popular-dish-section">
        <div className="container">
          <h2 className="section-title">Popular Dish</h2>
          <div className="dish-grid">
            <div className="dish-item">
              <div className="dish-badges">
                <span className="badge best-seller">Best Seller</span>
                <span className="badge sold-badge">50+ Sold</span>
              </div>
              <div className="dish-image">
                <span>Menu Image</span>
              </div>
              <div className="dish-info">
                <h3 className="dish-name">Name</h3>
                <div className="dish-bottom">
                  <div className="dish-price-info">
                    <span className="dish-price">$2.10</span>
                    <span className="original-price">$4.00</span>
                    <span className="discount-badge">$1.90 OFF</span>
                  </div>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>

            <div className="dish-item">
              <div className="dish-badges">
                <span className="badge best-seller">Best Seller</span>
                <span className="badge sold-badge">50+ Sold</span>
              </div>
              <div className="dish-image">
                <span>Menu Image</span>
              </div>
              <div className="dish-info">
                <h3 className="dish-name">Name</h3>
                <div className="dish-bottom">
                  <div className="dish-price-info">
                    <span className="dish-price">$2.10</span>
                    <span className="original-price">$4.00</span>
                    <span className="discount-badge">$1.90 OFF</span>
                  </div>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>

            <div className="dish-item">
              <div className="dish-badges">
                <span className="badge best-seller">Best Seller</span>
                <span className="badge sold-badge">50+ Sold</span>
              </div>
              <div className="dish-image">
                <span>Menu Image</span>
              </div>
              <div className="dish-info">
                <h3 className="dish-name">Name</h3>
                <div className="dish-bottom">
                  <div className="dish-price-info">
                    <span className="dish-price">$2.10</span>
                    <span className="original-price">$4.00</span>
                    <span className="discount-badge">$1.90 OFF</span>
                  </div>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>

            <div className="dish-item">
              <div className="dish-badges">
                <span className="badge best-seller">Best Seller</span>
                <span className="badge sold-badge">50+ Sold</span>
              </div>
              <div className="dish-image">
                <span>Menu Image</span>
              </div>
              <div className="dish-info">
                <h3 className="dish-name">Name</h3>
                <div className="dish-bottom">
                  <div className="dish-price-info">
                    <span className="dish-price">$2.10</span>
                    <span className="original-price">$4.00</span>
                    <span className="discount-badge">$1.90 OFF</span>
                  </div>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discount Dish Section */}
      <section className="discount-dish-section">
        <div className="container">
          <h2 className="section-title">Discount Dish</h2>
          <div className="dish-grid">
            <div className="dish-item">
              <div className="dish-badges">
                <span className="badge best-seller">Best Seller</span>
                <span className="badge sold-badge">50+ Sold</span>
              </div>
              <div className="dish-image">
                <span>Menu Image</span>
              </div>
              <div className="dish-info">
                <h3 className="dish-name">Name</h3>
                <div className="dish-bottom">
                  <div className="dish-price-info">
                    <span className="dish-price">$2.10</span>
                    <span className="original-price">$4.00</span>
                    <span className="discount-badge">$1.90 OFF</span>
                  </div>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>

            <div className="dish-item">
              <div className="dish-badges">
                <span className="badge best-seller">Best Seller</span>
                <span className="badge sold-badge">50+ Sold</span>
              </div>
              <div className="dish-image">
                <span>Menu Image</span>
              </div>
              <div className="dish-info">
                <h3 className="dish-name">Name</h3>
                <div className="dish-bottom">
                  <div className="dish-price-info">
                    <span className="dish-price">$2.10</span>
                    <span className="original-price">$4.00</span>
                    <span className="discount-badge">$1.90 OFF</span>
                  </div>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>

            <div className="dish-item">
              <div className="dish-badges">
                <span className="badge best-seller">Best Seller</span>
                <span className="badge sold-badge">50+ Sold</span>
              </div>
              <div className="dish-image">
                <span>Menu Image</span>
              </div>
              <div className="dish-info">
                <h3 className="dish-name">Name</h3>
                <div className="dish-bottom">
                  <div className="dish-price-info">
                    <span className="dish-price">$2.10</span>
                    <span className="original-price">$4.00</span>
                    <span className="discount-badge">$1.90 OFF</span>
                  </div>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>

            <div className="dish-item">
              <div className="dish-badges">
                <span className="badge best-seller">Best Seller</span>
                <span className="badge sold-badge">50+ Sold</span>
              </div>
              <div className="dish-image">
                <span>Menu Image</span>
              </div>
              <div className="dish-info">
                <h3 className="dish-name">Name</h3>
                <div className="dish-bottom">
                  <div className="dish-price-info">
                    <span className="dish-price">$2.10</span>
                    <span className="original-price">$4.00</span>
                    <span className="discount-badge">$1.90 OFF</span>
                  </div>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Menu;