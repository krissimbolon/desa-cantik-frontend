// src/components/shared/Footer.jsx
import { Link } from 'react-router-dom';
import logoDc from '@/assets/images/logo_dc.png';

export default function Footer({ scrollToVillages }) {
  return (
    <footer className="bg-gradient-to-r from-[#154D71] to-[#1C6EA4] text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-sm">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white rounded-full p-2.5 flex items-center justify-center">
                <img src={logoDc} alt="Logo Desa Cantik" className="w-8 h-8 object-contain" />
              </div>
            </div>
            <h3 className="text-lg mb-1">Desa Cantik</h3>
            <p className="text-blue-200">Sistem Informasi Desa Cinta Statistik</p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-lg mb-3">Navigasi</h3>
            <ul className="space-y-1.5 text-blue-100">
              <li><Link to="/" className="hover:text-[#FFF9AF] transition-colors">Home</Link></li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); scrollToVillages(); }}
                  className="hover:text-[#FFF9AF] transition-colors cursor-pointer"
                >
                  Desa Cantik
                </a>
              </li>
              <li><Link to="/about" className="hover:text-[#FFF9AF] transition-colors">Tentang</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg mb-3">Kontak</h3>
            <ul className="space-y-1.5 text-blue-100">
              <li><a href="mailto:desacantik@bps.go.id" className="hover:text-[#FFF9AF] transition-colors">desacantik@bps.go.id</a></li>
              <li><a href="tel:081234567890" className="hover:text-[#FFF9AF] transition-colors">0812-3456-7890</a></li>
            </ul>
          </div>

          {/* Tautan */}
          <div>
            <h3 className="text-lg mb-3">Tautan Terkait</h3>
            <ul className="space-y-1.5 text-blue-100">
              <li><a href="https://torutkab.bps.go.id/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFF9AF] transition-colors">BPS Toraja Utara</a></li>
              <li><a href="https://sulsel.bps.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFF9AF] transition-colors">BPS Sulawesi Selatan</a></li>
              <li><a href="https://www.bps.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFF9AF] transition-colors">BPS RI</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
