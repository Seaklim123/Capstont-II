import { useState, useEffect } from 'react';
import '../styles/TableNumberModal.css';

function TableNumberModal({ isOpen, onClose, onSubmit }) {
  const [tableId, setTableId] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Auto-generate a random table id between 1-20
      const autoTableId = Math.floor(Math.random() * 20) + 1;
      setTableId(autoTableId.toString());
    }
  }, [isOpen]);


  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tableId.trim()) {
      onSubmit(tableId.trim());
      setTableId('');
    }
  };

  const handleCancel = () => {
    setTableId('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>localhost:5175 says</h3>
        </div>
        
        <div className="modal-body">
          <p>Your table ID is: <strong>{tableId}</strong></p>
          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              value={tableId}
            />
            <div className="modal-actions">
              <button type="button" onClick={handleCancel} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-ok">
                OK
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TableNumberModal;
