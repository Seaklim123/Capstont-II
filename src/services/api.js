// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000';

// Helper function to transform image paths to full URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  if (imagePath.startsWith('/storage/')) return `${STORAGE_BASE_URL}${imagePath}`;
  if (imagePath.startsWith('storage/')) return `${STORAGE_BASE_URL}/${imagePath}`;
  return `${STORAGE_BASE_URL}/storage/${imagePath}`;
};

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

// Helper to get auth headers (reads token from localStorage)
const getAuthHeaders = () => {
  const headers = {};
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Wrapper around fetch that injects Authorization header when available
const fetchWithAuth = async (url, options = {}) => {
  const authHeaders = getAuthHeaders();
  options.headers = {
    ...(options.headers || {}),
    Accept: 'application/json',
    ...authHeaders,
  };
  // If sending JSON body and Content-Type not set, add it
  if (options.body && !(options.body instanceof FormData) && !options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }
  console.debug('fetchWithAuth', url, options);
  return fetch(url, options);
};



// ===========================================
// CATEGORY API FUNCTIONS
// ===========================================

export const categoryApi = {
  // GET: Fetch all categories
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/categories`);
      const result = await handleResponse(response);
      // Transform image paths to full URLs
      if (result.data && Array.isArray(result.data)) {
        result.data = result.data.map(cat => ({
          ...cat,
          image: getImageUrl(cat.image || cat.image_path),
          image_url: getImageUrl(cat.image || cat.image_path)
        }));
      }
      return result;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // GET: Fetch category by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/categories/${id}`);
      const result = await handleResponse(response);
      // Transform image path to full URL
      if (result.data) {
        result.data.image = getImageUrl(result.data.image || result.data.image_path);
        result.data.image_url = getImageUrl(result.data.image || result.data.image_path);
      }
      return result;
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
        `${API_BASE_URL}/v1/auth/categories`,
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
        `${API_BASE_URL}/v1/auth/categories/${id}`,
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
        `${API_BASE_URL}/v1/auth/categories/${id}`,
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
      const response = await fetch(`${API_BASE_URL}/v1/auth/products`);
      const result = await handleResponse(response);
      // Keep all original fields from backend including image_path
      if (result.data && Array.isArray(result.data)) {
        result.data = result.data.map(product => ({
          ...product,
          price: parseFloat(product.price || 0),
          discount: parseFloat(product.discount || 0),
          is_best_seller: product.is_bestseller || product.is_best_seller || false
        }));
      }
      return result;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // GET: Fetch single product by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/products/${id}`);
      const result = await handleResponse(response);
      // Keep all original fields from backend
      if (result.data) {
        result.data.price = parseFloat(result.data.price || 0);
        result.data.discount = parseFloat(result.data.discount || 0);
        result.data.is_best_seller = result.data.is_bestseller || result.data.is_best_seller || false;
      }
      return result;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // POST: Create new product
  create: async (productData) => {
    try {
      const isFormData = productData && productData.image_path instanceof File;
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
        `${API_BASE_URL}/v1/auth/products`,
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
      const isFormData = productData && productData.image_path instanceof File;
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
        `${API_BASE_URL}/v1/auth/products/${id}`,
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
        `${API_BASE_URL}/v1/auth/products/${id}`,
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
// AUTHENTICATED /v1/auth API HELPERS
// ===========================================

const AUTH_BASE = `${API_BASE_URL}/v1/auth`;
const CASHIER_BASE = `${API_BASE_URL}/v1/cashier`;

// ===========================================
// CASHIER API (No Mock Data - Always use real backend)
// ===========================================

export const cashierProductApi = {
  getAll: async () => {
    try {
      const url = `${CASHIER_BASE}/products`;
      console.log('🔵 Fetching cashier products from:', url);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        }
      });
      console.log('🔵 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Cashier products raw result:', result);
      
      // Transform image paths to full URLs
      if (result.data && Array.isArray(result.data)) {
        result.data = result.data.map(product => ({
          ...product,
          image: getImageUrl(product.image || product.image_path),
          image_url: getImageUrl(product.image || product.image_path),
          price: parseFloat(product.price || 0),
          discount: parseFloat(product.discount || 0)
        }));
      }
      console.log('✅ Transformed products:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching cashier products:', error.message);
      console.error('❌ Full error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const url = `${CASHIER_BASE}/products/${id}`;
      console.debug(`cashierProductApi.getById -> ${url}`);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        }
      });
      const result = await handleResponse(response);
      // Transform image path to full URL
      if (result.data) {
        result.data.image = getImageUrl(result.data.image || result.data.image_path);
        result.data.image_url = getImageUrl(result.data.image || result.data.image_path);
        result.data.price = parseFloat(result.data.price || 0);
        result.data.discount = parseFloat(result.data.discount || 0);
      }
      console.debug('cashierProductApi.getById response ->', result);
      return result;
    } catch (error) {
      console.error(`Error fetching cashier product ${id}:`, error);
      throw error;
    }
  }
};

