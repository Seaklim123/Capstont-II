import React from 'react';
import { Search } from 'lucide-react';

const TableToolbar = ({ searchTerm, setSearchTerm, totalTables, filteredCount }) => {
  return (
    <div className="content-toolbar">
      <div className="search-container">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          placeholder="Search tables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="toolbar-actions">
        <span className="text-sm text-gray">
          {filteredCount} of {totalTables} tables
        </span>
      </div>
    </div>
  );
};

export default TableToolbar;