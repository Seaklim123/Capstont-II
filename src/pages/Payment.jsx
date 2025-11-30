import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { authOrdersApi } from '../services/api';

function Payment() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  const calculateTax = () => {
    return (parseFloat(calculateSubtotal()) * 0.1).toFixed(2);
  };

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + parseFloat(calculateTax())).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }

    try {
      setLoading(true);

      // Get table number from localStorage (if scanned QR code)
      const tableNumber = localStorage.getItem('tableNumber');

      const orderData = {
        customer_name: customerName,
        phone_number: phoneNumber,
        table_number: tableNumber || null,
        payment_method: paymentMethod,
        notes: notes,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: parseFloat(calculateSubtotal()),
        tax: parseFloat(calculateTax()),
        total: parseFloat(calculateTotal())
      };

      console.log('Placing order:', orderData);

      // Send order to backend
      const response = await authOrdersApi.create(orderData);
      
      console.log('Order response:', response);

      // Show success message
      alert(`Order placed successfully!\n\nOrder Number: ${response.data?.order_number || 'N/A'}\nTotal: $${calculateTotal()}\n\nThank you, ${customerName}!`);
      
      // Clear cart
      clearCart();
      
      // Navigate to home
      navigate('/');
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ 
        maxWidth: '650px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1.5rem' }}>
          <button 
            onClick={() => navigate('/cart')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '0.5rem 1.2rem',
              borderRadius: '25px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            ← Back to Cart
          </button>
          <h1 style={{ 
            fontSize: '2.2rem', 
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Checkout
          </h1>
          {localStorage.getItem('tableNumber') && (
            <div style={{ 
              display: 'inline-block',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              🍽️ Table {localStorage.getItem('tableNumber')}
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.3rem', 
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            👤 Customer Information
          </h2>
          
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.6rem',
              fontWeight: '600',
              fontSize: '0.95rem',
              color: '#555'
            }}>
              Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.6rem',
              fontWeight: '600',
              fontSize: '0.95rem',
              color: '#555'
            }}>
              Phone Number *
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.6rem',
              fontWeight: '600',
              fontSize: '0.95rem',
              color: '#555'
            }}>
              Special Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests? (e.g., no onions, extra spicy)"
              rows="3"
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                resize: 'vertical',
                transition: 'all 0.3s',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.3rem', 
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            💳 Payment Method
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.2rem',
              border: `3px solid ${paymentMethod === 'cash' ? '#667eea' : '#e0e0e0'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: paymentMethod === 'cash' ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : 'white',
              boxShadow: paymentMethod === 'cash' ? '0 4px 12px rgba(102, 126, 234, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
              transform: paymentMethod === 'cash' ? 'scale(1.02)' : 'scale(1)'
            }}>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ 
                  marginRight: '1rem', 
                  width: '22px', 
                  height: '22px',
                  accentColor: '#667eea',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                fontSize: '1.05rem', 
                fontWeight: '600',
                color: paymentMethod === 'cash' ? '#667eea' : '#555'
              }}>
                💵 Cash Payment
              </span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.2rem',
              border: `3px solid ${paymentMethod === 'card' ? '#667eea' : '#e0e0e0'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: paymentMethod === 'card' ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : 'white',
              boxShadow: paymentMethod === 'card' ? '0 4px 12px rgba(102, 126, 234, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
              transform: paymentMethod === 'card' ? 'scale(1.02)' : 'scale(1)'
            }}>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ 
                  marginRight: '1rem', 
                  width: '22px', 
                  height: '22px',
                  accentColor: '#667eea',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                fontSize: '1.05rem', 
                fontWeight: '600',
                color: paymentMethod === 'card' ? '#667eea' : '#555'
              }}>
                💳 Credit/Debit Card
              </span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.2rem',
              border: `3px solid ${paymentMethod === 'mobile' ? '#667eea' : '#e0e0e0'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: paymentMethod === 'mobile' ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : 'white',
              boxShadow: paymentMethod === 'mobile' ? '0 4px 12px rgba(102, 126, 234, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
              transform: paymentMethod === 'mobile' ? 'scale(1.02)' : 'scale(1)'
            }}>
              <input
                type="radio"
                value="mobile"
                checked={paymentMethod === 'mobile'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ 
                  marginRight: '1rem', 
                  width: '22px', 
                  height: '22px',
                  accentColor: '#667eea',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                fontSize: '1.05rem', 
                fontWeight: '600',
                color: paymentMethod === 'mobile' ? '#667eea' : '#555'
              }}>
                📱 Mobile Payment
              </span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ 
          marginBottom: '2rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          borderRadius: '16px',
          border: '2px solid rgba(102, 126, 234, 0.2)'
        }}>
          <h2 style={{ 
            fontSize: '1.3rem', 
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🛒 Order Summary
          </h2>
          
          <div style={{ marginBottom: '1.2rem' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '10px',
                fontSize: '0.95rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <span style={{ fontWeight: '500', color: '#333' }}>
                  {item.name} <span style={{ color: '#888', fontSize: '0.9rem' }}>×{item.quantity}</span>
                </span>
                <span style={{ fontWeight: '700', color: '#667eea', fontSize: '1.05rem' }}>
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ 
            borderTop: '2px solid rgba(102, 126, 234, 0.2)',
            paddingTop: '1.2rem',
            marginTop: '0.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.8rem',
              fontSize: '1rem',
              color: '#555'
            }}>
              <span style={{ fontWeight: '500' }}>Subtotal</span>
              <span style={{ fontWeight: '600' }}>${calculateSubtotal()}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              fontSize: '1rem',
              color: '#555'
            }}>
              <span style={{ fontWeight: '500' }}>Tax (10%)</span>
              <span style={{ fontWeight: '600' }}>${calculateTax()}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.4rem',
              fontWeight: '700',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              color: 'white'
            }}>
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1.3rem',
            background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: loading ? 'none' : '0 8px 20px rgba(102, 126, 234, 0.4)',
            transform: 'scale(1)',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 12px 28px rgba(102, 126, 234, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          {loading ? 'Placing Order...' : `Place Order - $${calculateTotal()}`}
        </button>
      </div>
    </div>
  );
}

export default Payment;
