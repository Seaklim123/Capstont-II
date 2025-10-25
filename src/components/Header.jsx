import { Bell, ChevronDown, Menu } from 'lucide-react';

const Header = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  toggleMobileMenu, 
  currentPageName 
}) => {
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
          
          <div className="user-menu">
            <div className="user-avatar">A</div>
            <span className="user-name desktop-only">Admin</span>
            <span className="dropdown-arrow desktop-only"><ChevronDown size={16} /></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;