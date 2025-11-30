import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { BarChart3, PieChart, LineChart, Activity, Filter } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const CombinedDashboardCharts = ({ dashboardData }) => {
  const [activeChart, setActiveChart] = useState('earnings');

  const chartOptions = [
    {
      id: 'earnings',
      label: 'Earnings Analysis',
      icon: <BarChart3 size={16} />,
      type: 'bar'
    },
    {
      id: 'orders',
      label: 'Orders Distribution',
      icon: <PieChart size={16} />,
      type: 'pie'
    },
    {
      id: 'products',
      label: 'Product Performance',
      icon: <Activity size={16} />,
      type: 'bar'
    },
    {
      id: 'financial',
      label: 'Financial Trends',
      icon: <LineChart size={16} />,
      type: 'line'
    }
  ];

  // Earnings Bar Chart Data
  const earningsChartData = {
    labels: ['Today', 'This Month', 'Total'],
    datasets: [
      {
        label: 'Earnings ($)',
        data: [
          dashboardData?.earnings?.today || 0,
          dashboardData?.earnings?.this_month || 0,
          dashboardData?.earnings?.total || 0,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Orders Pie Chart Data
  const ordersChartData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        label: 'Orders',
        data: [
          dashboardData?.orders?.completed || 0,
          dashboardData?.orders?.pending || 0,
          dashboardData?.orders?.cancelled || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  // Products Performance Chart Data
  const topProducts = (dashboardData?.top_products || []).slice(0, 5);
  const productsChartData = {
    labels: topProducts.map(product => product.name || 'Unknown'),
    datasets: [
      {
        label: 'Orders',
        data: topProducts.map(product => product.total_orders || 0),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        yAxisID: 'y',
      },
      {
        label: 'Revenue ($)',
        data: topProducts.map(product => product.total_revenue || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        yAxisID: 'y1',
      },
    ],
  };

  // Financial Trends Line Chart Data
  const financialChartData = {
    labels: ['Total Earnings', 'Monthly Earnings', 'Average Order', 'Total Refunds'],
    datasets: [
      {
        label: 'Financial Metrics ($)',
        data: [
          dashboardData?.earnings?.total || 0,
          dashboardData?.earnings?.this_month || 0,
          dashboardData?.financial?.average_order_value || 0,
          dashboardData?.financial?.total_refunds || 0,
        ],
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
  };

  const barChartOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  const productsChartOptions = {
    ...commonOptions,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
          maxRotation: 45,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
        title: {
          display: true,
          text: 'Orders Count',
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Revenue ($)',
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  const lineChartOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
          maxRotation: 45,
        },
      },
    },
  };

  const pieChartOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'earnings':
        return <Bar data={earningsChartData} options={barChartOptions} />;
      case 'orders':
        return <Doughnut data={ordersChartData} options={pieChartOptions} />;
      case 'products':
        if (topProducts.length === 0) {
          return (
            <div className="empty-chart-state">
              <Activity size={48} className="text-gray-400" />
              <p className="text-secondary mt-4">No product data available</p>
            </div>
          );
        }
        return <Bar data={productsChartData} options={productsChartOptions} />;
      case 'financial':
        return <Line data={financialChartData} options={lineChartOptions} />;
      default:
        return null;
    }
  };

  const getChartStats = () => {
    switch (activeChart) {
      case 'earnings':
        return [
          { label: 'Today', value: `$${(dashboardData?.earnings?.today || 0).toLocaleString()}`, color: 'text-blue-600' },
          { label: 'This Month', value: `$${(dashboardData?.earnings?.this_month || 0).toLocaleString()}`, color: 'text-emerald-600' },
          { label: 'Total', value: `$${(dashboardData?.earnings?.total || 0).toLocaleString()}`, color: 'text-amber-600' },
        ];
      case 'orders':
        return [
          { label: 'Completed', value: dashboardData?.orders?.completed || 0, color: 'text-green-600' },
          { label: 'Pending', value: dashboardData?.orders?.pending || 0, color: 'text-orange-600' },
          { label: 'Cancelled', value: dashboardData?.orders?.cancelled || 0, color: 'text-red-600' },
        ];
      case 'products':
        return topProducts.slice(0, 3).map((product, index) => ({
          label: product.name || 'Unknown',
          value: `${product.total_orders || 0} orders`,
          color: index === 0 ? 'text-purple-600' : index === 1 ? 'text-emerald-600' : 'text-blue-600'
        }));
      case 'financial':
        return [
          { label: 'Avg Order', value: `$${(dashboardData?.financial?.average_order_value || 0).toFixed(2)}`, color: 'text-indigo-600' },
          { label: 'Total Refunds', value: `$${(dashboardData?.financial?.total_refunds || 0).toLocaleString()}`, color: 'text-red-600' },
          { label: 'Total Orders', value: dashboardData?.orders?.total || 0, color: 'text-blue-600' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="combined-charts-container">
      {/* Chart Filter Tabs */}
      <div className="chart-filters">
        <div className="filter-header">
          <Filter size={16} />
          <span>Chart View</span>
        </div>
        <div className="filter-buttons">
          {chartOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveChart(option.id)}
              className={`filter-btn ${activeChart === option.id ? 'active' : ''}`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Display Area */}
      <div className="chart-display-area">
        <div className="chart-main">
          <div className="chart-container" style={{ height: '400px' }}>
            {renderChart()}
          </div>
        </div>

        {/* Chart Stats Sidebar */}
        <div className="chart-stats">
          <h4 className="stats-title">Key Metrics</h4>
          <div className="stats-list">
            {getChartStats().map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-label">{stat.label}</div>
                <div className={`stat-value ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>
          
          {/* Current Chart Info */}
          <div className="chart-info">
            <div className="chart-type-badge">
              {chartOptions.find(option => option.id === activeChart)?.icon}
              <span>{chartOptions.find(option => option.id === activeChart)?.type.toUpperCase()} CHART</span>
            </div>
            <p className="chart-description">
              {activeChart === 'earnings' && 'Compare earnings across different time periods'}
              {activeChart === 'orders' && 'View the distribution of order statuses'}
              {activeChart === 'products' && 'Analyze top performing products by orders and revenue'}
              {activeChart === 'financial' && 'Track key financial metrics and trends'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedDashboardCharts;