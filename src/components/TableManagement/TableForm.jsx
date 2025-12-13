import React, { useState, useEffect } from 'react';
import { X, Hash } from 'lucide-react';
import ApiService from '../../services/api';

const TableForm = ({
  isOpen,
  onClose,
  onSave,
  editingTable,
  existingTables
}) => {
  const [formData, setFormData] = useState({
    number: '',
    status: 'available'
  });

  const [errors, setErrors] = useState({});
  const [statusOptions, setStatusOptions] = useState([]);

  // Set status options (matching database enum values)
  useEffect(() => {
    setStatusOptions([
      { value: 'available', label: 'Available' },
      { value: 'unavailable', label: 'Unavailable' }
    ]);
  }, []);

  // Initialize form when editing or reset when adding
  useEffect(() => {
    if (editingTable) {
      setFormData({
        number: editingTable.number || '',
        status: editingTable.status || 'available'
      });
    } else {
      setFormData({
        number: '',
        status: statusOptions.length > 0 ? statusOptions[0].value : 'available'
      });
    }
    setErrors({});
  }, [editingTable, isOpen, statusOptions]);

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
    const numberValue = formData.number || '';
    const trimmedNumber = String(numberValue).trim();
    
    if (!trimmedNumber) {
      newErrors.number = '⚠️ Table number is required';
    } else if (!/^\d+$/.test(trimmedNumber)) {
      newErrors.number = '❌ Table number must be a valid number (digits only)';
    } else {
      // Check if the number is within range
      const numericValue = parseInt(trimmedNumber);
      if (numericValue < 1) {
        newErrors.number = ' Table number must be at least 1';
      } else if (numericValue > 100) {
        newErrors.number = ' Table number must be 100 or less (You entered: ' + numericValue + ')';
      } else {
        // Check for duplicate table number
        const isDuplicate = existingTables.some(table => {
          const existingNumber = String(table.number || table.table_number || '').trim();
          const newNumber = trimmedNumber;
          return existingNumber === newNumber && 
                 (!editingTable || table.id !== editingTable.id);
        });
        
        if (isDuplicate) {
          newErrors.number = ` Table number "${trimmedNumber}" already exists. Please choose a different number.`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateQRCode = () => {
    const tableNum = formData.number ? String(formData.number).trim() : '';
    const year = new Date().getFullYear();
    return tableNum ? `QR-${tableNum}-${year}` : '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const tableData = {
      ...formData,
      number: formData.number ? String(formData.number).trim() : ''
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
      <div className="modal-content modal-table-form">
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
                <label className="form-label" htmlFor="number">
                  <Hash size={14} />
                  Table Number *
                </label>
                <input
                  type="number"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="Enter table number (1-100 only)"
                  className={`form-input ${errors.number ? 'border-error' : ''}`}
                  min="1"
                  max="100"
                />
                {errors.number && (
                  <span className="error-message">{errors.number}</span>
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

            {formData.number && (
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