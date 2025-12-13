import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterModal = ({ isOpen, onClose, onRegister, title = "Create Account" }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    primary_phone: '',
    secondary_phone: '',
    password: '',
    password_confirmation: '',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.primary_phone.trim()) {
      newErrors.primary_phone = 'Primary phone is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const registerToast = toast.loading('Creating account...');

    try {
      await onRegister(formData);
      toast.success('Account created successfully!', { id: registerToast });
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        primary_phone: '',
        secondary_phone: '',
        password: '',
        password_confirmation: '',
        role: 'admin'
      });
      setErrors({});
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.', { id: registerToast });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      primary_phone: '',
      secondary_phone: '',
      password: '',
      password_confirmation: '',
      role: 'admin'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content" style={{ maxWidth: '500px', width: '90%' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <UserPlus size={20} />
            {title}
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Username *
              </label>
              <input
                type="text"
                name="username"
                className={`form-input ${errors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                Email *
              </label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Primary Phone */}
            <div className="form-group">
              <label className="form-label">
                <Phone size={16} />
                Primary Phone *
              </label>
              <input
                type="tel"
                name="primary_phone"
                className={`form-input ${errors.primary_phone ? 'error' : ''}`}
                value={formData.primary_phone}
                onChange={handleInputChange}
                placeholder="Enter primary phone number"
                required
              />
              {errors.primary_phone && <span className="error-message">{errors.primary_phone}</span>}
            </div>

            {/* Secondary Phone (Optional) */}
            <div className="form-group">
              <label className="form-label">
                <Phone size={16} />
                Secondary Phone (Optional)
              </label>
              <input
                type="tel"
                name="secondary_phone"
                className="form-input"
                value={formData.secondary_phone}
                onChange={handleInputChange}
                placeholder="Enter secondary phone number"
              />
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Role *
              </label>
              <select
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">
                <Lock size={16} />
                Password *
              </label>
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">
                <Lock size={16} />
                Confirm Password *
              </label>
              <input
                type="password"
                name="password_confirmation"
                className={`form-input ${errors.password_confirmation ? 'error' : ''}`}
                value={formData.password_confirmation}
                onChange={handleInputChange}
                placeholder="Confirm password"
                required
              />
              {errors.password_confirmation && <span className="error-message">{errors.password_confirmation}</span>}
            </div>

            {/* Submit Button */}
            <div className="form-actions" style={{ marginTop: '24px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <UserPlus size={20} />
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;