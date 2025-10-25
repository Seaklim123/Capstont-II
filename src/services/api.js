// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Default headers for JSON requests
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    const config = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      mode: 'cors',
      ...options,
    };

    // Remove Content-Type for FormData requests (let browser set it)
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
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

  // Categories API methods
  async getCategories() {
    const response = await this.request('/categories');
    return response.data || response; // Handle data wrapper
  }

  async createCategory(categoryData) {
    const response = await this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return response.data || response;
  }

  async updateCategory(id, categoryData) {
    const response = await this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return response.data || response;
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
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
    
    const response = await this.request('/categories', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });
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
    
    const response = await this.request(`/categories/${id}`, {
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
    const response = await this.request('/products');
    return response.data || response; // Handle data wrapper
  }

  async createProduct(productData) {
    const response = await this.request('/products', {
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
      formData.append('image_path', imageFile);
    }
    
    const response = await this.request('/products', {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set it with boundary for FormData
        'Accept': 'application/json',
      },
      body: formData,
    });
    return response.data || response;
  }

  async updateProduct(id, productData) {
    const response = await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response.data || response;
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
    
    const response = await this.request(`/products/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });
    return response.data || response;
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleProductStatus(id, status) {
    const response = await this.request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data || response;
  }
}

// Export singleton instance
export default new ApiService();