// src/routes/index.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Impor Halaman
import Home from '@/pages/public/Home';
import Login from '@/pages/public/Login';


const Placeholder = ({ pageName }) => (
  <div className="p-10">
    <h1 className="text-3xl font-bold">Halaman: {pageName}</h1>
    <Link to="/" className="text-blue-500 hover:underline">
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

        {/* Tambahkan placeholder untuk rute lain yang ada di Home */}
        <Route path="/about" element={<Placeholder pageName="About" />} />
        <Route path="/desa/:id" element={<Placeholder pageName="Detail Desa" />} />
        <Route path="/lupa-password" element={<Placeholder pageName="Lupa Password" />} />

      </Routes>
    </Router>
  );
}

export default AppRoutes;