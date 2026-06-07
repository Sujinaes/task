import apiClient from '../apiClient';

const getVendorId = () => localStorage.getItem('roleId');

export const vendorService = {
  getAllProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.warrantyType) params.append('warrantyType', filters.warrantyType);
      if (filters.minPrice !== undefined && filters.minPrice !== '') {
        params.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
        params.append('maxPrice', filters.maxPrice);
      }
      const queryString = params.toString();
      const url = `/api/vendor/all-products${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  getCategories: async () => {
    try {
      const response = await apiClient.get('/api/products/categories');
      return response.data.map(cat => cat.categoryName);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  getWarrantyTypes: async () => {
    try {
      const response = await apiClient.get('/api/products/warranty-types');
      return response.data.map(wt => wt.warrantyType);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch warranty types');
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      const vendorId = getVendorId();
      const payload = {
        productId: productId,
        quantity: quantity
      };
      const response = await apiClient.post(
        `/api/vendor/cart/add?vendorId=${vendorId}`,
        payload
      );
      window.dispatchEvent(new Event('cartUpdated'));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update cart');
    }
  },

  getCart: async () => {
    try {
      const vendorId = getVendorId();
      const response = await apiClient.get(`/api/vendor/cart?vendorId=${vendorId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart');
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      const vendorId = getVendorId();
      const response = await apiClient.delete(`/api/vendor/cart/remove/${cartItemId}?vendorId=${vendorId}`);
      window.dispatchEvent(new Event('cartUpdated'));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  },

  placeOrder: async (cartItemIds, vendorDetails) => {
    try {
      const vendorId = getVendorId();
      const body = {};
      if (cartItemIds && cartItemIds.length > 0) body.cartItemIds = cartItemIds;
      if (vendorDetails) {
        body.vendorName = vendorDetails.vendorName;
        body.address = vendorDetails.vendorAddress;
        body.location = vendorDetails.vendorLocation;
      }
      const response = await apiClient.post(
        `/api/vendor/orders/place?vendorId=${vendorId}`,
        Object.keys(body).length > 0 ? body : undefined
      );
      window.dispatchEvent(new Event('cartUpdated'));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to place order');
    }
  },

  getOrders: async () => {
    try {
      const vendorId = getVendorId();
      const response = await apiClient.get(`/api/vendor/orders?vendorId=${vendorId}`);
      console.log("Orders Response:", response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  getOrderDetails: async (orderId) => {
    try {
      const response = await apiClient.get(`/api/vendor/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order details');
    }
  },

  cancelOrder: async (orderId) => {
  console.log('4. vendorService.cancelOrder received:', orderId, 'Type:', typeof orderId);
  try {
    const response = await apiClient.patch(`/api/vendor/orders/cancel/${orderId}`);
    console.log('5. Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('6. Error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to cancel order');
  }
},
};