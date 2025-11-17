// src/routes/index.jsx
import { BrowserRouter as Router, Routes, Route, Link, useParams, Outlet } from 'react-router-dom';

// Impor Halaman Publik
import Home from '@/pages/public/Home';
import Login from '@/pages/public/Login';
import Tentang from '@/pages/public/Tentang';
import VillageDetail from '@/pages/public/VillageDetail';

// --- Impor Halaman Admin BPS ---
import DashboardLayout from '@/layouts/DashboardLayout'; 
import DashboardAdmin from '@/pages/admin/DashboardAdmin';
import UbahPasswordAdminBPS from '@/pages/admin/UbahPasswordAdminBPS'; 
import PetaTematikAdmin from '@/pages/admin/PetaTematikAdmin';

// --- Impor Halaman Perangkat Desa ---
import DashboardDesa from '@/pages/desa/DashboardDesa';
import UbahPasswordPerangkatDesa from '@/pages/desa/UbahPasswordPerangkatDesa';
import PetaTematikDesa from '@/pages/desa/PetaTematikDesa';
import ProfilUmumDesa from '@/pages/desa/ProfilUmumDesa';
import PublikasiDesa from '@/pages/desa/PublikasiDesa';
import DataStatistikDesa from '@/pages/desa/DataStatistikDesa';


// Komponen placeholder
const Placeholder = ({ pageName }) => (
  <div className="p-10 text-center">
    <h1 className="text-3xl font-bold text-red-500">Halaman Placeholder</h1>
    <p className="text-xl mt-2">Halaman untuk "{pageName}" belum dibuat.</p>
    <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
      &larr; Kembali ke Home
    </Link>
  </div>
);

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* --- Rute Publik (Tetap sama) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/desa/:id" element={<VillageDetail />} />
        <Route path="/lupa-password" element={<Placeholder pageName="Lupa Password" />} />
        
        {/* --- 2. Rute Layout Admin (Internal) --- */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="perangkat-desa" element={<Placeholder pageName="Admin: Perangkat Desa" />} />
          <Route path="daftar-desa" element={<Placeholder pageName="Admin: Daftar Desa" />} />
          <Route path="modul-desa" element={<Placeholder pageName="Admin: Modul Desa" />} />
          <Route path="publikasi" element={<Placeholder pageName="Admin: Publikasi" />} />
          <Route path="peta-tematik" element={<PetaTematikAdmin />} />
          <Route path="ubah-password" element={<UbahPasswordAdminBPS />} />
          <Route index element={<DashboardAdmin />} /> 
        </Route>
        
        {/* --- 3. Rute Layout Perangkat Desa (Internal) --- */}
        <Route path="/desa-dashboard" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardDesa />} />
          <Route path="profil-umum" element={<ProfilUmumDesa pageName="Desa: Profil Umum" />} />
          <Route path="publikasi" element={<PublikasiDesa pageName="Desa: Publikasi" />} />
          <Route path="data-statistik" element={<DataStatistikDesa pageName="Desa: Data Statistik" />} />
          <Route path="peta-tematik" element={<PetaTematikDesa />} />
          <Route path="ubah-password" element={<UbahPasswordPerangkatDesa />} />
          <Route index element={<DashboardDesa />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default AppRoutes;