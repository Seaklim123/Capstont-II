import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authCartApi, tableApi } from '../services/api';
import toast from 'react-hot-toast';
import TableNumberModal from '../components/TableNumberModal';
// Footer removed from Cart to prevent About Us content appearing in cart
import '../styles/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableNumber, setTableNumber] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);

  useEffect(() => {
    // Get table number from localStorage
    const storedTableNumber = localStorage.getItem('tableNumber');
    setTableNumber(storedTableNumber);
    
    // Fetch cart from backend API (table number checked on checkout, not on view)
    fetchCart();
  }, []);

  // Helper to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL (like Unsplash), use it directly
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it starts with /storage/, construct the full URL
    if (imagePath.startsWith('/storage/')) {
      return `${import.meta.env.VITE_STORAGE_URL || ''}${imagePath}`;
    }
    
    // If it starts with storage/, add the base URL
    if (imagePath.startsWith('storage/')) {
      return `${import.meta.env.VITE_STORAGE_URL || ''}/${imagePath}`;
    }
    
    // Otherwise, assume it's in storage folder
    return `${import.meta.env.VITE_STORAGE_URL || ''}/storage/${imagePath}`;
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const tableNumber = localStorage.getItem('tableNumber');
      if (token && tableNumber) {
        // Authenticated user: fetch cart from backend
        const response = await authCartApi.list();
        // Assume response.data is an array of cart items or a single cart object with items
        let items = [];
        if (Array.isArray(response.data)) {
          // If backend returns an array of cart items
          items = response.data;
        } else if (response.data && response.data.items) {
          // If backend returns a cart object with items array
          items = response.data.items;
        } else if (response.data) {
          // If backend returns a single cart item
          items = [response.data];
        }
        setCartItems(items || []);
        console.log(' Backend cart items:', items);
      } else {
        // Guest user: load from localStorage
        const savedCart = localStorage.getItem('cart');
        console.log('Raw localStorage cart:', savedCart);
        if (savedCart) {
          const cart = JSON.parse(savedCart);
          setCartItems(Array.isArray(cart) ? cart : []);
        } else {
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const tableNumber = localStorage.getItem('tableNumber');
    
    try {
      // Only use backend API if user has both token AND table number
      if (token && tableNumber) {
        // Authenticated user with table - update via API
        await authCartApi.updateItem(itemId, { quantity: newQuantity });
      } else {
        // Guest user or no table - update localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cart = JSON.parse(savedCart);
          const updatedCart = cart.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          );
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
      }
      
      // Update local state
      const updatedCart = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const tableNumber = localStorage.getItem('tableNumber');
    
    try {
      // Only use backend API if user has both token AND table number
      if (token && tableNumber) {
        // Authenticated user with table - remove via API
        await authCartApi.removeItem(itemId);
      } else {
        // Guest user or no table - remove from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cart = JSON.parse(savedCart);
          const updatedCart = cart.filter(item => item.id !== itemId);
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
      }
      
      // Update local state
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const calculateSubtotal = () => {
    console.log(' Calculating subtotal for items:', cartItems);
    return cartItems.reduce((total, item) => {
      // Access price from product if available
      const price = item.product?.price || item.price || 0;
      console.log(' Item:', item.name || item.product?.name, 'Price:', price, 'Quantity:', item.quantity);
      return total + (parseFloat(price) * item.quantity);
    }, 0).toFixed(2);
  };

  const calculateTotal = () => {
    // No tax, total is just subtotal
    return calculateSubtotal();
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Check for table number before checkout
    const tableNumber = localStorage.getItem('tableNumber');
    if (!tableNumber) {
      toast.error('Please enter your table number to proceed', {
        duration: 4000,
        icon: '🔢',
      });
      
      // Show modal to enter table number
      setShowTableModal(true);
      return;
    }
    
    // Navigate to payment page directly
    navigate('/payment');
  };

  const handleTableNumberSubmit = async (userTableNumber) => {
    setShowTableModal(false);
    
    if (!userTableNumber || !userTableNumber.trim()) {
      toast.error('Table number is required to proceed. Redirecting to home...', {
        duration: 3000,
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }
    
    // Save table number and proceed (skip verification if API not available)
    try {
      toast.loading('Verifying table number...', { id: 'verify-table' });
      
      // Try to verify, but don't fail if API not available
      try {
        const response = await tableApi.verify(userTableNumber);
        
        if (response.exists || response.data?.exists || response.valid) {
          localStorage.setItem('tableNumber', userTableNumber);
          setTableNumber(userTableNumber);
          toast.success(`Table ${userTableNumber} confirmed!`, { id: 'verify-table' });
          window.dispatchEvent(new Event('cartUpdated'));
          navigate('/payment');
        } else {
          toast.error(`Table ${userTableNumber} not found. Please check your table number.`, { id: 'verify-table', duration: 3000 });
        }
      } catch (apiError) {
        // If API fails, allow anyway (backend might not be ready)
        console.log('Table verification API not available, allowing table number:', apiError);
        localStorage.setItem('tableNumber', userTableNumber);
        setTableNumber(userTableNumber);
        toast.success(`Table ${userTableNumber} set!`, { id: 'verify-table' });
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/payment');
      }
    } catch (error) {
      console.error('Error in table number submission:', error);
      // Allow proceeding anyway
      localStorage.setItem('tableNumber', userTableNumber);
      setTableNumber(userTableNumber);
      toast.success(`Table ${userTableNumber} set!`);
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/payment');
    }
  };

  return (
    <div className="cart-page">
      <section className="cart-section">
        <div className="container">
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="cart-title">Shopping Cart </h1>
            {/* Show table number if present */}
            {(tableNumber || (cartItems.length > 0 && (cartItems[0].table_number || cartItems[0].table_id))) && (
              <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', color: '#555', marginRight: '0.5rem' }}>Table</span>
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '8px 14px', 
                  borderRadius: '12px', 
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                }}>
                  {tableNumber || cartItems[0]?.table_number?.table_number || cartItems[0]?.table_number || cartItems[0]?.table_id}
                </div>
              </div>
            )}
            {/* Show cart status */}
            {cartItems.length > 0 && cartItems[0].status && (
              <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.85rem', 
                  padding: '4px 12px', 
                  borderRadius: '12px',
                  background: cartItems[0].status === 'ordering' ? '#4CAF50' : '#FFC107',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {cartItems[0].status}
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
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
                {cartItems.map((item) => {
                  // Handle both backend API format (with product object) and localStorage format (flat)
                  const product = item.product || {};
                  const productName = product.name || item.name || 'Unknown Product';
                  const productPrice = product.price || item.price || 0;
                  // Use image_path from backend or localStorage
                  const imagePath = product.image_path || item.image_path || product.image || item.image;
                  const productImageUrl = getImageUrl(imagePath);
                  
                  console.log('Cart item:', item.id, 'Product:', productName, 'Image path:', imagePath, 'URL:', productImageUrl);
                  
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        {productImageUrl ? (
                          <img 
                            src={productImageUrl} 
                            alt={productName}
                            onError={(e) => {
                              console.error('Image failed to load:', productImageUrl);
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; color: #999; font-size: 0.85rem; padding: 0.5rem;">${productName}</div>`;
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: '#f0f0f0',
                            color: '#999',
                            fontSize: '0.85rem',
                            padding: '0.5rem'
                          }}>
                            {productName}
                          </div>
                        )}
                      </div>
                      
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{productName}</h3>
                        <p className="cart-item-price">${parseFloat(productPrice).toFixed(2)}</p>
                        {item.note && (
                          <p className="cart-item-note" style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                            Note: {item.note}
                          </p>
                        )}
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
                        ${(parseFloat(productPrice) * item.quantity).toFixed(2)}
                      </div>

                      <button 
                        className="remove-item-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="cart-summary">
                <h2 className="summary-title">Order Summary</h2>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal()}</span>
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
      
      {/* Table Number Modal */}
      <TableNumberModal 
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        onSubmit={handleTableNumberSubmit}
      />
    </div>
  );
};

export default Cart;
