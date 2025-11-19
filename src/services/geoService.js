// src/services/geoService.js

// --- DATA DATABASE SEMENTARA (MOCK) ---
// Ini mensimulasikan database backend.
// Data ini akan dimanipulasi oleh Admin/Desa dan dibaca oleh Publik.

let MOCK_GEOSPATIAL_DB = [
  { 
    id: 1, 
    villageId: '1', // Nonongan Selatan
    name: 'Batas Wilayah', 
    type: 'boundary', 
    // GeoJSON Kotak Sederhana
    geometry: { "type": "Polygon", "coordinates": [[[-2.97, 119.90], [-2.97, 119.91], [-2.98, 119.91], [-2.98, 119.90], [-2.97, 119.90]]] },
    source: 'System'
  },
  { 
    id: 2, 
    villageId: '1', 
    name: 'Titik Sekolah', 
    type: 'point', 
    geometry: { "type": "Point", "coordinates": [119.905, -2.975] },
    source: 'System'
  },
  // Data untuk Rinding Batu (ID 2)
  { 
    id: 3, 
    villageId: '2', 
    name: 'Area Pertanian', 
    type: 'boundary', 
    geometry: { "type": "Polygon", "coordinates": [[[-2.96, 119.89], [-2.96, 119.90], [-2.97, 119.90], [-2.97, 119.89], [-2.96, 119.89]]] },
    source: 'System'
  }
];

let MOCK_LAYERS_DB = [
  { id: 1, villageId: '1', name: 'Peta Batas Wilayah', geoId: 1, color: '#FF0000', isVisible: true },
  { id: 2, villageId: '1', name: 'Lokasi Pendidikan', geoId: 2, color: '#0000FF', isVisible: true },
  { id: 3, villageId: '2', name: 'Lahan Sawah', geoId: 3, color: '#008000', isVisible: true },
];

// --- SERVICE API ---

export const geoService = {
  // Ambil semua data geo berdasarkan ID Desa
  getGeospatialByVillage: async (villageId) => {
    await new Promise(r => setTimeout(r, 500)); // Simulate delay
    return MOCK_GEOSPATIAL_DB.filter(g => g.villageId === String(villageId));
  },

  // Ambil semua layer berdasarkan ID Desa
  getLayersByVillage: async (villageId) => {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_LAYERS_DB.filter(l => l.villageId === String(villageId));
  },

  // Tambah Data Geo
  addGeospatial: async (data) => {
    const newId = Date.now();
    const newItem = { ...data, id: newId };
    MOCK_GEOSPATIAL_DB.push(newItem);
    return newItem;
  },

  // Hapus Data Geo
  deleteGeospatial: async (id) => {
    MOCK_GEOSPATIAL_DB = MOCK_GEOSPATIAL_DB.filter(g => g.id !== id);
    // Hapus layer terkait juga (Cascade delete)
    MOCK_LAYERS_DB = MOCK_LAYERS_DB.filter(l => l.geoId !== id);
    return true;
  },

  // Tambah Layer
  addLayer: async (data) => {
    const newId = Date.now();
    const newItem = { ...data, id: newId };
    MOCK_LAYERS_DB.push(newItem);
    return newItem;
  },

  // Update Layer (misal ganti warna atau visibilitas)
  updateLayer: async (id, updates) => {
    MOCK_LAYERS_DB = MOCK_LAYERS_DB.map(l => l.id === id ? { ...l, ...updates } : l);
    return true;
  },

  // Hapus Layer
  deleteLayer: async (id) => {
    MOCK_LAYERS_DB = MOCK_LAYERS_DB.filter(l => l.id !== id);
    return true;
  }
};