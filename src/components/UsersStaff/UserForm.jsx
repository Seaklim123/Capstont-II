import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const UserForm = ({ isOpen, onClose, onSave, editingUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    primary_phone: '',
    secondary_phone: '',
    password: '',
    password_confirmation: '',
    role: 'cashier',
    status: 'active',
  });

  useEffect(() => {
    if (editingUser) {
      setForm({
        username: editingUser.username || '',
        email: editingUser.email || '',
        primary_phone: editingUser.primary_phone || '',
        secondary_phone: editingUser.secondary_phone || '',
        password: '', // Don't show password
        password_confirmation: '',
        role: editingUser.role || 'cashier',
        status: editingUser.status || 'active',
      });
    } else {
      setForm({ 
        username: '', 
        email: '', 
        primary_phone: '', 
        secondary_phone: '', 
        password: '', 
        password_confirmation: '', 
        role: 'cashier', 
        status: 'active' 
      });
    }
  }, [editingUser, isOpen]);

  const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!editingUser && form.password !== form.password_confirmation) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!editingUser && form.password.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      alert('Please enter a valid email address!');
      return;
    }
    
    // Phone validation (basic)
    if (form.primary_phone && form.primary_phone.length < 10) {
      alert('Primary phone number must be at least 10 digits!');
      return;
    }
    
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title" style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center' }}>
          {editingUser ? 'Edit Staff Member' : 'Add New Staff Member'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>
          
          <div className="form-group">
            <label>Primary Phone *</label>
            <input
              type="tel"
              name="primary_phone"
              value={form.primary_phone}
              onChange={handleChange}
              required
              placeholder="+1234567890"
            />
          </div>
          
          <div className="form-group">
            <label>Secondary Phone</label>
            <input
              type="tel"
              name="secondary_phone"
              value={form.secondary_phone}
              onChange={handleChange}
              placeholder="+0987654321"
            />
          </div>
          
          {!editingUser && (
            <>
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: '2rem' }}
                  placeholder="Enter password (min 8 characters)"
                />
                <span
                  style={{ position: 'absolute', right: '10px', top: '35px', cursor: 'pointer' }}
                  onClick={() => setShowPassword((v) => !v)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Confirm Password *</label>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: '2rem' }}
                  placeholder="Confirm your password"
                />
                <span
                  style={{ position: 'absolute', right: '10px', top: '35px', cursor: 'pointer' }}
                  onClick={() => setShowConfirm((v) => !v)}
                  title={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </>
          )}
          
          {editingUser && (
            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter new password (optional)"
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              {editingUser ? 'Update' : 'Add'}
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
