import React from 'react';
import { ImageIcon } from 'lucide-react';

const MenuItemsTable = ({ 
  items, 
  categories
}) => {

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll create a mock URL
      const mockUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`;
      setFormData(prev => ({
        ...prev,
        image: mockUrl
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
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
