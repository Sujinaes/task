import apiClient from '../apiClient';

export const productService = {

  //Categories Dropdown
  getCategories: async () => {
    const response = await apiClient.get('/api/products/categories');
    return response.data;
  },

  //Warranty Dropdown
  getWarrantyTypes: async () => {
    const response = await apiClient.get('/api/products/warranty-types');
    return response.data;
  },

  getAllProducts: async () => {
    const response = await apiClient.get(
      `/api/manufacturer/products?manufacturerId=${localStorage.getItem("roleId")}`
    );
    return response.data;
  },

  getAllVendorProducts: async () => {
    const response = await apiClient.get('/api/vendor/all-products');
    return response.data;
  },

  getProductById: async (productId) => {
    const manufacturerId = localStorage.getItem("roleId");
    const response = await apiClient.get(`/api/manufacturer/product?manufacturerId=${manufacturerId}&productId=${productId}`);
    const p = response.data;

    if (p && p.productName) {
      return {
        name: p.productName,
        category: p.category,
        price: String(p.price),
        warranty: p.warrantyType || p.warranty,
        description: p.description,
        quantity: p.stockQuantity !== undefined ? Number(p.stockQuantity) : 0,
        id: p.productId || p.id,
        is_active: p.isActive !== undefined ? p.isActive : true
      };
    }
    return p;
  },

  addProduct: async (data) => {
    const payload = {
      productName: data.name,
      category: data.category,
      price: parseFloat(data.price),
      warrantyType: data.warranty,
      description: data.description,
      stockQuantity: data.quantity !== undefined ? Number(data.quantity) : 0,
      isActive: true,
      manufacturerId: localStorage.getItem("roleId")
    };

    try {
      const response = await apiClient.post(`/api/manufacturer/create-product`, payload);
      return response.data || { success: true, product: payload };
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(
        (errorData?.errors ? Object.values(errorData.errors).join(", ") : undefined) ||
        errorData?.message ||
        'Failed to create product'
      );
    }
  },

  updateProduct: async (id, data) => {
    try {
      const payload = {
        productId: id,
        productName: data.name,
        category: data.category,
        price: parseFloat(data.price),
        warrantyType: data.warranty,
        description: data.description,
        stockQuantity: data.quantity !== undefined ? Number(data.quantity) : 0,
        isActive: data.is_active !== undefined ? data.is_active : true,
        manufacturerId: localStorage.getItem("roleId")
      };
      const response = await apiClient.put(`/api/manufacturer/update-product?manufacturerId=${localStorage.getItem("roleId")}&productId=${id}`, payload);
      return response.data || { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  toggleProductStatus: async (productId, newStatus) => {
    try {
      const manufacturerId = localStorage.getItem("roleId");
      
      // First, get the current product data
      const product = await this.getProductById(productId);
      
      // Send ALL fields with the updated status
      const payload = {
        productId: productId,
        productName: product.name,
        category: product.category,
        price: parseFloat(product.price),
        warrantyType: product.warranty,
        description: product.description,
        stockQuantity: product.quantity,
        isActive: newStatus,
        manufacturerId: manufacturerId
      };
      
      const response = await apiClient.put(
        `/api/manufacturer/update-product?manufacturerId=${manufacturerId}&productId=${productId}`,
        payload
      );
      return response.data || { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product status');
    }
  }
};