import React, { useState, useEffect } from 'react';
import { X, MapPin, Users, Hash, FileText } from 'lucide-react';

const TableForm = ({
  isOpen,
  onClose,
  onSave,
  editingTable,
  existingTables
}) => {
  const [formData, setFormData] = useState({
    table_number: '',
    table_name: '',
    capacity: '',
    location: '',
    description: '',
    status: 'available'
  });

  const [errors, setErrors] = useState({});

  // Location options
  const locationOptions = [
    'Main Hall',
    'Terrace',
    'VIP Section',
    'Private Room',
    'Bar Area',
    'Garden'
  ];

  // Status options for scan-to-order restaurant
  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  // Initialize form when editing or reset when adding
  useEffect(() => {
    if (editingTable) {
      setFormData({
        table_number: editingTable.table_number || '',
        table_name: editingTable.table_name || '',
        capacity: editingTable.capacity?.toString() || '',
        location: editingTable.location || '',
        description: editingTable.description || '',
        status: editingTable.status || 'available'
      });
    } else {
      setFormData({
        table_number: '',
        table_name: '',
        capacity: '',
        location: '',
        description: '',
        status: 'available'
      });
    }
    setErrors({});
  }, [editingTable, isOpen]);

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

    // Table number validation
    if (!formData.table_number.trim()) {
      newErrors.table_number = 'Table number is required';
    } else if (formData.table_number.length > 10) {
      newErrors.table_number = 'Table number must be less than 10 characters';
    } else {
      // Check for duplicate table number
      const isDuplicate = existingTables.some(table => 
        table.table_number === formData.table_number.trim() && 
        (!editingTable || table.id !== editingTable.id)
      );
      
      if (isDuplicate) {
        newErrors.table_number = 'Table number already exists';
      }
    }

    // Table name validation
    if (!formData.table_name.trim()) {
      newErrors.table_name = 'Table name is required';
    } else if (formData.table_name.length > 50) {
      newErrors.table_name = 'Table name must be less than 50 characters';
    }

    // Capacity validation
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else {
      const capacityNum = parseInt(formData.capacity);
      if (isNaN(capacityNum) || capacityNum < 1 || capacityNum > 20) {
        newErrors.capacity = 'Capacity must be between 1 and 20';
      }
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Description validation (optional but with limit)
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateQRCode = () => {
    const tableNum = formData.table_number.trim();
    const year = new Date().getFullYear();
    return `QR-${tableNum}-${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const tableData = {
      ...formData,
      table_number: formData.table_number.trim(),
      table_name: formData.table_name.trim(),
      capacity: parseInt(formData.capacity),
      location: formData.location.trim(),
      description: formData.description.trim(),
      qr_code: editingTable ? editingTable.qr_code : generateQRCode()
    };

    onSave(tableData);
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
          <h2 className="modal-title">
            {editingTable ? 'Edit Table' : 'Add New Table'}
          </h2>
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
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="table_number">
                  <Hash size={14} />
                  Table Number *
                </label>
                <input
                  type="text"
                  id="table_number"
                  name="table_number"
                  value={formData.table_number}
                  onChange={handleInputChange}
                  placeholder="e.g., T001, A1, 101"
                  className={`form-input ${errors.table_number ? 'border-error' : ''}`}
                />
                {errors.table_number && (
                  <span className="text-error text-sm">{errors.table_number}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="capacity">
                  <Users size={14} />
                  Capacity *
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="2"
                  min="1"
                  max="20"
                  className={`form-input ${errors.capacity ? 'border-error' : ''}`}
                />
                {errors.capacity && (
                  <span className="text-error text-sm">{errors.capacity}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="table_name">
                <MapPin size={14} />
                Table Name *
              </label>
              <input
                type="text"
                id="table_name"
                name="table_name"
                value={formData.table_name}
                onChange={handleInputChange}
                placeholder="e.g., Table 1, VIP Table, Window Table"
                className={`form-input ${errors.table_name ? 'border-error' : ''}`}
              />
              {errors.table_name && (
                <span className="text-error text-sm">{errors.table_name}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  <MapPin size={14} />
                  Location *
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`form-input ${errors.location ? 'border-error' : ''}`}
                >
                  <option value="">Select location</option>
                  {locationOptions.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {errors.location && (
                  <span className="text-error text-sm">{errors.location}</span>
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
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                <FileText size={14} />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional description (e.g., Near window, good for families)"
                rows={3}
                className={`form-input ${errors.description ? 'border-error' : ''}`}
              />
              {errors.description && (
                <span className="text-error text-sm">{errors.description}</span>
              )}
              <small className="text-gray text-sm">
                {formData.description.length}/200 characters
              </small>
            </div>

            {formData.table_number && (
              <div className="form-group">
                <label className="form-label">QR Code Preview</label>
                <div className="qr-preview">
                  <code className="qr-code">{generateQRCode()}</code>
                  <small className="text-gray text-sm">
                    This QR code will be generated for the table
                  </small>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingTable ? 'Update Table' : 'Add Table'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TableForm;