import React, { useState, useEffect } from 'react';
import { Search, Filter, Package, Tag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import MenuItemsTable from '../components/MenuManagement/MenuItemsTable';
import MenuItemForm from '../components/MenuManagement/MenuItemForm';
import CategoriesTable from '../components/MenuManagement/CategoriesTable';
import CategoryForm from '../components/MenuManagement/CategoryForm';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ApiService from '../services/api';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('items');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Menu Items state
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Categories state
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCategoryDeleteConfirm, setShowCategoryDeleteConfirm] = useState(null);

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

    const loadData = async (showToast = true) => {
    let loadingToast;
    if (showToast) {
      loadingToast = toast.loading('Loading menu data...');
    }
    
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getCategories()
      ]);
      
      // Transform items data to ensure consistent field names
      const transformedItems = productsResponse.map(item => ({
        ...item,
        available: item.status === 'available' || item.available,
        category: item.category_id || item.category,
        price: parseFloat(item.price || 0), // Use actual price field from database
        discount: parseFloat(item.discount || 0), // Keep discount separate
        image: item.image_path || item.image_url || item.image // Support both file uploads and URL images
      }));
      
      // Transform categories data to ensure consistent field names
      const transformedCategories = categoriesResponse.map(category => ({
        id: category.id,
        name: category.name,
        value: category.id.toString(),
        label: category.name,
        image: category.image_path || category.image, // Support category images
        created_at: category.created_at,
        updated_at: category.updated_at
      }));
      
      setItems(transformedItems);
      setCategoriesList(transformedCategories);
      
      if (showToast && loadingToast) {
        toast.success('Menu data loaded successfully', { id: loadingToast });
      }
    } catch (err) {
      setError('Failed to load data: ' + err.message);
      if (showToast && loadingToast) {
        toast.error('Failed to load menu data: ' + err.message, { id: loadingToast });
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search and category
  useEffect(() => {
    let filtered = items;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category && item.category.toString() === selectedCategory
      );
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

  const handleSaveItem = async (itemData, imageFile = null) => {
    const saveToast = toast.loading(editingItem ? 'Updating menu item...' : 'Adding new menu item...');
    
    try {
      // Transform data for backend
      const backendData = {
        name: itemData.name?.trim() || '',
        category_id: parseInt(itemData.category) || 1,
        price: parseFloat(itemData.price) || 0,
        description: itemData.description?.trim() || '',
        status: itemData.available ? 'available' : 'unavailable'
      };

      // Handle image based on mode
      if (itemData.imageMode === 'url' && itemData.image) {
        // For URL mode, use 'image_url' field instead of 'image_path'
        backendData.image_url = itemData.image;
      }

      if (editingItem) {
        // Update existing item
        let result;
        
        if (imageFile && itemData.imageMode === 'file') {
          // Update with new image file
          result = await ApiService.updateProductWithFile(editingItem.id, backendData, imageFile);
        } else {
          // Update without file upload (includes URL mode)
          result = await ApiService.updateProduct(editingItem.id, backendData);
        }
        toast.success('Menu item updated successfully!', { id: saveToast });
      } else {
        // Add new item
        let result;
        
        if (imageFile && itemData.imageMode === 'file') {
          // Create with image file
          result = await ApiService.createProductWithFile(backendData, imageFile);
        } else {
          // Create without file (includes URL mode)
          result = await ApiService.createProduct(backendData);
        }
        toast.success('Menu item added successfully!', { id: saveToast });
      }
      
      // Reload data to get updated list (without showing loading toast)
      await loadData(false);
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving item:', err);
      toast.error(`Failed to ${editingItem ? 'update' : 'add'} menu item: ${err.message}`, { id: saveToast });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (item) => {
    setShowDeleteConfirm(item);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      const deleteToast = toast.loading('Deleting menu item...');
      
      try {
        await ApiService.deleteProduct(showDeleteConfirm.id);
        await loadData(false); // Reload data
        setShowDeleteConfirm(null);
        toast.success('Menu item deleted successfully!', { id: deleteToast });
      } catch (err) {
        toast.error('Failed to delete menu item. Please try again.', { id: deleteToast });
        setShowDeleteConfirm(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleToggleAvailability = async (item) => {
    const statusText = item.available ? 'unavailable' : 'available';
    const toggleToast = toast.loading(`Making item ${statusText}...`);
    
    try {
      const newStatus = item.available ? 'unavailable' : 'available';
      await ApiService.toggleProductStatus(item.id, newStatus);
      await loadData(false); // Reload data to reflect changes
      toast.success(`Item is now ${statusText}!`, { id: toggleToast });
    } catch (err) {
      toast.error('Failed to update item status. Please try again.', { id: toggleToast });
    }
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

  const handleSaveCategory = async (categoryData, imageFile = null) => {
    const saveToast = toast.loading(editingCategory ? 'Updating category...' : 'Adding new category...');
    
    try {
      const backendData = {
        name: categoryData.label
      };

      // Handle image based on mode
      if (categoryData.imageMode === 'url' && categoryData.image) {
        backendData.image_url = categoryData.image;
      }

      if (editingCategory) {
        // Update existing category
        let result;
        
        if (imageFile && categoryData.imageMode === 'file') {
          // Update with new image file
          result = await ApiService.updateCategoryWithFile(editingCategory.id, backendData, imageFile);
        } else {
          // Update without file upload (includes URL mode)
          result = await ApiService.updateCategory(editingCategory.id, backendData);
        }
        toast.success('Category updated successfully!', { id: saveToast });
      } else {
        // Add new category
        let result;
        
        if (imageFile && categoryData.imageMode === 'file') {
          // Create with image file
          result = await ApiService.createCategoryWithFile(backendData, imageFile);
        } else {
          // Create without file (includes URL mode)
          result = await ApiService.createCategory(backendData);
        }
        toast.success('Category added successfully!', { id: saveToast });
      }
      
      await loadData(false); // Reload data
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error(`Failed to ${editingCategory ? 'update' : 'add'} category: ${err.message}`, { id: saveToast });
    }
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

  const confirmCategoryDelete = async () => {
    if (showCategoryDeleteConfirm) {
      const deleteToast = toast.loading('Deleting category...');
      
      try {
        await ApiService.deleteCategory(showCategoryDeleteConfirm.id);
        await loadData(false); // Reload data
        setShowCategoryDeleteConfirm(null);
        toast.success('Category deleted successfully!', { id: deleteToast });
      } catch (err) {
        console.error('Error deleting category:', err);
        toast.error('Failed to delete category. Please try again.', { id: deleteToast });
      }
    }
  };

  const cancelCategoryDelete = () => {
    setShowCategoryDeleteConfirm(null);
  };

  return (
    <div className="p-xl">
      {/* Page Header */}
      <div className="page-header mb-xl">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-sm">Menu Management</h1>
          <p className="text-secondary">
            Manage your restaurant's menu items, categories, and pricing
          </p>
        </div>
        <div className="flex gap-md">
          {activeTab === 'items' ? (
            <button 
              className="btn btn-primary transition hover-lift flex items-center gap-xs"
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

      {/* Loading State */}
      {loading && (
        <div className="content-card">
          <div className="loading-state">
            <p>Loading menu data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="content-card">
          <div className="error-state">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadData}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Content Card */}
      {!loading && !error && (
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
                  {categoriesList.map((category, index) => (
                    <option key={category.value || category.id || index} value={category.value || category.id}>
                      {category.label || category.name}
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
              onToggleAvailability={handleToggleAvailability}
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
      )}

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
