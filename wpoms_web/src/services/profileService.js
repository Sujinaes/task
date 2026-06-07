import apiClient from '../apiClient';

export const profileService = {
  updateCustomer: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/customer/update-customer?id=${id}`, data);
      return response.data || { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(
        (errorData?.errors ? Object.values(errorData.errors).join(", ") : undefined) ||
        errorData?.message ||
        'Failed to update customer'
      );
    }
  },

  updateVendor: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/vendor/edit?id=${id}`, data);
      return response.data || { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(
        (errorData?.errors ? Object.values(errorData.errors).join(", ") : undefined) ||
        errorData?.message ||
        'Failed to update vendor'
      );
    }
  },

  updateManufacturer: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/admin/update-manufacture?id=${id}`, data);
      return response.data || { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(
        (errorData?.errors ? Object.values(errorData.errors).join(", ") : undefined) ||
        errorData?.message ||
        'Failed to update manufacturer'
      );
    }
  },

  getManufacturerProfile: async (id) => {
    try {
      const response = await apiClient.get(`/api/admin/manufacturer?id=${id}`);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(errorData?.message || 'Failed to fetch manufacturer profile');
    }
  },

  getVendorProfile: async (id) => {
    try {
      const response = await apiClient.get(`/api/vendor/get?id=${id}`);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(errorData?.message || 'Failed to fetch vendor profile');
    }
  },

  getCustomerProfile: async (id) => {
    try {
      const response = await apiClient.get(`/api/customer/view-customer?id=${id}`);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(errorData?.message || 'Failed to fetch customer profile');
    }
  },

  getStaffs: async (type) => {
    const STAFF_API = {
      vendor: `api/vendor/staff-list?vendorId=${localStorage.getItem("roleId")}`, // Was `${AP`
      manufacturer: `api/admin/manufacturer/staff-list?manufacturerId=${localStorage.getItem("roleId")}` // Was `${API_URL}`
    };

    try {
      const response = await apiClient.get(STAFF_API[type]);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      throw new Error(errorData?.message || 'Failed to fetch staffs');
    }
  }
};