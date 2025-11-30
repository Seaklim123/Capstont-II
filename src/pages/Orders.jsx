import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authOrdersApi } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/Orders.css';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // all, starting, accepted, cancel

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      if (token) {
        // Authenticated user - fetch from API
        // Note: You'll need to create this endpoint in backend
        // For now, using a placeholder
        // const response = await authOrdersApi.getAll();
        // setOrders(response.data || []);
        
        // Temporary: Show message that API is needed
        toast.info('Order history API endpoint needed');
        setOrders([]);
      } else {
        // Guest user - load from localStorage
        const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
        setOrders(guestOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      
      // Fallback to localStorage
      const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
      setOrders(guestOrders);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (activeFilter === 'all') return orders;
    return orders.filter(order => order.status === activeFilter);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'starting':
      case 'pending':
        return '#FFC107'; // Yellow
      case 'accepted':
        return '#4CAF50'; // Green
      case 'cancel':
      case 'cancelled':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'starting':
        return 'Processing';
      case 'accepted':
        return 'Accepted';
      case 'cancel':
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      default:
        return status || 'Unknown';
    }
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <button 
            className="back-btn" 
            onClick={() => navigate('/')}
          >
            ← Back
          </button>
          <h1>My Orders</h1>
          <p className="orders-subtitle">Track your order status</p>
        </div>

        {/* Filter Tabs */}
        <div className="order-filters">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({orders.length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'starting' ? 'active' : ''}`}
            onClick={() => setActiveFilter('starting')}
          >
            Processing ({orders.filter(o => o.status === 'starting' || o.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'accepted' ? 'active' : ''}`}
            onClick={() => setActiveFilter('accepted')}
          >
            Accepted ({orders.filter(o => o.status === 'accepted').length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'cancel' ? 'active' : ''}`}
            onClick={() => setActiveFilter('cancel')}
          >
            Cancelled ({orders.filter(o => o.status === 'cancel' || o.status === 'cancelled').length})
          </button>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {loading ? (
            <div className="orders-loading">
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="orders-empty">
              <div className="empty-icon">📦</div>
              <h2>No orders found</h2>
              <p>You haven't placed any orders yet</p>
              <button 
                className="start-shopping-btn"
                onClick={() => navigate('/menu')}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <div key={index} className="order-card">
                <div className="order-card-header">
                  <div className="order-number">
                    <span className="label">Order #</span>
                    <span className="number">{order.orderNumber || order.numberOrder || 'N/A'}</span>
                  </div>
                  <div 
                    className="order-status"
                    style={{ 
                      backgroundColor: getStatusColor(order.status),
                      color: 'white'
                    }}
                  >
                    {getStatusLabel(order.status)}
                  </div>
                </div>

                <div className="order-card-body">
                  {/* Customer Info */}
                  <div className="order-info">
                    <div className="info-row">
                      <span className="info-label">Customer:</span>
                      <span className="info-value">{order.customerName || order.customer_name || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">{order.phoneNumber || order.phone_number || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Location:</span>
                      <span className="info-value">{order.location || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Payment:</span>
                      <span className="info-value">{order.paymentMethod || order.payment || 'Cash'}</span>
                    </div>
                  </div>

                  {/* Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      <h4>Items:</h4>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <span>{item.product?.name || item.name || 'Unknown'}</span>
                          <span>×{item.quantity}</span>
                          <span>${((item.product?.price || item.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Total */}
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">${(order.totalPrice || 0).toFixed(2)}</span>
                  </div>

                  {/* Date */}
                  {order.createdAt && (
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="order-card-footer">
                  <button 
                    className="view-details-btn"
                    onClick={() => navigate(`/order-confirmation?order=${order.orderNumber || order.numberOrder}`)}
                  >
                    View Details
                  </button>
                  {(order.status === 'starting' || order.status === 'pending') && (
                    <button 
                      className="reorder-btn"
                      onClick={() => navigate('/menu')}
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
