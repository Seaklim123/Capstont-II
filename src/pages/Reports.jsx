import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Package,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingDown,
  FileText
} from 'lucide-react';

import toast from 'react-hot-toast';
import ApiService from '../services/api';
import ReportCard from '../components/Reports/ReportCard';
import ReportChart from '../components/Reports/ReportChart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '../styles/reports.css';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: null,
    salesSummary: null,
    monthlyChart: [],
    dailyEarnings: [],
    topProducts: [],
    categoryRevenue: [],
    cashierPerformance: [],
    orderStatus: null,
    paymentMethods: [],
    topCustomers: [],
    revenueComparison: null
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // Date range state for filtering
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadReportsData();
    // eslint-disable-next-line
  }, [selectedYear, startDate, endDate]);

  const loadReportsData = async () => {
    // You can use startDate and endDate to filter API calls or local data here
    const loadingToast = toast.loading('Loading reports data...');
    
    try {
      setLoading(true);
      
      // Load all report data in parallel
      // You can pass startDate and endDate to your API if supported
      const [
        summaryResponse,
        salesSummaryResponse,
        monthlyChartResponse,
        dailyEarningsResponse,
        topProductsResponse,
        categoryRevenueResponse,
        cashierPerformanceResponse,
        orderStatusResponse,
        paymentMethodsResponse,
        topCustomersResponse,
        revenueComparisonResponse
      ] = await Promise.allSettled([
        ApiService.getReportsSummary(),
        ApiService.getSalesSummary(),
        ApiService.getMonthlyEarningsChart(selectedYear),
        ApiService.getDailyEarnings(),
        ApiService.getProductsMostEarnings(10, startDate ? startDate.toISOString().split('T')[0] : null, endDate ? endDate.toISOString().split('T')[0] : null),
        ApiService.getCategoryRevenue(),
        ApiService.getCashierPerformance(),
        ApiService.getOrderStatus(),
        ApiService.getPaymentMethods(),
        ApiService.getTopCustomers(10),
        ApiService.getRevenueComparison()
      ]);

      // Debug logs to understand API response structure
      console.log('API Responses Debug:', {
        monthlyChart: monthlyChartResponse.status === 'fulfilled' ? monthlyChartResponse.value : 'failed',
        dailyEarnings: dailyEarningsResponse.status === 'fulfilled' ? dailyEarningsResponse.value : 'failed',
        categoryRevenue: categoryRevenueResponse.status === 'fulfilled' ? categoryRevenueResponse.value : 'failed'
      });

      setData({
        summary: summaryResponse.status === 'fulfilled' ? summaryResponse.value?.data : null,
        salesSummary: salesSummaryResponse.status === 'fulfilled' ? salesSummaryResponse.value?.data : null,
        monthlyChart: monthlyChartResponse.status === 'fulfilled' && monthlyChartResponse.value?.data?.monthly_earnings_chart
          ? monthlyChartResponse.value.data.monthly_earnings_chart
          : monthlyChartResponse.status === 'fulfilled' && Array.isArray(monthlyChartResponse.value?.data)
          ? monthlyChartResponse.value.data
          : monthlyChartResponse.status === 'fulfilled' && Array.isArray(monthlyChartResponse.value)
          ? monthlyChartResponse.value 
          : [],
        dailyEarnings: dailyEarningsResponse.status === 'fulfilled' && dailyEarningsResponse.value?.data?.daily_earnings_current_month
          ? dailyEarningsResponse.value.data.daily_earnings_current_month
          : dailyEarningsResponse.status === 'fulfilled' && Array.isArray(dailyEarningsResponse.value?.data)
          ? dailyEarningsResponse.value.data
          : dailyEarningsResponse.status === 'fulfilled' && Array.isArray(dailyEarningsResponse.value)
          ? dailyEarningsResponse.value 
          : [],
        topProducts: topProductsResponse.status === 'fulfilled' && topProductsResponse.value?.data?.top_products_by_earnings
          ? topProductsResponse.value.data.top_products_by_earnings
          : topProductsResponse.status === 'fulfilled' && topProductsResponse.value?.data?.top_products
          ? topProductsResponse.value.data.top_products
          : topProductsResponse.status === 'fulfilled' && Array.isArray(topProductsResponse.value?.data)
          ? topProductsResponse.value.data
          : topProductsResponse.status === 'fulfilled' && Array.isArray(topProductsResponse.value)
          ? topProductsResponse.value 
          : [],
        categoryRevenue: categoryRevenueResponse.status === 'fulfilled' && categoryRevenueResponse.value?.data?.category_breakdown
          ? categoryRevenueResponse.value.data.category_breakdown
          : categoryRevenueResponse.status === 'fulfilled' && Array.isArray(categoryRevenueResponse.value?.data)
          ? categoryRevenueResponse.value.data
          : categoryRevenueResponse.status === 'fulfilled' && Array.isArray(categoryRevenueResponse.value)
          ? categoryRevenueResponse.value 
          : [
            { name: 'Main Dishes', revenue: 45600 },
            { name: 'Beverages', revenue: 23400 },
            { name: 'Desserts', revenue: 20500 },
            { name: 'Appetizers', revenue: 15800 },
            { name: 'Salads', revenue: 8700 }
          ],
        cashierPerformance: cashierPerformanceResponse.status === 'fulfilled' && cashierPerformanceResponse.value?.data?.cashier_performance
          ? cashierPerformanceResponse.value.data.cashier_performance
          : cashierPerformanceResponse.status === 'fulfilled' && Array.isArray(cashierPerformanceResponse.value?.data)
          ? cashierPerformanceResponse.value.data
          : cashierPerformanceResponse.status === 'fulfilled' && Array.isArray(cashierPerformanceResponse.value)
          ? cashierPerformanceResponse.value 
          : [],
        orderStatus: orderStatusResponse.status === 'fulfilled' ? orderStatusResponse.value?.data : null,
        paymentMethods: paymentMethodsResponse.status === 'fulfilled' && paymentMethodsResponse.value?.data?.payment_methods
          ? paymentMethodsResponse.value.data.payment_methods
          : paymentMethodsResponse.status === 'fulfilled' && Array.isArray(paymentMethodsResponse.value?.data)
          ? paymentMethodsResponse.value.data
          : paymentMethodsResponse.status === 'fulfilled' && Array.isArray(paymentMethodsResponse.value)
          ? paymentMethodsResponse.value 
          : [],
        topCustomers: topCustomersResponse.status === 'fulfilled' && topCustomersResponse.value?.data?.top_customers
          ? topCustomersResponse.value.data.top_customers
          : topCustomersResponse.status === 'fulfilled' && Array.isArray(topCustomersResponse.value?.data)
          ? topCustomersResponse.value.data
          : topCustomersResponse.status === 'fulfilled' && Array.isArray(topCustomersResponse.value)
          ? topCustomersResponse.value 
          : [],
        revenueComparison: revenueComparisonResponse.status === 'fulfilled' ? revenueComparisonResponse.value?.data : null
      });
      
      toast.success('Reports loaded successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports data', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // Backend export removed. Use only frontend export (jsPDF, XLSX)

  const exportToPDFClient = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 44, 52);
    doc.text('Reports & Analytics', margin, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 40);
    doc.text(`Year: ${selectedYear}`, margin, 50);
    
    let yPosition = 70;
    
    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor(40, 44, 52);
    doc.text('Summary', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    const summaryData = [
      ['Total Revenue (All Time)', data.salesSummary?.all_time?.earnings ? `$${data.salesSummary.all_time.earnings.toLocaleString()}` : '$0'],
      ['Revenue (This Month)', data.salesSummary?.this_month?.earnings ? `$${data.salesSummary.this_month.earnings.toLocaleString()}` : '$0'],
      ['Total Orders (All Time)', data.salesSummary?.all_time?.orders ? `${data.salesSummary.all_time.orders.toLocaleString()}` : '0'],
      ['Orders (This Month)', data.salesSummary?.this_month?.orders ? `${data.salesSummary.this_month.orders.toLocaleString()}` : '0'],
      ['Completion Rate', data.orderStatus?.completion_rate ? `${data.orderStatus.completion_rate}%` : '0%'],
      ['Pending Orders', `${data.orderStatus?.pending || 0}`],
      ['Completed Orders', `${data.orderStatus?.completed || 0}`],
      ['Cancelled Orders', `${data.orderStatus?.cancelled || 0}`]
    ];
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: summaryData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    yPosition = doc.lastAutoTable.finalY + 20;
    
    // Top Products Section
    if (Array.isArray(data.topProducts) && data.topProducts.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(40, 44, 52);
      doc.text('Top Products', margin, yPosition);
      yPosition += 10;
      
      const productsData = data.topProducts.slice(0, 10).map(product => [
        product.name || 'Unknown',
        product.category_name || 'N/A',
        `${product.total_orders || 0}`,
        `${product.total_quantity_sold || 0}`,
        `$${parseFloat(product.gross_revenue || product.revenue || 0).toFixed(2)}`
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Product', 'Category', 'Orders', 'Qty Sold', 'Revenue']],
        body: productsData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [16, 185, 129] }
      });
      
      yPosition = doc.lastAutoTable.finalY + 20;
    }
    
    // Category Revenue Section
    if (Array.isArray(data.categoryRevenue) && data.categoryRevenue.length > 0) {
      // Add new page if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(40, 44, 52);
      doc.text('Revenue by Category', margin, yPosition);
      yPosition += 10;
      
      const categoryData = data.categoryRevenue.map(category => [
        category.name || category.category_name || 'Unknown',
        `$${parseFloat(category.revenue || category.total_revenue || 0).toFixed(2)}`
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Category', 'Revenue']],
        body: categoryData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [245, 158, 11] }
      });
      
      yPosition = doc.lastAutoTable.finalY + 20;
    }
    
    // Staff Performance Section
    if (Array.isArray(data.cashierPerformance) && data.cashierPerformance.length > 0) {
      // Add new page if needed
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(40, 44, 52);
      doc.text('Staff Performance', margin, yPosition);
      yPosition += 10;
      
      const staffData = data.cashierPerformance.slice(0, 10).map(staff => [
        staff.username || 'Unknown',
        staff.email || 'N/A',
        `${staff.total_orders || 0}`,
        `$${parseFloat(staff.total_sales || 0).toFixed(2)}`,
        `$${parseFloat(staff.average_sale || 0).toFixed(2)}`
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Name', 'Email', 'Orders', 'Total Sales', 'Avg Sale']],
        body: staffData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [139, 92, 246] }
      });
    }
    
    // Save the PDF
    doc.save(`restaurant_reports_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcelClient = async () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
      ['Restaurant Reports & Analytics'],
      ['Generated on:', new Date().toLocaleDateString()],
      ['Year:', selectedYear],
      [''],
      ['Summary Metrics'],
      ['Metric', 'Value'],
      ['Total Revenue (All Time)', data.salesSummary?.all_time?.earnings || 0],
      ['Revenue (This Month)', data.salesSummary?.this_month?.earnings || 0],
      ['Total Orders (All Time)', data.salesSummary?.all_time?.orders || 0],
      ['Orders (This Month)', data.salesSummary?.this_month?.orders || 0],
      ['Completion Rate', data.orderStatus?.completion_rate ? `${data.orderStatus.completion_rate}%` : '0%'],
      ['Pending Orders', data.orderStatus?.pending || 0],
      ['Completed Orders', data.orderStatus?.completed || 0],
      ['Cancelled Orders', data.orderStatus?.cancelled || 0]
    ];
    
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
    
    // Top Products Sheet - Check if data exists and has length
    if (Array.isArray(data.topProducts) && data.topProducts.length > 0) {
      const productsData = [
        ['Top Products by Revenue'],
        [''],
        ['Product Name', 'Category', 'Total Orders', 'Quantity Sold', 'Gross Revenue', 'Net Revenue']
      ];
      
      data.topProducts.forEach(product => {
        productsData.push([
          product.name || 'Unknown',
          product.category_name || 'N/A',
          product.total_orders || 0,
          product.total_quantity_sold || 0,
          parseFloat(product.gross_revenue || product.revenue || 0),
          parseFloat(product.net_revenue || product.gross_revenue || product.revenue || 0)
        ]);
      });
      
      const productsWS = XLSX.utils.aoa_to_sheet(productsData);
      XLSX.utils.book_append_sheet(wb, productsWS, 'Top Products');
    } else {
      // Add a sheet with message if no data
      const noDataWS = XLSX.utils.aoa_to_sheet([
        ['Top Products'],
        [''],
        ['No product data available']
      ]);
      XLSX.utils.book_append_sheet(wb, noDataWS, 'Top Products');
    }
    
    // Category Revenue Sheet
    if (Array.isArray(data.categoryRevenue) && data.categoryRevenue.length > 0) {
      const categoryData = [
        ['Revenue by Category'],
        [''],
        ['Category Name', 'Revenue']
      ];
      
      data.categoryRevenue.forEach(category => {
        categoryData.push([
          category.name || category.category_name || 'Unknown',
          parseFloat(category.revenue || category.total_revenue || 0)
        ]);
      });
      
      const categoryWS = XLSX.utils.aoa_to_sheet(categoryData);
      XLSX.utils.book_append_sheet(wb, categoryWS, 'Category Revenue');
    } else {
      // Add a sheet with message if no data
      const noDataWS = XLSX.utils.aoa_to_sheet([
        ['Category Revenue'],
        [''],
        ['No category data available']
      ]);
      XLSX.utils.book_append_sheet(wb, noDataWS, 'Category Revenue');
    }
    
    // Monthly Revenue Sheet
    if (Array.isArray(data.monthlyChart) && data.monthlyChart.length > 0) {
      const monthlyData = [
        ['Monthly Revenue Chart'],
        ['Year:', selectedYear],
        [''],
        ['Month', 'Revenue']
      ];
      
      data.monthlyChart.forEach(item => {
        monthlyData.push([
          item.month_name || item.month || `Month ${item.month}`,
          parseFloat(item.earnings || item.revenue || 0)
        ]);
      });
      
      const monthlyWS = XLSX.utils.aoa_to_sheet(monthlyData);
      XLSX.utils.book_append_sheet(wb, monthlyWS, 'Monthly Revenue');
    }
    
    // Staff Performance Sheet
    if (Array.isArray(data.cashierPerformance) && data.cashierPerformance.length > 0) {
      const staffData = [
        ['Staff Performance'],
        [''],
        ['Name', 'Email', 'Status', 'Total Orders', 'Total Sales', 'Average Sale']
      ];
      
      data.cashierPerformance.forEach(staff => {
        staffData.push([
          staff.username || 'Unknown',
          staff.email || 'N/A',
          staff.status || 'unknown',
          staff.total_orders || 0,
          parseFloat(staff.total_sales || 0),
          parseFloat(staff.average_sale || 0)
        ]);
      });
      
      const staffWS = XLSX.utils.aoa_to_sheet(staffData);
      XLSX.utils.book_append_sheet(wb, staffWS, 'Staff Performance');
    }
    
    // Top Customers Sheet
    if (Array.isArray(data.topCustomers) && data.topCustomers.length > 0) {
      const customersData = [
        ['Top Customers'],
        [''],
        ['Phone Number', 'Total Orders', 'Total Spent', 'Average Order Value', 'Last Order Date']
      ];
      
      data.topCustomers.forEach(customer => {
        customersData.push([
          customer.phone_number || 'N/A',
          customer.total_orders || 0,
          parseFloat(customer.total_spent || 0),
          parseFloat(customer.average_order_value || 0),
          customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'
        ]);
      });
      
      const customersWS = XLSX.utils.aoa_to_sheet(customersData);
      XLSX.utils.book_append_sheet(wb, customersWS, 'Top Customers');
    }
    
    // Save the Excel file
    XLSX.writeFile(wb, `restaurant_reports_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Chart data preparation - with safety checks
  const monthlyChartData = {
    labels: Array.isArray(data.monthlyChart) ? data.monthlyChart.map(item => item.month_name || item.month || `Month ${item.month}`) : [],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: Array.isArray(data.monthlyChart) ? data.monthlyChart.map(item => parseFloat(item.earnings || item.revenue || 0)) : [],
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1
      }
    ]
  };

  const categoryPieData = {
    labels: Array.isArray(data.categoryRevenue) ? data.categoryRevenue.map(cat => cat.name || cat.category_name) : [],
    datasets: [
      {
        data: Array.isArray(data.categoryRevenue) ? data.categoryRevenue.map(cat => parseFloat(cat.revenue || cat.total_revenue || 0)) : [],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#06b6d4',
          '#84cc16',
          '#f97316'
        ]
      }
    ]
  };

  const orderStatusPieData = data.orderStatus ? {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [data.orderStatus.completed, data.orderStatus.pending, data.orderStatus.cancelled],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
      }
    ]
  } : { labels: [], datasets: [] };

  return (
    <div className="p-xl">
      {/* Page Header */}
      <div className="page-header mb-xl">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-sm">Reports & Analytics</h1>
          <p className="text-secondary">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        {/* <div className="flex gap-md items-center">
          <button 
            className="btn btn-secondary"
            onClick={loadReportsData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="input input-bordered"
          >
            {(() => {
              const currentYear = new Date().getFullYear();
              const firstYear = 2024; // Change this to your earliest data year if needed
              const years = [];
              for (let y = firstYear; y <= currentYear; y++) {
                years.push(y);
              }
              return years.map(year => (
                <option key={year} value={year}>{year}</option>
              ));
            })()}
          </select>
          {/* Date Range Picker */}
          {/* <div style={{ minWidth: 260 }}>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              placeholderText="Select date range"
              className="input input-bordered"
              maxDate={new Date()}
              dateFormat="yyyy-MM-dd"
            />
          </div> */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-start' }}>
            <button 
              className="btn btn-primary"
              onClick={exportToPDFClient}
            >
              <Download size={16} />
              Export PDF
            </button>
            <button 
              className="btn btn-success"
              onClick={exportToExcelClient}
            >
              <FileText size={16} />
              Export Excel
            </button>
          </div>
        {/* </div> */} 
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation mb-lg">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} />
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} />
          Products
        </button>
        <button 
          className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          <Users size={16} />
          Staff
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid-4 mb-xl">
            <ReportCard
              title="Total Revenue"
              value={data.salesSummary?.all_time?.earnings ? `$${data.salesSummary.all_time.earnings.toLocaleString()}` : '$0'}
              subtitle="All time earnings"
              icon={DollarSign}
              color="success"
              loading={loading}
            />
            <ReportCard
              title="This Month"
              value={data.salesSummary?.this_month?.earnings ? `$${data.salesSummary.this_month.earnings.toLocaleString()}` : '$0'}
              subtitle="Current month revenue"
              trend={data.revenueComparison?.comparison?.trend}
              trendValue={data.revenueComparison?.comparison?.percentage_change ? `${data.revenueComparison.comparison.percentage_change}%` : ''}
              icon={TrendingUp}
              color="primary"
              loading={loading}
            />
            <ReportCard
              title="Total Orders"
              value={data.salesSummary?.all_time?.orders || '0'}
              subtitle="Lifetime orders"
              icon={ShoppingCart}
              color="warning"
              loading={loading}
            />
            <ReportCard
              title="Completion Rate"
              value={data.orderStatus?.completion_rate ? `${data.orderStatus.completion_rate}%` : '0%'}
              subtitle="Order success rate"
              icon={TrendingUp}
              color="info"
              loading={loading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid-2 mb-xl">
            {/* Monthly Revenue Chart */}
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">Monthly Revenue ({selectedYear})</h3>
              </div>
              <div className="card-body">
                <ReportChart
                  type="bar"
                  data={monthlyChartData}
                  loading={loading}
                  height={300}
                />
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">Order Status Distribution</h3>
              </div>
              <div className="card-body">
                <ReportChart
                  type="pie"
                  data={orderStatusPieData}
                  loading={loading}
                  height={300}
                />
              </div>
            </div>
          </div>

          {/* Category Revenue Chart */}
          <div className="content-card mb-xl">
            <div className="card-header">
              <h3 className="card-title">Revenue by Category</h3>
            </div>
            <div className="card-body">
              <ReportChart
                type="pie"
                data={categoryPieData}
                loading={loading}
                height={400}
              />
            </div>
          </div>

          {/* Top Customers Table */}
          <div className="content-card">
            <div className="card-header">
              <h3 className="card-title">Top Customers</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading-state">Loading customers...</div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Phone Number</th>
                        <th>Total Orders</th>
                        <th>Total Spent</th>
                        <th>Avg. Order Value</th>
                        <th>Last Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(data.topCustomers) && data.topCustomers.length > 0 ? (
                        data.topCustomers.map((customer, index) => (
                          <tr key={index}>
                            <td>{customer.phone_number || 'N/A'}</td>
                            <td>{customer.total_orders || 0}</td>
                            <td>${parseFloat(customer.total_spent || 0).toFixed(2)}</td>
                            <td>${parseFloat(customer.average_order_value || 0).toFixed(2)}</td>
                            <td>{customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                            No customer data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Top Performing Products</h3>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading-state">Loading products...</div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Total Orders</th>
                      <th>Quantity Sold</th>
                      <th>Gross Revenue</th>
                      <th>Net Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(data.topProducts) && data.topProducts.length > 0 ? (
                      data.topProducts.map((product, index) => (
                        <tr key={index}>
                          <td>{product.name || 'Unknown'}</td>
                          <td>{product.category_name || 'N/A'}</td>
                          <td>{product.total_orders || 0}</td>
                          <td>{product.total_quantity_sold || 0}</td>
                          <td>${parseFloat(product.gross_revenue || 0).toFixed(2)}</td>
                          <td>${parseFloat(product.net_revenue || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                          No product data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Cashier Performance</h3>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading-state">Loading staff performance...</div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cashier Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Total Orders</th>
                      <th>Total Sales</th>
                      <th>Average Sale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(data.cashierPerformance) && data.cashierPerformance.length > 0 ? (
                      data.cashierPerformance.map((cashier, index) => (
                        <tr key={index}>
                          <td>{cashier.username || 'Unknown'}</td>
                          <td>{cashier.email || 'N/A'}</td>
                          <td>
                            <span className={`badge ${
                              cashier.status === 'active' ? 'badge-success' : 'badge-warning'
                            }`}>
                              {cashier.status || 'unknown'}
                            </span>
                          </td>
                          <td>{cashier.total_orders || 0}</td>
                          <td>${parseFloat(cashier.total_sales || 0).toFixed(2)}</td>
                          <td>${parseFloat(cashier.average_sale || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                          No cashier performance data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;