import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Lock, Save, UserCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const UserProfileModal = ({ isOpen, onClose, currentUser, onProfileUpdate }) => {
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    primary_phone: '',
    secondary_phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        primary_phone: currentUser.primary_phone || '',
        secondary_phone: currentUser.secondary_phone || ''
      });
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: ''
      });
      setErrors({});
    }
  }, [isOpen, currentUser]);

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
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

  const validateProfileForm = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.current_password) {
      newErrors.current_password = 'Current password is required';
    }

    if (!passwordData.password) {
      newErrors.password = 'New password is required';
    } else if (passwordData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (passwordData.password !== passwordData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    const updateToast = toast.loading('Updating profile...');

    try {
      const response = await api.updateProfile(formData);
      toast.success('Profile updated successfully!', { id: updateToast });
      
      // Call the callback to update user data in context
      if (onProfileUpdate) {
        onProfileUpdate(response.data || response);
      }
      
      onClose();
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.', { id: updateToast });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    const updateToast = toast.loading('Updating password...');
    
    // Clear previous errors
    setErrors({});

    try {
      console.log('Sending password change request with data:', passwordData);
      await api.changePassword(passwordData);
      toast.success('Password updated successfully!', { id: updateToast });
      
      // Reset password form
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: ''
      });
      
      // Switch back to profile tab
      setActiveTab('profile');
    } catch (error) {
      console.error('Password update failed:', error);
      
      // Handle authentication errors first
      if (error.message.includes('Session expired') || error.message.includes('Authentication required')) {
        toast.error('Session expired. Please log in again.', { id: updateToast });
        // Close modal and logout user
        onClose();
        await logout();
        return;
      }
      
      // Handle field-specific validation errors
      if (error.validationErrors) {
        const fieldErrors = {};
        
        // Map backend field names to frontend field names
        Object.keys(error.validationErrors).forEach(field => {
          const errorMessages = error.validationErrors[field];
          const errorMessage = Array.isArray(errorMessages) ? errorMessages[0] : errorMessages;
          
          if (field === 'current_password') {
            fieldErrors.current_password = errorMessage;
          } else if (field === 'new_password') {
            fieldErrors.password = errorMessage;
          } else if (field === 'new_password_confirmation') {
            fieldErrors.password_confirmation = errorMessage;
          } else {
            // For any other fields, use the original field name
            fieldErrors[field] = errorMessage;
          }
        });
        
        setErrors(fieldErrors);
        toast.error('Please fix the errors below', { id: updateToast });
      } else {
        // Enhanced error handling for non-validation errors
        let errorMessage = 'Failed to update password. Please try again.';
        
        if (error.message.includes('current password is incorrect')) {
          errorMessage = 'Current password is incorrect. Please try again.';
          setErrors({ current_password: 'Current password is incorrect' });
        } else if (error.message.includes('password confirmation does not match')) {
          errorMessage = 'Password confirmation does not match the new password.';
          setErrors({ password_confirmation: 'Password confirmation does not match' });
        } else if (error.message.includes('password must be at least')) {
          errorMessage = 'Password must be at least 8 characters long.';
          setErrors({ password: 'Password must be at least 8 characters long' });
        } else if (error.message.includes('Validation failed')) {
          errorMessage = 'Please check your input. Current password may be incorrect or new password format is invalid.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage, { id: updateToast });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      primary_phone: '',
      secondary_phone: ''
    });
    setPasswordData({
      current_password: '',
      password: '',
      password_confirmation: ''
    });
    setErrors({});
    setActiveTab('profile');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <UserCheck size={20} />
            User Profile
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tabs */}
          <div className="profile-tabs" style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e5e7eb', 
            marginBottom: '24px' 
          }}>
            <button
              type="button"
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'profile' ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === 'profile' ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === 'profile' ? '600' : '400'
              }}
            >
              <User size={16} style={{ marginRight: '8px', display: 'inline' }} />
              Profile Info
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'password' ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === 'password' ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === 'password' ? '600' : '400'
              }}
            >
              <Lock size={16} style={{ marginRight: '8px', display: 'inline' }} />
              Change Password
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
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

              {/* Submit Button */}
              <div className="form-actions" style={{ marginTop: '24px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Save size={20} />
                  <span>{loading ? 'Updating...' : 'Update Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {/* Current Password */}
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} />
                  Current Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="current_password"
                    className={`form-input ${errors.current_password ? 'error' : ''}`}
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    required
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      padding: '4px'
                    }}
                    title={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.current_password && <span className="error-message">{errors.current_password}</span>}
              </div>

              {/* New Password */}
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} />
                  New Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    required
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      padding: '4px'
                    }}
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* Confirm New Password */}
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} />
                  Confirm New Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    className={`form-input ${errors.password_confirmation ? 'error' : ''}`}
                    value={passwordData.password_confirmation}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      padding: '4px'
                    }}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                  <Save size={20} />
                  <span>{loading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;