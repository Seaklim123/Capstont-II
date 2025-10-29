import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

export function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="clean-header">
      <div className="header-container">
        {/* Left side - Logo and Navigation */}
        <div className="left-section">
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

          <button className="icon-button cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
