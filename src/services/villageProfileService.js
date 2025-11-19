import { apiClient } from './apiClient';

export const villageProfileService = {
  // Ambil data profil desa
  async getProfile(villageId) {
    const response = await apiClient.get(`/villages/${villageId}/profile`);
    return response.data;
  },

  // Update profil desa (termasuk upload file)
  async updateProfile(villageId, formData) {
    // Backend Laravel butuh _method: 'PUT' saat mengirim file via POST
    formData.append('_method', 'PUT');
    
    const response = await apiClient.post(`/villages/${villageId}/profile`, formData);
    return response.data;
  }
};