export const cashierCategoryApi = {
  getAll: async () => {
    try {
      const url = `${CASHIER_BASE}/categories`;
      console.log('🔵 Fetching cashier categories from:', url);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        }
      });
      console.log('🔵 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Cashier categories raw result:', result);
      
      // Transform image paths to full URLs
      if (result.data && Array.isArray(result.data)) {
        result.data = result.data.map(cat => ({
          ...cat,
          image: getImageUrl(cat.image || cat.image_path),
          image_url: getImageUrl(cat.image || cat.image_path)
        }));
      }
      console.log('✅ Transformed categories:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching cashier categories:', error.message);
      console.error('❌ Full error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const url = `${CASHIER_BASE}/categories/${id}`;
      console.debug(`cashierCategoryApi.getById -> ${url}`);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        }
      });
      const result = await handleResponse(response);
      // Transform image path to full URL
      if (result.data) {
        result.data.image = getImageUrl(result.data.image || result.data.image_path);
        result.data.image_url = getImageUrl(result.data.image || result.data.image_path);
      }
      console.debug('cashierCategoryApi.getById response ->', result);
      return result;
    } catch (error) {
      console.error(`Error fetching cashier category ${id}:`, error);
      throw error;
    }
  }
};

export const authProductApi = {
  getAll: async () => {
    try {
      if (USE_MOCKS) return await mockDelay(_mock.products);
      const url = `${AUTH_BASE}/products`;
      console.debug('authProductApi.getAll ->', url);
      const response = await fetchWithAuth(url);
      const result = await handleResponse(response);
      // Transform image paths to full URLs
      if (result.data && Array.isArray(result.data)) {
        result.data = result.data.map(product => ({
          ...product,
          image: getImageUrl(product.image || product.image_path),
          image_url: getImageUrl(product.image || product.image_path),
          price: parseFloat(product.price || 0),
          discount: parseFloat(product.discount || 0)
        }));
      }
      console.debug('authProductApi.getAll response ->', result);
      return result;
    } catch (error) {
      console.error('Error fetching auth products:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      if (USE_MOCKS) return await mockDelay(_mock.products.find(p => p.id === Number(id)) || null);
      const url = `${AUTH_BASE}/products/${id}`;
      console.debug(`authProductApi.getById -> ${url}`);
      const response = await fetchWithAuth(url);
      const result = await handleResponse(response);
      // Transform image path to full URL
      if (result.data) {
        result.data.image = getImageUrl(result.data.image || result.data.image_path);
        result.data.image_url = getImageUrl(result.data.image || result.data.image_path);
        result.data.price = parseFloat(result.data.price || 0);
        result.data.discount = parseFloat(result.data.discount || 0);
      }
      console.debug('authProductApi.getById response ->', result);
      return result;
    } catch (error) {
      console.error(`Error fetching auth product ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      if (USE_MOCKS) {
        const newId = _mock.products.length ? Math.max(..._mock.products.map(p => p.id)) + 1 : 1;
        const newProduct = { id: newId, ...(data instanceof FormData ? Object.fromEntries(data.entries()) : data) };
        _mock.products.push(newProduct);
        return await mockDelay(newProduct);
      }
      const isFormData = data instanceof FormData;
      const url = `${AUTH_BASE}/products`;
      console.debug('authProductApi.create ->', url, isFormData ? 'FormData' : data);
      const response = await fetchWithAuth(
        url,
        createRequestOptions('POST', data, isFormData)
      );
      const resData = await handleResponse(response);
      console.debug('authProductApi.create response ->', resData);
      return resData;
    } catch (error) {
      console.error('Error creating auth product:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      if (USE_MOCKS) {
        const idx = _mock.products.findIndex(p => p.id === Number(id));
        if (idx === -1) throw new Error('Product not found');
        const update = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        _mock.products[idx] = { ..._mock.products[idx], ...update };
        return await mockDelay(_mock.products[idx]);
      }
      const isFormData = data instanceof FormData;
      const url = `${AUTH_BASE}/products/${id}`;
      console.debug(`authProductApi.update -> ${url}`, isFormData ? 'FormData' : data);
      const response = await fetchWithAuth(
        url,
        createRequestOptions(isFormData ? 'POST' : 'PUT', data, isFormData)
      );
      const resData = await handleResponse(response);
      console.debug('authProductApi.update response ->', resData);
      return resData;
    } catch (error) {
      console.error(`Error updating auth product ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      if (USE_MOCKS) {
        _mock.products = _mock.products.filter(p => p.id !== Number(id));
        return await mockDelay({ success: true });
      }
      const url = `${AUTH_BASE}/products/${id}`;
      console.debug(`authProductApi.delete -> ${url}`);
      const response = await fetchWithAuth(url, createRequestOptions('DELETE'));
      const data = await handleResponse(response);
      console.debug('authProductApi.delete response ->', data);
      return data;
    } catch (error) {
      console.error(`Error deleting auth product ${id}:`, error);
      throw error;
    }
  },
};

export const authCategoryApi = {
  getAll: async () => {
    try {
      if (USE_MOCKS) return await mockDelay(_mock.categories);
      const url = `${AUTH_BASE}/categories`;
      console.debug('authCategoryApi.getAll ->', url);
      const response = await fetchWithAuth(url);
      const result = await handleResponse(response);
      // Transform image paths to full URLs
      if (result.data && Array.isArray(result.data)) {
        result.data = result.data.map(cat => ({
          ...cat,
          image: getImageUrl(cat.image || cat.image_path),
          image_url: getImageUrl(cat.image || cat.image_path)
        }));
      }
      console.debug('authCategoryApi.getAll response ->', result);
      return result;
    } catch (error) {
      console.error('Error fetching auth categories:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      if (USE_MOCKS) return await mockDelay(_mock.categories.find(c => c.id === Number(id)) || null);
      const url = `${AUTH_BASE}/categories/${id}`;
      console.debug(`authCategoryApi.getById -> ${url}`);
      const response = await fetchWithAuth(url);
      const result = await handleResponse(response);
      // Transform image path to full URL
      if (result.data) {
        result.data.image = getImageUrl(result.data.image || result.data.image_path);
        result.data.image_url = getImageUrl(result.data.image || result.data.image_path);
      }
      console.debug('authCategoryApi.getById response ->', result);
      return result;
    } catch (error) {
      console.error(`Error fetching auth category ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      if (USE_MOCKS) {
        const newId = _mock.categories.length ? Math.max(..._mock.categories.map(c => c.id)) + 1 : 1;
        const newCat = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        const created = { id: newId, ...newCat };
        _mock.categories.push(created);
        return await mockDelay(created);
      }
      const isFormData = data instanceof FormData;
      const response = await fetchWithAuth(
        `${AUTH_BASE}/categories`,
        createRequestOptions('POST', data, isFormData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating auth category:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      if (USE_MOCKS) {
        const idx = _mock.categories.findIndex(c => c.id === Number(id));
        if (idx === -1) throw new Error('Category not found');
        const update = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        _mock.categories[idx] = { ..._mock.categories[idx], ...update };
        return await mockDelay(_mock.categories[idx]);
      }
      const isFormData = data instanceof FormData;
      const response = await fetchWithAuth(
        `${AUTH_BASE}/categories/${id}`,
        createRequestOptions(isFormData ? 'POST' : 'PUT', data, isFormData)
      );
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating auth category ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      if (USE_MOCKS) {
        _mock.categories = _mock.categories.filter(c => c.id !== Number(id));
        return await mockDelay({ success: true });
      }
      const response = await fetchWithAuth(`${AUTH_BASE}/categories/${id}`, createRequestOptions('DELETE'));
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting auth category ${id}:`, error);
      throw error;
    }
  },
};

export const authCartApi = {
  // GET: list all carts for the authenticated user
  list: async () => {
    try {
      if (USE_MOCKS) return await mockDelay(_mock.cart);
      const url = `${AUTH_BASE}/carts`;
      console.debug('authCartApi.list ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('authCartApi.list response ->', data);
      return data;
    } catch (error) {
      console.error('Error listing auth carts:', error);
      throw error;
    }
  },
  // GET: get current cart
  getCart: async (id) => {
    try {
      const url = `${AUTH_BASE}/carts/${id}`;
      console.debug('authCartApi.getCart ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('authCartApi.getCart response ->', data);
      return data;
    } catch (error) {
      console.error('Error fetching auth cart:', error);
      throw error;
    }
  },

  // POST: add item to cart
  addItem: async (itemData) => {
    try {
      const url = `${AUTH_BASE}/carts`;
      console.debug('authCartApi.addItem ->', url, itemData);
      const response = await fetchWithAuth(
        url,
        createRequestOptions('POST', itemData)
      );
      const data = await handleResponse(response);
      console.debug('authCartApi.addItem response ->', data);
      return data;
    } catch (error) {
      console.error('Error adding auth cart item:', error);
      throw error;
    }
  },

  // PUT: update cart item by id
  updateItem: async (id, data) => {
    try {
      const url = `${AUTH_BASE}/carts/${id}`;
      console.debug(`authCartApi.updateItem -> ${url}`, data);
      const response = await fetchWithAuth(
        url,
        createRequestOptions('PUT', data)
      );
      const resData = await handleResponse(response);
      console.debug('authCartApi.updateItem response ->', resData);
      return resData;
    } catch (error) {
      console.error(`Error updating auth cart item ${id}:`, error);
      throw error;
    }
  },

  // DELETE: remove cart item
  removeItem: async (id) => {
    try {
      const url = `${AUTH_BASE}/carts/${id}`;
      console.debug(`authCartApi.removeItem -> ${url}`);
      const response = await fetchWithAuth(url, createRequestOptions('DELETE'));
      const data = await handleResponse(response);
      console.debug('authCartApi.removeItem response ->', data);
      return data;
    } catch (error) {
      console.error(`Error removing auth cart item ${id}:`, error);
      throw error;
    }
  },
};

export const authOrdersApi = {
  // POST: create new order
  create: async (orderData) => {
    try {
      const url = `${AUTH_BASE}/orders`;
      console.debug('authOrdersApi.create ->', url, orderData);
      const response = await fetchWithAuth(url, createRequestOptions('POST', orderData));
      const data = await handleResponse(response);
      console.debug('authOrdersApi.create response ->', data);
      return data;
    } catch (error) {
      console.error('Error creating auth order:', error);
      throw error;
    }
  },

  // GET: check order (generic endpoint)
  checkOrder: async () => {
    try {
      const url = `${AUTH_BASE}/orders/checkOrder`;
      console.debug('authOrdersApi.checkOrder ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('authOrdersApi.checkOrder response ->', data);
      return data;
    } catch (error) {
      console.error('Error checking auth order:', error);
      throw error;
    }
  },

  // GET: find order by number
  findByNumber: async (number) => {
    try {
      const url = `${AUTH_BASE}/orders/findByNumber/${number}`;
      console.debug(`authOrdersApi.findByNumber -> ${url}`);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('authOrdersApi.findByNumber response ->', data);
      return data;
    } catch (error) {
      console.error(`Error finding auth order ${number}:`, error);
      throw error;
    }
  },

  // GET: order status list
  getStatus: async () => {
    try {
      const url = `${AUTH_BASE}/orders/status`;
      console.debug('authOrdersApi.getStatus ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('authOrdersApi.getStatus response ->', data);
      return data;
    } catch (error) {
      console.error('Error fetching auth order statuses:', error);
      throw error;
    }
  },

  // GET: get all orders for authenticated user
  getAll: async () => {
    try {
      const url = `${AUTH_BASE}/orders`;
      console.debug('authOrdersApi.getAll ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('authOrdersApi.getAll response ->', data);
      return data;
    } catch (error) {
      console.error('Error fetching auth orders:', error);
      throw error;
    }
  }
};

export const authPaymentApi = {
  // GET: payment cancel
  cancel: async () => {
    try {
      const url = `${AUTH_BASE}/payment/cancel`;
      console.debug('authPaymentApi.cancel ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('authPaymentApi.cancel response ->', data);
      return data;
    } catch (error) {
      console.error('Error calling payment cancel:', error);
      throw error;
    }
  },

  // POST: payment create
  create: async (paymentData) => {
    try {
      const url = `${AUTH_BASE}/payment/create`;
      console.debug('authPaymentApi.create ->', url, paymentData);
      const response = await fetchWithAuth(url, createRequestOptions('POST', paymentData));
      const data = await handleResponse(response);
      console.debug('authPaymentApi.create response ->', data);
      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // GET: payment success
  success: async () => {
    try {
      const url = `${AUTH_BASE}/payment/success`;
      console.debug('authPaymentApi.success ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('authPaymentApi.success response ->', data);
      return data;
    } catch (error) {
      console.error('Error calling payment success:', error);
      throw error;
    }
  }
};

// ===========================================
// TABLE API (For Table Number Verification)
// ===========================================

export const tableApi = {
  // GET: Verify table number exists
  verify: async (tableNumber) => {
    try {
      const url = `${AUTH_BASE}/tables/verify/${tableNumber}`;
      console.debug('tableApi.verify ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('tableApi.verify response ->', data);
      return data;
    } catch (error) {
      console.error(`Error verifying table ${tableNumber}:`, error);
      throw error;
    }
  },

  // GET: Get all tables
  getAll: async () => {
    try {
      const url = `${AUTH_BASE}/tables`;
      console.debug('tableApi.getAll ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('tableApi.getAll response ->', data);
      return data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  }
};

// ===========================================
// ADMIN TABLE API (For Table Management)
// ===========================================

export const adminTableApi = {
  // GET: Get all tables
  getAll: async () => {
    try {
      const url = `${API_BASE_URL}/v1/admin/tables`;
      console.debug('adminTableApi.getAll ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('adminTableApi.getAll response ->', data);
      return data;
    } catch (error) {
      console.error('Error fetching admin tables:', error);
      throw error;
    }
  },

  // GET: Get table by ID
  getById: async (id) => {
    try {
      const url = `${API_BASE_URL}/v1/admin/tables/${id}`;
      console.debug('adminTableApi.getById ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('adminTableApi.getById response ->', data);
      return data;
    } catch (error) {
      console.error(`Error fetching admin table ${id}:`, error);
      throw error;
    }
  },

  // POST: Create new table
  create: async (tableData) => {
    try {
      const url = `${API_BASE_URL}/v1/admin/tables`;
      console.debug('adminTableApi.create ->', url, tableData);
      const response = await fetchWithAuth(url, createRequestOptions('POST', tableData));
      const data = await handleResponse(response);
      console.debug('adminTableApi.create response ->', data);
      return data;
    } catch (error) {
      console.error('Error creating admin table:', error);
      throw error;
    }
  },

  // PUT: Update table
  update: async (id, tableData) => {
    try {
      const url = `${API_BASE_URL}/v1/admin/tables/${id}`;
      console.debug('adminTableApi.update ->', url, tableData);
      const response = await fetchWithAuth(url, createRequestOptions('PUT', tableData));
      const data = await handleResponse(response);
      console.debug('adminTableApi.update response ->', data);
      return data;
    } catch (error) {
      console.error(`Error updating admin table ${id}:`, error);
      throw error;
    }
  },

  // DELETE: Delete table
  delete: async (id) => {
    try {
      const url = `${API_BASE_URL}/v1/admin/tables/${id}`;
      console.debug('adminTableApi.delete ->', url);
      const response = await fetchWithAuth(url, createRequestOptions('DELETE'));
      const data = await handleResponse(response);
      console.debug('adminTableApi.delete response ->', data);
      return data;
    } catch (error) {
      console.error(`Error deleting admin table ${id}:`, error);
      throw error;
    }
  },

  // PUT: Update table status
  updateStatus: async (id, status) => {
    try {
      const url = `${API_BASE_URL}/v1/admin/tables/${id}/status`;
      console.debug('adminTableApi.updateStatus ->', url, { status });
      const response = await fetchWithAuth(url, createRequestOptions('PUT', { status }));
      const data = await handleResponse(response);
      console.debug('adminTableApi.updateStatus response ->', data);
      return data;
    } catch (error) {
      console.error(`Error updating table ${id} status:`, error);
      throw error;
    }
  }
};

// ===========================================
// ADMIN API (For Admin Dashboard)
// ===========================================

export const adminOrderApi = {
  // GET: Get orders by status
  getByStatus: async (status) => {
    try {
      const url = `${API_BASE_URL}/v1/admin/orders/status?status=${status}`;
      console.debug('adminOrderApi.getByStatus ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('adminOrderApi.getByStatus response ->', data);
      return data;
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      throw error;
    }
  },

  // GET: Get all orders
  getAll: async () => {
    try {
      const url = `${API_BASE_URL}/v1/admin/orders`;
      console.debug('adminOrderApi.getAll ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('adminOrderApi.getAll response ->', data);
      return data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  // PUT: Update order status
  updateStatus: async (orderId, status) => {
    try {
      const url = `${API_BASE_URL}/v1/admin/orders/${orderId}/status`;
      console.debug('adminOrderApi.updateStatus ->', url, { status });
      const response = await fetchWithAuth(url, createRequestOptions('PUT', { status }));
      const data = await handleResponse(response);
      console.debug('adminOrderApi.updateStatus response ->', data);
      return data;
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      throw error;
    }
  }
};

export const adminCategoryApi = {
  getAll: async () => {
    try {
      const url = `${API_BASE_URL}/v1/admin/categories`;
      console.debug('adminCategoryApi.getAll ->', url);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      });
      const result = await handleResponse(response);
      if (result.data && Array.isArray(result.data)) {
        result.data = result.data.map(cat => ({
          ...cat,
          image: getImageUrl(cat.image || cat.image_path),
          image_url: getImageUrl(cat.image || cat.image_path)
        }));
      }
      return result;
    } catch (error) {
      console.error('Error fetching admin categories:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/admin/categories/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      });
      const result = await handleResponse(response);
      if (result.data) {
        result.data.image = getImageUrl(result.data.image || result.data.image_path);
        result.data.image_url = getImageUrl(result.data.image || result.data.image_path);
      }
      return result;
    } catch (error) {
      console.error(`Error fetching admin category ${id}:`, error);
      throw error;
    }
  },

  create: async (categoryData) => {
    try {
      const isFormData = categoryData instanceof FormData || categoryData.image_path instanceof File;
      let requestData;

      if (isFormData && !(categoryData instanceof FormData)) {
        requestData = new FormData();
        requestData.append('name', categoryData.name);
        if (categoryData.image_path) {
          requestData.append('image_path', categoryData.image_path);
        }
      } else {
        requestData = categoryData;
      }

      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      };

      if (!(requestData instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(requestData);
      } else {
        options.body = requestData;
      }

      const response = await fetch(`${API_BASE_URL}/v1/admin/categories`, options);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating admin category:', error);
      throw error;
    }
  },

  update: async (id, categoryData) => {
    try {
      const isFormData = categoryData instanceof FormData || categoryData.image_path instanceof File;
      let requestData;
      let method = 'PUT';

      if (isFormData && !(categoryData instanceof FormData)) {
        requestData = new FormData();
        if (categoryData.name) requestData.append('name', categoryData.name);
        if (categoryData.image_path) requestData.append('image_path', categoryData.image_path);
        requestData.append('_method', 'PUT');
        method = 'POST';
      } else if (categoryData instanceof FormData) {
        requestData = categoryData;
        requestData.append('_method', 'PUT');
        method = 'POST';
      } else {
        requestData = categoryData;
      }

      const options = {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      };

      if (!(requestData instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(requestData);
      } else {
        options.body = requestData;
      }

      const response = await fetch(`${API_BASE_URL}/v1/admin/categories/${id}`, options);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating admin category ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting admin category ${id}:`, error);
      throw error;
    }
  }
};

export const adminProductApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/admin/products`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      });
      const result = await handleResponse(response);
      if (result.data && Array.isArray(result.data)) {
        result.data = result.data.map(product => ({
          ...product,
          image: getImageUrl(product.image || product.image_path),
          image_url: getImageUrl(product.image || product.image_path),
          price: parseFloat(product.price || 0),
          discount: parseFloat(product.discount || 0)
        }));
      }
      return result;
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/admin/products/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching admin product:', error);
      throw error;
    }
  },

  create: async (productData) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/v1/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        },
        body: formData
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating admin product:', error);
      throw error;
    }
  },

  update: async (id, productData) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/v1/admin/products/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        },
        body: formData
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating admin product:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting admin product:', error);
      throw error;
    }
  }
};

// ===========================================
// EXPORT DEFAULT API OBJECT
// ===========================================
export default {
  category: categoryApi,
  product: productApi,
  auth: {
    product: authProductApi,
    category: authCategoryApi,
    cart: authCartApi,
  },
  cashier: {
    product: cashierProductApi,
    category: cashierCategoryApi,
  },
  admin: {
    category: adminCategoryApi,
    product: adminProductApi,
    table: adminTableApi,
    order: adminOrderApi,
  },
  table: tableApi,
};
