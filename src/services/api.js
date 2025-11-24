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

// -------------------------
// Mock mode (in-memory) support
// Use mocks when explicitly enabled OR when not running in production (dev mode)
// Set VITE_USE_MOCKS=true in .env to force mocks in production if desired
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true' || import.meta.env.MODE !== 'production';

// Simple in-memory mock data (used when USE_MOCKS === true)
const _mock = {
  products: [
    { id: 1, name: 'Grilled Chicken', price: '12.99', discount: 20, description: 'Delicious grilled chicken', image: 'https://via.placeholder.com/600x400?text=Grilled+Chicken', category_id: 1, sold_count: 120, is_bestseller: true, is_best_seller: true },
    { id: 2, name: 'Beef Burger', price: '10.99', discount: 15, description: 'Juicy beef burger', image: 'https://via.placeholder.com/600x400?text=Beef+Burger', category_id: 2, sold_count: 80, is_bestseller: true, is_best_seller: true },
    { id: 3, name: 'Caesar Salad', price: '8.99', discount: 25, description: 'Fresh salad', image: 'https://via.placeholder.com/600x400?text=Caesar+Salad', category_id: 3, sold_count: 30, is_bestseller: false, is_best_seller: false },
  ],
  categories: [
    { id: 1, name: 'Chicken', image: 'https://via.placeholder.com/120x120?text=Chicken' },
    { id: 2, name: 'Burgers', image: 'https://via.placeholder.com/120x120?text=Burgers' },
    { id: 3, name: 'Salads', image: 'https://via.placeholder.com/120x120?text=Salads' },
  ],
  cart: [],
  orders: [
    { id: 1, number: 'ORD-1001', items: [{ product_id: 1, qty: 2 }], total: '25.98', status: 'pending' }
  ],
};

const mockDelay = (result) => new Promise((res) => setTimeout(() => res({ data: result }), 150));


// ===========================================
// CATEGORY API FUNCTIONS
// ===========================================

export const categoryApi = {
  // GET: Fetch all categories
  getAll: async () => {
    try {
      if (USE_MOCKS) return await mockDelay(_mock.categories);
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
      if (USE_MOCKS) return await mockDelay(_mock.categories.find(c => c.id === Number(id)) || null);
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
      if (USE_MOCKS) {
        _mock.categories = _mock.categories.filter(c => c.id !== Number(id));
        return await mockDelay({ success: true });
      }
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
      if (USE_MOCKS) return await mockDelay(_mock.products);
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
      if (USE_MOCKS) return await mockDelay(_mock.products.find(p => p.id === Number(id)) || null);
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // GET: Fetch best sellers products
  getBestSellers: async () => {
    try {
      if (USE_MOCKS) {
        const sellers = _mock.products.filter(p => p.is_bestseller);
        return await mockDelay(sellers);
      }
      const response = await fetch(`${API_BASE_URL}/products/best-sellers/list`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      throw error;
    }
  },

  // GET: Fetch discount products
  getDiscounts: async () => {
    try {
      if (USE_MOCKS) {
        const discounts = _mock.products.filter(p => p.discount && Number(p.discount) > 0);
        return await mockDelay(discounts);
      }
      const response = await fetch(`${API_BASE_URL}/products/discounts/list`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching discounts:', error);
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

      if (USE_MOCKS) {
        const newId = _mock.products.length ? Math.max(..._mock.products.map(p => p.id)) + 1 : 1;
        const newProduct = { id: newId, ...(!isFormData ? requestData : {}), ...(isFormData ? { name: productData.name, price: productData.price } : {}) };
        _mock.products.push(newProduct);
        return await mockDelay(newProduct);
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

      if (USE_MOCKS) {
        const idx = _mock.products.findIndex(p => p.id === Number(id));
        if (idx === -1) throw new Error('Product not found');
        _mock.products[idx] = { ..._mock.products[idx], ...requestData };
        return await mockDelay(_mock.products[idx]);
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
      if (USE_MOCKS) {
        _mock.products = _mock.products.filter(p => p.id !== Number(id));
        return await mockDelay({ success: true });
      }
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
// AUTHENTICATED /v1/auth API HELPERS
// ===========================================

const AUTH_BASE = `${API_BASE_URL}/v1/auth`;

export const authProductApi = {
  getAll: async () => {
    try {
      if (USE_MOCKS) return await mockDelay(_mock.products);
      const url = `${AUTH_BASE}/products`;
      console.debug('authProductApi.getAll ->', url);
      const response = await fetchWithAuth(url);
      const data = await handleResponse(response);
      console.debug('authProductApi.getAll response ->', data);
      return data;
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
      const data = await handleResponse(response);
      console.debug('authProductApi.getById response ->', data);
      return data;
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
      const data = await handleResponse(response);
      console.debug('authCategoryApi.getAll response ->', data);
      return data;
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
      const data = await handleResponse(response);
      console.debug('authCategoryApi.getById response ->', data);
      return data;
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
  // GET: get current cart
  getCart: async () => {
    try {
      if (USE_MOCKS) return await mockDelay(_mock.cart);
      const url = `${AUTH_BASE}/cart`;
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
      if (USE_MOCKS) {
        const newId = _mock.cart.length ? Math.max(..._mock.cart.map(i => i.id)) + 1 : 1;
        const item = { id: newId, ...itemData };
        _mock.cart.push(item);
        return await mockDelay(item);
      }
      const url = `${AUTH_BASE}/cart`;
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
      if (USE_MOCKS) {
        const idx = _mock.cart.findIndex(i => i.id === Number(id));
        if (idx === -1) throw new Error('Cart item not found');
        _mock.cart[idx] = { ..._mock.cart[idx], ...data };
        return await mockDelay(_mock.cart[idx]);
      }
      const url = `${AUTH_BASE}/cart/${id}`;
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
      if (USE_MOCKS) {
        _mock.cart = _mock.cart.filter(i => i.id !== Number(id));
        return await mockDelay({ success: true });
      }
      const url = `${AUTH_BASE}/cart/${id}`;
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
      if (USE_MOCKS) {
        const newId = _mock.orders.length ? Math.max(..._mock.orders.map(o => o.id)) + 1 : 1;
        const number = `ORD-${1000 + newId}`;
        const order = { id: newId, number, status: 'pending', total: orderData.total || '0.00', items: orderData.items || [] };
        _mock.orders.push(order);
        return await mockDelay(order);
      }
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
      if (USE_MOCKS) return await mockDelay({ ok: true });
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
      if (USE_MOCKS) return await mockDelay(_mock.orders.find(o => o.number === String(number)) || null);
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
      if (USE_MOCKS) return await mockDelay(['pending', 'paid', 'cancelled', 'shipped']);
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
  }
};

export const authPaymentApi = {
  // GET: payment cancel
  cancel: async () => {
    try {
      if (USE_MOCKS) return await mockDelay({ cancelled: true });
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
      if (USE_MOCKS) return await mockDelay({ id: 'pay_mock_1', status: 'created', ...paymentData });
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
      if (USE_MOCKS) return await mockDelay({ success: true });
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
};
