import React, { useState } from 'react';
import { Edit, Trash2, QrCode, Users, Plus, MapPin, CheckCircle, XCircle, Clock, Wrench } from 'lucide-react';
import QRCodeModal from './QRCodeModal';
import StatusChangeButton from './StatusChangeButton';

const TablesTable = ({ tables, filteredTables, searchTerm, onEditTable, onDeleteTable, onStatusChange }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const getStatusInfo = (status) => {
    const statusMap = {
      available: { 
        className: 'status-badge status-success', 
        text: 'Available', 
        icon: <CheckCircle size={12} /> 
      },
      occupied: { 
        className: 'status-badge status-danger', 
        text: 'Occupied', 
        icon: <Users size={12} /> 
      },
      maintenance: { 
        className: 'status-badge status-secondary', 
        text: 'Maintenance', 
        icon: <Wrench size={12} /> 
      }
    };
    return statusMap[status] || { 
      className: 'status-badge status-secondary', 
      text: 'Unknown', 
      icon: <XCircle size={12} /> 
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewQR = (table) => {
    setSelectedTable(table);
    setShowQRModal(true);
  };

  if (filteredTables.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <MapPin size={48} className="empty-icon" />
          <h3>No Tables Found</h3>
          <p>
            {searchTerm 
              ? `No tables match "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first restaurant table.'
            }
          </p>
          {!searchTerm && (
            <button className="btn btn-primary">
              <Plus size={16} />
              Add First Table
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Table Display */}
    <div className="table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Table Info</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Status</th>
              <th>QR Code</th>
              <th>Current Order</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTables.map((table) => {
              const statusInfo = getStatusInfo(table.status);
              return (
                <tr key={table.id}>
                  <td>
                    <div className="cell-content">
                      <div className="table-info">
                        <span className="font-medium">{table.table_name}</span>
                        <span className="text-sm text-gray">#{table.table_number}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="capacity-info">
                      <Users size={14} className="inline mr-1" />
                      <span className="font-medium">{table.capacity}</span>
                    </div>
                  </td>
                  <td>
                    <span className="location-badge">{table.location}</span>
                  </td>
                  <td>
                    <StatusChangeButton 
                      table={table}
                      onStatusChange={onStatusChange}
                    />
                  </td>
                  <td>
                    <div className="qr-info">
                      <code className="qr-code">{table.qr_code}</code>
                      <button
                        className="btn btn-primary btn-sm transition hover-lift"
                        title="View QR Code"
                        onClick={() => handleViewQR(table)}
                      >
                        <QrCode size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    {table.current_order_id ? (
                      <span className="order-link">
                        Order #{table.current_order_id}
                      </span>
                    ) : (
                      <span className="text-gray">-</span>
                    )}
                  </td>
                  <td>
                    <span className="text-sm text-gray">
                      {formatDate(table.created_at)}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-xs">
                      <button
                        className="btn btn-secondary btn-sm transition hover-lift"
                        onClick={() => onEditTable(table)}
                        title="Edit table"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-error btn-sm transition hover-lift"
                        onClick={() => onDeleteTable(table)}
                        title="Delete table"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        table={selectedTable}
      />
    </div>
    </>
  );
};

export default TablesTable;