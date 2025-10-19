import React, { useState, useEffect } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';

const MenuItemForm = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  categories
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'main',
    price: '',
    description: '',
    image: '',
    available: true
  });

  const [errors, setErrors] = useState({});

  // Initialize form when editing or reset when adding
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        category: editingItem.category || 'main',
        price: editingItem.price || '',
        description: editingItem.description || '',
        image: editingItem.image || '',
        available: editingItem.available ?? true
      });
    } else {
      setFormData({
        name: '',
        category: 'main',
        price: '',
        description: '',
        image: '',
        available: true
      });
    }
    setErrors({});
  }, [editingItem, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.name.length > 50) {
      newErrors.name = 'Item name must be less than 50 characters';
    }

    if (formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const itemData = {
      ...formData,
      price: parseFloat(formData.price),
      name: formData.name.trim(),
      description: formData.description.trim()
    };

    onSave(itemData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // In a real app, you would upload the file to a server
      // For now, we'll create a mock URL
      const mockUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`;
      setFormData(prev => ({
        ...prev,
        image: mockUrl
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <button 
            className="close-btn"
            onClick={handleClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Item Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter item name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter item description"
              rows={3}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <small>{formData.description.length}/200 characters</small>
          </div>

          <div className="form-group">
            <label>Image</label>
            <div className="image-upload-section">
              {formData.image ? (
                <div className="image-preview-container">
                  <div className="image-preview">
                    <img src={formData.image} alt="Preview" />
                  </div>
                  <div className="image-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm remove-image-btn"
                      onClick={removeImage}
                      title="Remove image"
                    >
                      <X size={14} />
                      Remove
                    </button>
                    <label htmlFor="image-change" className="btn btn-outline btn-sm">
                      <Upload size={14} />
                      Change
                    </label>
                    <input
                      type="file"
                      id="image-change"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="upload-area">
                  <ImageIcon size={24} className="upload-icon" />
                  <label htmlFor="image-upload" className="upload-btn">
                    <Upload size={16} />
                    Choose Image
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <p className="upload-hint">
                    Recommended: 400x300px, JPG or PNG (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="available"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
              />
              <label htmlFor="available">Available for order</label>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;