// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to create request options
const createRequestOptions = (method, data = null, isFormData = false) => {
  const options = {
    method,
    headers: {},
  };

  if (data) {
    if (isFormData) {
      // For file uploads, let the browser set the Content-Type
      options.body = data;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }
  }

  return options;
};

// ===========================================
// CATEGORY API FUNCTIONS
// ===========================================

export const categoryApi = {
  // GET: Fetch all categories
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // GET: Fetch category by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  // POST: Create new category
  create: async (categoryData) => {
    try {
      let requestData;
      let isFormData = false;

      // Check if image is included
      if (categoryData.image_path) {
        // Create FormData for file upload
        requestData = new FormData();
        requestData.append('name', categoryData.name);
        requestData.append('image_path', categoryData.image_path);
        isFormData = true;
      } else {
        // Use JSON for text-only data
        requestData = { name: categoryData.name };
      }

      const response = await fetch(
        `${API_BASE_URL}/categories`,
        createRequestOptions('POST', requestData, isFormData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // PUT: Update category by ID
  update: async (id, categoryData) => {
    try {
      let requestData;
      let isFormData = false;

      // Check if image is included
      if (categoryData.image_path) {
        // Create FormData for file upload
        requestData = new FormData();
        if (categoryData.name) requestData.append('name', categoryData.name);
        requestData.append('image_path', categoryData.image_path);
        requestData.append('_method', 'PUT'); // Laravel requires this for file uploads with PUT
        isFormData = true;
      } else {
        // Use JSON for text-only data
        requestData = {};
        if (categoryData.name) requestData.name = categoryData.name;
      }

      const response = await fetch(
        `${API_BASE_URL}/categories/${id}`,
        createRequestOptions(isFormData ? 'POST' : 'PUT', requestData, isFormData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  // DELETE: Delete category by ID
  delete: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/${id}`,
        createRequestOptions('DELETE')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};

// ===========================================
// PRODUCT API
// ===========================================
export const productApi = {
  // GET: Fetch all products
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // GET: Fetch single product by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // POST: Create new product
  create: async (productData) => {
    try {
      const isFormData = productData.image_path instanceof File;
      let requestData;

      if (isFormData) {
        requestData = new FormData();
        requestData.append('name', productData.name);
        requestData.append('price', productData.price);
        requestData.append('discount', productData.discount || 0);
        requestData.append('description', productData.description || '');
        requestData.append('status', productData.status || 'available');
        requestData.append('category_id', productData.category_id);
        if (productData.image_path) {
          requestData.append('image_path', productData.image_path);
        }
      } else {
        requestData = productData;
      }

      const response = await fetch(
        `${API_BASE_URL}/products`,
        createRequestOptions('POST', requestData, isFormData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // PUT: Update existing product
  update: async (id, productData) => {
    try {
      const isFormData = productData.image_path instanceof File;
      let requestData;

      if (isFormData) {
        requestData = new FormData();
        if (productData.name) requestData.append('name', productData.name);
        if (productData.price) requestData.append('price', productData.price);
        if (productData.discount !== undefined) requestData.append('discount', productData.discount);
        if (productData.description) requestData.append('description', productData.description);
        if (productData.status) requestData.append('status', productData.status);
        if (productData.category_id) requestData.append('category_id', productData.category_id);
        if (productData.image_path) requestData.append('image_path', productData.image_path);
        requestData.append('_method', 'PUT');
      } else {
        requestData = {};
        if (productData.name) requestData.name = productData.name;
        if (productData.price) requestData.price = productData.price;
        if (productData.discount !== undefined) requestData.discount = productData.discount;
        if (productData.description) requestData.description = productData.description;
        if (productData.status) requestData.status = productData.status;
        if (productData.category_id) requestData.category_id = productData.category_id;
      }

      const response = await fetch(
        `${API_BASE_URL}/products/${id}`,
        createRequestOptions(isFormData ? 'POST' : 'PUT', requestData, isFormData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // DELETE: Delete product by ID
  delete: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${id}`,
        createRequestOptions('DELETE')
      );
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

// ===========================================
// EXPORT DEFAULT API OBJECT
// ===========================================
export default {
  category: categoryApi,
  product: productApi,
};
