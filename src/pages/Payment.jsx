import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { authOrdersApi, authCartApi } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/Payment.css';

function Payment() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableId, setTableId] = useState(null);
  
    useEffect(() => {
      // Get tableId from localStorage (set by QR code)
      const storedTableId = localStorage.getItem('tableId');
      if(storedTableId){
        setTableId(storedTableId);
      }
    },[]);

  // Load cart items on component mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await authCartApi.getCart(tableId);
        setCartItems(data);
      } catch (error) {
        console.error('Failed to load carts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [tableId]);

  // Debug effect to track cartItems changes and total calculation
  // useEffect(() => {
  //   console.log(' Cart Items Updated:', cartItems);
  //   console.log(' Cart Items Count:', cartItems.length);
  //   if (cartItems.length > 0) {
  //     console.log(' First item:', cartItems[0]);
  //     console.log(' Current Subtotal:', calculateSubtotal());
  //     console.log(' Current Total:', calculateTotal());
  //   } else {
  //     console.log(' Cart is empty!');
  //   }
  // }, [cartItems]);

  const calculateSubtotal = () => {
    if (cartItems.length === 0) {
      return '0.00';
    }
    
    const subtotal = cartItems.reduce((total, item) => {
      // Handle both API format (with product object) and localStorage format
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 0;
      const itemTotal = parseFloat(price) * quantity;
      
      // console.log(' Item:', item.name || item.product?.name, '| Price:', price, '| Qty:', quantity, '| Total:', itemTotal);
      
      return total + itemTotal;
    }, 0);
    
    return subtotal.toFixed(2);
  };

  // No tax
  const calculateTotal = () => {
    return calculateSubtotal();
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

    // Phone number is required
    if (!phoneNumber || phoneNumber.trim() === '') {
      setPhoneError(true);
      toast.error('Phone number is required');
      return;
    } else {
      setPhoneError(false);
      const phoneRegex = /^[0-9]{8,15}$/;
      if (!phoneRegex.test(phoneNumber.replace(/[\s-]/g, ''))) {
        setPhoneError(true);
        toast.error('Please enter a valid phone number (8-15 digits)');
        return;
      }
      setPhoneError(false);
    }

    try {
      setLoading(true);
      // const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      // const tableId = localStorage.getItem('tableId');

      // Only use backend API if user has both token AND tableId
      // if (token && tableId) {
      //   // AUTHENTICATED USER WITH TABLE - Full backend flow
      //   console.log('=== AUTHENTICATED ORDER FLOW (WITH TABLE) ===');

        // Step 1: Create order payload (match backend requirements)
        // Use cart item IDs for backend
        const orderPayload = {
          table_id: tableId,
          payment: 'cash',
          phone_number: phoneNumber ? String(phoneNumber) : '',
        };

        console.log('Step 1: Creating order information...', orderPayload);

        try {
          const response = await authOrdersApi.create(orderPayload);
          console.log('Order created successfully:', response);
          const createdOrderNumber = response.data?.numberOrder || response.data?.order_number || response.data?.id;
          toast.success(`Order #${createdOrderNumber} placed successfully!`);          
          // Clear local state
          setCartItems([]);
          navigate('/orders');
        } catch (apiError) {
          // Try to extract backend error message
          // let backendMsg = apiError?.message;
          // if (apiError?.response) {
          //   try {
          //     const text = await apiError.response.text();
          //     let data;
          //     try {
          //       data = JSON.parse(text);
          //     } catch (jsonErr) {
          //       data = text;
          //     }
          //     backendMsg = (data && data.message) ? data.message : backendMsg;
          //     console.error('Backend error response:', data);
          //   } catch (parseErr) {
          //     console.error('Error parsing backend error response:', parseErr);
          //   }
          // }
          console.error('API Error:', apiError);
          toast.error(`Failed to create order: ${backendMsg}`);
        }

      // } 
      // else {
      //   // GUEST USER OR NO TABLE - Send to backend AND save to localStorage
      //   console.log('=== GUEST ORDER FLOW ===');
      //   console.log(' Generating order number...');
        
      //   const orderNumber = Date.now();
      //   const totalPrice = parseFloat(calculateTotal());
        
      //   console.log('📝 Order Number:', orderNumber);
      //   console.log('📝 Total Price:', totalPrice);
        
      //   // Get table number from localStorage
      //   const tableNumber = localStorage.getItem('tableNumber');
        
      //   // Prepare order data for backend
      //   const orderData = {
      //     numberOrder: orderNumber,
      //     totalPrice: totalPrice,
      //     discount: 0,
      //     note: notes || null,
      //     phone_number: phoneNumber || '',
      //     payment: 'cash',
      //     status: 'starting',
      //     table_id: tableNumber ? parseInt(tableNumber, 10) : 1,
      //     items: cartItems.map(item => ({
      //       product_id: item.id,
      //       quantity: item.quantity,
      //       price: item.price
      //     }))
      //   };
        
      //   console.log(' Sending order to backend:', orderData);
        
      //   // Try to send to backend API
      //   try {
      //     const response = await authOrdersApi.create(orderData);
      //     console.log(' Order sent to backend successfully:', response);
      //   } catch (apiError) {
      //     console.error(' Backend API failed (order will be saved locally only):', apiError);
      //     // Continue anyway - save to localStorage as fallback
      //   }
        
      //   // Also store in localStorage for guest (backup/fallback)
      //   const guestOrder = {
      //     id: orderNumber,
      //     orderNumber: orderNumber,
      //     numberOrder: orderNumber,
      //     phoneNumber: phoneNumber || 'N/A',
      //     phone_number: phoneNumber || 'N/A',
      //     paymentMethod: 'cash',
      //     payment: 'cash',
      //     notes: notes || '',
      //     note: notes || '',
      //     items: cartItems,
      //     totalPrice: parseFloat(totalPrice) || 0,
      //     priceperorder: parseFloat(totalPrice) || 0,
      //     status: 'pending',
      //     createdAt: new Date().toISOString(),
      //     table_number: tableNumber || 'N/A'
      //   };
        
      //   console.log(' Saving to localStorage as backup:', guestOrder);
      //   console.log(' Order details check:');
      //   console.log('   - Order Number:', guestOrder.orderNumber);
      //   console.log('   - Phone:', guestOrder.phoneNumber);
      //   console.log('   - Total:', guestOrder.totalPrice);
      //   console.log('   - Items:', guestOrder.items.length);
        
      //   // Save to localStorage
      //   try {
      //     const existingOrders = localStorage.getItem('guestOrders');
      //     console.log(' Existing orders in localStorage:', existingOrders);
          
      //     const guestOrders = existingOrders ? JSON.parse(existingOrders) : [];
      //     console.log(' Parsed existing orders:', guestOrders);
      //     console.log(' Number of existing orders:', guestOrders.length);
          
      //     guestOrders.push(guestOrder);
      //     console.log(' Orders after adding new order:', guestOrders);
      //     console.log(' Total orders now:', guestOrders.length);
          
      //     const ordersString = JSON.stringify(guestOrders);
      //     localStorage.setItem('guestOrders', ordersString);
      //     console.log(' Saved to localStorage');
          
      //     // Verify it was saved
      //     const verifyOrders = localStorage.getItem('guestOrders');
      //     const parsedVerify = JSON.parse(verifyOrders);
      //     console.log(' Order saved to localStorage - Verification:', parsedVerify);
      //     console.log(' Total orders now:', parsedVerify.length);
      //     console.log(' Last order:', parsedVerify[parsedVerify.length - 1]);
      //   } catch (storageError) {
      //     console.error(' Error saving to localStorage:', storageError);
      //   }
        
      //   // Clear cart
      //   localStorage.removeItem('cart');
      //   setCartItems([]);
      //   window.dispatchEvent(new Event('cartUpdated'));
        
      //   console.log(' Cart cleared');
        
      //   toast.success(`Order #${orderNumber} placed successfully!`);
        
      //   console.log(' Navigating to orders page...');
        
      //   // Navigate to orders page
      //   setTimeout(() => {
      //     navigate('/orders');
      //   }, 1500);
      // }
      
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
        </div>
        <div className="order-summary-divider">
          {/* List all products and their prices - Enhanced UI */}
          {cartItems.length > 0 && (
            <div style={{
              marginBottom: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '14px',
              boxShadow: '0 2px 8px rgba(102,126,234,0.07)',
              padding: '1.2rem 1.2rem 0.7rem 1.2rem',
              border: '1.5px solid #e3e7f0'
            }}>
              <h4 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.13rem',
                fontWeight: 700,
                color: '#222',
                letterSpacing: '-0.5px'
              }}>Order Items</h4>
              {cartItems.map((item, idx) => {
                const product = item.product || {};
                const name = product.name || item.name || 'Product';
                const price = parseFloat(product.price || item.price || 0);
                const discount = parseFloat(product.discount || item.discount || 0);
                const quantity = item.quantity || 1;
                const finalPrice = discount > 0 ? price - discount : price;
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.55em 0',
                    borderBottom: idx < cartItems.length - 1 ? '1px solid #e3e7f0' : 'none',
                    fontSize: '1.04rem',
                    fontWeight: 500
                  }}>
                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: '#222', fontSize: '1.05em' }}>{name}</span>
                      <span style={{ color: '#888', fontSize: '0.97em', fontWeight: 400 }}>× {quantity}</span>
                    </span>
                    <span style={{ textAlign: 'right', minWidth: 80 }}>
                      {discount > 0 ? (
                        <>
                          <span style={{ textDecoration: 'line-through', color: '#bbb', marginRight: 7, fontSize: '0.98em' }}>${price.toFixed(2)}</span>
                          <span style={{ color: '#e53935', fontWeight: 700, fontSize: '1.08em' }}>${finalPrice.toFixed(2)}</span>
                          <span style={{ color: '#388e3c', fontSize: '0.97em', marginLeft: 7 }}>
                            -${discount.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: '#222', fontWeight: 600 }}>${price.toFixed(2)}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {/* <div className="summary-row">
            <span>Subtotal</span>
            <span>${calculateSubtotal()}</span>
          </div> */}
          <div className="summary-total">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="payment-section">
          {/* <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} style={{ verticalAlign: 'middle' }} /> Customer Information
          </h2> */}
          
          <div className="form-group">
            <label className="form-label">
              Phone Number <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/[^0-9]/g, '');
                setPhoneNumber(value);
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0252522"
              className="form-input"
            />
            {phoneError && (
              <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Phone number is required
              </div>
            )}
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
