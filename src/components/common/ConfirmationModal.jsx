import React from 'react';
import { X, AlertTriangle, Trash2, Save, Info } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // default, danger, warning, info
  itemName = null,
  icon = null
}) => {
  if (!isOpen) return null;

  // Icon mapping based on type
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'danger':
        return <Trash2 size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      case 'save':
        return <Save size={20} className="text-green-500" />;
      default:
        return <AlertTriangle size={20} className="text-gray-500" />;
    }
  };

  // Button class based on type
  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn btn-danger';
      case 'warning':
        return 'btn btn-warning';
      case 'info':
        return 'btn btn-primary';
      case 'save':
        return 'btn btn-success';
      default:
        return 'btn btn-primary';
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal">
        <div className="modal-header">
          <div className="modal-title-section">
            {getIcon()}
            <h3>{title}</h3>
          </div>
          <button 
            className="close-btn"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <p>
            {message}
            {itemName && (
              <>
                {' '}
                <strong>"{itemName}"</strong>
              </>
            )}
          </p>
        </div>
        
        <div className="modal-actions">
          <button 
            className="btn btn-outline"
            onClick={onClose}
            type="button"
          >
            {cancelText}
          </button>
          <button 
            className={getConfirmButtonClass()}
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;