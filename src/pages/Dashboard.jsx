import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  PieChart
} from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Mock dashboard data
  const mockDashboardData = {
    // Key metrics
    stats: {
      todayRevenue: 2847.50,
      todayOrders: 67,
      activeCustomers: 23,
      availableTables: 8,
      totalTables: 15,
      pendingOrders: 5
    },
    


    // Recent orders
    recentOrders: [
      {
        id: 'ORD-001',
        table: 'Table 5',
        items: ['Burger Deluxe', 'Fries', 'Coke'],
        total: 28.50,
        status: 'preparing',
        time: '2 mins ago'
      },
      {
        id: 'ORD-002',
        table: 'Table 12',
        items: ['Pizza ', 'Salad'],
        total: 35.00,
        status: 'ready',
        time: '5 mins ago'
      },
      {
        id: 'ORD-003',
        table: 'Table 3',
        items: ['Pasta ', 'Wine'],
        total: 45.00,
        status: 'delivered',
        time: '8 mins ago'
      },
      {
        id: 'ORD-004',
        table: 'Table 8',
        items: ['Steak', , 'Beer'],
        total: 65.00,
        status: 'preparing',
        time: '12 mins ago'
      }
    ],

    // Popular items today
    popularItems: [
      { name: 'Burger ', orders: 12, revenue: 180 },
      { name: 'Pizza ', orders: 8, revenue: 200 },
      { name: 'Pasta ', orders: 6, revenue: 150 },
      { name: 'Salad', orders: 5, revenue: 75 }
    ],



    // Alerts
    alerts: [
      {
        id: 1,
        type: 'warning',
        message: 'Table 7 has been occupied for over 2 hours',
        time: '10 mins ago'
      },
      {
        id: 2,
        type: 'info',
        message: 'New reservation for 6 people at 7:30 PM',
        time: '15 mins ago'
      },
    
    ]
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      preparing: 'status-warning',
      ready: 'status-success',
      delivered: 'status-secondary',
      cancelled: 'status-danger'
    };
    return colors[status] || 'status-secondary';
  };

  const getAlertIcon = (type) => {
    const icons = {
      warning: <AlertCircle size={16} className="text-warning" />,
      error: <XCircle size={16} className="text-danger" />,
      info: <CheckCircle size={16} className="text-info" />,
      success: <CheckCircle size={16} className="text-success" />
    };
    return icons[type] || <AlertCircle size={16} />;
  };

  if (loading) {
    return (
      <div className="p-xl">
        <div className="loading-state">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-xl">
      {/* Page Header */}
      <div className="page-header mb-xl">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-sm">Dashboard</h1>
          <p className="text-secondary">
            Overview of your restaurant's performance and current operations
          </p>
        </div>
        <div className="flex gap-md">
          <div className="flex items-center gap-xs text-sm text-gray">
            <Calendar size={16} />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-4 gap-lg mb-xl">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon bg-success">
              <DollarSign size={20} />
            </div>
            <div className="metric-trend positive">
              <TrendingUp size={14} />
              +12.5%
            </div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">${dashboardData.stats.todayRevenue.toLocaleString()}</h3>
            <p className="metric-label">Today's Revenue</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon bg-primary">
              <ShoppingBag size={20} />
            </div>
            <div className="metric-trend positive">
              <TrendingUp size={14} />
              +8.2%
            </div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{dashboardData.stats.todayOrders}</h3>
            <p className="metric-label">Orders Today</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon bg-warning">
              <Users size={20} />
            </div>
            <div className="metric-trend">
              <Clock size={14} />
              Live
            </div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{dashboardData.stats.activeCustomers}</h3>
            <p className="metric-label">Active Customers</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon bg-secondary">
              <MapPin size={20} />
            </div>
            <div className="metric-trend">
              {dashboardData.stats.availableTables}/{dashboardData.stats.totalTables}
            </div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{dashboardData.stats.availableTables}</h3>
            <p className="metric-label">Available Tables</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-3 gap-lg">
        {/* Recent Orders */}
        <div className="content-card col-span-2">
          <div className="card-header">
            <h2 className="card-title">
              <ShoppingBag size={20} />
              Recent Orders
            </h2>
            <span className="badge badge-info">{dashboardData.stats.pendingOrders} pending</span>
          </div>
          <div className="card-content">
            <div className="orders-list">
              {dashboardData.recentOrders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <div className="order-header">
                      <span className="order-id font-medium">{order.id}</span>
                      <span className="order-table text-sm text-gray">{order.table}</span>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-items">
                      {order.items.join(', ')}
                    </div>
                    <div className="order-footer">
                      <span className="order-total font-medium">${order.total}</span>
                      <span className="order-time text-sm text-gray">{order.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Items */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">
              <PieChart size={20} />
              Popular Today
            </h2>
          </div>
          <div className="card-content">
            <div className="popular-items">
              {dashboardData.popularItems.map((item, index) => (
                <div key={item.name} className="popular-item">
                  <div className="item-rank">#{index + 1}</div>
                  <div className="item-info">
                    <div className="item-name font-medium">{item.name}</div>
                    <div className="item-stats text-sm text-gray">
                      {item.orders} orders • ${item.revenue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">
              <AlertCircle size={20} />
              Alerts
            </h2>
          </div>
          <div className="card-content">
            <div className="alerts-list">
              {dashboardData.alerts.map(alert => (
                <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                  <div className="alert-icon">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="alert-content">
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-time text-xs text-gray">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;