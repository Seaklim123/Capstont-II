import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Header.css";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Update cart count when component mounts and when storage changes
    const updateCartCount = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const items = JSON.parse(cart);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();

    // Listen for storage changes (when cart is updated)
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for same-window updates
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [location]); // Re-check when location changes

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="clean-header">
      <div className="header-container">
        {/* Left side - Logo and Navigation */}
        <div className="left-section">
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-text">Tos Kamong</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="nav-menu">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
            >
              Menu
            </Link>
            <Link 
              to="/discount" 
              className={`nav-link ${isActive('/discount') ? 'active' : ''}`}
            >
              Discount
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              About Us
            </Link>
          </nav>
        </div>

        {/* Search and Icons */}
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              className="search-input"
            />
            <button className="search-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>

          <button className="icon-button cart" onClick={() => navigate('/cart')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="mobile-nav-menu">
          <Link 
            to="/" 
            className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/menu" 
            className={`mobile-nav-link ${isActive('/menu') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Menu
          </Link>
          <Link 
            to="/discount" 
            className={`mobile-nav-link ${isActive('/discount') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Discount
          </Link>
          <Link 
            to="/about" 
            className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
        </nav>
      )}
    </header>
  );
}
