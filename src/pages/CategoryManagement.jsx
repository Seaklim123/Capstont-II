import React, { useState, useEffect } from 'react';
import { categoryApi } from '../services/api';
import '../styles/CategoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image_path: null
  });

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryApi.getAll();
      setCategories(response.data || []);
    } catch (err) {
      setError('Failed to fetch categories: ' + err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingCategory) {
        // Update existing category
        await categoryApi.update(editingCategory.id, formData);
      } else {
        // Create new category
        await categoryApi.create(formData);
      }

      // Refresh categories list
      await fetchCategories();
      
      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save category: ' + err.message);
      console.error('Error saving category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await categoryApi.delete(id);
      
      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      setError('Failed to delete category: ' + err.message);
      console.error('Error deleting category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image_path: null // Don't pre-fill file input
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', image_path: null });
    setEditingCategory(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="category-management">
      <div className="category-header">
        <h1>Category Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          Add Category
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}

      <div className="categories-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  {category.image_path ? (
                    <img 
                      src={category.image_path} 
                      alt={category.name}
                      className="category-image"
                    />
                  ) : (
                    <span className="no-image">No Image</span>
                  )}
                </td>
                <td>{formatDate(category.created_at)}</td>
                <td>{formatDate(category.updated_at)}</td>
                <td className="actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(category)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(category.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && !loading && (
          <div className="no-data">No categories found</div>
        )}
      </div>

      {/* Modal for Add/Edit Category */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength="255"
                  placeholder="Enter category name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image_path">Category Image</label>
                <input
                  type="file"
                  id="image_path"
                  name="image_path"
                  onChange={handleInputChange}
                  accept="image/jpeg,image/jpg,image/png"
                />
                <small>Optional. Accepts JPG, JPEG, PNG files (max 2MB)</small>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;