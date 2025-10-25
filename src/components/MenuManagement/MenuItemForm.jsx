import React, { useState, useEffect } from 'react';
import { X, Upload, ImageIcon, Link, FileImage } from 'lucide-react';

const MenuItemForm = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  categories
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    available: true
  });

  const [imageFile, setImageFile] = useState(null); // Store the actual file
  const [imagePreview, setImagePreview] = useState(''); // Store preview URL
  const [imageMode, setImageMode] = useState('url'); // 'url' or 'file'
  const [errors, setErrors] = useState({});

  // Initialize form when editing or reset when adding
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        category: editingItem.category?.toString() || (categories[0]?.value || ''),
        price: editingItem.price || '',
        description: editingItem.description || '',
        image: editingItem.image || '',
        available: editingItem.available ?? true
      });
      setImagePreview(editingItem.image || '');
      setImageFile(null);
      // Auto-detect mode based on existing image
      setImageMode(editingItem.image && editingItem.image.startsWith('http') ? 'url' : 'file');
    } else {
      setFormData({
        name: '',
        category: categories[0]?.value || '',
        price: '',
        description: '',
        image: '',
        available: true
      });
      setImagePreview('');
      setImageFile(null);
      setImageMode('url'); // Default to URL mode
    }
    setErrors({});
  }, [editingItem, isOpen, categories]);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.classList.add('modal-open');
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Restore body scroll
      document.body.classList.remove('modal-open');
      const scrollY = document.body.style.top;
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
    };
  }, [isOpen]);

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
      description: formData.description.trim(),
      imageMode: imageMode // Include mode information
    };

    // Pass both item data and image file to parent
    onSave(itemData, imageMode === 'file' ? imageFile : null);
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

      // Store the file and create preview
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        image: file.name
      }));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value.trim();
    setFormData(prev => ({
      ...prev,
      image: url
    }));
    
    // Clear preview immediately when URL is being edited
    if (!url) {
      setImagePreview('');
      setImageFile(null);
      return;
    }
    
    // Only set preview if URL looks like a complete valid image URL
    const isValidImageUrl = url.startsWith('http') && 
      (/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) || 
       url.includes('unsplash.com') || 
       url.includes('imgur.com') ||
       url.includes('cloudinary.com'));
    
    if (isValidImageUrl) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
    
    setImageFile(null); // Clear file if using URL
  };

  const handleImageModeChange = (mode) => {
    setImageMode(mode);
    // Clear previous data when switching modes
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    
    // Clear file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    
    // Clear file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleOverlayClick = (e) => {
    // Close modal only if clicking on the overlay itself, not on modal content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
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
              <label className="form-label" htmlFor="name">Item Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter item name"
                className={`form-input ${errors.name ? 'border-error' : ''}`}
              />
              {errors.name && <span className="text-error text-sm">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input"
              >
                {categories.map((category, index) => (
                  <option key={category.value || category.id || index} value={category.value || category.id}>
                    {category.label || category.name}
                  </option>
                ))}
              </select>
            </div>            <div className="form-group">
              <label className="form-label" htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`form-input ${errors.price ? 'border-error' : ''}`}
              />
              {errors.price && <span className="text-error text-sm">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter item description"
                rows={3}
                className={`form-input ${errors.description ? 'border-error' : ''}`}
              />
              {errors.description && <span className="text-error text-sm">{errors.description}</span>}
              <small className="text-gray text-sm">{formData.description.length}/200 characters</small>
            </div>

            <div className="form-group">
              <label className="form-label">Image</label>
              
              {/* Image Mode Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  className={`btn btn-sm ${imageMode === 'url' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleImageModeChange('url')}
                >
                  <Link size={16} />
                  Image URL
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${imageMode === 'file' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleImageModeChange('file')}
                >
                  <FileImage size={16} />
                  Upload File
                </button>
              </div>

              {/* URL Input Mode */}
              {imageMode === 'url' && (
                <div className="mb-3">
                  <input
                    type="url"
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    value={formData.image}
                    onChange={handleImageUrlChange}
                    className="form-input"
                  />
                  <small className="text-gray text-sm">Paste a direct link to an image (JPG, PNG, WebP)</small>
              </div>
            )}

              {/* File Upload Mode */}
              {imageMode === 'file' && (
                <div className="mb-3">
                  {!imagePreview ? (
                    <div className="border-dashed border-2 border-gray-light rounded p-6 text-center hover:border-primary transition-colors">
                      <ImageIcon size={24} className="mx-auto mb-2 text-gray" />
                      <label htmlFor="image-upload" className="btn btn-secondary btn-sm cursor-pointer">
                        <Upload size={16} />
                        Choose Image File
                      </label>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <p className="text-gray text-sm mt-2">
                        Recommended: 400x300px, JPG or PNG (Max 5MB)
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Image Preview (for both modes) */}
              {imagePreview && (
                <div className="mb-3">
                  <div className="border rounded overflow-hidden bg-gray-light" style={{ maxWidth: '200px' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
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
                      <small>Please check the URL or try a different image</small>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={removeImage}
                      title="Remove image"
                    >
                      <X size={14} />
                      Remove
                    </button>
                    {imageMode === 'file' && (
                      <label htmlFor="image-change" className="btn btn-secondary btn-sm cursor-pointer">
                        <Upload size={14} />
                        Change File
                      </label>
                    )}
                    <input
                      type="file"
                      id="image-change"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
              </div>
            )}
          </div>

            <div className="form-group">
              <label className="form-label">Availability</label>
              <div className="availability-section">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="availability-checkbox"
                />
                <label className="availability-label" htmlFor="available">
                  Available for order
                </label>
              </div>
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
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuItemForm;