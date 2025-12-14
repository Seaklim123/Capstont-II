import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authOrdersApi, authCartApi } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/Payment.css';

function Payment() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Load cart items on component mount
  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const tableNumber = localStorage.getItem('tableNumber');
      
      console.log('💰 Payment page - Loading cart...');
      console.log('💰 Token exists:', !!token);
      console.log('💰 Table number:', tableNumber);
      
      // Always try localStorage first for guest users
      const savedCart = localStorage.getItem('cart');
      console.log('💰 Loading cart from localStorage:', savedCart);
      
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        console.log('💰 Parsed cart items:', cart);
        console.log('💰 Number of items:', cart.length);
        setCartItems(cart);
      } else {
        console.log('💰 No cart found in localStorage');
        // If no localStorage cart and user is authenticated, try API
        if (token && tableNumber) {
          try {
            console.log('💰 Fetching from backend API as fallback...');
            const response = await authCartApi.getCart(tableNumber);
            const carts = response.data || response.cart || response;
            const cartArray = Array.isArray(carts) ? carts : [];
            console.log('💰 Loaded cart from API:', cartArray);
            setCartItems(cartArray);
          } catch (error) {
            console.error('❌ Error loading cart from API:', error);
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
    };
    
    loadCart();
  }, []);

  // Debug effect to track cartItems changes and total calculation
  useEffect(() => {
    console.log('💰💰💰 Cart Items Updated:', cartItems);
    console.log('💰💰💰 Cart Items Count:', cartItems.length);
    if (cartItems.length > 0) {
      console.log('💰💰💰 First item:', cartItems[0]);
      console.log('💰💰💰 Current Subtotal:', calculateSubtotal());
      console.log('💰💰💰 Current Tax:', calculateTax());
      console.log('💰💰💰 Current Total:', calculateTotal());
    } else {
      console.log('💰💰💰 Cart is empty!');
    }
  }, [cartItems]);

  const calculateSubtotal = () => {
    if (cartItems.length === 0) {
      return '0.00';
    }
    
    const subtotal = cartItems.reduce((total, item) => {
      // Handle both API format (with product object) and localStorage format
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 0;
      const itemTotal = parseFloat(price) * quantity;
      
      console.log('💰 Item:', item.name || item.product?.name, '| Price:', price, '| Qty:', quantity, '| Total:', itemTotal);
      
      return total + itemTotal;
    }, 0);
    
    return subtotal.toFixed(2);
  };

  const calculateTax = () => {
    return (parseFloat(calculateSubtotal()) * 0.1).toFixed(2);
  };

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + parseFloat(calculateTax())).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    console.log('🚀 Place Order clicked!');
    console.log('🚀 Phone Number:', phoneNumber);
    console.log('🚀 Cart Items:', cartItems);
    console.log('🚀 Cart Items Length:', cartItems.length);
    console.log('🚀 Total Price:', calculateTotal());
    console.log('🚀 Subtotal:', calculateSubtotal());

    if (cartItems.length === 0) {
      console.error('❌ Cart is empty!');
      toast.error('Your cart is empty. Please add items first.');
      navigate('/menu');
      return;
    }

    // Validate phone number (only if provided)
    if (phoneNumber && phoneNumber.trim() !== '') {
      const phoneRegex = /^[0-9]{8,15}$/;
      if (!phoneRegex.test(phoneNumber.replace(/[\s-]/g, ''))) {
        toast.error('Please enter a valid phone number (8-15 digits)');
        return;
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const tableNumber = localStorage.getItem('tableNumber');

      // Only use backend API if user has both token AND table number
      if (token && tableNumber) {
        // AUTHENTICATED USER WITH TABLE - Full backend flow
        console.log('=== AUTHENTICATED ORDER FLOW (WITH TABLE) ===');
        
        // Step 1: Update all cart items status from "starting" to "ordering"
        console.log('Step 1: Updating cart status to ordering...');
        for (const item of cartItems) {
          try {
            await authCartApi.updateItem(item.id, { status: 'ordering' });
            console.log(`Updated cart item ${item.id} to ordering`);
          } catch (error) {
            console.error('Error updating cart status:', error);
          }
        }

        // Step 2: Generate order number
        const orderNumber = Date.now();
        
        // Step 3: Calculate totals
        const subtotal = parseFloat(calculateSubtotal());
        const discount = 0;
        const totalPrice = parseFloat(calculateTotal());

        // Step 4: Create order_information entry
        const orderInformationData = {
          numberOrder: orderNumber,
          totalPrice: totalPrice,
          discount: discount,
          note: notes || null,
          refund: 0,
          phone_number: phoneNumber || '',
          status: 'starting', // starting, accepted, cancel
          payment: 'cash', // always cash
          payment_status: 'nondone', // done or nondone
          table_number: tableNumber || null,
          cart_items: cartItems.map(item => ({
            cart_id: item.id,
            product_id: item.product_id || item.id,
            quantity: item.quantity,
            price: item.product?.price || item.price || 0
          }))
        };

        console.log('Step 2: Creating order information...', orderInformationData);
        
        try {
          // Step 5: Create order via API
          const response = await authOrdersApi.create(orderInformationData);
          console.log('Order created successfully:', response);
          
          const createdOrderNumber = response.data?.numberOrder || response.data?.order_number || orderNumber;
          
          toast.success(`Order #${createdOrderNumber} placed successfully!`);
          // navigate(`/order-confirmation?order=${createdOrderNumber || order.numberOrder}`)
          // Step 6: Clear cart after successful order
          console.log('Step 3: Clearing cart...');
          for (const item of cartItems) {
            try {
              await authCartApi.removeItem(item.id);
              console.log(`Removed cart item ${item.id}`);
            } catch (err) {
              console.error('Error clearing cart item:', err);
            }
          }
          
          // Clear local state
          setCartItems([]);
          window.dispatchEvent(new Event('cartUpdated'));
          
          // Navigate to orders page
          setTimeout(() => {
            navigate('/orders');
          }, 1500);
        } catch (apiError) {
          console.error('API Error:', apiError);
          toast.error(`Failed to create order: ${apiError.message}`);
          throw apiError;
        }
        
      } else {
        // GUEST USER OR NO TABLE - Send to backend AND save to localStorage
        console.log('=== GUEST ORDER FLOW ===');
        console.log('📝 Generating order number...');
        
        const orderNumber = Date.now();
        const totalPrice = parseFloat(calculateTotal());
        
        console.log('📝 Order Number:', orderNumber);
        console.log('📝 Total Price:', totalPrice);
        
        // Get table number from localStorage
        const tableNumber = localStorage.getItem('tableNumber');
        
        // Prepare order data for backend
        const orderData = {
          numberOrder: orderNumber,
          totalPrice: totalPrice,
          discount: 0,
          note: notes || null,
          phone_number: phoneNumber || '',
          payment: 'cash',
          status: 'starting',
          table_id: tableNumber ? parseInt(tableNumber, 10) : 1,
          items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        };
        
        console.log('📤 Sending order to backend:', orderData);
        
        // Try to send to backend API
        try {
          const response = await authOrdersApi.create(orderData);
          console.log('✅ Order sent to backend successfully:', response);
        } catch (apiError) {
          console.error('⚠️ Backend API failed (order will be saved locally only):', apiError);
          // Continue anyway - save to localStorage as fallback
        }
        
        // Also store in localStorage for guest (backup/fallback)
        const guestOrder = {
          id: orderNumber,
          orderNumber: orderNumber,
          numberOrder: orderNumber,
          phoneNumber: phoneNumber || 'N/A',
          phone_number: phoneNumber || 'N/A',
          paymentMethod: 'cash',
          payment: 'cash',
          notes: notes || '',
          note: notes || '',
          items: cartItems,
          totalPrice: parseFloat(totalPrice) || 0,
          priceperorder: parseFloat(totalPrice) || 0,
          status: 'pending',
          createdAt: new Date().toISOString(),
          table_number: tableNumber || 'N/A'
        };
        
        console.log('📝 Saving to localStorage as backup:', guestOrder);
        console.log('📝 Order details check:');
        console.log('   - Order Number:', guestOrder.orderNumber);
        console.log('   - Phone:', guestOrder.phoneNumber);
        console.log('   - Total:', guestOrder.totalPrice);
        console.log('   - Items:', guestOrder.items.length);
        
        // Save to localStorage
        try {
          const existingOrders = localStorage.getItem('guestOrders');
          console.log('📝 Existing orders in localStorage:', existingOrders);
          
          const guestOrders = existingOrders ? JSON.parse(existingOrders) : [];
          console.log('📝 Parsed existing orders:', guestOrders);
          console.log('📝 Number of existing orders:', guestOrders.length);
          
          guestOrders.push(guestOrder);
          console.log('📝 Orders after adding new order:', guestOrders);
          console.log('📝 Total orders now:', guestOrders.length);
          
          const ordersString = JSON.stringify(guestOrders);
          localStorage.setItem('guestOrders', ordersString);
          console.log('✅ Saved to localStorage');
          
          // Verify it was saved
          const verifyOrders = localStorage.getItem('guestOrders');
          const parsedVerify = JSON.parse(verifyOrders);
          console.log('✅ Order saved to localStorage - Verification:', parsedVerify);
          console.log('✅ Total orders now:', parsedVerify.length);
          console.log('✅ Last order:', parsedVerify[parsedVerify.length - 1]);
        } catch (storageError) {
          console.error('❌ Error saving to localStorage:', storageError);
        }
        
        // Clear cart
        localStorage.removeItem('cart');
        setCartItems([]);
        window.dispatchEvent(new Event('cartUpdated'));
        
        console.log('✅ Cart cleared');
        
        toast.success(`Order #${orderNumber} placed successfully!`);
        
        console.log('🚀 Navigating to orders page...');
        
        // Navigate to orders page
        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        {/* Header */}
        <div className="payment-header">
          <button 
            onClick={() => navigate('/cart')}
            className="back-button"
          >
            ← Back to Cart
          </button>
          <h1 className="payment-title">
            Checkout
          </h1>
        </div>

        {/* Order Summary */}
        <div className="payment-section">
          <div className="order-summary">
            <h2 className="section-title">
              🛒 Order Summary
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              {cartItems.map(item => {
                const productName = item.product?.name || item.name || 'Unknown Product';
                const productPrice = item.product?.price || item.price || 0;
                
                return (
                  <div key={item.id} className="order-item">
                    <span className="order-item-name">
                      {productName} <span className="order-item-quantity">×{item.quantity}</span>
                    </span>
                    <span className="order-item-price">
                      ${(parseFloat(productPrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="order-summary-divider">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%)</span>
                <span>${calculateTax()}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="payment-section">
          <h2 className="section-title">
            👤 Customer Information
          </h2>
          
          <div className="form-group">
            <label className="form-label">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0252522"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Special Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests?"
              rows="3"
              className="form-textarea"
            />
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="place-order-button"
        >
          {loading ? 'Placing Order...' : `Place Order - $${calculateTotal()}`}
        </button>
      </div>
    </div>
  );
}

export default Payment;
