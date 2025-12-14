import React, { useState, useEffect } from 'react';
import { Plus, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import TableStats from '../components/TableManagement/TableStats';
import TableToolbar from '../components/TableManagement/TableToolbar';
import TablesTable from '../components/TableManagement/TablesTable';
import TableForm from '../components/TableManagement/TableForm';
import DeleteConfirmModal from '../components/TableManagement/DeleteConfirmModal';
import ApiService from '../services/api';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTableForm, setShowTableForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingTable, setDeletingTable] = useState(null);

  useEffect(() => {
    loadTables();
  }, []);

  // Helper function to check if table number exists
  const isTableNumberExists = (number, excludeId = null) => {
    return tables.some(table => {
      const tableNumber = String(table.number || table.table_number || '').toLowerCase().trim();
      const checkNumber = String(number || '').toLowerCase().trim();
      return tableNumber === checkNumber && (!excludeId || table.id !== excludeId);
    });
  };

  const loadTables = async () => {
    try {
      setLoading(true);
      
      const response = await ApiService.getTables();
      console.log('Tables loaded:', response);
      
      // Transform data to match expected format
      const transformedTables = response.map(table => ({
        id: table.id,
        table_number: table.number.toString(),
        table_name: `Table ${table.number}`,
        number: table.number,
        status: table.status,
        created_at: table.created_at,
        updated_at: table.updated_at
      }));
      
      setTables(transformedTables);
    } catch (error) {
      toast.error('Failed to load tables');
      console.error('Error loading tables:', error);
      setTables([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredTables = tables.filter(table =>
    // (table.table_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (table.table_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (table.number || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (table.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTable = () => {
    setEditingTable(null);
    setShowTableForm(true);
  };

  const handleEditTable = (table) => {
    setEditingTable(table);
    setShowTableForm(true);
  };

  const handleSaveTable = async (tableData) => {
    const saveToast = toast.loading(editingTable ? 'Updating table...' : 'Adding new table...');
    
    try {
      // Prepare data for backend - only send fields that exist in database
      const backendData = {
        number: parseInt(tableData.number || tableData.table_number),
        status: tableData.status || 'available'
      };

      // Validate table number is not NaN
      if (isNaN(backendData.number)) {
        throw new Error('Table number must be a valid number');
      }

      console.log('Saving table data:', { tableData, backendData });

      if (editingTable) {
        // Update existing table
        const result = await ApiService.updateTable(editingTable.id, backendData);
        console.log('Table updated:', result);
        toast.success('Table updated successfully!', { id: saveToast });
      } else {
        // Add new table
        const result = await ApiService.createTable(backendData);
        console.log('Table created:', result);
        toast.success('Table added successfully!', { id: saveToast });
      }
      
      // Reload tables to get fresh data
      await loadTables();
      
      setShowTableForm(false);
      setEditingTable(null);
    } catch (err) {
      console.error('Error saving table:', err);
      
      // Handle specific error types with user-friendly messages
      let errorMessage = 'Failed to save table';
      
      if (err.message.includes('already exists')) {
        errorMessage = err.message;
      } else if (err.message.includes('UNIQUE constraint failed')) {
        errorMessage = 'Table number already exists. Please choose a different number.';
      } else if (err.message.includes('valid number')) {
        errorMessage = 'Please enter a valid table number';
      } else if (err.message.includes('Cannot connect')) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else if (err.message && err.message !== 'Failed to save table') {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage, { 
        id: saveToast,
        duration: 4000 // Show error longer for better visibility
      });
    }
  };

  const handleDeleteTable = (table) => {
    setDeletingTable(table);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTable = async () => {
    const deleteToast = toast.loading('Deleting table...');
    
    try {
      await ApiService.deleteTable(deletingTable.id);
      toast.success(`${deletingTable.table_name || `Table ${deletingTable.number}`} deleted successfully!`, { id: deleteToast });
      
      // Reload tables to get fresh data
      await loadTables();
      
      setShowDeleteConfirm(false);
      setDeletingTable(null);
    } catch (err) {
      console.error('Error deleting table:', err);
      toast.error(`Failed to delete table: ${err.message}`, { id: deleteToast });
    }
  };

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      const table = tables.find(t => t.id === tableId);
      
      // Update status via API, passing the current table number
      await ApiService.updateTableStatus(tableId, newStatus, parseInt(table.number));
      
      const statusLabels = {
        available: 'Available',
        unavailable: 'Unavailable'
      };
      
      toast.success(`${table.table_name || `Table ${table.number}`} marked as ${statusLabels[newStatus]}`);
      
      // Reload tables to get fresh data
      await loadTables();
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(`Failed to update table status: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-xl">
      {/* Page Header */}
      <div className="page-header mb-xl">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-sm">Table Management</h1>
          <p className="text-secondary">
            Manage restaurant tables, seating arrangements, and QR codes
          </p>
        </div>
      </div>

      {/* Table Statistics Component */}
      <TableStats tables={tables} />

      <div className="page-content">
        {/* Search and Filters Component */}
        <TableToolbar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalTables={tables.length}
          filteredCount={filteredTables.length}
          onAddTable={handleAddTable}
        />

        {/* Tables Table Component */}
        <TablesTable 
          tables={tables}
          filteredTables={filteredTables}
          searchTerm={searchTerm}
          onEditTable={handleEditTable}
          onDeleteTable={handleDeleteTable}
          onStatusChange={handleStatusChange}
          onAddTable={handleAddTable}
        />
      </div>

      {/* Table Form Modal */}
      <TableForm
        isOpen={showTableForm}
        onClose={() => setShowTableForm(false)}
        onSave={handleSaveTable}
        editingTable={editingTable}
        existingTables={tables}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteTable}
        table={deletingTable}
      />
    </div>
  );
};

export default TableManagement;
