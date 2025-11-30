import React, { useState, useEffect } from 'react';
import { adminCategoryApi, adminProductApi } from '../services/api';
import '../styles/CategoryManagement.css';

const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'categories'
  
  // Product state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_percentage: '',
    category_id: '',
    image_path: '',
    status: 'active'
  });

  // Category state
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    image_path: ''
  });

  // Fetch data on component mount and tab change
  useEffect(() => {
    fetchCategories(); // Always fetch categories for dropdown
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  // ========== PRODUCT FUNCTIONS ==========
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setErrorProducts(null);
      const response = await adminProductApi.getAll();
      setProducts(response.data || []);
    } catch (err) {
      setErrorProducts('Failed to fetch products: ' + err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingProducts(true);
      setErrorProducts(null);

      if (editingProduct) {
        await adminProductApi.update(editingProduct.id, productFormData);
      } else {
        await adminProductApi.create(productFormData);
      }

      await fetchProducts();
      resetProductForm();
      setIsProductModalOpen(false);
    } catch (err) {
      setErrorProducts('Failed to save product: ' + err.message);
      console.error('Error saving product:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setLoadingProducts(true);
      setErrorProducts(null);
      await adminProductApi.delete(id);
      await fetchProducts();
    } catch (err) {
      setErrorProducts('Failed to delete product: ' + err.message);
      console.error('Error deleting product:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      discount_percentage: product.discount_percentage || '',
      category_id: product.category_id || '',
      image_path: product.image_path || '',
      status: product.status || 'active'
    });
    setIsProductModalOpen(true);
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      description: '',
      price: '',
      discount_percentage: '',
      category_id: '',
      image_path: '',
      status: 'active'
    });
  };

  // ========== CATEGORY FUNCTIONS ==========
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setErrorCategories(null);
      const response = await adminCategoryApi.getAll();
      setCategories(response.data || []);
    } catch (err) {
      setErrorCategories('Failed to fetch categories: ' + err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingCategories(true);
      setErrorCategories(null);

      if (editingCategory) {
        await adminCategoryApi.update(editingCategory.id, categoryFormData);
      } else {
        await adminCategoryApi.create(categoryFormData);
      }

      await fetchCategories();
      resetCategoryForm();
      setIsCategoryModalOpen(false);
    } catch (err) {
      setErrorCategories('Failed to save category: ' + err.message);
      console.error('Error saving category:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setLoadingCategories(true);
      setErrorCategories(null);
      await adminCategoryApi.delete(id);
      await fetchCategories();
    } catch (err) {
      setErrorCategories('Failed to delete category: ' + err.message);
      console.error('Error deleting category:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name || '',
      image_path: category.image_path || ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      image_path: ''
    });
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="category-management">
      <div className="page-header">
        <h1>Menu Management</h1>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Menu Items
        </button>
        <button
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>

      {/* ========== PRODUCTS TAB ========== */}
      {activeTab === 'products' && (
        <div className="table-container">
          <div className="table-header">
            <h2>Products</h2>
            <button
              className="btn-primary"
              onClick={() => {
                resetProductForm();
                setIsProductModalOpen(true);
              }}
            >
              + Add Product
            </button>
          </div>

          {errorProducts && (
            <div className="error-message">{errorProducts}</div>
          )}

          {loadingProducts ? (
            <div className="loading">Loading products...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.image_path ? (
                        <img
                          src={`http://localhost:8000${product.image_path}`}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{getCategoryName(product.category_id)}</td>
                    <td>${parseFloat(product.price || 0).toFixed(2)}</td>
                    <td>{product.discount_percentage || 0}%</td>
                    <td className="description-cell">{product.description}</td>
                    <td>
                      <span className={`status-badge ${product.status}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleProductEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleProductDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {products.length === 0 && !loadingProducts && (
            <div className="no-data">No products found</div>
          )}
        </div>
      )}

      {/* ========== CATEGORIES TAB ========== */}
      {activeTab === 'categories' && (
        <div className="table-container">
          <div className="table-header">
            <h2>Categories</h2>
            <button
              className="btn-primary"
              onClick={() => {
                resetCategoryForm();
                setIsCategoryModalOpen(true);
              }}
            >
              + Add Category
            </button>
          </div>

          {errorCategories && (
            <div className="error-message">{errorCategories}</div>
          )}

          {loadingCategories ? (
            <div className="loading">Loading categories...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      {category.image_path ? (
                        <img
                          src={`http://localhost:8000${category.image_path}`}
                          alt={category.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleCategoryEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleCategoryDelete(category.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {categories.length === 0 && !loadingCategories && (
            <div className="no-data">No categories found</div>
          )}
        </div>
      )}

      {/* ========== PRODUCT MODAL ========== */}
      {isProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setIsProductModalOpen(false);
                  resetProductForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={productFormData.name}
                  onChange={handleProductInputChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category_id">Category *</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={productFormData.category_id}
                  onChange={handleProductInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={productFormData.price}
                  onChange={handleProductInputChange}
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="discount_percentage">Discount %</label>
                <input
                  type="number"
                  id="discount_percentage"
                  name="discount_percentage"
                  value={productFormData.discount_percentage}
                  onChange={handleProductInputChange}
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={productFormData.description}
                  onChange={handleProductInputChange}
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={productFormData.status}
                  onChange={handleProductInputChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image_path">Product Image URL</label>
                <input
                  type="text"
                  id="image_path"
                  name="image_path"
                  value={productFormData.image_path}
                  onChange={handleProductInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                <small>Optional. Enter the full URL of the image</small>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    resetProductForm();
                  }}
                  disabled={loadingProducts}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loadingProducts}
                >
                  {loadingProducts ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== CATEGORY MODAL ========== */}
      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  resetCategoryForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="cat-name">Category Name *</label>
                <input
                  type="text"
                  id="cat-name"
                  name="name"
                  value={categoryFormData.name}
                  onChange={handleCategoryInputChange}
                  required
                  maxLength="255"
                  placeholder="Enter category name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cat-image">Category Image URL</label>
                <input
                  type="text"
                  id="cat-image"
                  name="image_path"
                  value={categoryFormData.image_path}
                  onChange={handleCategoryInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                <small>Optional. Enter the full URL of the image</small>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    resetCategoryForm();
                  }}
                  disabled={loadingCategories}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loadingCategories}
                >
                  {loadingCategories ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
