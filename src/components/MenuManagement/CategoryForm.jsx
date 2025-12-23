import React, { useState, useEffect } from 'react';
import { X, Upload, ImageIcon, Link, FileImage } from 'lucide-react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import '../../styles/image-preview.css';

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
  const [isExistingImage, setIsExistingImage] = useState(false); // Track if showing existing image
  const [errors, setErrors] = useState({});

  // Initialize form when editing or reset when adding
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        label: editingCategory.label || editingCategory.name || '',
        image: editingCategory.image || ''
      });
      
      // Show existing image when editing (if it exists)
      const existingImageUrl = editingCategory.image_url || editingCategory.image;
      setImagePreview(existingImageUrl || '');
      setIsExistingImage(!!existingImageUrl);
      setImageFile(null);
      setImageMode('file'); // Always use file mode
      
      console.log('Editing category initialized:', {
        category: editingCategory,
        hasImage: !!existingImageUrl,
        imageUrl: existingImageUrl
      });
    } else {
      setFormData({
        label: '',
        image: ''
      });
      setImagePreview('');
      setIsExistingImage(false);
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
      
      // Clean up any object URL when component unmounts
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
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
      setIsExistingImage(false); // Mark as new upload
      
      setFormData(prev => ({
        ...prev,
        image: file.name
      }));
    }
  };



  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setIsExistingImage(false);
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    
    const fileInput = document.getElementById('category-image-upload');
    if (fileInput) fileInput.value = '';
    
    // Clean up any object URL if it exists
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
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

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="category-modal-title"
      aria-describedby="category-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <h2 id="category-modal-title" style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
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
          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label">Upload Category Image (Optional)</label>
            {!imagePreview ? (
              <div className="border-dashed border-2 border-gray-light rounded p-4 text-center hover:border-primary transition-colors">
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
              <div className="mb-3">
                {isExistingImage && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
                    <p className="text-blue-800 text-sm flex items-center gap-2">
                      <FileImage size={16} />
                      Current category image - Upload a new image to replace it
                    </p>
                  </div>
                )}
                <div className="image-preview-container border rounded overflow-hidden bg-gray-light">
                  <div className="image-preview-wrapper">
                    <img 
                      src={imagePreview} 
                      alt="Category Preview" 
                      className="image-preview-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.nextElementSibling.style.display = 'flex';
                      }}
                      onLoad={(e) => {
                        e.target.style.display = 'block';
                        e.target.parentElement.nextElementSibling.style.display = 'none';
                      }}
                    />
                  </div>
                  <div style={{display: 'none'}} className="image-error-state p-4 text-center text-gray flex flex-col items-center justify-center">
                    <ImageIcon size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Unable to load image</p>
                  </div>
                </div>
                <div className="image-actions">
                  <label htmlFor="category-image-change" className="btn btn-secondary btn-sm cursor-pointer">
                    <Upload size={14} />
                    {isExistingImage ? 'Replace Image' : 'Change Image'}
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CategoryForm;