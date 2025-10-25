import React, { useState, useEffect } from 'react';
import { Plus, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import TableStats from '../components/TableManagement/TableStats';
import TableToolbar from '../components/TableManagement/TableToolbar';
import TablesTable from '../components/TableManagement/TablesTable';
import { mockTables } from '../components/TableManagement/mockTableData';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              <MapPin className="title-icon" />
              Table Management
            </h1>
            <p className="page-subtitle">
              Manage restaurant tables, seating arrangements, and QR codes
            </p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary">
              <Plus size={16} />
              Add New Table
            </button>
          </div>
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
        />

        {/* Tables Table Component */}
        <TablesTable 
          tables={tables}
          filteredTables={filteredTables}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default TableManagement;
