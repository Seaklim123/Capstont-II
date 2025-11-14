// src/pages/OrdersManagement.jsx
import React, { useEffect, useState } from "react";
import ApiService from "../services/api";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ApiService.getOrder(); // returns data.data
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-management p-6">
      <div className="page-header mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Orders Management
        </h1>
        <p className="text-gray-500">
          Manage all current orders and update their status
        </p>
      </div>

      <div className="content-section mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Orders Management Content
        </h2>
        <p className="text-gray-600">
          This page displays all current orders, with details and actions.
        </p>
      </div>

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
                <th className="px-4 py-3">View</th>
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
                    <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3">{item.payment}</td>
                    <td className="px-4 py-3">{item.refund}</td>
                    <td className="px-4 py-3">{item.priceperorder}</td>
                    <td className="px-4 py-3">{item.phonenumber}</td>
                    <td className="px-4 py-3">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() => setSelectedOrder(item)}
                      >
                        View Order
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersManagement;

/* -------------------------------------------------------
   ORDER MODAL COMPONENT
-------------------------------------------------------- */
const OrderModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Order Details (ID: {order.id})
        </h2>

        {/* Main Order Info */}
        <div className="space-y-2 text-gray-700">
          <p><strong>Order Number:</strong> {order.numberOrder}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice}</p>
          <p><strong>Discount:</strong> {order.discount}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment:</strong> {order.payment}</p>
          <p><strong>Refund:</strong> {order.refund}</p>
          <p><strong>Phone:</strong> {order.phonenumber}</p>
        </div>

        {/* Ordered Items */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Ordered Items</h3>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {order.order_lists.map((item) => (
            <div
              key={item.id}
              className="p-3 border rounded-lg bg-gray-50 shadow-sm"
            >
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Quantity:</strong> {item.cart.quantity}</p>
              <p><strong>Product:</strong> {item.cart.product.name}</p>
              <p><strong>Price:</strong> ${item.cart.product.price}</p>
              <p><strong>Note:</strong> {item.cart.note}</p>
              <p><strong>Table Number:</strong> {item.cart.table_number.number}</p>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
