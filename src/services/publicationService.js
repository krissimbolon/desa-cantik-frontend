import { apiClient } from './apiClient.js';

export const publicationService = {
  // Get All (Bisa difilter tahun/bulan via params)
  async getPublications(villageId, params = {}) {
    const response = await apiClient.get(`/villages/${villageId}/publications`, { params });
    return response.data;
  },

  // Create (Upload PDF)
  async createPublication(villageId, formData) {
    const response = await apiClient.post(`/villages/${villageId}/publications`, formData);
    return response.data;
  },

  // Update Data Teks
  async updatePublication(villageId, publicationId, data) {
    const response = await apiClient.put(`/villages/${villageId}/publications/${publicationId}`, data);
    return response.data;
  },
  
  // Hapus
  async deletePublication(villageId, publicationId) {
    return await apiClient.delete(`/villages/${villageId}/publications/${publicationId}`);
  }
};