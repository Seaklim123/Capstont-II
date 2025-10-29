import React, { useState, useEffect } from 'react';
import { X, Upload, ImageIcon, Link, FileImage } from 'lucide-react';

const CategoryForm = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  existingCategories
}) => {
  const [formData, setFormData] = useState({
    label: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageMode, setImageMode] = useState('file'); // Always use file mode
  const [errors, setErrors] = useState({});

  // Initialize form when editing or reset when adding
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        label: editingCategory.label || editingCategory.name || '',
        image: editingCategory.image || ''
      });
      setImagePreview(''); // Don't show existing images in edit mode
      setImageFile(null);
      setImageMode('file'); // Always use file mode
    } else {
      setFormData({
        label: '',
        image: ''
      });
      setImagePreview('');
      setImageFile(null);
      setImageMode('file'); // Always use file mode
    }
    setErrors({});
  }, [editingCategory, isOpen]);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      document.body.classList.remove('modal-open');
      const scrollY = document.body.style.top;
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.label.trim()) {
      newErrors.label = 'Category name is required';
    }

    // Check for duplicate name (only when adding or changing name)
    if (formData.label.trim()) {
      const isDuplicate = existingCategories.some(cat => 
        (cat.label || cat.name) === formData.label.trim() && 
        (!editingCategory || cat.id !== editingCategory.id)
      );
      
      if (isDuplicate) {
        newErrors.label = 'Category name already exists';
      }
    }

    if (formData.label.length > 50) {
      newErrors.label = 'Category name must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      setFormData(prev => ({
        ...prev,
        image: file.name
      }));
    }
  };



  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    
    const fileInput = document.getElementById('category-image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const categoryData = {
      name: formData.label.trim(), // Use 'name' field for backend compatibility
      imageMode: 'file' // Always file mode
    };

    onSave(categoryData, imageFile); // Always pass imageFile (can be null)
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="label">Category Name *</label>
              <input
                type="text"
                id="label"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                placeholder="Enter category name (e.g., Appetizers, Main Courses, Desserts)"
                className={`form-input ${errors.label ? 'border-error' : ''}`}
              />
              {errors.label && <span className="text-error text-sm">{errors.label}</span>}
            </div>



            <div className="form-group">
              <label className="form-label">Upload Category Image (Optional)</label>
              
              {/* File Upload Area */}
              {!imagePreview ? (
                <div className="border-dashed border-2 border-gray-light rounded p-6 text-center hover:border-primary transition-colors">
                  <ImageIcon size={32} className="mx-auto mb-3 text-gray" />
                  <label htmlFor="category-image-upload" className="btn btn-primary btn-sm cursor-pointer">
                    <Upload size={16} />
                    Choose Category Image
                  </label>
                  <input
                    type="file"
                    id="category-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <p className="text-gray text-sm mt-3">
                    Upload JPG, PNG, or WebP (Max 5MB)<br/>
                    Recommended size: 300x200px for categories
                  </p>
                </div>
              ) : (
                // Image Preview
                <div className="mb-3">
                  <div className="border rounded overflow-hidden bg-gray-light" style={{ maxWidth: '250px' }}>
                    <img 
                      src={imagePreview} 
                      alt="Category Preview" 
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                      onLoad={(e) => {
                        e.target.style.display = 'block';
                        e.target.nextSibling.style.display = 'none';
                      }}
                    />
                    <div style={{display: 'none'}} className="p-4 text-center text-gray">
                      <ImageIcon size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Unable to load image</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <label htmlFor="category-image-change" className="btn btn-secondary btn-sm cursor-pointer">
                      <Upload size={14} />
                      Change Image
                    </label>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={removeImage}
                    >
                      <X size={14} />
                      Remove
                    </button>
                  </div>
                  <input
                    type="file"
                    id="category-image-change"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
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
    </div>
  );
};

export default CategoryForm;