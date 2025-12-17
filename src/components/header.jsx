import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Header.css";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState(null);
  const [tableDisplayNumber, setTableDisplayNumber] = useState(null);


  // Fetch table display number from backend using table id
  async function fetchTableDisplayNumber(tableId) {
    // Only fetch from admin API if user is admin
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {}
      if (user && (user.role === 'admin' || user.role === 'cashier')) {
        try {
          const table = await adminTableApi.getById(tableId);
          setTableDisplayNumber(table?.data?.number || tableId);
        } catch (error) {
          setTableDisplayNumber(tableId);
        }
      } else {
        // For normal users, use table number/id from localStorage, do NOT call admin API
        setTableDisplayNumber(tableId);
    }
  }

  useEffect(() => {
    // Update cart count and table info
    const updateCartCount = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const items = JSON.parse(cart);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
      // Update table number (id)
      const storedTableNumber = localStorage.getItem('tableNumber');
      const storedTableId = localStorage.getItem('tableId');
      setTableNumber(storedTableNumber);
      // Always prefer to fetch display number if tableId is present
      if (storedTableId) {
        fetchTableDisplayNumber(storedTableId);
      } else {
        const storedTableDisplayNumber = localStorage.getItem('tableDisplayNumber');
        if (storedTableNumber && (!storedTableDisplayNumber || storedTableDisplayNumber === storedTableNumber)) {
          fetchTableDisplayNumber(storedTableNumber);
        } else if (storedTableDisplayNumber) {
          setTableDisplayNumber(storedTableDisplayNumber);
        } else {
          setTableDisplayNumber(null);
        }
      }
    };

    updateCartCount();

    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [location]);

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
          <Link to="/" className="logo">
            <span className="logo-text">Tos Kamong</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="nav-menu">
            {/* <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link> */}
            <Link 
              to="/menu" 
              className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
            >
              Menu
            </Link>
            <Link 
              to="/orders" 
              className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
            >
              Orders
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
          {/* Table Number Display */}
          {tableDisplayNumber && tableNumber && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginRight: '12px',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}>
              <span>🪑</span>
              <span>Table {tableDisplayNumber}</span>
            </div>
          )}
          
          {/* <div className="search-container">
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
          </div> */}

          <button className="icon-button cart" onClick={() => {
            console.log('Cart button clicked, navigating to /cart');
            navigate('/cart');
          }}>
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
            to="/orders" 
            className={`mobile-nav-link ${isActive('/orders') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Orders
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
