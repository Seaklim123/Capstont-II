import React, { useState, useEffect } from 'react';
import { Search, Filter, Package, Tag, Plus } from 'lucide-react';
import MenuItemsTable from '../components/MenuManagement/MenuItemsTable';
import MenuItemForm from '../components/MenuManagement/MenuItemForm';
import CategoriesTable from '../components/MenuManagement/CategoriesTable';
import CategoryForm from '../components/MenuManagement/CategoryForm';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { menuItems, categories } from '../data/mockData';

const MenuManagement = () => {
  const [items, setItems] = useState(menuItems);
  const [categoriesList, setCategoriesList] = useState(categories);
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('items');
  
  // Menu Items state
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Categories state
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCategoryDeleteConfirm, setShowCategoryDeleteConfirm] = useState(null);

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

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      // Update existing item
      setItems(items.map(item =>
        item.id === editingItem.id
          ? { ...item, ...itemData, id: editingItem.id }
          : item
      ));
    } else {
      // Add new item
      const newItem = {
        ...itemData,
        id: Math.max(...items.map(item => item.id)) + 1,
        createdAt: new Date().toISOString()
      };
      setItems([...items, newItem]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (item) => {
    setShowDeleteConfirm(item);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      setItems(items.filter(item => item.id !== showDeleteConfirm.id));
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Category CRUD handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      // Update existing category
      setCategoriesList(categoriesList.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, ...categoryData, id: editingCategory.id }
          : cat
      ));
    } else {
      // Add new category
      const newCategory = {
        ...categoryData,
        id: Math.max(...categoriesList.map(cat => cat.id)) + 1,
        createdAt: new Date().toISOString()
      };
      setCategoriesList([...categoriesList, newCategory]);
    }
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleCloseCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (category) => {
    // Check if category has items
    const itemsInCategory = items.filter(item => item.category === category.value).length;
    if (itemsInCategory > 0) {
      alert(`Cannot delete category "${category.label}" because it contains ${itemsInCategory} menu items. Please move or delete those items first.`);
      return;
    }
    setShowCategoryDeleteConfirm(category);
  };

  const confirmCategoryDelete = () => {
    if (showCategoryDeleteConfirm) {
      setCategoriesList(categoriesList.filter(cat => cat.id !== showCategoryDeleteConfirm.id));
      setShowCategoryDeleteConfirm(null);
    }
  };

  const cancelCategoryDelete = () => {
    setShowCategoryDeleteConfirm(null);
  };

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
        <div className="page-actions">
          {activeTab === 'items' ? (
            <button 
              className="btn btn-primary"
              onClick={handleAddItem}
            >
              <Plus size={16} />
              Add New Item
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handleAddCategory}
            >
              <Plus size={16} />
              Add New Category
            </button>
          )}
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
                  {categoriesList.map(category => (
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
              categories={categoriesList}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          </>
        ) : (
          <>
            {/* Categories Table */}
            <CategoriesTable
              categories={categoriesList}
              items={items}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          </>
        )}
      </div>

      {/* Menu Item Form Modal */}
      <MenuItemForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSave={handleSaveItem}
        editingItem={editingItem}
        categories={categoriesList}
      />

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={showCategoryForm}
        onClose={handleCloseCategoryForm}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        existingCategories={categoriesList}
      />

      {/* Menu Item Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item? This action cannot be undone and will permanently remove it from your menu."
        confirmText="Delete Item"
        cancelText="Cancel"
        type="danger"
        itemName={showDeleteConfirm?.name}
      />

      {/* Category Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!showCategoryDeleteConfirm}
        onClose={cancelCategoryDelete}
        onConfirm={confirmCategoryDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone and will permanently remove the category."
        confirmText="Delete Category"
        cancelText="Cancel"
        type="danger"
        itemName={showCategoryDeleteConfirm?.label}
      />
    </div>
  );
};

export default MenuManagement;
