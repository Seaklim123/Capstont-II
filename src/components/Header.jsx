import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Menu, LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  toggleMobileMenu, 
  currentPageName 
}) => {
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    toast.success('Logged out successfully');
    logout();
    navigate('/login');
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const getUserInitial = () => {
  if (!user) return 'U';
  return user.username ? user.username.charAt(0).toUpperCase() : 'U';
  };

  const getUserDisplayName = () => {
  if (!user) return 'User';
  return user.username;
  };

  const getRoleBadge = () => {
    if (!user) return '';
    const roleLabels = {
      'founder_restaurant': 'Founder',
      'cashier': 'Cashier'
    };
    return roleLabels[user.role] || user.role;
  };

  return (
    <header className={`admin-header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <Menu size={20} />
        </button>
        <div className="breadcrumb">
          <span>Admin</span>
          <span className="breadcrumb-separator">/</span>
          <span>{currentPageName || 'Dashboard'}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="notification-btn">
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </button>
          
          <div className="user-menu" ref={dropdownRef}>
            <button 
              className="user-menu-trigger"
              onClick={toggleUserDropdown}
            >
              <div className="user-avatar">{getUserInitial()}</div>
              <div className="user-info desktop-only">
                <span className="user-name">{getUserDisplayName()}</span>
                <span className="user-role">{getRoleBadge()}</span>
              </div>
              <span className="dropdown-arrow desktop-only">
                <ChevronDown size={16} />
              </span>
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && (
              <div className="user-dropdown enhanced-dropdown">
                <div className="user-dropdown-header enhanced-dropdown-header">
                  <div className="user-avatar large enhanced-avatar">{getUserInitial()}</div>
                  <div className="user-details">
                    <div className="user-name enhanced-user-name">{getUserDisplayName()}</div>
                    <div className="user-role enhanced-user-role">{getRoleBadge()}</div>
                  </div>
                </div>

                <div className="dropdown-divider enhanced-divider"></div>

                <div className="dropdown-menu enhanced-dropdown-menu">
                  <button className="dropdown-item enhanced-dropdown-item">
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="dropdown-item enhanced-dropdown-item">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="dropdown-divider enhanced-divider"></div>

                <button className="dropdown-item logout enhanced-logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;