import React, { useState, useEffect } from 'react';
import { Search, Filter, Package } from 'lucide-react';
import MenuItemsTable from '../components/MenuManagement/MenuItemsTable';
import { menuItems, categories } from '../data/mockData';

const MenuManagement = () => {
  const [items, setItems] = useState(menuItems);
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter items based on search and category
  useEffect(() => {
    let filtered = items;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory]);

  return (
    <div className="menu-management">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Management</h1>
          <p className="page-subtitle">
            Manage your restaurant's menu items, categories, and pricing
          </p>
        </div>
      </div>

      {/* Content Card */}
      <div className="content-card">
        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-input">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-select">
            <Filter size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Menu Items Table */}
        <MenuItemsTable
          items={filteredItems}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default MenuManagement;
