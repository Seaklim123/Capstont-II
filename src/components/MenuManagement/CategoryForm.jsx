import React, { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';

const CategoryForm = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  existingCategories
}) => {
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  // Initialize form when editing or reset when adding
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        label: editingCategory.label || '',
        value: editingCategory.value || '',
        description: editingCategory.description || ''
      });
    } else {
      setFormData({
        label: '',
        value: '',
        description: ''
      });
    }
    setErrors({});
  }, [editingCategory, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate value from label
    if (name === 'label') {
      const generatedValue = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        value: generatedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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

    if (!formData.label.trim()) {
      newErrors.label = 'Category name is required';
    }

    if (!formData.value.trim()) {
      newErrors.value = 'Category value is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Check for duplicate value (only when adding or changing value)
    if (formData.value.trim()) {
      const isDuplicate = existingCategories.some(cat => 
        cat.value === formData.value.trim() && 
        (!editingCategory || cat.id !== editingCategory.id)
      );
      
      if (isDuplicate) {
        newErrors.value = 'Category value already exists';
      }
    }

    if (formData.label.length > 30) {
      newErrors.label = 'Category name must be less than 30 characters';
    }

    if (formData.description.length > 100) {
      newErrors.description = 'Description must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const categoryData = {
      ...formData,
      label: formData.label.trim(),
      value: formData.value.trim(),
      description: formData.description.trim()
    };

    onSave(categoryData);
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
          <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
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
            <label htmlFor="label">Category Name *</label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              placeholder="Enter category name"
              className={errors.label ? 'error' : ''}
            />
            {errors.label && <span className="error-message">{errors.label}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="value">Category Value *</label>
            <input
              type="text"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="category-value"
              className={errors.value ? 'error' : ''}
            />
            {errors.value && <span className="error-message">{errors.value}</span>}
            <small>Used internally for categorization (auto-generated from name)</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter category description"
              rows={3}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <small>{formData.description.length}/100 characters</small>
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
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;