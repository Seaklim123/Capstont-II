import React from 'react';
import { CheckCircle, Users } from 'lucide-react';

const StatusChangeButton = ({ table, onStatusChange }) => {
  const statusOptions = [
    { 
      value: 'available', 
      label: 'Available', 
      icon: <CheckCircle size={12} />,
      className: 'status-success'
    },
    { 
      value: 'unavailable', 
      label: 'Unavailable', 
      icon: <Users size={12} />,
      className: 'status-danger'
    }
  ];

  const currentStatus = statusOptions.find(s => s.value === table.status);
  
  const handleStatusChange = (newStatus) => {
    if (newStatus !== table.status) {
      onStatusChange(table.id, newStatus);
    }
  };

  return (
    <div className="status-dropdown">
      <select
        value={table.status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`status-select ${currentStatus?.className || ''}`}
        title="Change table status"
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusChangeButton;