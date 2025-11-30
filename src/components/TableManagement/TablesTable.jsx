import React, { useState } from 'react';
import { Edit, Trash2, QrCode, MapPin, CheckCircle, XCircle, Plus } from 'lucide-react';
import QRCodeModal from './QRCodeModal';
import StatusChangeButton from './StatusChangeButton';

const TablesTable = ({ tables, filteredTables, searchTerm, onEditTable, onDeleteTable, onStatusChange, onAddTable }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const getStatusInfo = (status) => {
    const statusMap = {
      available: { 
        className: 'status-badge status-success', 
        text: 'Available', 
        icon: <CheckCircle size={12} /> 
      },
      unavailable: { 
        className: 'status-badge status-danger', 
        text: 'Unavailable', 
        icon: <XCircle size={12} /> 
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
        <div className="empty-state-enhanced">
          <div className="empty-icon-wrapper">
            <MapPin size={64} className="empty-icon-large" />
          </div>
          <div className="empty-content">
            <h2 className="empty-title">No Tables Found</h2>
            <p className="empty-description">
              {searchTerm 
                ? `No tables match "${searchTerm}". Try a different search term or clear your search.`
                : 'Get started by adding your first restaurant table to begin managing your seating arrangements.'
              }
            </p>
            {!searchTerm && onAddTable && (
              <div className="empty-actions">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={onAddTable}
                >
                  <Plus size={20} />
                  Add Your First Table
                </button>
              </div>
            )}
          </div>
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
              <th>Table Number</th>
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
                        <span className="font-medium">Table {table.number}</span>
                        <span className="text-sm text-gray">#{table.number}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusChangeButton 
                      table={table}
                      onStatusChange={onStatusChange}
                    />
                  </td>
                  <td>
                    <div className="qr-info">
                      <code className="qr-code">QR-{table.number}-{new Date().getFullYear()}</code>
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