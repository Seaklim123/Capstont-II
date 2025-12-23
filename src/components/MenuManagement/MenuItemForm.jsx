import React, { useState, useEffect } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import '../../styles/image-preview.css';

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
    available: true,
    discount: '',
    status: 'available'
  });

  const [imageFile, setImageFile] = useState(null); // Store the actual file
  const [imagePreview, setImagePreview] = useState(''); // Store preview URL
  const [imageMode, setImageMode] = useState('file'); // Always use file mode
  const [errors, setErrors] = useState({});

  // Initialize form when editing or reset when adding
  useEffect(() => {
    if (editingItem) {
      // Convert discount amount back to percentage for display
      const discountPercent = editingItem.discount && editingItem.price ? 
        Math.round((editingItem.discount / editingItem.price) * 100) : '';

      setFormData({
        name: editingItem.name || '',
        category: editingItem.category_id?.toString() || editingItem.category?.toString() || (categories[0]?.value || ''),
        price: editingItem.price || '',
        description: editingItem.description || '',
        image: editingItem.image_url || editingItem.image || '',
        available: editingItem.status === 'available',
        discount: discountPercent,
        status: editingItem.status || 'available'
      });
      // Show existing image when editing (if it exists)
      setImagePreview(editingItem.image_url || editingItem.image || '');
      setImageFile(null);
      setImageMode('file'); // Always use file mode
      
      console.log('Editing item initialized:', {
        item: editingItem,
        discountAmount: editingItem.discount,
        calculatedDiscountPercent: discountPercent,
        imageMode: 'file',
        hasImage: !!(editingItem.image_url || editingItem.image),
        imageUrl: editingItem.image_url || editingItem.image
      });
    } else {
      setFormData({
        name: '',
        category: categories[0]?.value || categories[0]?.id || '',
        price: '',
        description: '',
        image: '',
        available: true,
        discount: '',
        status: 'available'
      });
      setImagePreview('');
      setImageFile(null);
      setImageMode('file'); // Always use file mode
      
      console.log('New item form initialized');
    }
    setErrors({});
  }, [editingItem, isOpen, categories]);


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

    // Validate discount percentage if provided
    if (formData.discount) {
      const discountPercent = parseFloat(formData.discount);
      if (discountPercent < 0 || discountPercent > 100) {
        newErrors.discount = 'Discount must be between 0% and 100%';
      }
    }

    // Validate category selection
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Image is optional - no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Calculate discount amount from percentage
    const price = parseFloat(formData.price) || 0;
    const discountPercent = formData.discount ? parseFloat(formData.discount) : 0;
    const discountAmount = discountPercent > 0 ? (price * discountPercent / 100) : 0;

    const itemData = {
      name: formData.name.trim(),
      category_id: formData.category,
      price: price,
      discount: discountAmount, // Always save as dollar amount
      description: formData.description.trim(),
      status: formData.status,
      imageMode: 'file', // Always file mode
      // Include image file name if selected
      image: imageFile ? imageFile.name : '',
      // Include percentage for frontend display only (not saved to DB)
      discountPercent: discountPercent
    };

    console.log('Form submission with discount calculation:', {
      originalPrice: price,
      discountPercent: discountPercent,
      calculatedDiscountAmount: discountAmount,
      finalPrice: price - discountAmount,
      willSaveToDatabase: {
        price: price,
        discount: discountAmount // This dollar amount goes to database
      }
    });

    console.log('Form submission data:', {
      itemData,
      imageFile,
      imageMode,
      imagePreview
    });

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
      
      console.log('File uploaded successfully:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        previewUrl
      });
    }
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

    return (
      <Dialog open={isOpen} onClose={handleClose} aria-labelledby="menuitem-modal-title" maxWidth="xs" fullWidth={false}>
        <Box
          sx={{
            width: 400,
            p: 3,
            maxHeight: '90vh',
            overflowY: 'auto',
            mx: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <h2 id="menuitem-modal-title" style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <IconButton onClick={handleClose} size="small">
              <X size={20} />
            </IconButton>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
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
                maxLength={50}
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
              {errors.category && <span className="text-error text-sm">{errors.category}</span>}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <div className="form-group" style={{ flex: 1 }}>
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
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="discount">Discount (%)</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="1"
                  min="0"
                  max="100"
                  className="form-input"
                />
                <small className="text-gray text-sm">
                  Enter percentage (0-100%)
                  {formData.price && formData.discount ? (
                    <span className="text-primary ml-2">
                      • ${(
                        parseFloat(formData.price) * parseFloat(formData.discount) / 100
                      ).toFixed(2)} off
                      • Final price: ${(
                        parseFloat(formData.price) - (parseFloat(formData.price) * parseFloat(formData.discount) / 100)
                      ).toFixed(2)}
                    </span>
                  ) : null}
                </small>
              </div>
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
                maxLength={200}
              />
              {errors.description && <span className="text-error text-sm">{errors.description}</span>}
              <small className="text-gray text-sm">{formData.description.length}/200 characters</small>
            </div>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Upload Image (Optional)</label>
              {!imagePreview ? (
                <div className="border-dashed border-2 border-gray-light rounded p-4 text-center hover:border-primary transition-colors">
                  <ImageIcon size={32} className="mx-auto mb-3 text-gray" />
                  <label htmlFor="image-upload" className="btn btn-primary btn-sm cursor-pointer">
                    <Upload size={16} />
                    Choose Image from Device
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <p className="text-gray text-sm mt-3">
                    Upload JPG, PNG, or WebP (Max 5MB)<br/>
                    Recommended size: 400x300px for best display
                  </p>
                </div>
              ) : (
                <div className="mb-3">
                  <div className="image-preview-container menu-item-image-preview">
                    <div className="image-preview-wrapper">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="image-preview-img"
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.parentElement.nextElementSibling.style.display = 'flex';
                        }}
                        onLoad={e => {
                          e.target.style.display = 'block';
                          e.target.parentElement.nextElementSibling.style.display = 'none';
                        }}
                      />
                    </div>
                    <div style={{display: 'none'}} className="image-error-state">
                      <ImageIcon size={24} className="opacity-50" />
                      <p className="text-sm">Unable to load image</p>
                    </div>
                  </div>
                  <div className="image-actions">
                    <label htmlFor="image-change" className="btn btn-secondary btn-sm cursor-pointer">
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
                    id="image-change"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <small className="text-gray text-sm">Set item availability status</small>
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
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </Box>
          </Box>
        </Box>
      </Dialog>
  );
};

export default MenuItemForm;