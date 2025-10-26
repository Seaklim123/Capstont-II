import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, table }) => {
  if (!isOpen || !table) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content modal-small">
        <div className="modal-header">
          <h3 className="modal-title text-error">
            <AlertTriangle size={20} />
            Delete Table
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-warning">
            <div className="warning-icon">
              <Trash2 size={48} className="text-error" />
            </div>
            
            <div className="warning-content">
              <h4>Are you sure you want to delete this table?</h4>
              <div className="table-details">
                <p><strong>Table:</strong> {table.table_name}</p>
                <p><strong>Number:</strong> #{table.table_number}</p>
                <p><strong>Location:</strong> {table.location}</p>
                <p><strong>Capacity:</strong> {table.capacity} people</p>
              </div>
              
              <div className="warning-message">
                <p className="text-error">
                  <strong>Warning:</strong> This action cannot be undone. 
                  The table and its QR code will be permanently removed.
                </p>
                {table.status === 'occupied' && (
                  <p className="text-warning">
                    <strong>Note:</strong> This table is currently occupied. 
                    Make sure customers have finished their orders.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={onConfirm}
          >
            <Trash2 size={16} />
            Delete Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;