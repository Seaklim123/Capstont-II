const OrdersManagement = () => {
  return (
    <div className="orders-management">
      <div className="page-header">
        <h1 className="page-title">Orders Management</h1>
        <p className="page-subtitle">
          Manage all current orders and update their status
        </p>
      </div>
      
      <div className="content-section">
        <h2>Orders Management Content</h2>
        <p>This page will display all current orders with options to update status (New, Preparing, Served, Completed).</p>
      </div>
    </div>
  );
};

export default OrdersManagement;