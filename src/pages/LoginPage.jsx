import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import '../styles/login.css';

const LoginPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  // Use AuthContext login method
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Navigation will be handled by the useEffect above
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to be handled by LoginModal
    }
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegister = async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      toast.success('Registration successful! Please login with your credentials.');
      setIsRegisterModalOpen(false);
      setIsLoginModalOpen(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <img 
              src="/src/assets/TosOrder-logo.png" 
              alt="TosOrder Logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div style="font-size: 32px; color: #3b82f6;">🍽️</div>';
              }}
            />
          </div>
          <h1 className="login-brand">TOS KAMONG</h1>
          {/* <p className="login-subtitle">Restaurant Management System</p> */}
          <p className="login-slogan">Order Fast. Eat Fresh. Toskamong!</p>
        </div>

        <div className="login-card">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <LogIn size={48} style={{ color: '#3b82f6', marginBottom: '16px' }} />
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
              Welcome Back
            </h2>
            <p style={{ margin: '0', color: '#64748b', fontSize: '16px' }}>
              Please sign in to access the admin dashboard
            </p>
          </div>

          <button
            onClick={openLoginModal}
            className="btn btn-primary"
            disabled={loading}
            style={{ 
              width: '100%', 
              justifyContent: 'center',
              fontSize: '18px',
              padding: '16px 24px',
              marginBottom: '16px'
            }}
          >
            <LogIn size={20} />
            <span>Sign In to Dashboard</span>
          </button>

          <button
            onClick={openRegisterModal}
            className="btn btn-secondary"
            disabled={loading}
            style={{ 
              width: '100%', 
              justifyContent: 'center',
              fontSize: '18px',
              padding: '16px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none'
            }}
          >
            <UserPlus size={20} />
            <span>Create New Account</span>
          </button>

          <p style={{ 
            textAlign: 'center', 
            marginTop: '16px', 
            color: '#64748b', 
            fontSize: '14px' 
          }}>
            Need an account? Register as admin or cashier
          </p>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLogin={handleLogin}
        title="Admin Login"
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        onRegister={handleRegister}
        title="Create Admin Account"
      />
    </div>
  );
};

export default LoginPage;
