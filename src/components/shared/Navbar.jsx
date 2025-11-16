// src/components/shared/Navbar.jsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logoDc from '@/assets/images/logo_dc.png';

export default function Navbar({ scrollToVillages }) {
  return (
    <nav className="bg-gradient-to-r from-[#1C6EA4] to-[#154D71] sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full shadow-md w-14 h-14 flex items-center justify-center hover:scale-105 transition-transform">
              <img src={logoDc} alt="Logo Desa Cantik" className="w-9 h-9 object-contain" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-white text-lg">Desa Cantik</h1>
              <p className="text-[#FFF9AF] text-xs">Cinta Statistik</p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1.5">
            <Button
              asChild
              variant="ghost"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white hover:text-[#FFF9AF] hover:bg-white/10 text-base px-4 py-1.5 transition-all"
            >
              <Link to="/">Home</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              onClick={scrollToVillages}
              className="text-white hover:text-[#FFF9AF] hover:bg-white/10 text-base px-4 py-1.5 transition-all"
            >
              <Link to="/">Desa Cantik</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="text-white hover:text-[#FFF9AF] hover:bg-white/10 text-base px-4 py-1.5 transition-all"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Link to="/tentang">Tentang</Link>
            </Button>

            <Button
              asChild
              className="bg-[#FFF9AF] hover:bg-[#FFE680] text-[#154D71] text-base px-6 py-1.5 ml-3 transition-all shadow-md hover:shadow-lg"
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
