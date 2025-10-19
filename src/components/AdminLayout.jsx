import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  UtensilsCrossed, 
  Table, 
  Users, 
  BarChart3
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      description: 'Overview & Analytics'
    },
    {
      path: '/orders',
      name: 'Orders Management',
      icon: <ClipboardList size={20} />,
      description: 'Manage current orders'
    },
    {
      path: '/menu',
      name: 'Menu Management',
      icon: <UtensilsCrossed size={20} />,
      description: 'Add/Edit food items'
    },
    {
      path: '/tables',
      name: 'Table Management',
      icon: <Table size={20} />,
      description: 'Manage tables & QR codes'
    },
    {
      path: '/users',
      name: 'Users/Staff',
      icon: <Users size={20} />,
      description: 'Staff & permissions'
    },
    {
      path: '/reports',
      name: 'Reports',
      icon: <BarChart3 size={20} />,
      description: 'Sales & analytics'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">QR</div>
          {!sidebarCollapsed && <h2 className="sidebar-title">Admin Screen</h2>}
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path}
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <div className="nav-text">
                      <span className="nav-name">{item.name}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

    
      </aside>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <Header 
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          toggleMobileMenu={toggleMobileMenu}
          currentPageName={navigationItems.find(item => isActiveRoute(item.path))?.name}
        />

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default AdminLayout;