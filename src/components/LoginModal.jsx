import React, { useState } from 'react';
import { X, User, Lock, LogIn } from 'lucide-react';
import FormInput from './FormInput';

const LoginModal = ({ 
  isOpen, 
  onClose, 
  onLogin,
  title = "Admin Login"
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the login function passed from parent
      await onLogin(formData);

      // Reset form
      setFormData({
        username: '',
        password: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      // Show error on both fields if invalid credentials
      setErrors(prev => ({
        ...prev,
        username: error.message || 'Invalid username or password',
        password: error.message || 'Invalid username or password'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        username: '',
        password: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="login-modal">
        <div className="modal-header">
          <div className="modal-title-section">
            <LogIn className="modal-title-icon" size={24} />
            <h2 className="modal-title">{title}</h2>
          </div>
          
          <button
            type="button"
            onClick={handleClose}
            className="modal-close-button"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-fields">
            <FormInput
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
              error={errors.username}
              disabled={isLoading}
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              error={errors.password}
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-content">
                  <div className="spinner" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="button-content">
                  <LogIn size={18} />
                  <span>Sign In</span>
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p className="login-help-text">
            Enter your admin credentials to access the dashboard
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginModal;