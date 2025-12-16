import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { authOrdersApi } from '../services/api';
import '../styles/OrderConfirmation.css';

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber) {
        setLoading(false);
        return;
      }

      // First, check if order data was passed via navigation state
      if (location.state) {
        console.log('✅ Using order data from navigation state:', location.state);
        setOrderDetails(location.state);
        setLoading(false);
        return;
      }

      // Otherwise, try to fetch from backend API
      try {
        console.log('🔍 Fetching order from API:', orderNumber);
        const response = await authOrdersApi.findByNumber(orderNumber);
        console.log(' Order fetched from API:', response.data);
        setOrderDetails(response.data);
      } catch (error) {
        console.error(' Error fetching order from API:', error);
        
        // Fallback: check localStorage for guest orders
        try {
          const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
          const order = guestOrders.find(o => o.orderNumber == orderNumber);
          if (order) {
            console.log(' Found order in localStorage:', order);
            setOrderDetails({
              orderNumber: order.orderNumber,
              totalPrice: order.totalPrice,
              payment: order.paymentMethod,
              status: order.status || 'starting',
              phone_number: order.phoneNumber,
              customer_name: order.customerName
            });
          } else {
            console.log(' Order not found in localStorage');
          }
        } catch (localError) {
          console.error(' Error reading from localStorage:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber, location.state]);

  return (
    <div className="order-confirmation-container">
      <div className="order-confirmation-card">
        {/* Success Icon */}
        <div className="success-icon">
          ✓
        </div>

        {/* Title */}
        <h1 className="order-confirmation-title">
          Order Placed Successfully!
        </h1>

        {/* Order Number */}
        {orderNumber && (
          <div style={{
            background: '#f0f4ff',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '2px solid #667eea'
          }}>
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#666', 
              margin: '0 0 0.5rem 0',
              fontWeight: '500'
            }}>
              Order Number
            </p>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: '#667eea',
              margin: 0,
              fontFamily: 'monospace'
            }}>
              #{orderNumber}
            </p>
          </div>
        )}

        {/* Status Info */}
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#856404'
          }}>
            <strong>Status:</strong> Your order is being processed
          </p>
        </div>

        {/* Customer Information */}
        {(orderDetails?.phone_number || orderDetails?.special_notes) && (
          <div style={{
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#333'
            }}>
              Customer Information
            </h3>
            
            {orderDetails.phone_number && (
              <div style={{ marginBottom: orderDetails.special_notes ? '0.75rem' : '0' }}>
                <span style={{ 
                  fontSize: '0.85rem', 
                  color: '#666',
                  fontWeight: '500'
                }}>Phone Number:</span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: '#333',
                  marginLeft: '0.5rem',
                  fontWeight: '600'
                }}>
                  {orderDetails.phone_number}
                </span>
              </div>
            )}
            
            {orderDetails.special_notes && (
              <div>
                <span style={{ 
                  fontSize: '0.85rem', 
                  color: '#666',
                  fontWeight: '500',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}>Special Notes:</span>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#333',
                  background: '#fff',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  fontStyle: 'italic'
                }}>
                  {orderDetails.special_notes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Details */}
        {loading ? (
          <p className="loading-spinner">Loading order details...</p>
        ) : orderDetails ? (
          <div className="order-details-section">
            <h3 className="order-details-title">Order Details</h3>
            
            {/* Order Items */}
            {orderDetails.items && orderDetails.items.length > 0 && (
              <div style={{
                marginBottom: '1.5rem',
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#333'
                }}>Items Ordered:</h4>
                {orderDetails.items.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: index < orderDetails.items.length - 1 ? '1px solid #dee2e6' : 'none'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.25rem' }}>
                        {item.name || item.product?.name || item.product_name || 'Product'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Qty: {item.quantity} × ${parseFloat(item.price || item.product?.price || 0).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: '700', color: '#667eea' }}>
                      ${(parseFloat(item.price || item.product?.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="order-detail-row">
              <span className="order-detail-label">Total:</span>
              <span className="order-detail-value">${parseFloat(orderDetails.totalPrice || 0).toFixed(2)}</span>
            </div>
            <div className="order-detail-row">
              <span className="order-detail-label">Payment:</span>
              <span className="order-detail-value">{orderDetails.payment || 'cash'}</span>
            </div>
            <div className="order-detail-row">
              <span className="order-detail-label">Status:</span>
              <span className={`order-status-badge status-${orderDetails.status?.toLowerCase() || 'starting'}`}>
                {orderDetails.status?.toUpperCase() || 'STARTING'}
              </span>
            </div>
          </div>
        ) : null}

        {/* Thank You Message */}
        <p style={{ 
          fontSize: '0.95rem', 
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          Thank you for your order! We'll prepare your food shortly.
          {orderDetails?.phone_number && (
            <span> We'll contact you at <strong>{orderDetails.phone_number}</strong> if needed.</span>
          )}
        </p>

        {/* Action Buttons */}
        <div className="order-action-buttons">
          <button
            onClick={() => navigate('/')}
            className="btn-track-order"
          >
            Back to Home
          </button>
          
          <button
            onClick={() => navigate('/menu')}
            className="btn-back-home"
          >
            Order More
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
