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
      console.log(' Checking auth status...');
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');

      console.log(' Token exists:', !!token);
      console.log(' User data exists:', !!userData);

      if (token && userData) {
        try {
          // Parse stored user data
          const parsedUser = JSON.parse(userData);
          console.log(' Parsed user data:', parsedUser);
          
          // Set user immediately with stored data to avoid logout during token validation
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log(' User authenticated with stored data');

          // Try to verify token is still valid by making a request to profile endpoint
          try {
            console.log(' Validating token with backend...');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/auth/profile`, {
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              },
            });

            if (response.ok) {
              const profileData = await response.json();
              console.log(' Raw profile response:', profileData);
              
              // Extract user data correctly - handle different response formats
              let currentUser;
              if (profileData.data) {
                // Response format: { success: true, message: "...", data: { user_data } }
                currentUser = profileData.data;
              } else if (profileData.user) {
                // Response format: { user: { user_data } }
                currentUser = profileData.user;
              } else if (profileData.id) {
                // Response format: { id, username, email, ... } (direct user object)
                currentUser = profileData;
              } else {
                // Fallback - use the stored data
                console.warn(' Unexpected profile response format, keeping stored data');
                currentUser = parsedUser;
              }
              
              console.log('Extracted user data:', currentUser);
              setUser(currentUser);
              // Update stored user data with clean user object
              localStorage.setItem('user', JSON.stringify(currentUser));
            } else if (response.status === 401) {
              // Token is expired or invalid, clear auth data
              console.warn(' Token expired or invalid');
              throw new Error('Token expired');
            } else {
              // Profile endpoint error but token might be valid, keep stored data
              console.warn(' Profile endpoint error, keeping stored user data');
            }
          } catch (tokenError) {
            if (tokenError.message === 'Token expired') {
              console.log(' Token expired, clearing auth data');
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              setUser(null);
              setIsAuthenticated(false);
            } else {
              // Network or other error, keep stored data as fallback
              console.warn(' Token validation failed, keeping stored data:', tokenError.message);
              // Keep the user authenticated with stored data
            }
          }
        } catch (parseError) {
          console.error(' Failed to parse stored user data:', parseError);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log(' No token or user data found');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(' Error checking auth status:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      console.log(' Auth check completed');
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log(' Attempting login...');
      
      // Step 1: Login to get token
      const loginResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const loginData = await loginResponse.json();
      console.log('Login response received:', loginData);
      
      // Try different possible token property names
      const token = loginData.token || loginData.access_token || loginData.data?.token || loginData.data?.access_token;
      console.log(' Extracted token:', token ? '***' + token.slice(-10) : 'NO TOKEN');
      
      if (!token) {
        console.error('No token found in response. Response structure:', Object.keys(loginData));
        throw new Error('No token received from server');
      }

      let userData = null;

      // Step 2: Try to fetch user profile with the token
      try {
        console.log(' Fetching user profile...');
        const profileResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/auth/profile`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log(' Raw profile response:', profileData);
          
          // Extract user data correctly - handle different response formats
          if (profileData.data) {
            // Response format: { success: true, message: "...", data: { user_data } }
            userData = profileData.data;
          } else if (profileData.user) {
            // Response format: { user: { user_data } }
            userData = profileData.user;
          } else if (profileData.id) {
            // Response format: { id, username, email, ... } (direct user object)
            userData = profileData;
          }
          
          console.log(' Extracted profile data:', userData);
        } else {
          console.warn(' Profile endpoint failed, using fallback user data');
        }
      } catch (profileError) {
        console.warn(' Profile fetch failed, using fallback user data:', profileError);
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
        console.log(' Created fallback user data:', userData);
      }

      // Step 4: Store token and user data
      console.log(' Storing authentication data...');
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Verify storage
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      console.log(' Token stored:', !!storedToken);
      console.log(' User stored:', !!storedUser);
      
      setUser(userData);
      setIsAuthenticated(true);
      console.log('Login successful!');
      
      return userData;
    } catch (error) {
      console.error(' Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Call backend logout endpoint
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/auth/logout`, {
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