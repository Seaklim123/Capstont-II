import { useState } from "react";
import MenuItem from "../components/MenuItem";
import "../styles/Menu.css";

function Menu() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const menuItems = [
    { 
      id: 1, 
      name: "Gourmet Fried Rice", 
      price: 12.99, 
      category: "mains",
      description: "Aromatic jasmine rice stir-fried with premium ingredients, fresh vegetables, and our signature sauce",
      image: "🍚",
      popular: true,
      spicy: false
    },
    { 
      id: 2, 
      name: "Authentic Ramen Bowl", 
      price: 15.99, 
      category: "mains",
      description: "Rich tonkotsu broth with handmade noodles, tender chashu pork, and fresh toppings",
      image: "🍜",
      popular: true,
      spicy: true
    },
    { 
      id: 3, 
      name: "Artisan Cold Brew", 
      price: 4.99, 
      category: "beverages",
      description: "Smooth and refreshing cold brew coffee, perfectly balanced with subtle chocolate notes",
      image: "☕",
      popular: false,
      spicy: false
    },
    { 
      id: 4, 
      name: "Truffle Mushroom Pizza", 
      price: 18.99, 
      category: "mains",
      description: "Wood-fired pizza with truffle oil, wild mushrooms, mozzarella, and fresh arugula",
      image: "🍕",
      popular: true,
      spicy: false
    },
    { 
      id: 5, 
      name: "Grilled Salmon Teriyaki", 
      price: 22.99, 
      category: "mains",
      description: "Fresh Atlantic salmon glazed with house teriyaki, served with jasmine rice and vegetables",
      image: "🐟",
      popular: false,
      spicy: false
    },
    { 
      id: 6, 
      name: "Mango Smoothie Bowl", 
      price: 8.99, 
      category: "beverages",
      description: "Tropical mango smoothie topped with granola, fresh fruits, and coconut flakes",
      image: "🥭",
      popular: false,
      spicy: false
    },
    { 
      id: 7, 
      name: "Chocolate Lava Cake", 
      price: 7.99, 
      category: "desserts",
      description: "Decadent warm chocolate cake with molten center, served with vanilla ice cream",
      image: "🍰",
      popular: true,
      spicy: false
    },
    { 
      id: 8, 
      name: "Spicy Korean Tacos", 
      price: 13.99, 
      category: "mains",
      description: "Korean-style beef bulgogi in soft tacos with kimchi slaw and gochujang sauce",
      image: "🌮",
      popular: true,
      spicy: true
    }
  ];

  const categories = [
    { id: "all", name: "All Items", icon: "🍽️" },
    { id: "mains", name: "Main Courses", icon: "🍖" },
    { id: "beverages", name: "Beverages", icon: "🥤" },
    { id: "desserts", name: "Desserts", icon: "🍰" }
  ];

  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div className="menu-container">
      {/* Menu Header */}
      <div className="menu-header">
        <div className="container">
          <h1 className="menu-title">Our Delicious Menu</h1>
          <p className="menu-subtitle">Discover amazing flavors crafted with love and premium ingredients</p>
        </div>
      </div>

      <div className="menu-content">
        <div className="container">
          <div className="menu-layout">
            {/* Category Filter */}
            <div className="category-filter">
              <h3>Categories</h3>
              <div className="category-buttons">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="menu-items">
              <div className="items-grid">
                {filteredItems.map((item) => (
                  <MenuItem 
                    key={item.id} 
                    item={item} 
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

       
    </div>
  );
}

export default Menu;
