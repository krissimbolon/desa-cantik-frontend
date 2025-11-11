// src/components/shared/Navbar.jsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import logoDc from '@/assets/images/logo_dc.png';

// Terima 'scrollToVillages' sebagai prop dari Home.jsx
export default function Navbar({ scrollToVillages }) {
  return (
    <nav className="bg-gradient-to-r from-[#1C6EA4] to-[#154D71] sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4"> 
            <div className="bg-white p-2 rounded-full shadow-lg w-20 h-20 flex items-center justify-center hover:scale-105 transition-transform">
              <img src={logoDc} alt="Logo Desa Cantik" className="w-12 h-12 object-contain" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-white text-xl">Desa Cantik</h1>
              <p className="text-[#FFF9AF] text-sm">Cinta Statistik</p>
            </div>
          </Link>

          {/* Navigation Menu */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              variant="ghost"
              className="text-white hover:text-[#FFF9AF] hover:bg-white/10 text-lg px-6 py-2 transition-all"
            >
              Home
            </Button>
            <Button
              onClick={scrollToVillages} // Gunakan prop
              variant="ghost"
              className="text-white hover:text-[#FFF9AF] hover:bg-white/10 text-lg px-6 py-2 transition-all"
            >
              Desa Cantik
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-white hover:text-[#FFF9AF] hover:bg-white/10 text-lg px-6 py-2 transition-all"
            >
              <Link to="/about">Tentang</Link>
            </Button>
            <Button
              asChild
              className="bg-[#FFF9AF] hover:bg-[#FFE680] text-[#154D71] text-lg px-8 py-2 ml-4 transition-all shadow-md hover:shadow-lg"
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}