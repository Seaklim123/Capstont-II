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
                          console.error('Image failed to load:', item.image, 'for item:', item.name);
                          console.error('Original path:', item.originalImagePath);
                          console.error('Trying to fetch from:', item.image);
                          
                          // Test if URL is accessible
                          fetch(item.image, { method: 'HEAD' })
                            .then(response => {
                              console.error('URL fetch test result:', response.status, response.statusText);
                            })
                            .catch(err => {
                              console.error('URL not accessible:', err.message);
                            });
                          
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                          // Add error indicator to placeholder
                          const placeholder = e.target.nextSibling;
                          if (placeholder) {
                            placeholder.style.borderColor = '#ef4444';
                            placeholder.title = `Image failed to load: ${item.image}\nOriginal path: ${item.originalImagePath || 'N/A'}`;
                          }
                        }}
                        onLoad={(e) => {
                          console.log(' Image loaded successfully:', item.image, 'for item:', item.name);
                        }}
                      />
                    ) : null}
                    <div className="img-placeholder" style={{display: item.image ? 'none' : 'flex'}} title={item.image ? `Loading image: ${item.image}` : `No image available. Original path: ${item.originalImagePath || 'N/A'}`}>
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
                    {item.discount > 0 && item.price > 0 ? (
                      <div className="text-sm">
                        <span className="font-semibold text-success">
                          ${(item.price - item.discount).toFixed(2)}
                        </span>
                        <br />
                        <span className="text-muted line-through text-xs">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold text-success">
                        ${(item.price || 0).toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td>
                    {item.discount > 0 && item.price > 0 ? (
                      <span 
                        className="badge badge-error"
                        title={`${Math.round((item.discount / item.price) * 100)}% discount = $${item.discount.toFixed(2)} off`}
                      >
                        {Math.round((item.discount / item.price) * 100)}%
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
