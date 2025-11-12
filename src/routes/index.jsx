// src/routes/index.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Impor Halaman
import Home from '@/pages/public/Home';
import Login from '@/pages/public/Login';
import Tentang from '@/pages/public/Tentang';
import VillageDetail from '@/pages/public/VillageDetail';
import VillageData from '@/pages/public/VillageData';
import VillagePublikasi from '@/pages/public/VillagePublikasi';

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
        {/* Rute Publik */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/desa/:id" element={<VillageDetail />} />

        {/* Rute Publik Detail Desa */}
        <Route path="/desa/:id/data" element={<VillageData />} />
        <Route path="/desa/:id/publikasi" element={<VillagePublikasi />} />
        
        <Route path="/lupa-password" element={<Placeholder pageName="Lupa Password" />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;