function MenuItem({ item, addToCart }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <strong>{item.name}</strong> - ${item.price.toFixed(2)}
      <button 
        onClick={() => addToCart(item)} 
        style={{ marginLeft: 10 }}
      >
        Add to Order
      </button>
    </div>
  );
}

export default MenuItem;
