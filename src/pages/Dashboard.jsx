import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import '../styles/Dashboard.css';
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

      // Fetch all dashboard data concurrently
      const [
        dashboardResponse,
        financialResponse,
        topProductsResponse,
        categoryPerformanceResponse,
        ordersResponse
      ] = await Promise.allSettled([
        api.getDashboardData(),
        api.getDashboardFinancialSummary(),
        api.getDashboardTopProducts(),
        api.getDashboardCategoryPerformance(),
        api.getDashboardOrders()
      ]);

      // Process main dashboard data
      const mainData = dashboardResponse.status === 'fulfilled' ? dashboardResponse.value : {
        earnings: { total: 0, today: 0, this_month: 0 },
        orders: { total: 0, today: 0, completed: 0, pending: 0, cancelled: 0 },
        top_products: [],
        financial: { total_refunds: 0, total_discounts: 0, average_order_value: 0 }
      };

      // Process financial summary
      const financialData = financialResponse.status === 'fulfilled' ? financialResponse.value : {
        total_earnings: 0,
        total_refunds: 0,
        total_discounts: 0,
        average_order_value: 0,
        net_earnings: 0
      };

      // Process top products
      const topProductsData = topProductsResponse.status === 'fulfilled' ? topProductsResponse.value : [];

      // Process category performance
      const categoryData = categoryPerformanceResponse.status === 'fulfilled' ? categoryPerformanceResponse.value : [];

      // Process orders data
      const ordersData = ordersResponse.status === 'fulfilled' ? ordersResponse.value : {
        total: 0,
        today: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
        average_value: 0
      };

      // Combine all data
      setDashboardData({
        ...mainData,
        financial: {
          ...mainData.financial,
          ...financialData
        },
        top_products: topProductsData,
        category_performance: categoryData,
        orders: {
          ...mainData.orders,
          ...ordersData
        }
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
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
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
      <div className="dashboard-container">
        <div className="dashboard-empty-state">
          <h3>No Data Available</h3>
          <p>No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
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
      </div>

      {/* Key Metrics Cards - Enhanced Design */}
      <div className="metrics-section mb-xl">
        <div className="section-header mb-lg">
          <h2 className="section-title">
            <BarChart3 size={24} />
            Key Performance Metrics
          </h2>
          {/* <p className="section-subtitle">Real-time insights into your restaurant's performance</p> */}
        </div>
        
        <div className="metrics-grid">
          {/* Today's Revenue */}
          <div className="metric-card-modern revenue">
            <div className="metric-card-content">
              <div className="metric-header-modern">
                <div className="metric-icon-wrapper revenue">
                  <DollarSign size={28} />
                </div>
                <div className="metric-badge today">
                  <span>Today</span>
                </div>
              </div>
              <div className="metric-details">
                <h3 className="metric-value-modern">
                  ${(dashboardData.earnings?.today || 0).toLocaleString()}
                </h3>
                <p className="metric-label-modern">Today's Revenue</p>
                <div className="metric-comparison">
                  <TrendingUp size={14} />
                  <span>vs yesterday</span>
                </div>
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="metric-card-modern orders">
            <div className="metric-card-content">
              <div className="metric-header-modern">
                <div className="metric-icon-wrapper orders">
                  <Calendar size={28} />
                </div>
                <div className="metric-badge month">
                  <span>This Month</span>
                </div>
              </div>
              <div className="metric-details">
                <h3 className="metric-value-modern">
                  ${(dashboardData.earnings?.this_month || 0).toLocaleString()}
                </h3>
                <p className="metric-label-modern">Monthly Revenue</p>
                <div className="metric-comparison">
                  <TrendingUp size={14} />
                  <span>vs last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="metric-card-modern customers">
            <div className="metric-card-content">
              <div className="metric-header-modern">
                <div className="metric-icon-wrapper customers">
                  <ShoppingBag size={28} />
                </div>
                <div className="metric-badge total">
                  <span>All Time</span>
                </div>
              </div>
              <div className="metric-details">
                <h3 className="metric-value-modern">
                  {(dashboardData.orders?.total || 0).toLocaleString()}
                </h3>
                <p className="metric-label-modern">Total Orders</p>
                <div className="metric-comparison">
                  <CheckCircle size={14} />
                  <span>{dashboardData.orders?.completed || 0} completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="metric-card-modern growth">
            <div className="metric-card-content">
              <div className="metric-header-modern">
                <div className="metric-icon-wrapper growth">
                  <Clock size={28} />
                </div>
                <div className="metric-badge pending">
                  <span>Active</span>
                </div>
              </div>
              <div className="metric-details">
                <h3 className="metric-value-modern">
                  {dashboardData.orders?.pending || 0}
                </h3>
                <p className="metric-label-modern">Pending Orders</p>
                <div className="metric-comparison">
                  <AlertCircle size={14} />
                  <span>needs attention</span>
                </div>
              </div>
            </div>
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
            <div className="card-actions">
              <span className="text-sm text-gray">Updated just now</span>
            </div>
          </div>
          <div className="card-content">
            <div className="stats-grid grid-3 gap-md">
              <div className="stat-item">
                <div className="stat-label">Total Earnings</div>
                <div className="stat-value text-success">${(dashboardData.financial?.total_earnings || dashboardData.earnings?.total || 0).toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Net Earnings</div>
                <div className="stat-value text-primary">${(dashboardData.financial?.net_earnings || 0).toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">This Month</div>
                <div className="stat-value text-info">${(dashboardData.earnings?.this_month || 0).toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{dashboardData.orders?.total || 0}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Average Order</div>
                <div className="stat-value text-secondary">${(dashboardData.financial?.average_order_value || dashboardData.orders?.average_value || 0).toFixed(2)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Completed Orders</div>
                <div className="stat-value text-success">{dashboardData.orders?.completed || 0}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Pending Orders</div>
                <div className="stat-value text-warning">{dashboardData.orders?.pending || 0}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Cancelled Orders</div>
                <div className="stat-value text-danger">{dashboardData.orders?.cancelled || 0}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Refunds</div>
                <div className="stat-value text-warning">${(dashboardData.financial?.total_refunds || 0).toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Discounts</div>
                <div className="stat-value text-info">${(dashboardData.financial?.total_discounts || 0).toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Today's Orders</div>
                <div className="stat-value text-primary">{dashboardData.orders?.today || 0}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Today's Revenue</div>
                <div className="stat-value text-success">${(dashboardData.earnings?.today || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="dashboard-content-section">
          <div className="content-section-header">
            <div>
              <h2 className="content-section-title">
                <PieChart size={20} />
                Top Products
              </h2>
              <p className="content-section-subtitle">Best performing products by revenue</p>
            </div>
          </div>
          <div className="card-content">
            <div className="products-list">
              {dashboardData.top_products && dashboardData.top_products.length > 0 ? (
                dashboardData.top_products.slice(0, 5).map((item, index) => (
                  <div key={item.id || index} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    {item.image_path ? (
                      <img 
                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${item.image_path}`}
                        alt={item.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="product-placeholder">
                        <PieChart size={16} />
                      </div>
                    )}
                    <div className="product-info">
                      <h4 className="product-name">{item.name || 'Unknown Product'}</h4>
                      <p className="product-category">{item.category_name || 'Beverages'}</p>
                      <p className="product-price">${parseFloat(item.price || 0).toFixed(2)}</p>
                    </div>
                    <div className="product-stats">
                      <div className="product-stats-row">
                        <span className="stat-label">Orders:</span>
                        <span className="stat-value orders">{item.total_orders || 0}</span>
                      </div>
                      <div className="product-stats-row">
                        <span className="stat-label">Qty:</span>
                        <span className="stat-value quantity">{item.total_quantity || 0}</span>
                      </div>
                      <div className="product-stats-row">
                        <span className="stat-label">Revenue:</span>
                        <span className="stat-value revenue">${parseFloat(item.total_revenue || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dashboard-empty-state">
                  <h3>No Products</h3>
                  <p>No product data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance Section */}
      {dashboardData.category_performance && dashboardData.category_performance.length > 0 && (
        <div className="dashboard-content-section">
          <div className="content-section-header">
            <div>
              <h2 className="content-section-title">
                <BarChart3 size={20} />
                Category Performance
              </h2>
              <p className="content-section-subtitle">{dashboardData.category_performance.length} categories performing</p>
            </div>
          </div>
          <div className="card-content">
            <div className="category-grid">
              {dashboardData.category_performance.map((category) => (
                <div key={category.id} className="category-card">
                  <h4 className="category-name">{category.name}</h4>
                  <div className="category-stats">
                    <div className="category-revenue">${parseFloat(category.total_revenue || 0).toFixed(2)}</div>
                    <div className="category-items">{category.total_items_sold} items sold</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Combined Interactive Charts Section */}
      <div className="dashboard-content-section">
        <div className="content-section-header">
          <div>
            <h2 className="content-section-title">Analytics Dashboard</h2>
            <p className="content-section-subtitle">
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