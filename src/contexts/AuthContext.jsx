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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        // Parse stored user data
        const parsedUser = JSON.parse(userData);
        
        // Try to verify token is still valid by making a request to profile endpoint
        try {
          const response = await fetch('http://localhost:8000/api/v1/auth/profile', {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            const currentUser = profileData.user || profileData;
            setUser(currentUser);
            setIsAuthenticated(true);
            // Update stored user data if needed
            localStorage.setItem('user', JSON.stringify(currentUser));
          } else if (response.status === 401) {
            // Token is expired or invalid, clear auth data
            throw new Error('Token expired');
          } else {
            // Profile endpoint error but token might be valid, use stored data
            console.warn('Profile endpoint error, using stored user data');
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        } catch (tokenError) {
          if (tokenError.message === 'Token expired') {
            console.log('Token expired, clearing auth data');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // Network or other error, use stored data as fallback
            console.warn('Token validation failed, using stored data:', tokenError);
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
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
      // Step 1: Login to get token
      const loginResponse = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const loginData = await loginResponse.json();
      
      // Debug: Log the entire response to see structure
      console.log('Login response data:', loginData);
      
      // Try different possible token property names
      const token = loginData.token || loginData.access_token || loginData.data?.token || loginData.data?.access_token;
      
      console.log('Extracted token:', token);
      
      if (!token) {
        console.error('No token found in response. Response structure:', Object.keys(loginData));
        throw new Error('No token received from server');
      }

      let userData = null;

      // Step 2: Try to fetch user profile with the token
      try {
        const profileResponse = await fetch('http://localhost:8000/api/v1/auth/profile', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          userData = profileData.user || profileData.data || profileData;
        } else {
          console.warn('Profile endpoint failed, using fallback user data');
        }
      } catch (profileError) {
        console.warn('Profile fetch failed, using fallback user data:', profileError);
      }

      // Step 3: If profile fetch failed, create basic user data from credentials
      if (!userData) {
        userData = {
          id: Date.now(), // Temporary ID
          username: credentials.username,
          role: 'admin', // Default role based on your current system
          name: credentials.username,
          email: `${credentials.username}@example.com`, // Placeholder email
        };
      }

      // Step 4: Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Call backend logout endpoint
        await fetch('http://localhost:8000/api/v1/auth/logout', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage regardless of backend response
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
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
    const roleHierarchy = {
      'admin': 2,
      'cashier': 1
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  const hasPermission = (permission) => {
    if (!user) return false;

    const permissions = {
      'admin': [
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