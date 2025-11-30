import { useState, useEffect } from 'react';
import '../styles/TableNumberModal.css';

function TableNumberModal({ isOpen, onClose, onSubmit }) {
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Auto-generate a random table number between 1-20
      const autoTableNumber = Math.floor(Math.random() * 20) + 1;
      setTableNumber(autoTableNumber.toString());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tableNumber.trim()) {
      onSubmit(tableNumber.trim());
      setTableNumber('');
    }
  };

  const handleCancel = () => {
    setTableNumber('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>localhost:5175 says</h3>
        </div>
        
        <div className="modal-body">
          <p>Your table number is: <strong>{tableNumber}</strong></p>
          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              value={tableNumber}
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
