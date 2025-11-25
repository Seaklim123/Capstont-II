import React from 'react';
import { MapPin, Users } from 'lucide-react';

const TableStats = ({ tables }) => {
  const getTableStats = () => {
    return {
      total: tables.length,
      available: tables.filter(t => t.status === 'available').length,
      unavailable: tables.filter(t => t.status !== 'available').length
    };
  };

  const stats = getTableStats();

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Tables</div>
        </div>
        <div className="stat-icon">
          <MapPin size={24} />
        </div>
      </div>
      <div className="stat-card stat-success">
        <div className="stat-content">
          <div className="stat-number">{stats.available}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-icon">
          <Users size={24} />
        </div>
      </div>
      <div className="stat-card stat-danger">
        <div className="stat-content">
          <div className="stat-number">{stats.unavailable}</div>
          <div className="stat-label">Unavailable</div>
        </div>
        <div className="stat-icon">
          <Users size={24} />
        </div>
      </div>
    </div>
  );
};

export default TableStats;