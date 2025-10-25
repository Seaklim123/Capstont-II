import React from 'react';
import { Edit, Trash2, Tag } from 'lucide-react';

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
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Category Name</th>
              <th>Items Count</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const itemsInCategory = items.filter(item => 
                item.category && item.category.toString() === category.value
              ).length;
              return (
                <tr key={category.id}>
                  <td>
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="img-thumbnail hover-scale transition"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="img-placeholder" style={{display: category.image ? 'none' : 'flex'}}>
                      <Tag size={12} />
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-gradient font-mono">#{category.id}</span>
                  </td>
                  <td>
                    <div className="font-semibold text-primary">{category.label || category.name}</div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {itemsInCategory} items
                    </span>
                  </td>
                  <td>
                    <span className="text-secondary text-sm">
                      {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-xs">
                      <button
                        className="btn btn-secondary btn-sm transition hover-lift"
                        onClick={() => onEdit(category)}
                        title="Edit category"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-error btn-sm transition hover-lift"
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