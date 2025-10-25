import React from 'react';
import { ImageIcon, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const MenuItemsTable = ({ 
  items, 
  categories,
  onEdit,
  onDelete,
  onToggleAvailability
}) => {

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  return (
    <>
      {/* Table Container */}
      <div className="table-container">
        {items.length === 0 ? (
          <div className="empty-state">
            <p>No menu items found. Add your first menu item to get started!</p>
          </div>
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
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="img-thumbnail hover-scale transition"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="img-placeholder" style={{display: item.image ? 'none' : 'flex'}}>
                      <ImageIcon size={12} />
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-primary">{item.name}</div>
                  </td>
                  <td>
                    <span className="badge badge-secondary">
                      {getCategoryLabel(item.category)}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold text-success">
                      ${(item.price || 0).toFixed(2)}
                    </span>
                  </td>
                  <td>
                    {item.discount > 0 ? (
                      <span className="badge badge-error">
                        {item.discount}%
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="text-secondary text-sm" title={item.description} style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                      {item.description}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${item.available ? 'badge-success' : 'badge-secondary'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-xs">
                      <button
                        className={`btn btn-sm ${item.available ? 'btn-success' : 'btn-secondary'} transition hover-lift`}
                        onClick={() => onToggleAvailability(item)}
                        title={item.available ? 'Click to make unavailable' : 'Click to make available'}
                      >
                        {item.available ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm transition hover-lift"
                        onClick={() => onEdit(item)}
                        title="Edit item"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-error btn-sm transition hover-lift"
                        onClick={() => onDelete(item)}
                        title="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default MenuItemsTable;
