// src/pages/OrdersManagement.jsx
import React, { useEffect, useState } from "react";
import ApiService from "../services/api";
import { Modal, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

      // Refresh the orders list
      await loadOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order");
    }
  };
  const handleCancelOrder = async (id) => {
    try {
      const res = await ApiService.cencalOrder(id);
      console.log("Order Cencel:", res);

      alert("Order Cencel successfully!");

      // Refresh the orders list
      await loadOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order");
    }
  };
  const handleCancelOrderList = async (id) => {
    try {
      const res = await ApiService.cencalOrderList(id);
      console.log("OrderList Cencel:", res);

      alert("OrderList Cencel successfully!");

      // Refresh the orders list
      await loadOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order");
    }
  };


  return (
    <div className="orders-management p-6">
      <div className="page-header mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Orders Management</h1>
        <p className="text-gray-500">Manage all current orders and update their status</p>
      </div>
      <Button onClick={() => navigate("/create-order")}>
        Create Order
      </Button>
      <div className="overflow-x-auto rounded-xl shadow-sm">
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : (
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Order Number</th>
                <th className="px-4 py-3">Total Price ($)</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Refund</th>
                <th className="px-4 py-3">Price/Order</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Items</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
            {orders.length > 0 ? (
              orders.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.numberOrder}</td>
                  <td className="px-4 py-3">${item.totalPrice}</td>
                  <td className="px-4 py-3">{item.discount}</td>
                  <td className="px-4 py-3">
                  {item.status === "starting" ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAcceptOrder(item.id)}
                        sx={{
                          bgcolor: "green",
                          color: "white",
                          "&:hover": {
                            bgcolor: "darkgreen",
                          },
                        }}
                      >
                        Accept Order
                      </Button>
                      <Button
                        onClick={() => handleCancelOrder(item.id)}
                        sx={{
                          bgcolor: "red",
                          color: "white",
                          "&:hover": {
                            bgcolor: "darkgreen",
                          },
                        }}
                      >
                        Cancel Order
                      </Button>
                      
                    </div>
                  ) : (
                    item.status
                  )}
                </td>
                  <td className="px-4 py-3">{item.payment}</td>
                  <td className="px-4 py-3">{item.refund}</td>
                  <td className="px-4 py-3">{item.priceperorder}</td>
                  <td className="px-4 py-3">{item.phonenumber}</td>
                  <td className="px-4 py-3">
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleOpenItemsModal(item.order_lists)}
                    >
                      View Items
                    </Button>
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for viewing order items */}
      <Modal
        open={openItemsModal}
        onClose={handleCloseItemsModal}
        aria-labelledby="order-items-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 id="order-items-modal" className="text-xl font-semibold mb-4">
            Order Items
          </h2>
          <div className="space-y-3">
           
            {selectedOrderItems && selectedOrderItems.length > 0 ? (
              selectedOrderItems.map((orderItem) => (
                <div
                  key={orderItem.id}
                  className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Product:</p>
                      <p className="text-base text-gray-800">
                        {orderItem.cart?.product?.name || 'N/A'} {orderItem.id}
                      </p>

                      <Button
                        onClick={() => handleCancelOrderList(orderItem.id)}
                        sx={{
                          bgcolor: "red",
                          color: "white",
                          "&:hover": {
                            bgcolor: "darkgreen",
                          },
                        }}
                      >
                        Cancel Order
                      </Button>
                      
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Quantity:</p>
                      <p className="text-base text-gray-800">
                        {orderItem.cart?.quantity || 0}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-gray-600">Status:</p>
                      <p className="text-base text-gray-800">
                        <span className={`px-2 py-1 rounded text-black text-xs font-semibold ${
                          orderItem.status === 'starting' ? 'bg-green-500' :
                          orderItem.status === 'accepted' ? 'bg-yellow-500' :
                          orderItem.status === 'cancel' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}>
                          {orderItem.status || 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No items in this order.</p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              variant="contained"
              onClick={handleCloseItemsModal}
              sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
            >
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default OrdersManagement;
