function MenuItem({ item, onAddToCart }) {
  return (
    <div className="menu-item-card">
      {item.popular && <div className="popular-badge">🔥 Popular</div>}
      
      <div className="item-image">
        <span className="food-emoji">{item.image}</span>
        {item.spicy && <div className="spicy-indicator">🌶️</div>}
      </div>
      
      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-description">{item.description}</p>
        
        <div className="item-footer">
          <span className="item-price">${item.price}</span>
          <button
            onClick={() => onAddToCart(item)}
            className="add-to-cart-btn"
          >
            <span>Add to Cart</span>
            <span className="btn-icon">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;