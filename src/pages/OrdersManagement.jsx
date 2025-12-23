import React, { useEffect, useState } from "react";
import ApiService from "../services/api";
import { Modal, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Package, Tag, Table, Clock, Check, X, Trash2 } from "lucide-react";
import "../styles/OrdersManagement-simple.css";

const OrdersManagement = () => {
  // Mark payment as done
  const handleMarkPaymentDone = async (orderId) => {
    try {
      // Call the new API endpoint
      await ApiService.request(`/v1/admin/orders/update_payment_status/${orderId}`, {
        method: 'PUT',
      });
      alert('Payment marked as done!');
      await loadOrders();
    } catch (error) {
      alert('Failed to mark payment as done');
      console.error(error);
    }
  };
// ...existing code...
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [openItemsModal, setOpenItemsModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ApiService.getOrder(); 
      setOrders(data); 
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshModalData = async () => {
    try {
      const updatedOrders = await ApiService.getOrder();
      // Find the current order being viewed in the modal
      if (selectedOrderItems && selectedOrderItems.length > 0) {
        const currentOrderId = selectedOrderItems[0]?.cart?.order_id;
        const updatedOrder = updatedOrders.find(order => order.id === currentOrderId);
        
        if (updatedOrder) {
          setSelectedOrderItems(updatedOrder.order_lists);
        }
      }
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error refreshing modal data:", error);
    }
  };

  const handleOpenItemsModal = (orderItems) => {
    setSelectedOrderItems(orderItems);
    setOpenItemsModal(true);
  };

  const handleCloseItemsModal = () => {
    setOpenItemsModal(false);
    setSelectedOrderItems([]);
  };

  const handleAcceptOrder = async (id) => {
    try {
      const res = await ApiService.acceptOrder(id);
      console.log("Order accepted:", res);

      alert("Order accepted successfully!");

      // Refresh the orders list immediately
      await loadOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order");
    }
  };
  const handleCancelOrder = async (id) => {
    try {
      const res = await ApiService.cencalOrder(id);
      console.log("Order Cancel:", res);

      alert("Order Cancel successfully!");

      // Refresh the orders list immediately
      await loadOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order");
    }
  };
  const handleCancelOrderList = async (id) => {
    // Optimistically remove the cancelled item from selectedOrderItems
    setSelectedOrderItems((prev) => prev.filter(item => item.id !== id));
    try {
      const res = await ApiService.cencalOrderList(id);
      console.log("OrderList Cancel:", res);

      alert("OrderList Cancel successfully!");

      // Refresh both the orders list and modal content immediately
      await refreshModalData();
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order");
    }
  };


  return (
    <div className="orders-management-container">
      <div className="page-header">
        <h1 className="page-title">Orders Management</h1>
        <p className="page-subtitle">Manage all current orders and update their status</p>
      </div>
      {/* <Button 
        onClick={() => navigate("/create-order")}
        className="create-order-btn"
        variant="contained"
      >
        Create New Order
      </Button> */}
      <div className="orders-table-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-shimmer"></div>
            <p className="loading-text">Loading orders...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order Number</th>
                  <th>Total Price ($)</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Payment Status</th>
                  <th>Price/Order</th>
                  <th>Phone Number</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
              {orders.length > 0 ? (
                orders.map((item) => (
                  <tr key={item.id}>
                    <td data-label="ID">{item.id}</td>
                    <td data-label="Order Number">{item.numberOrder}</td>
                    <td data-label="Total Price">${item.totalPrice}</td>
                    <td data-label="Discount">{item.discount}</td>
                    <td data-label="Status">
                    {item.status === "starting" ? (
                      <div className="status-buttons">
                        <Button
                          onClick={() => handleAcceptOrder(item.id)}
                          className="action-button accept-btn"
                          variant="contained"
                          size="small"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleCancelOrder(item.id)}
                          className="action-button cancel-btn"
                          variant="contained"
                          size="small"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <span className={`status-badge ${
                        item.status === 'accepted' ? 'accepted' :
                        item.status === 'cancel' ? 'cancelled' :
                        'starting'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                    <td data-label="Payment">{item.payment}</td>
                    <td data-label="Payment Status">
                      {item.payment_status === 'done' ? (
                        <span style={{ color: '#22c55e', fontWeight: 600 }}>Done</span>
                      ) : (
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          style={{ fontWeight: 600, borderRadius: 8, borderColor: '#22c55e', color: '#22c55e', padding: '2px 12px', minWidth: 0 }}
                          onClick={() => handleMarkPaymentDone(item.id)}
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </td>
                    <td data-label="Price/Order">{item.priceperorder.toFixed(2)}</td>
                    <td data-label="Phone">{item.phonenumber}</td>
                    <td data-label="Items">
                      <Button 
                        className="view-items-btn"
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenItemsModal(item.order_lists)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="no-orders">No orders found.</td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for viewing order items */}
      <Modal
        open={openItemsModal}
        onClose={handleCloseItemsModal}
        aria-labelledby="order-items-modal"
      >
        <Box className="modal-container"
          sx={{
            position: 'absolute',
            top: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '98vw', sm: '90vw', md: 600, lg: 600 },
            minWidth: { md: 350 },
            maxWidth: '99vw',
            height: 'auto',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: 'none',
            borderRadius: '20px',
            p: 0,
            boxShadow: '0 8px 40px 0 rgba(0,0,0,0.18)',
            justifyContent: 'flex-start',
            alignItems: 'center',
            transition: 'box-shadow 0.2s',
          }}
        >
          <div className="modal-header" style={{
            background: 'linear-gradient(90deg, #e0e7ef 0%, #f8fafc 100%)',
            borderBottom: '1px solid #e5e7eb',
            padding: '32px 32px 16px 32px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
          }}>
            {/* X Close Icon */}
            <button
              onClick={handleCloseItemsModal}
              style={{
                position: 'absolute',
                top: 18,
                right: 24,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                zIndex: 2,
                borderRadius: '50%',
                transition: 'background 0.15s',
              }}
              aria-label="Close"
              title="Close"
              onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <X size={26} color="#64748b" />
            </button>
            <div className="header-content">
              <div className="header-info">
                <h2 className="modal-title" style={{ fontWeight: 700, fontSize: '1.5rem', color: '#22223b', marginBottom: 4 }}>Order Items</h2>
                <p className="modal-subtitle" style={{ color: '#64748b', fontWeight: 500, fontSize: '1.1rem' }}>
                  {selectedOrderItems?.length || 0} item(s) • 
                  <span style={{ color: '#22c55e', fontWeight: 700 }}>
                    ${selectedOrderItems?.reduce((sum, item) => sum + (parseFloat(item.cart?.product?.price || 0) * (item.cart?.quantity || 0)), 0).toFixed(2)}
                  </span> total
                </p>
              </div>
            </div>
          </div>
          <div className="modal-content">
            {selectedOrderItems && selectedOrderItems.length > 0 ? (
              <div className="order-items-list">
                {selectedOrderItems.map((orderItem, index) => (
                  <div key={orderItem.id} className="order-item-card">
                    <div className="item-layout">
                      {/* Product Image - Centered */}
                      <div className="product-image-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                        {(orderItem.cart?.product?.image_url || orderItem.cart?.product?.image_path) ? (
                          <img 
                            src={orderItem.cart.product.image_url || 
                                 `http://localhost:8000/storage/${orderItem.cart.product.image_path}`}
                            alt={orderItem.cart.product.name || 'Product'}
                            className="product-image"
                            style={{ display: 'block', margin: '0 auto' }}
                            onError={(e) => {
                              console.log('Image failed to load:', e.target.src);
                              console.log('Product data:', orderItem.cart.product);
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => console.log('Image loaded successfully:', e.target.src)}
                          />
                        ) : null}
                        {!(orderItem.cart?.product?.image_url || orderItem.cart?.product?.image_path) && (
                          <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                            <svg className="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="product-info">
                        {/* Product Name */}
                        <h3 className="product-name">
                          {orderItem.cart?.product?.name || 'Unknown Product'}
                        </h3>
                        
                        {/* Item Details */}
                        <div className="item-details">
                          <span className="detail-badge item-id">
                            <Tag size={16} /> Item #{orderItem.id}
                          </span>
                          <span className="detail-badge table-num">
                            <Table size={16} /> Table {orderItem.cart?.table_number?.number || 'N/A'}
                          </span>
                          <span className="detail-badge table-id">
                            ID: {orderItem.cart?.table_id || 'N/A'}
                          </span>
                        </div>
                        
                        {orderItem.cart?.note && (
                          <div className="note-section">
                            <p className="note-label"><Package size={16} /> Special Note:</p>
                            <p className="note-text">{orderItem.cart.note}</p>
                          </div>
                        )}
                        
                        {/* Product Details Grid */}
                        <div className="product-details">
                          <div className="detail-item">
                            <span className="detail-label">Quantity</span>
                            <span className="detail-value">{orderItem.cart?.quantity || 0}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Unit Price</span>
                            <span className="detail-value price-highlight">${parseFloat(orderItem.cart?.product?.price || 0).toFixed(2)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Subtotal</span>
                            <span className="detail-value price-highlight">
                              ${(parseFloat(orderItem.cart?.product?.price || 0) * (orderItem.cart?.quantity || 0)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="item-actions">
                        <span className={`status-badge ${
                          orderItem.status === 'starting' ? 'starting' :
                          orderItem.status === 'accepted' ? 'accepted' :
                          orderItem.status === 'cancel' ? 'cancelled' :
                          'starting'
                        }`}>
                          {orderItem.status === 'starting' ? <><Clock size={16} /> Starting</> :
                           orderItem.status === 'accepted' ? <><Check size={16} /> Accepted</> :
                           orderItem.status === 'cancel' ? <><X size={16} /> Cancelled</> :
                           orderItem.status || 'Unknown'}
                        </span>
                        
                        {/* Disable Cancel if payment is done */}
                        {orderItem.status !== 'cancel' && orders.find(o => o.id === orderItem.cart?.order_id)?.payment_status !== 'done' && (
                          <Button
                            onClick={() => handleCancelOrderList(orderItem.id)}
                            className="cancel-item-btn"
                            variant="contained"
                            startIcon={<Trash2 size={16} />}
                            size="small"
                          >
                            Cancel
                          </Button>
                        )}
                        {/* If payment is done, show info instead of Cancel button */}
                        {orderItem.status !== 'cancel' && orders.find(o => o.id === orderItem.cart?.order_id)?.payment_status === 'done' && (
                          <span style={{color:'#64748b',fontWeight:500,fontSize:'0.95rem',marginLeft:8}}>Cannot cancel after payment</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H4" />
                  </svg>
                </div>
                <h3 className="empty-title">No Items Found</h3>
                <p className="empty-description">This order doesn't contain any items.</p>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <div className="footer-content">
              <div className="footer-summary">
                <span className="footer-items">{selectedOrderItems?.length || 0}</span> items • 
                <span className="footer-total">
                  ${selectedOrderItems?.reduce((sum, item) => sum + (parseFloat(item.cart?.product?.price || 0) * (item.cart?.quantity || 0)), 0).toFixed(2)}
                </span> total
              </div>
              <Button
                onClick={handleCloseItemsModal}
                className="close-btn"
                variant="contained"
                // startIcon={<Check size={16} />}
              >
                Done
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default OrdersManagement;
