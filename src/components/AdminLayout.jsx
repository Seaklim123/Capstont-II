import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, Outlet } from 'react-router-dom';
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

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, hasRole, hasPermission } = useAuth ? useAuth() : { user: null };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Only show Users/Staff for founder_restaurant, Reports for view_reports permission
  const navigationItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />, 
      description: 'Overview & Analytics',
      show: true
    },
    {
      path: '/orders',
      name: 'Orders Management',
      icon: <ClipboardList size={20} />, 
      description: 'Manage current orders',
      show: true
    },
    {
      path: '/menu',
      name: 'Menu Management',
      icon: <UtensilsCrossed size={20} />, 
      description: 'Add/Edit food items',
      show: true
    },
    {
      path: '/tables',
      name: 'Table Management',
      icon: <Table size={20} />, 
      description: 'Manage tables & QR codes',
      show: true
    },
    {
      path: '/users',
      name: 'Users/Staff',
      icon: <Users size={20} />, 
      description: 'Staff & permissions',
      show: user && (user.role === 'founder_restaurant' || (hasRole && hasRole('founder_restaurant')))
    },
    {
      path: '/reports',
      name: 'Reports',
      icon: <BarChart3 size={20} />, 
      description: 'Sales & analytics',
      show: user && ((user.permissions && user.permissions.includes('view_reports')) || (hasPermission && hasPermission('view_reports')))
    }
  ];

  return (
    <>
      {/* Sidebar (now acts as overlay on mobile) */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px' }}>
            <img src="/public/TosOrder-logo.png" alt="TOS KAMONG Logo" style={{ width: '50px', height: '60px', objectFit: 'contain' }} />
          </div>
          {!sidebarCollapsed && (
            <h2 className="sidebar-title" style={{ textAlign: 'center', width: '100%', margin: 0 }}>
              TOS KAMONG
            </h2>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navigationItems.filter(item => item.show).map((item) => (
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
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default AdminLayout;