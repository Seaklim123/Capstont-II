import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Footer removed from Cart to prevent About Us content appearing in cart
import '../styles/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Trigger event to update cart badge
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Trigger event to update cart badge
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const tax = subtotal * 0.1; // 10% tax
    return (subtotal + tax).toFixed(2);
  };

  const handleCheckout = () => {
    alert('Checkout functionality coming soon!');
  };

  return (
    <div className="cart-page">
      <section className="cart-section">
        <div className="container">
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <span>←</span>
            </button>
            <h1 className="cart-title">Shopping Cart</h1>
            {/* Show table number if present (from QR) */}
            {typeof window !== 'undefined' && localStorage.getItem('tableNumber') && (
              <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', color: '#555', marginRight: '0.5rem' }}>Table</span>
                <div style={{ background: '#f5f5f5', padding: '6px 10px', borderRadius: '8px', fontWeight: 600 }}>
                  {localStorage.getItem('tableNumber')}
                </div>
              </div>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some delicious items to your cart!</p>
              <button className="continue-shopping-btn" onClick={() => navigate('/menu')}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span>{item.name}</span>
                      )}
                    </div>
                    
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price">${parseFloat(item.price).toFixed(2)}</p>
                    </div>

                    <div className="cart-item-quantity">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <input 
                        type="number" 
                        className="quantity-input" 
                        value={item.quantity} 
                        readOnly 
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-total">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>

                    <button 
                      className="remove-item-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2 className="summary-title">Order Summary</h2>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax (10%)</span>
                  <span>${(parseFloat(calculateSubtotal()) * 0.1).toFixed(2)}</span>
                </div>
                
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>

                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>

                <button className="continue-shopping-btn" onClick={() => navigate('/menu')}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      
    </div>
  );
};

export default Cart;
