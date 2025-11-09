import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear invalid data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Mock API call - replace with actual authentication
      const mockUsers = [
        {
          id: 1,
          username: 'admin',
          password: 'admin123',
          role: 'founder_restaurant',
          status: 'active',
          name: 'Administrator'
        },
        {
          id: 2,
          username: 'cashier',
          password: 'cashier123',
          role: 'cashier',
          status: 'active',
          name: 'Cashier'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const foundUser = mockUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (!foundUser) {
        throw new Error('Invalid username or password');
      }

      if (foundUser.status !== 'active') {
        throw new Error('Account is inactive. Please contact administrator.');
      }

      // Generate mock token
      const token = `token_${foundUser.id}_${Date.now()}`;
      
      // Prepare user data (exclude password)
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        status: foundUser.status,
        name: foundUser.name,
        loginTime: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear state
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    // Role hierarchy: founder_restaurant > cashier
    const roleHierarchy = {
      'founder_restaurant': 2,
      'cashier': 1
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  const hasPermission = (permission) => {
    if (!user) return false;

    // Define permissions for each role
    const permissions = {
      'founder_restaurant': [
        'view_dashboard',
        'manage_orders',
        'manage_menu',
        'manage_tables',
        'manage_users',
        'view_reports',
        'manage_settings',
        'delete_items',
        'export_data'
      ],
      'cashier': [
        'view_dashboard',
        'manage_orders',
        'view_menu',
        'view_tables',
        'view_reports'
      ]
    };

    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    hasRole,
    hasPermission,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};