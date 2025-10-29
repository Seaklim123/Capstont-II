// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiService {
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
    const categories = this.handleResponse(response);
    
    // Transform categories to include properly formatted image URLs
    return categories.map(category => ({
      ...category,
      image_url: this.getImageUrl(category.image_path),
      originalImagePath: category.image_path
    }));
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
    
    const response = await this.request('/products', {
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