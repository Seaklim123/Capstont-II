import React, { useState, useEffect } from 'react';
import { Plus, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import TableStats from '../components/TableManagement/TableStats';
import TableToolbar from '../components/TableManagement/TableToolbar';
import TablesTable from '../components/TableManagement/TablesTable';
import TableForm from '../components/TableManagement/TableForm';
import DeleteConfirmModal from '../components/TableManagement/DeleteConfirmModal';
import { mockTables } from '../components/TableManagement/mockTableData';

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

  const loadTables = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTables(mockTables);
    } catch (error) {
      toast.error('Failed to load tables');
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTables = tables.filter(table =>
    table.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.table_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.status.toLowerCase().includes(searchTerm.toLowerCase())
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
      if (editingTable) {
        // Update existing table
        const updatedTables = tables.map(table =>
          table.id === editingTable.id 
            ? { ...tableData, id: editingTable.id, created_at: editingTable.created_at }
            : table
        );
        setTables(updatedTables);
        toast.success('Table updated successfully!', { id: saveToast });
      } else {
        // Add new table
        const newTable = {
          ...tableData,
          id: Math.max(...tables.map(t => t.id), 0) + 1,
          created_at: new Date().toISOString(),
          current_order_id: null
        };
        setTables(prev => [...prev, newTable]);
        toast.success('Table added successfully!', { id: saveToast });
      }
      
      setShowTableForm(false);
      setEditingTable(null);
    } catch (err) {
      toast.error('Failed to save table', { id: saveToast });
      console.error('Error saving table:', err);
    }
  };

  const handleDeleteTable = (table) => {
    setDeletingTable(table);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTable = async () => {
    const deleteToast = toast.loading('Deleting table...');
    
    try {
      const updatedTables = tables.filter(table => table.id !== deletingTable.id);
      setTables(updatedTables);
      toast.success(`${deletingTable.table_name} deleted successfully!`, { id: deleteToast });
      
      setShowDeleteConfirm(false);
      setDeletingTable(null);
    } catch (err) {
      toast.error('Failed to delete table', { id: deleteToast });
      console.error('Error deleting table:', err);
    }
  };

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      const updatedTables = tables.map(table =>
        table.id === tableId 
          ? { ...table, status: newStatus }
          : table
      );
      setTables(updatedTables);
      
      const table = tables.find(t => t.id === tableId);
      const statusLabels = {
        available: 'Available',
        occupied: 'Occupied', 
        maintenance: 'Maintenance'
      };
      
      toast.success(`${table.table_name} marked as ${statusLabels[newStatus]}`);
    } catch (err) {
      toast.error('Failed to update table status');
      console.error('Error updating status:', err);
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
