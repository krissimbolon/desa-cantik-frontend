import { apiClient } from './apiClient.js';

export const geoService = {
  // Ambil semua data geo (GeoJSON boundaries, points) berdasarkan ID Desa
  async getGeospatialByVillage(villageId) {
    try {
        const response = await apiClient.get(`/villages/${villageId}/geospatial`);
        // Backend biasanya mengembalikan array dalam response.data atau response.data.data
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch geospatial data:", error);
        return [];
    }
  },

  // Ambil semua layer (konfigurasi tampilan) berdasarkan ID Desa
  async getLayersByVillage(villageId) {
    try {
        const response = await apiClient.get(`/villages/${villageId}/thematic-maps`);
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch thematic maps:", error);
        return [];
    }
  },

  // Tambah Data Geo
  async addGeospatial(villageId, data) {
    const response = await apiClient.post(`/villages/${villageId}/geospatial`, data);
    return response.data;
  },

  // Hapus Data Geo
  async deleteGeospatial(villageId, geoId) {
    return await apiClient.delete(`/villages/${villageId}/geospatial/${geoId}`);
  },

  // Tambah Layer (Thematic Map)
  async addLayer(villageId, data) {
    const response = await apiClient.post(`/villages/${villageId}/thematic-maps`, data);
    return response.data;
  },

  // Update Layer
  async updateLayer(villageId, mapId, updates) {
    const response = await apiClient.put(`/villages/${villageId}/thematic-maps/${mapId}`, updates);
    return response.data;
  },

  // Hapus Layer
  async deleteLayer(villageId, mapId) {
    return await apiClient.delete(`/villages/${villageId}/thematic-maps/${mapId}`);
  }
};