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
    
    // Listen for cart updates (which might indicate a new order was placed)
    const handleCartUpdate = () => {
      console.log('🔄 Cart updated, reloading orders...');
      loadOrders();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      if (token) {
        // Authenticated user - fetch from API
        try {
          const response = await authOrdersApi.getAll();
          // Normalize: backend may return { data: [...] } or just [...]
          let ordersData = Array.isArray(response) ? response : (Array.isArray(response.data) ? response.data : response);
          setOrders(ordersData);
        } catch (apiError) {
          // Fallback to localStorage if API fails
          const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
          setOrders(guestOrders);
        }
      } else {
        // Guest user - load from localStorage
        const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
        setOrders(guestOrders);
      }
    } catch (error) {
      // Fallback to localStorage
      const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
      setOrders(guestOrders);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (activeFilter === 'all') return orders;
    if (activeFilter === 'starting') {
      // Include both 'starting' and 'pending' in Processing filter
      return orders.filter(order => order.status === 'starting' || order.status === 'pending');
    }
    if (activeFilter === 'cancel') {
      // Include both 'cancel' and 'cancelled' in Cancelled filter
      return orders.filter(order => order.status === 'cancel' || order.status === 'cancelled');
    }
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
                  <th>Price After Accept</th>
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
                    <td data-label="ID">{index + 1}</td>
                    <td data-label="Order Number" className="order-number-cell">
                      #{order.orderNumber || order.numberOrder || 'N/A'}
                    </td>
                    <td data-label="Total Price" className="price-cell">
                      ${Number(order.totalPrice ?? 0).toFixed(2)}
                    </td>
                    <td data-label="Price After Accept" className="discount-cell">
                      ${order.priceperorder || '0.00'}
                    </td>
                    <td data-label="Status">
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(order.status),
                          color: 'white',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          letterSpacing: '0.2px',
                          display: 'inline-block',
                          width: 'fit-content',
                          maxWidth: '85px'
                        }}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td data-label="Payment" className="payment-cell">
                      {order.paymentMethod || order.payment || 'Cash'}
                    </td>
                    <td data-label="Phone Number" className="phone-cell">
                      {order.phoneNumber || order.numberOrder || 'N/A'}
                    </td>
                    <td data-label="Items" className="items-cell">
                      {order.items && order.items.length > 0 ? (
                        <div className="items-summary">
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.85em', marginBottom: 2 }}>
                              {item.product_name || item.name || item.title || `Product ${item.product_id || ''}`} x{item.qty || item.quantity || 1}
                            </div>
                          ))}
                        </div>
                      ) : (
                        'No items'
                      )}
                    </td>
                    <td data-label="Actions" className="actions-cell">
                      <button 
                        className="view-btn"
                        onClick={() => navigate(`/order-confirmation?order=${order.orderNumber || order.numberOrder}`, {
                          state: {
                            orderNumber: order.orderNumber || order.numberOrder,
                            totalPrice: order.totalPrice,
                            payment: order.paymentMethod || order.payment || 'cash',
                            status: order.status || 'starting',
                            phone_number: order.phoneNumber || order.phone_number,
                            items: order.items || []
                          }
                        })}
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
