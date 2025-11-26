import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import '../styles/dashboard-charts.css';
import '../styles/combined-charts.css';
import CombinedDashboardCharts from '../components/charts/CombinedDashboardCharts';
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
  PieChart,
  RefreshCw,
  BarChart3,
  LineChart
} from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch main dashboard data
      const data = await api.getDashboardData();
      
      // Try to fetch additional data for a more complete dashboard
      let topProducts = [];
      try {
        topProducts = await api.getDashboardTopProducts();
      } catch (e) {
        console.warn('Could not fetch top products:', e);
      }

      setDashboardData({
        ...data,
        top_products: topProducts
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

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

  if (error) {
    return (
      <div className="p-xl">
        <div className="error-state">
          <AlertCircle size={48} className="text-danger mb-md" />
          <h2>Failed to Load Dashboard</h2>
          <p className="text-secondary mb-md">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => fetchDashboardData()}
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-xl">
        <div className="error-state">
          <p>No dashboard data available</p>
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
          <button 
            className={`btn btn-outline ${refreshing ? 'loading' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
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
              Today
            </div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">${(dashboardData.earnings?.today || 0).toLocaleString()}</h3>
            <p className="metric-label">Today's Earnings</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon bg-primary">
              <ShoppingBag size={20} />
            </div>
            <div className="metric-trend positive">
              <TrendingUp size={14} />
              Today
            </div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{dashboardData.orders?.today || 0}</h3>
            <p className="metric-label">Orders Today</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon bg-warning">
              <Clock size={20} />
            </div>
            <div className="metric-trend">
              <Clock size={14} />
              Pending
            </div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{dashboardData.orders?.pending || 0}</h3>
            <p className="metric-label">Pending Orders</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon bg-secondary">
              <CheckCircle size={20} />
            </div>
            <div className="metric-trend">
              Total
            </div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{dashboardData.orders?.completed || 0}</h3>
            <p className="metric-label">Completed Orders</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-3 gap-lg mb-xl">
        {/* Statistics Overview */}
        <div className="content-card col-span-2">
          <div className="card-header">
            <h2 className="card-title">
              <DollarSign size={20} />
              Financial Overview
            </h2>
          </div>
          <div className="card-content">
            <div className="stats-grid grid-3 gap-md">
              <div className="stat-item">
                <div className="stat-label">Total Earnings</div>
                <div className="stat-value text-success">${(dashboardData.earnings?.total || 0).toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">This Month</div>
                <div className="stat-value text-primary">${(dashboardData.earnings?.this_month || 0).toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Average Order</div>
                <div className="stat-value text-secondary">${(dashboardData.financial?.average_order_value || 0).toFixed(2)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{dashboardData.orders?.total || 0}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Cancelled Orders</div>
                <div className="stat-value text-danger">{dashboardData.orders?.cancelled || 0}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Refunds</div>
                <div className="stat-value text-warning">${(dashboardData.financial?.total_refunds || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">
              <PieChart size={20} />
              Top Products
            </h2>
          </div>
          <div className="card-content">
            <div className="popular-items">
              {dashboardData.top_products && dashboardData.top_products.length > 0 ? (
                dashboardData.top_products.slice(0, 5).map((item, index) => (
                  <div key={item.id || index} className="popular-item">
                    <div className="item-rank">#{index + 1}</div>
                    <div className="item-info">
                      <div className="item-name font-medium">{item.name || 'Unknown Product'}</div>
                      <div className="item-stats text-sm text-gray">
                        {item.total_orders || 0} orders • ${item.total_revenue || 0}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p className="text-secondary">No product data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Combined Interactive Charts Section */}
      <div className="mb-xl">
        <div className="page-section-header mb-lg">
          <div>
            <h2 className="section-title">Analytics Dashboard</h2>
            <p className="section-subtitle">
              Interactive charts and visualizations of your restaurant's key performance metrics
            </p>
          </div>
        </div>
        <CombinedDashboardCharts dashboardData={dashboardData} />
      </div>
    </div>
  );
};

export default Dashboard;