// src/components/shared/Footer.jsx
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import logoDc from '@/assets/images/logo_dc.png';


export default function Footer({ scrollToVillages }) {
  return (
    <footer className="bg-gradient-to-r from-[#154D71] to-[#1C6EA4] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white rounded-full p-3 flex items-center justify-center">
                <img src={logoDc} alt="Logo Desa Cantik" className="w-10 h-10 object-contain" />
              </div>
            </div>
            <h3 className="text-xl mb-2">Desa Cantik</h3>
            <p className="text-sm text-blue-200">Sistem Informasi Desa Cinta Statistik</p>
          </div>
          <div>
            <h3 className="text-xl mb-4">Navigasi</h3>
            <ul className="space-y-2 text-blue-100">
              <li><Link to="/" className="hover:text-[#FFF9AF] transition-colors">Home</Link></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToVillages(); }} className="hover:text-[#FFF9AF] transition-colors cursor-pointer">Desa Cantik</a></li>
              <li><Link to="/about" className="hover:text-[#FFF9AF] transition-colors">Tentang</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl mb-4">Kontak</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="mailto:desacantik@bps.go.id" className="hover:text-[#FFF9AF] transition-colors">desacantik@bps.go.id</a></li>
              <li><a href="tel:081234567890" className="hover:text-[#FFF9AF] transition-colors">0812-3456-7890</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl mb-4">Tautan Terkait</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="https://torajautkab.bps.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFF9AF] transition-colors">BPS Toraja Utara</a></li>
              <li><a href="https://sulsel.bps.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFF9AF] transition-colors">BPS Sulawesi Selatan</a></li>
              <li><a href="https://www.bps.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFF9AF] transition-colors">BPS RI</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-blue-200">
          <p>&copy; 2025 Badan Pusat Statistik. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}