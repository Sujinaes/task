import apiClient from '../apiClient';

export const purchaseOrderService = {
  /**
   
   * @returns {Promise<Array>} list of order data
   */
  getAllOrders: async (manufacturerId = 36) => {
    try {
      const response = await apiClient.get('/api/manufacturer/orders', {
        params: { manufacturerId }
      });
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(
        errorData?.message || 'Failed to fetch purchase orders'
      );
    }
  },

  /**
   
   * @param {number} id - numeric primary key
   * @returns {Promise<Object>} order data with items
   */
  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/api/manufacturer/orders/${id}`);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(
        errorData?.message || 'Failed to fetch order details'
      );
    }
  },

  /**
   
   * @param {number} id - 
   * @param {string} deliveryDate – ISO date string (YYYY-MM-DD)
   * @returns {Promise<Object>}
   */
  acceptOrder: async (id, deliveryDate) => {
    try {
      const response = await apiClient.post(
        `/api/manufacturer/orders/${id}/accept`,
        { deliveryDate }
      );
      return response.data || { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(
        errorData?.message || 'Failed to accept order'
      );
    }
  },

  /**
   
   * @param {number} id - numeric primary key
   * @param {string} rejectionReason
   * @returns {Promise<Object>}
   */
  rejectOrder: async (id, rejectionReason) => {
    try {
      const response = await apiClient.post(
        `/api/manufacturer/orders/${id}/reject`,
        { reason: rejectionReason }
      );
      return response.data || { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(
        errorData?.message || 'Failed to reject order'
      );
    }
  },
};
