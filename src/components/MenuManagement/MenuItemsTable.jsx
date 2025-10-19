import React from 'react';
import { ImageIcon, Edit } from 'lucide-react';

const MenuItemsTable = ({ 
  items, 
  categories,
  onEdit
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
          <table className="menu-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="item-image">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="food-thumbnail"
                      />
                    ) : (
                      <div className="no-image">
                        <ImageIcon size={12} />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="item-name">{item.name}</div>
                  </td>
                  <td>
                    <span className="category-badge">
                      {getCategoryLabel(item.category)}
                    </span>
                  </td>
                  <td>
                    <span className="item-price">${item.price.toFixed(2)}</span>
                  </td>
                  <td>
                    <div className="item-description" title={item.description}>
                      {item.description}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${item.available ? 'available' : 'unavailable'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onEdit(item)}
                        title="Edit item"
                      >
                        <Edit size={14} />
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
