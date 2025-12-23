import React, { useState, useEffect } from 'react';
import { Search, Filter, Package, Tag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import MenuItemsTable from '../components/MenuManagement/MenuItemsTable';
import MenuItemForm from '../components/MenuManagement/MenuItemForm';
import CategoriesTable from '../components/MenuManagement/CategoriesTable';
import CategoryForm from '../components/MenuManagement/CategoryForm';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ApiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MenuManagement = () => {
  const { user } = useAuth();
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
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
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
      let productsResponse, categoriesResponse;
      if (user && user.role === 'cashier') {
        productsResponse = await ApiService.getCashierProducts();
        categoriesResponse = await ApiService.getCashierCategories();
      } else {
        productsResponse = await ApiService.getProducts();
        categoriesResponse = await ApiService.getCategories();
      }
      
      // Transform items data to ensure consistent field names
      const transformedItems = productsResponse.map(item => ({
        ...item,
        available: item.status === 'available' || item.available,
        category: item.category_id || item.category,
        price: parseFloat(item.price || 0),
        discount: parseFloat(item.discount || 0), // Discount is stored as dollar amount
        image: item.image_url || '',
        originalImagePath: item.originalImagePath
      }));
      
      // Transform categories data to ensure consistent field names
      const transformedCategories = categoriesResponse.map(category => ({
        id: category.id,
        name: category.name,
        value: category.id.toString(),
        label: category.name,
        image: category.image_url || '', // Use image URL from API service
        originalImagePath: category.originalImagePath, // Keep original path for debugging
        created_at: category.created_at,
        updated_at: category.updated_at
      }));
      
      // Sort items by created_at (or id) descending so newest appear first
      const sortedItems = [...transformedItems].sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        // fallback to id if created_at is missing
        return (b.id || 0) - (a.id || 0);
      });
      setItems(sortedItems);
      setCategoriesList(transformedCategories);
      
      // Debug: Log image URLs for troubleshooting (first 3 items only)
      console.log('Loaded items sample:', transformedItems.slice(0, 3).map(item => ({
        name: item.name,
        originalPath: item.originalImagePath,
        imageUrl: item.image,
        available: item.available
      })));
      
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
    setCurrentPage(1); // Reset to first page on filter change
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
        category_id: parseInt(itemData.category_id) || parseInt(itemData.category) || 1,
        price: parseFloat(itemData.price) || 0,
        discount: itemData.discount ? parseFloat(itemData.discount) : 0,
        description: itemData.description?.trim() || '',
        status: itemData.status || (itemData.available ? 'available' : 'unavailable')
      };

      // Handle image based on mode - don't send image_path for URLs to avoid validation error
      if (itemData.imageMode === 'url' && itemData.image) {
        // For URL mode, send as separate field or handle differently
        backendData.image_url = itemData.image;
        // Don't send image_path to avoid file validation
      }

      // Debug logging
      console.log('Saving item data:', {
        itemData,
        backendData,
        imageFile,
        isEditing: !!editingItem
      });

      if (editingItem) {
        // Update existing item
        let result;
        
        if (imageFile && itemData.imageMode === 'file') {
          // Update with new image file
          result = await ApiService.updateProductWithFile(editingItem.id, backendData, imageFile);
          console.log('File update result:', result);
        } else if (itemData.imageMode === 'url' && itemData.image) {
          // Update with image URL using the proper API method
          const urlData = {
            ...backendData,
            image_path: itemData.image
          };
          
          result = await ApiService.updateProduct(editingItem.id, urlData);
          console.log('URL update result:', result);
        } else {
          // Update without image changes
          result = await ApiService.updateProduct(editingItem.id, backendData);
        }
        toast.success('Menu item updated successfully!', { id: saveToast });
      } else {
        // Add new item
        let result;
        
        if (imageFile && itemData.imageMode === 'file') {
          // Create with image file
          result = await ApiService.createProductWithFile(backendData, imageFile);
          console.log('File upload result from backend:', result);
          console.log('Image path returned:', result?.image_path || result?.data?.image_path);
        } else if (itemData.imageMode === 'url' && itemData.image) {
          // Create with image URL - use FormData to avoid JSON validation issues
          const formData = new FormData();
          Object.keys(backendData).forEach(key => {
            if (key !== 'image_url' && backendData[key] !== null && backendData[key] !== undefined) {
              formData.append(key, backendData[key]);
            }
          });
          // Send URL as image_path
          formData.append('image_path', itemData.image);
          
          console.log('DEBUG: Sending URL via FormData:', {
            imageUrl: itemData.image,
            imageMode: itemData.imageMode,
            formDataEntries: [...formData.entries()].map(([key, value]) => [key, value])
          });
          
          // Use the proper createProduct method
          const urlData = {
            ...backendData,
            image_path: itemData.image
          };
          result = await ApiService.createProduct(urlData);
          console.log('URL create result:', result);
        } else {
          // Create without image
          result = await ApiService.createProduct(backendData);
        }
        toast.success('Menu item added successfully!', { id: saveToast });
      }
      
      // Reload data to get updated list (without showing loading toast)
      await loadData(false);
      // Move the newly added or updated item to the top of the list
      setItems(prevItems => {
        // Find the new/updated item in the loaded data
        const newItem = items.find(i => i.name === backendData.name && i.description === backendData.description);
        if (newItem) {
          // Remove if already exists (for update), then add to top
          return [newItem, ...prevItems.filter(i => i.id !== newItem.id)];
        }
        return prevItems;
      });
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
        console.error('Delete error:', err);
        const errorMessage = err.message || 'Failed to delete menu item. Please try again.';
        toast.error(errorMessage, { id: deleteToast });
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
        name: categoryData.name // Use the correct field name
      };

      console.log('Saving category:', {
        categoryData,
        backendData,
        imageFile,
        hasImageFile: !!imageFile
      });

      if (editingCategory) {
        // Update existing category
        let result;
        
        if (imageFile) {
          // Update with new image file
          result = await ApiService.updateCategoryWithFile(editingCategory.id, backendData, imageFile);
          console.log('Category updated with file:', result);
        } else {
          // Update without image file
          result = await ApiService.updateCategory(editingCategory.id, backendData);
          console.log('Category updated without file:', result);
        }
        toast.success('Category updated successfully!', { id: saveToast });
      } else {
        // Add new category
        let result;
        
        if (imageFile) {
          // Create with image file
          result = await ApiService.createCategoryWithFile(backendData, imageFile);
          console.log('Category created with file:', result);
        } else {
          // Create without image file
          result = await ApiService.createCategory(backendData);
          console.log('Category created without file:', result);
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
            {/* Pagination logic: slice filteredItems for current page */}
            <MenuItemsTable
              items={filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
              categories={categoriesList}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onToggleAvailability={handleToggleAvailability}
            />
            {/* Pagination Controls */}
            {filteredItems.length > itemsPerPage && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ marginRight: 8 }}
                >
                  Previous
                </button>
                {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ margin: '0 2px' }}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredItems.length / itemsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                  style={{ marginLeft: 8 }}
                >
                  Next
                </button>
              </div>
            )}
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
