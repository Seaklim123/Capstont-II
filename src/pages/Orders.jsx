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

        {/* Orders Table */}
        <div className="orders-table-container">
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
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order Number</th>
                  <th>Total Price ($)</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Phone Number</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="order-number-cell">
                      #{order.orderNumber || order.numberOrder || 'N/A'}
                    </td>
                    <td className="price-cell">
                      ${(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td className="discount-cell">
                      {order.discount ? `${order.discount}%` : '0%'}
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(order.status),
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="payment-cell">
                      {order.paymentMethod || order.payment || 'Cash'}
                    </td>
                    <td className="phone-cell">
                      {order.phoneNumber || order.phone_number || 'N/A'}
                    </td>
                    <td className="items-cell">
                      {order.items && order.items.length > 0 ? (
                        <div className="items-summary">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                      ) : (
                        'No items'
                      )}
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="view-btn"
                        onClick={() => navigate(`/order-confirmation?order=${order.orderNumber || order.numberOrder}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
