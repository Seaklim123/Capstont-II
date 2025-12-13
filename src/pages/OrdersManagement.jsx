// src/pages/OrdersManagement.jsx
import React, { useEffect, useState } from "react";
import ApiService from "../services/api";
import { Modal, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Package, Tag, Table, Clock, Check, X, Trash2 } from "lucide-react";
import "../styles/OrdersManagement-simple.css";

const OrdersManagement = () => {
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
      <Button 
        onClick={() => navigate("/create-order")}
        className="create-order-btn"
        variant="contained"
      >
        Create New Order
      </Button>
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
                  <th>Refund</th>
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
                    <td data-label="Refund">{item.refund}</td>
                    <td data-label="Price/Order">{item.priceperorder}</td>
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
                    <td colSpan="10" className="no-orders">No orders found.</td>
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
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '92vw', sm: '85vw', md: '75vw', lg: 800 },
            maxWidth: '92vw',
            height: '85vh',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.paper',
            border: 'none',
            borderRadius: '12px',
            p: 0,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          <div className="modal-header">
            <div className="header-content">
              <div className="header-info">
                <h2 className="modal-title">Order Items</h2>
                <p className="modal-subtitle">
                  {selectedOrderItems?.length || 0} item(s) • 
                  ${selectedOrderItems?.reduce((sum, item) => sum + (parseFloat(item.cart?.product?.price || 0) * (item.cart?.quantity || 0)), 0).toFixed(2)} total
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
                      {/* Product Image */}
                      <div className="product-image-container">
                        {(orderItem.cart?.product?.image_url || orderItem.cart?.product?.image_path) ? (
                          <img 
                            src={orderItem.cart.product.image_url || 
                                 `http://localhost:8000/storage/${orderItem.cart.product.image_path}`}
                            alt={orderItem.cart.product.name || 'Product'}
                            className="product-image"
                            onError={(e) => {
                              console.log('Image failed to load:', e.target.src);
                              console.log('Product data:', orderItem.cart.product);
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => console.log('Image loaded successfully:', e.target.src)}
                          />
                        ) : (
                          console.log('No image found, product data:', orderItem.cart?.product)
                        )}
                        <div 
                          className="no-image-placeholder" 
                          style={{ display: (orderItem.cart?.product?.image_url || orderItem.cart?.product?.image_path) ? 'none' : 'flex' }}
                        >
                          <svg className="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
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
                        
                        {orderItem.status !== 'cancel' && (
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
