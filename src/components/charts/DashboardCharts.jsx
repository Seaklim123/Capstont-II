import React from 'react';
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
import { Bar, Pie, Line } from 'react-chartjs-2';

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

// Earnings Bar Chart
export const EarningsBarChart = ({ earningsData, className = '' }) => {
  const data = {
    labels: ['Today', 'This Month', 'Total'],
    datasets: [
      {
        label: 'Earnings ($)',
        data: [
          earningsData?.today || 0,
          earningsData?.this_month || 0,
          earningsData?.total || 0,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
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
      title: {
        display: true,
        text: 'Earnings Overview',
        font: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif",
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
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

  return (
    <div className={`chart-container ${className}`} style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

// Orders Status Pie Chart
export const OrdersStatusPieChart = ({ ordersData, className = '' }) => {
  const data = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        label: 'Orders',
        data: [
          ordersData?.completed || 0,
          ordersData?.pending || 0,
          ordersData?.cancelled || 0,
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
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: 'Orders Status Distribution',
        font: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif",
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
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

  return (
    <div className={`chart-container ${className}`} style={{ height: '300px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

// Top Products Bar Chart
export const TopProductsBarChart = ({ productsData, className = '' }) => {
  const topProducts = (productsData || []).slice(0, 5);
  
  const data = {
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
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
      title: {
        display: true,
        text: 'Top Products Performance',
        font: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif",
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
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

  if (topProducts.length === 0) {
    return (
      <div className={`chart-container ${className}`} style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-secondary">No product data available</p>
      </div>
    );
  }

  return (
    <div className={`chart-container ${className}`} style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

// Financial Summary Line Chart (could be used for trends over time)
export const FinancialTrendsLineChart = ({ financialData, earningsData, className = '' }) => {
  // For now, this will show basic financial metrics
  // In the future, you could fetch time-series data from the earnings/chart endpoint
  const data = {
    labels: ['Total Earnings', 'Monthly Earnings', 'Average Order', 'Total Refunds'],
    datasets: [
      {
        label: 'Financial Metrics ($)',
        data: [
          earningsData?.total || 0,
          earningsData?.this_month || 0,
          financialData?.average_order_value || 0,
          financialData?.total_refunds || 0,
        ],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
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
      title: {
        display: true,
        text: 'Financial Overview',
        font: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif",
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
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

  return (
    <div className={`chart-container ${className}`} style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};