import React from 'react';
import { Search, Plus } from 'lucide-react';

const TableToolbar = ({ searchTerm, setSearchTerm, totalTables, filteredCount, onAddTable }) => {
  return (
    <div className="search-filter-bar">
      <div className="search-input">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search tables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="toolbar-actions flex items-center gap-md">
        <span className="text-sm text-gray">
          {filteredCount} of {totalTables} tables
        </span>
        <button 
          className="btn btn-primary transition hover-lift flex items-center gap-xs ml-auto"
          onClick={onAddTable}
        >
          <Plus size={16} />
          Add New Table
        </button>
      </div>
    </div>
  );
};

export default TableToolbar;