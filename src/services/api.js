// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_ADMIN_PREFIX = '/v1/admin';
const API_AUTH_PREFIX = '/v1/auth';

class ApiService {
  // Auth API method
  async login(credentials) {
      const response = await this.request(`${API_AUTH_PREFIX}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  async register(userData) {
    const response = await this.request(`${API_AUTH_PREFIX}/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await this.request(`${API_AUTH_PREFIX}/profile`, {
      method: 'GET',
    });
    return this.handleResponse(response);
  }

  async updateProfile(profileData) {
    const response = await this.request(`${API_AUTH_PREFIX}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return this.handleResponse(response);
  }

  async changePassword(passwordData) {
    console.log('changePassword called with data:', passwordData);
    
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    console.log('Auth token exists:', !!token);
    
    // Ensure field names match backend expectations
    const requestData = {
      current_password: passwordData.current_password,
      new_password: passwordData.password, // Backend might expect 'new_password'
      new_password_confirmation: passwordData.password_confirmation // Backend might expect 'new_password_confirmation'
    };
    
    console.log('Sending request data:', requestData);
    
    try {
      const response = await this.request(`${API_AUTH_PREFIX}/change-password`, {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
      return this.handleResponse(response);
    } catch (error) {
      // Handle specific authentication errors
      if (error.message.includes('Unauthenticated') || error.message.includes('401')) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        throw new Error('Session expired. Please log in again.');
      }
      
      // If it's a validation error, try to extract field-specific errors
      if (error.message.includes('Validation failed') && error.validationErrors) {
        throw error; // Re-throw with validation details
      }
      throw error;
    }
  }

  async refreshToken() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token to refresh');
    }

    try {
      const response = await this.request(`${API_AUTH_PREFIX}/refresh-token`, {
        method: 'POST'
      });
      
      const data = this.handleResponse(response);
      
      // Update stored token
      if (data.data && data.data.token) {
        localStorage.setItem('authToken', data.data.token);
        console.log('Token refreshed successfully');
        return data.data.token;
      } else if (data.token) {
        localStorage.setItem('authToken', data.token);
        console.log('Token refreshed successfully');
        return data.token;
      }
      
      throw new Error('Invalid refresh response format');
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw new Error('Token refresh failed. Please log in again.');
    }
  }
  constructor() {
    this.baseURL = API_BASE_URL;
    this.storageURL = API_BASE_URL.replace('/api', '') + '/storage';
    this.publicURL = API_BASE_URL.replace('/api', '') + '/public';
  }

  // Utility method to construct proper image URLs
  getImageUrl(imagePath) {
    if (!imagePath) return '';
    
    // If it's already a full URL (like Unsplash), return as-is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const baseUrl = this.baseURL.replace('/api', '');
    
    // Handle Laravel Storage patterns based on your backend structure
    if (imagePath.startsWith('category/')) {
      // Backend returns: "category/filename.jpg" (categories)
      // Construct: "http://localhost:8000/storage/category/filename.jpg"
      return `${baseUrl}/storage/${imagePath}`;
      
    } else if (imagePath.startsWith('products/')) {
      // Backend returns: "products/filename.jpg" (products)
      // Construct: "http://localhost:8000/storage/products/filename.jpg"
      return `${baseUrl}/storage/${imagePath}`;
      
    } else if (imagePath.startsWith('storage/')) {
      // Backend returns: "storage/folder/filename.jpg" (full storage path)
      // Construct: "http://localhost:8000/storage/folder/filename.jpg"
      return `${baseUrl}/${imagePath}`;
      
    } else if (imagePath.startsWith('public/')) {
      // Backend returns: "public/images/filename.jpg"
      // Construct: "http://localhost:8000/public/images/filename.jpg"
      return `${baseUrl}/${imagePath}`;
      
    } else if (imagePath.includes('/')) {
      // Backend returns: "folder/filename.jpg" (assume storage)
      // Construct: "http://localhost:8000/storage/folder/filename.jpg"
      return `${baseUrl}/storage/${imagePath}`;
      
    } else {
      // Backend returns: "filename.jpg" (just filename)
      // Assume it's in storage/products: "http://localhost:8000/storage/products/filename.jpg"
      return `${baseUrl}/storage/products/${imagePath}`;
    }
  }

  // Method to handle different response formats from Laravel
  handleResponse(response) {
    // Handle Laravel Resource responses that might wrap data
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (response && response.data) {
      return response.data;
    }
    if (response && Array.isArray(response)) {
      return response;
    }
    return response.data || response;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Default headers for JSON requests
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

    let config = {
      headers: {
        ...defaultHeaders,
        ...authHeaders,
        ...options.headers,
      },
      mode: 'cors',
      ...options,
    };

    // Remove Content-Type for FormData requests (let browser set it)
    if (options.body instanceof FormData) {
      // Remove Content-Type, then explicitly set Authorization header
      delete config.headers['Content-Type'];
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      // Debug: print request headers for every API call
      console.log('API Request:', {
        url,
        method: config.method || 'GET',
        headers: config.headers,
      });

      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        let errorDetails = null;
        
        // Handle 401 Unauthorized - try to refresh token
        if (response.status === 401) {
          const token = localStorage.getItem('authToken');
          if (token) {
            try {
              console.log('Attempting token refresh due to 401...');
              await this.refreshToken();
              
              // Retry the original request with new token
              console.log('Retrying original request with refreshed token...');
              const newToken = localStorage.getItem('authToken');
              if (newToken) {
                config.headers['Authorization'] = `Bearer ${newToken}`;
                const retryResponse = await fetch(url, config);
                
                if (retryResponse.ok) {
                  const retryData = await retryResponse.json();
                  return retryData;
                }
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              // Fall through to normal error handling
            }
          }
        }
        
        try {
          const errorData = await response.json();
          errorDetails = errorData;
          
          // Handle specific 500 errors
          if (response.status === 500) {
            console.error('500 Server Error Details:', {
              url,
              method: config.method || 'GET',
              errorData,
              status: response.status
            });
            
            if (errorData.message && errorData.message.includes('UNIQUE constraint failed: table_numbers.number')) {
              const tableNumber = this.extractTableNumberFromError(errorData.message);
              errorMessage = `Table number ${tableNumber ? tableNumber : ''} already exists. Please choose a different table number.`;
            } else if (errorData.message && errorData.message.includes('foreign key constraint')) {
              errorMessage = 'Cannot delete this item because it is being used by other records.';
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else {
              errorMessage = 'Internal server error. Please check the server logs for details.';
            }
          }
          // Handle duplicate table number error specifically
          else if (response.status === 500 && errorData.message && errorData.message.includes('UNIQUE constraint failed: table_numbers.number')) {
            const tableNumber = this.extractTableNumberFromError(errorData.message);
            errorMessage = `Table number ${tableNumber ? tableNumber : ''} already exists. Please choose a different table number.`;
          } 
          // Handle other validation errors
          else if (errorData.message) {
            errorMessage = errorData.message;
          }
          // Handle Laravel validation errors
          else if (errorData.errors) {
            const firstErrorKey = Object.keys(errorData.errors)[0];
            const firstError = errorData.errors[firstErrorKey];
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            
            // Attach validation errors for field-specific handling
            const error = new Error(errorMessage);
            error.validationErrors = errorData.errors;
            error.status = response.status;
            throw error;
          }
          // Handle specific auth errors
          else if (errorData.message) {
            if (errorData.message.includes('current password is incorrect') || 
                errorData.message.includes('current_password')) {
              errorMessage = 'Current password is incorrect';
            } else if (errorData.message.includes('password confirmation') || 
                       errorData.message.includes('password_confirmation')) {
              errorMessage = 'Password confirmation does not match';
            } else {
              errorMessage = errorData.message;
            }
          }
        } catch (parseError) {
          // If we can't parse the error, fall back to the text response
          try {
            const errorText = await response.text();
            if (errorText.includes('UNIQUE constraint failed: table_numbers.number')) {
              errorMessage = 'Table number already exists. Please choose a different table number.';
            } else {
              errorMessage = `HTTP ${response.status}: ${errorText}`;
            }
          } catch {
            errorMessage = `HTTP ${response.status}: Server error`;
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to server at ${this.baseURL}. Please check if the backend is running.`);
      }

      throw error;
    }
  }

  // Helper method to extract table number from database error
  extractTableNumberFromError(errorMessage) {
    try {
      // Look for pattern like "values (4, available, ...)"
      const match = errorMessage.match(/values \((\d+),/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  // Categories API methods
  async getCategories() {
    const response = await this.request(`${API_ADMIN_PREFIX}/categories`);
    const categories = this.handleResponse(response);
    
    // Transform categories to include properly formatted image URLs
    return categories.map(category => ({
      ...category,
      image_url: this.getImageUrl(category.image_path),
      originalImagePath: category.image_path
    }));
  }

  async createCategory(categoryData) {
      const response = await this.request(`${API_ADMIN_PREFIX}/categories`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return response.data || response;
  }

  async updateCategory(id, categoryData) {
      const response = await this.request(`${API_ADMIN_PREFIX}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return response.data || response;
  }

  async deleteCategory(id) {
      return this.request(`${API_ADMIN_PREFIX}/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Create category with file upload
  async createCategoryWithFile(categoryData, imageFile) {
    const formData = new FormData();
    
    // Add all category fields to FormData
    Object.keys(categoryData).forEach(key => {
      if (categoryData[key] !== null && categoryData[key] !== undefined) {
        formData.append(key, categoryData[key]);
      }
    });
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image_path', imageFile);
    }
    
      const response = await this.request(`${API_ADMIN_PREFIX}/categories`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    console.log('Backend response for CATEGORY upload:', response);
    console.log('Category image_path in response:', response?.image_path || response?.data?.image_path);
    console.log('Full category response:', JSON.stringify(response, null, 2));
    
    return response.data || response;
  }

  // Update category with file upload
  async updateCategoryWithFile(id, categoryData, imageFile) {
    const formData = new FormData();
    
    // Add all category fields to FormData
    Object.keys(categoryData).forEach(key => {
      if (categoryData[key] !== null && categoryData[key] !== undefined) {
        formData.append(key, categoryData[key]);
      }
    });
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image_path', imageFile);
    }
    
    // Use POST with _method override for file uploads (Laravel way)
    formData.append('_method', 'PUT');
    
      const response = await this.request(`${API_ADMIN_PREFIX}/categories/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });
    return response.data || response;
  }

  // Products API methods
  async getProducts() {
      const response = await this.request(`${API_ADMIN_PREFIX}/products`);
    const products = this.handleResponse(response);
    
    // Transform products to include properly formatted image URLs
    return products.map(product => {
      const imageUrl = this.getImageUrl(product.image_path);
      
      // Debug logging for image path construction
      if (product.image_path) {
        console.log('Image path transformation:', {
          original: product.image_path,
          constructed: imageUrl,
          productName: product.name,
          isUrl: product.image_path.startsWith('http')
        });
      }
      
      return {
        ...product,
        image_url: imageUrl,
        originalImagePath: product.image_path
      };
    });
  }

  async createProduct(productData) {
    console.log('Creating product with JSON data:', productData);
      const response = await this.request(`${API_ADMIN_PREFIX}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.data || response;
  }

  // Create product with file upload
  async createProductWithFile(productData, imageFile) {
    const formData = new FormData();
    
    // Add all product fields to FormData
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    // Add image file if provided
    if (imageFile) {
      // Try the most common Laravel field name for file uploads
      formData.append('image_path', imageFile);
      console.log('Adding image file to FormData as "image_path":', imageFile.name, imageFile.type, imageFile.size);
      console.log('FormData entries:', [...formData.entries()].map(([key, value]) => [key, typeof value === 'object' ? `File: ${value.name || 'file'}` : value]));
    }
    
    console.log('Creating product with FormData:', {
      productData,
      hasImageFile: !!imageFile,
      formDataEntries: [...formData.entries()].map(([key, value]) => [key, typeof value === 'object' ? `File: ${value.name}` : value])
    });
    
      const response = await this.request(`${API_ADMIN_PREFIX}/products`, {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set it with boundary for FormData
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    console.log('Backend response for PRODUCT upload:', response);
    console.log('Product image_path in response:', response?.image_path || response?.data?.image_path);
    console.log('Full product response:', JSON.stringify(response, null, 2));
    
    return response.data || response;
  }

  async updateProduct(id, productData) {
      const response = await this.request(`${API_ADMIN_PREFIX}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response.data || response;
  }

  async getProductById(id) {
    try {
      const response = await this.request(`${API_ADMIN_PREFIX}/products/${id}`);
      const product = this.handleResponse(response);
      
      if (product) {
        const imageUrl = this.getImageUrl(product.image_path);
        return {
          ...product,
          image_url: imageUrl,
          originalImagePath: product.image_path
        };
      }
      
      return product;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Update product with file upload
  async updateProductWithFile(id, productData, imageFile) {
    const formData = new FormData();
    
    // Add all product fields to FormData
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image_path', imageFile);
    }
    
    // Use POST with _method override for file uploads (Laravel way)
    formData.append('_method', 'PUT');
    
      const response = await this.request(`${API_ADMIN_PREFIX}/products/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });
    return response.data || response;
  }

  async deleteProduct(id) {
    try {
      const response = await this.request(`${API_ADMIN_PREFIX}/products/${id}`, {
        method: 'DELETE',
      });
      return response.data || response;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      
      // Provide more specific error messages
      if (error.message.includes('Foreign key constraint')) {
        throw new Error('Cannot delete this product because it is being used in orders or other records. Please remove those references first.');
      } else if (error.message.includes('Not found') || error.message.includes('404')) {
        throw new Error('Product not found. It may have already been deleted.');
      } else if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        throw new Error('You do not have permission to delete this product.');
      } else {
        throw new Error(`Failed to delete product: ${error.message}`);
      }
    }
  }

  // Check if product can be deleted (optional method to check dependencies)
  async checkProductDependencies(id) {
    try {
      const response = await this.request(`${API_ADMIN_PREFIX}/products/${id}/dependencies`);
      return this.handleResponse(response);
    } catch (error) {
      // If endpoint doesn't exist, assume no dependencies
      console.log('Dependencies check not available, proceeding with delete');
      return { canDelete: true, dependencies: [] };
    }
  }

  async toggleProductStatus(id, status) {
      const response = await this.request(`${API_ADMIN_PREFIX}/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data || response;
  }

  // Tables API methods
  async getTables() {
      const response = await this.request(`${API_ADMIN_PREFIX}/tables`);
    return this.handleResponse(response);
  }

  async createTable(tableData) {
    console.log('Creating table with data:', tableData);
      const response = await this.request(`${API_ADMIN_PREFIX}/tables`, {
      method: 'POST',
      body: JSON.stringify(tableData),
    });
    // Handle Laravel Resource response format
    return this.handleResponse(response);
  }

  async updateTable(id, tableData) {
    console.log('Updating table with data:', tableData);
      const response = await this.request(`${API_ADMIN_PREFIX}/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tableData),
    });
    // Handle Laravel Resource response format
    return this.handleResponse(response);
  }

  async deleteTable(id) {
      return this.request(`${API_ADMIN_PREFIX}/tables/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTableStatus(id, status, currentNumber) {
    // Send both number and status to satisfy DTO requirements
      const response = await this.request(`${API_ADMIN_PREFIX}/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        number: currentNumber,
        status: status 
      }),
    });
    // Handle Laravel Resource response format
    return this.handleResponse(response);
  }

  // Users API methods
  async getUsers() {
    const response = await this.request(`${API_ADMIN_PREFIX}/users`);
    return this.handleResponse(response);
  }

  async getUserById(id) {
    const response = await this.request(`${API_ADMIN_PREFIX}/users/${id}`);
    return this.handleResponse(response);
  }

  async createUser(userData) {
    console.log('Creating user with data:', userData);
    const response = await this.request(`${API_ADMIN_PREFIX}/users`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async createCashier(userData) {
    console.log('Creating cashier with data:', userData);
    const response = await this.request(`${API_ADMIN_PREFIX}/users/cashier`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async updateUser(id, userData) {
    console.log('Updating user with data:', userData);
    const response = await this.request(`${API_ADMIN_PREFIX}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async deleteUser(id) {
    return this.request(`${API_ADMIN_PREFIX}/users/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleUserStatus(id) {
    const response = await this.request(`${API_ADMIN_PREFIX}/users/${id}/toggle-status`, {
      method: 'PATCH',
    });
    return this.handleResponse(response);
  }

  async getCashiers() {
    const response = await this.request(`${API_ADMIN_PREFIX}/users/cashiers`);
    return this.handleResponse(response);
  }

  async getActiveUsers() {
    const response = await this.request(`${API_ADMIN_PREFIX}/users/active`);
    return this.handleResponse(response);
  }

  async searchUsers(query) {
    const response = await this.request(`${API_ADMIN_PREFIX}/users/search?q=${encodeURIComponent(query)}`);
    return this.handleResponse(response);
  }

  async getUserStatistics() {
    const response = await this.request(`${API_ADMIN_PREFIX}/users/statistics`);
    return this.handleResponse(response);
  }

  // Dashboard API methods
  async getDashboardData() {
    const response = await this.request(`${API_ADMIN_PREFIX}/dashboard`);
    return this.handleResponse(response);
  }

  async getDashboardEarnings() {
    const response = await this.request(`${API_ADMIN_PREFIX}/dashboard/earnings`);
    return this.handleResponse(response);
  }

  async getDashboardOrders() {
    const response = await this.request(`${API_ADMIN_PREFIX}/dashboard/orders`);
    return this.handleResponse(response);
  }

  async getDashboardTopProducts() {
    const response = await this.request(`${API_ADMIN_PREFIX}/dashboard/top-products`);
    return this.handleResponse(response);
  }

  async getDashboardFinancialSummary() {
    const response = await this.request(`${API_ADMIN_PREFIX}/dashboard/financial-summary`);
    return this.handleResponse(response);
  }

  async getDashboardEarningsChart() {
    const response = await this.request(`${API_ADMIN_PREFIX}/dashboard/earnings/chart`);
    return this.handleResponse(response);
  }

  async getDashboardCategoryPerformance() {
    const response = await this.request(`${API_ADMIN_PREFIX}/dashboard/category-performance`);
    return this.handleResponse(response);
  }

  async searchDashboardCategories(query) {
    const response = await this.request(`${API_ADMIN_PREFIX}/dashboard/search/categories?q=${encodeURIComponent(query)}`);
    return this.handleResponse(response);
  }

  async searchDashboardProducts(query) {
    const response = await this.request(`${API_ADMIN_PREFIX}/dashboard/search/products?q=${encodeURIComponent(query)}`);
    return this.handleResponse(response);
  }

  // Reports API methods
  async getReportsSummary() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/summary`);
    return this.handleResponse(response);
  }

  async getReportsDetailed() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/detailed`);
    return this.handleResponse(response);
  }

  async getSalesSummary() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/sales-summary`);
    return this.handleResponse(response);
  }

  async getTotalEarnings() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/total-earnings`);
    return this.handleResponse(response);
  }

  async getCurrentMonthEarnings() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/current-month-earnings`);
    return this.handleResponse(response);
  }

  async getDailyEarnings() {
    try {
      const response = await this.request(`${API_ADMIN_PREFIX}/reports/daily-earnings`);
      return this.handleResponse(response);
    } catch (error) {
      // Expected error when no order data exists - use mock data instead
      console.info(' Daily earnings endpoint unavailable (using demo data):', error.message);
      throw new Error('Daily earnings data unavailable');
    }
  }

  async getMonthlyEarningsChart(year = null) {
    try {
      const url = year 
        ? `${API_ADMIN_PREFIX}/reports/monthly-earnings-chart?year=${year}`
        : `${API_ADMIN_PREFIX}/reports/monthly-earnings-chart`;
      const response = await this.request(url);
      return this.handleResponse(response);
    } catch (error) {
      // Expected error when no order data exists - use mock data instead
      console.info('Monthly earnings chart endpoint unavailable (using demo data):', error.message);
      throw new Error('Monthly earnings chart data unavailable');
    }
  }

  async getCashierPerformance() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/cashier-performance`);
    return this.handleResponse(response);
  }

  async getTotalCashiers() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/total-cashiers`);
    return this.handleResponse(response);
  }

  async getProductPerformance() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/product-performance`);
    return this.handleResponse(response);
  }

  async getProductsMostEarnings(limit = 10) {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/products-most-earnings?limit=${limit}`);
    return this.handleResponse(response);
  }

  async getCategoryRevenue() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/category-revenue`);
    return this.handleResponse(response);
  }

  async getOrderStatus() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/order-status`);
    return this.handleResponse(response);
  }

  async getPaymentMethods() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/payment-methods`);
    return this.handleResponse(response);
  }

  async getTopCustomers(limit = 10) {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/top-customers?limit=${limit}`);
    return this.handleResponse(response);
  }

  async getRevenueComparison() {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/revenue-comparison`);
    return this.handleResponse(response);
  }

  async exportReportsPDF(data) {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/export/pdf`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async exportReportsExcel(data) {
    const response = await this.request(`${API_ADMIN_PREFIX}/reports/export/excel`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }
  async getOrder() {
      const response = await this.request(`${API_ADMIN_PREFIX}/orders`);
    return this.handleResponse(response);
  }
  async cheackOrder(id) {
      const response = await this.request(`${API_ADMIN_PREFIX}/orders/findByNumber/${id}`);
    return this.handleResponse(response);
  }

  async acceptOrder(id) {
    const response = await this.request(
      `${API_ADMIN_PREFIX}/orders/markAsDone/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ status: 'accepted' }),
      }
    );
    return this.handleResponse(response);
  }
  async cencalOrder(id) {
    const response = await this.request(
      `${API_ADMIN_PREFIX}/orders/markAsDone/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ status: 'cancel' }),
      }
    );
    return this.handleResponse(response);
  }
  async cencalOrderList(id) {
    const response = await this.request(
      `${API_ADMIN_PREFIX}/orders/cancelOrder/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ status: 'cancel' }),
      }
    );
    return this.handleResponse(response);
  }

}

// Export singleton instance
export default new ApiService();