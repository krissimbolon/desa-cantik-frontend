// src/services/villageService.js

// Mock data desa 
const mockVillages = [
  {
    id: 'desa-1',
    name: 'Lembang Nonongan Selatan',
    district: 'Kecamatan...',
    regency: 'Kabupaten ...',
    province: '....',
    population: 8542,
    status: 'Aktif',
    image: 'https://placehold.co/800x600/a3e635/ffffff?text=Desa+...',
    area: 12.5,
    households: 2145,
    malePopulation: 4285,
    femalePopulation: 4257,
  },
  {
    id: 'desa-2',
    name: 'Lembang Rindingbatu',
    district: 'Kecamatan ...',
    regency: 'Kabupaten ....',
    province: '...',
    population: 6234,
    status: 'Aktif',
    image: 'https://placehold.co/800x600/67e8f9/ffffff?text=Desa+...',
    area: 10.3,
    households: 1856,
    malePopulation: 3120,
    femalePopulation: 3114,
  },
  {
    id: 'desa-3',
    name: 'Desa ...',
    district: 'Kecamatan ...',
    regency: 'Kabupaten ...',
    province: '... ...',
    population: 9123,
    status: 'Aktif',
    image: 'https://placehold.co/800x600/fde047/ffffff?text=Desa+....',
    area: 15.8,
    households: 2345,
    malePopulation: 4562,
    femalePopulation: 4561,
  },
  
];

// ekspor service-nya sebagai objek
export const villageService = {
  // Fungsi untuk mengambil semua desa
  getAllVillages: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockVillages;
  },

  // Fungsi untuk mengambil satu desa berdasarkan ID
  getVillageById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockVillages.find((v) => v.id === id) || null;
  },
};