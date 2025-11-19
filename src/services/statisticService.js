import { apiClient } from './apiClient.js';

export const statisticService = {
  // Ambil semua data statistik untuk desa tertentu
  // Backend mendukung filter ?year=2024&type_id=1 dll jika diperlukan
  async getStatisticsByVillage(villageId, params = {}) {
    try {
      const response = await apiClient.get(`/villages/${villageId}/statistics`, { params });
      // Backend Laravel biasanya mengembalikan { data: [...] } atau array langsung
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch village statistics:", error);
      return [];
    }
  },

  // Ambil daftar tipe statistik (Kependudukan, Ekonomi, dll)
  async getStatisticTypes() {
    try {
        const response = await apiClient.get('/statistic-types');
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch statistic types:", error);
        return [];
    }
  }
};