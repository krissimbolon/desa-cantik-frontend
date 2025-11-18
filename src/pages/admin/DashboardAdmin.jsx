import React from 'react';
import AdminSidebar from '@/components/shared/AdminSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';
import Footer from '@/components/shared/Footer';

// --- Data Dummy untuk Tabel Publikasi Terkini ---
// Diambil langsung dari gambar referensi Anda
const publicationsData = [
  { id: 1, indikator: 'Jumlah Penduduk', desa: 'Nonongan Selatan', nilai: '2,543', satuan: 'Jiwa', tahun: 2024, kategori: 'Demografi', status: 'Terverifikasi' },
  { id: 2, indikator: 'Angka Partisipasi Sekolah', desa: 'Nonongan Selatan', nilai: 87.5, satuan: 'Persen', tahun: 2024, kategori: 'Pendidikan', status: 'Perlu Validasi' },
  { id: 3, indikator: 'Tingkat Kemiskinan', desa: 'Rinding Batu', nilai: 12.3, satuan: 'Persen', tahun: 2023, kategori: 'Ekonomi', status: 'Terverifikasi' },
  { id: 4, indikator: 'Angka Harapan Hidup', desa: 'Rinding Batu', nilai: 68.2, satuan: 'Tahun', tahun: 2024, kategori: 'Kesehatan', status: 'Terverifikasi' },
  { id: 5, indikator: 'Produksi Padi', desa: 'Nonongan Selatan', nilai: '1,258', satuan: 'Ton', tahun: 2024, kategori: 'Pertanian', status: 'Terverifikasi' },
];

// --- Komponen Helper untuk Kartu Statistik ---
// Dibuat agar sesuai dengan style di referensi
const StatCard = ({ title, value, titleBgColor = 'bg-[#33A1E0]' }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className={`${titleBgColor} p-4`}>
      <h3 className="text-white text-base font-semibold text-center">{title}</h3>
    </div>
    <div className="p-6">
      <p className="text-4xl font-bold text-gray-800 text-center">{value}</p>
    </div>
  </div>
);

// --- Komponen Helper untuk Badge Status ---
// Dibuat agar sesuai dengan style di referensi
const StatusBadge = ({ status }) => {
  let bgColor, textColor;

  switch (status) {
    case 'Terverifikasi':
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      break;
    case 'Perlu Validasi':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-700';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

// --- Komponen Helper untuk Badge Kategori ---
const KategoriBadge = ({ kategori }) => (
  <span className="px-3 py-1 rounded-full text-xs font-medium border border-blue-300 bg-blue-50 text-blue-600">
    {kategori}
  </span>
);


export default function DashboardAdmin() {
  return (
    <main className="flex-1 overflow-auto p-6 md:p-8 bg-gray-100">
      <div className="space-y-8">

        {/* Bagian Atas: Kartu Statistik & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom 1: Kartu Statistik */}
          <div className="lg:col-span-1 space-y-6">
            <StatCard 
              title="Jumlah Indikator" 
              value="120" 
              titleBgColor="bg-[#33A1E0]" 
            />
            <StatCard 
              title="Jumlah Perangkat Desa"
              value="6"
              titleBgColor="bg-[#33A1E0]"
            />
          </div>

          {/* Kolom 2: Chart Publikasi Desa (Placeholder) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Publikasi Desa</h3>
            <p className="text-sm text-gray-500 mb-4">Rekapitulasi publikasi desa menurut status dan kategori</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64 min-h-[260px]">
              <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-500">Placeholder Donut Chart</p>
              </div>
              <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-500">Placeholder Pie Chart</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Bawah: Tabel Publikasi Terkini */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Publikasi Terkini</h3>
            <p className="text-sm text-gray-500">Indikator pembangunan dan statistik desa terkini</p>
          </div>

          {/* Filter */}
          <div className="p-4 md:p-6 flex flex-wrap gap-4 items-center border-b border-gray-200 bg-gray-50">
            <select className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500">
              <option>Semua Kategori</option>
              <option>Demografi</option>
              <option>Pendidikan</option>
              <option>Ekonomi</option>
            </select>
            <select className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Indikator</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Desa</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nilai</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Satuan</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tahun</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {publicationsData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.indikator}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.desa}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.nilai}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.satuan}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.tahun}</td>
                    <td className="px-6 py-4 text-sm">
                      <KategoriBadge kategori={item.kategori} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </main>
  );
}