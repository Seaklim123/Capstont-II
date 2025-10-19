import React, { useState, useEffect } from 'react';
import { Search, Filter, Package, Tag } from 'lucide-react';
import MenuItemsTable from '../components/MenuManagement/MenuItemsTable';
import { menuItems, categories } from '../data/mockData';

const MenuManagement = () => {
  const [items, setItems] = useState(menuItems);
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('items');

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

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          <Package size={16} />
          Menu Items
        </button>
        <button 
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Tag size={16} />
          Categories
        </button>
      </div>

      {/* Content Card */}
      <div className="content-card">
        {activeTab === 'items' ? (
          <>
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
          </>
        ) : (
          <>
            {/* Categories Table */}
            <div className="table-container">
              {categories.length === 0 ? (
                <div className="empty-state">
                  <p>No categories found. Add your first category to get started!</p>
                </div>
              ) : (
                <table className="menu-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th>Items Count</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => {
                      const itemsInCategory = items.filter(item => item.category === category.value).length;
                      return (
                        <tr key={category.id}>
                          <td>
                            <span className="category-id">#{category.id}</span>
                          </td>
                          <td>
                            <div className="category-name">{category.label}</div>
                          </td>
                          <td>
                            <div className="category-description">
                              {category.description}
                            </div>
                          </td>
                          <td className="items-count">
                            <span className="count-badge">
                              {itemsInCategory} items
                            </span>
                          </td>
                          <td>
                            {new Date(category.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
