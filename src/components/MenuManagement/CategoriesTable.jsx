import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const CategoriesTable = ({ 
  categories,
  items,
  onEdit,
  onDelete
}) => {
  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  return (
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
              <th>Actions</th>
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
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onEdit(category)}
                        title="Edit category"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-outline btn-sm btn-danger"
                        onClick={() => onDelete(category)}
                        title="Delete category"
                        disabled={itemsInCategory > 0}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoriesTable;