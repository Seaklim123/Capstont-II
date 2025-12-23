import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Menu, LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import UserProfileModal from './UserProfileModal';

const Header = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  toggleMobileMenu, 
  currentPageName 
}) => {
  const { user, logout, updateUser } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
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

  const handleProfileClick = () => {
    setProfileModalOpen(true);
    setUserDropdownOpen(false); // Close dropdown when opening profile
  };

  const handleProfileUpdate = (updatedUserData) => {
    // Update user data in AuthContext
    if (updateUser) {
      updateUser(updatedUserData);
    }
    toast.success('Profile updated successfully!');
  };

  return (
    <header className={`admin-header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

      <div className="header-left" style={{ display: 'flex', alignItems: 'center' }}>
        {/* Menu icon for toggling sidebar (desktop & mobile) */}
        <button
          className="sidebar-toggle"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            marginRight: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.5rem',
          }}
        >
          <Menu size={28} />
        </button>
        <div className="breadcrumb">
          <span>Admin</span>
          <span className="breadcrumb-separator">/</span>
          <span>{currentPageName || 'Dashboard'}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
         
          
          <div className="user-menu" ref={dropdownRef} style={{ position: 'relative' }}>
            <button 
              className="user-menu-trigger"
              onClick={toggleUserDropdown}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '24px',
                minHeight: 0,
                minWidth: 0,
                boxShadow: 'none',
                margin: 0,
                transition: 'background 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >
              <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 18, marginRight: 8 }}>{getUserInitial()}</div>
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
              <div className="user-dropdown enhanced-dropdown" style={{ display: 'flex', flexDirection: 'row', minWidth: 240, position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 100, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}>
                {/* Left side: actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '18px 10px 18px 14px', borderRight: '1px solid #f1f5f9', minWidth: 100, background: '#f8fafc', height: '100%' }}>
                  <button className="dropdown-item enhanced-dropdown-item" style={{ marginBottom: 12, width: '100%', justifyContent: 'flex-start' }} onClick={handleProfileClick}>
                    <User size={18} style={{ marginRight: 10 }} />
                    <span>Profile</span>
                  </button>
                  <button className="dropdown-item enhanced-dropdown-item" style={{ marginBottom: 12, width: '100%', justifyContent: 'flex-start' }}>
                    <Settings size={18} style={{ marginRight: 10 }} />
                    <span>Settings</span>
                  </button>
                  <button className="dropdown-item logout enhanced-logout" style={{ color: '#ef4444', width: '100%', justifyContent: 'flex-start', marginTop: 'auto' }} onClick={handleLogout}>
                    <LogOut size={18} style={{ marginRight: 10 }} />
                    <span>Sign Out</span>
                  </button>
                </div>
                {/* Right side: user info */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '18px 12px' }}>
                  <div className="user-avatar large enhanced-avatar" style={{ marginBottom: 10 }}>{getUserInitial()}</div>
                  <div className="user-details" style={{ textAlign: 'center' }}>
                    <div className="user-name enhanced-user-name">{getUserDisplayName()}</div>
                    <div className="user-role enhanced-user-role">{getRoleBadge()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentUser={user}
        onProfileUpdate={handleProfileUpdate}
      />
    </header>
  );
};

export default Header;