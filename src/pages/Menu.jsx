import { useState, useEffect } from "react";
import "../styles/Menu.css";
import { Footer } from "../components/footer-component.jsx";
import { categoryApi } from "../services/api.js";

function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5; // Show 5 items per page

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching categories from:', import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api');
        const response = await categoryApi.getAll();
        console.log('Categories response:', response);
        // Log image paths for debugging
        if (response.data) {
          response.data.forEach(cat => {
            console.log(`Category "${cat.name}" image_path:`, cat.image_path);
          });
        }
        setCategories(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(`Backend not running. Please start your Laravel server: php artisan serve`);
        // Use fallback categories when backend is not available (without images)
        setCategories([
          { id: 1, name: "Food", image_path: null },
          { id: 2, name: "Beverages", image_path: null },
          { id: 3, name: "Desserts", image_path: null },
          { id: 4, name: "Snacks", image_path: null }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Default icon for categories without images
  const getDefaultIcon = (categoryName) => {
    const iconMap = {
      'food': '🍽️',
      'beverage': '🥤',
      'dessert': '🍰',
      'snack': '🍿',
      'meat': '🥩',
      'vegetable': '🥬',
      'fruit': '🍎',
      'seafood': '�',
      'dairy': '🥛',
      'bakery': '🥖'
    };
    
    const lowerCaseName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerCaseName.includes(key)) {
        return icon;
      }
    }
    return '🛒'; // Default grocery icon
  };

  // Helper function to get category image URL
  const getCategoryImageUrl = (category) => {
    if (category.image_path && category.image_path !== null && category.image_path !== '') {
      console.log(`Processing image for ${category.name}:`, category.image_path);
      
      // If it's a full URL, use it as is
      if (category.image_path.startsWith('http')) {
        return category.image_path;
      }
      
      // Handle different Laravel storage path formats
      let imagePath = category.image_path;
      
      // Remove leading slash if present
      if (imagePath.startsWith('/')) {
        imagePath = imagePath.substring(1);
      }
      
      // If it starts with 'storage/', construct URL
      if (imagePath.startsWith('storage/')) {
        return `http://127.0.0.1:8000/${imagePath}`;
      }
      
      // If it's just a filename, assume it's in storage/app/public/categories
      if (!imagePath.includes('/')) {
        return `http://127.0.0.1:8000/storage/categories/${imagePath}`;
      }
      
      // Default: add storage prefix
      return `http://127.0.0.1:8000/storage/${imagePath}`;
    }
    return null;
  };

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
          {loading && (
            <div className="categories-loading">
              <p>Loading categories...</p>
            </div>
          )}
          
          {error && (
            <div className="categories-error">
              <p>⚠️ {error}</p>
              <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
                Using fallback categories for now. Categories will work when backend is connected.
              </p>
            </div>
          )}
          
          {!loading && !error && (
            <div className="menu-categories-grid">
              {/* All Categories Option */}
              <div 
                className={`menu-category-item ${activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => setActiveCategory('All')}
              >
                <div className="menu-category-circle">
                  <span className="category-emoji">🍽️</span>
                </div>
                <span className="menu-category-label">All</span>
              </div>
              
              {/* Dynamic Categories from API */}
              {categories.slice(0, 6).map(category => {
                const imageUrl = getCategoryImageUrl(category);
                console.log(`=== Category: ${category.name} ===`);
                console.log('Raw image_path:', category.image_path);
                console.log('Processed URL:', imageUrl);
                console.log('Has image_path:', !!category.image_path);
                console.log('========================');
                
                return (
                  <div 
                    key={category.id} 
                    className={`menu-category-item ${activeCategory === category.name ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    <div className="menu-category-circle">
                      {imageUrl ? (
                        <>
                          <img 
                            src={imageUrl} 
                            alt={category.name}
                            className="category-image"
                            onLoad={() => console.log(`✅ SUCCESS: Image loaded for ${category.name}`)}
                            onError={(e) => {
                              console.log(`❌ FAILED: Image failed for ${category.name}`);
                              console.log('Failed URL:', imageUrl);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <span 
                            className="category-emoji"
                            style={{ display: 'none' }}
                          >
                            {getDefaultIcon(category.name)}
                          </span>
                        </>
                      ) : (
                        <span className="category-emoji">
                          {console.log(`🔄 Using emoji for ${category.name} (no image_path)`)}
                          {getDefaultIcon(category.name)}
                        </span>
                      )}
                    </div>
                    <span className="menu-category-label">{category.name}</span>
                  </div>
                );
              })}
              
              {/* Filter button */}
              <div className="menu-category-item">
                <div className="menu-category-circle filter-circle">
                  <span className="filter-icon">☰</span>
                </div>
                <span className="menu-category-label">Filter</span>
              </div>
            </div>
          )}
          
          {/* Show message if no categories */}
          {!loading && !error && categories.length === 0 && (
            <div className="no-categories">
              <p>No categories available. <a href="/categories">Add some categories</a> to get started.</p>
            </div>
          )}
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

      {/* All Dishes Section */}
      <section className="all-dishes-section">
        <div className="container">
          <h2 className="section-title">All Dishes</h2>
          
          <div className="all-dishes-grid">
            <div className="dish-item">
              <div className="dish-badges">
                <span className="badge best-seller">Best Seller</span>
                <span className="badge sold-badge">50+ Sold</span>
              </div>
              <div className="dish-image">
                <span>Menu Image</span>
                <div className="all-label">All</div>
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

          <div className="pagination">
            <div className="pagination-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Menu;