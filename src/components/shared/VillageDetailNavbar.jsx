// src/components/shared/VillageDetailNavbar.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logoDc from '@/assets/images/logo_dc.png';

export default function VillageDetailNavbar({ 
  activeSection, 
  scrollToSection
}) {
  // Ambil id langsung dari URL
  const { id: villageId } = useParams();

  // Fungsi untuk mengecek halaman aktif
  const getActiveClass = (sectionName) => {
    if (activeSection === sectionName) {
      return 'bg-white/20 text-white';
    }
    return 'text-white hover:text-[#FFF9AF] hover:bg-white/10';
  };

  const DataButton = () => {
    if (scrollToSection) {
      return (
        <Button
          variant="ghost"
          className={`text-lg px-6 py-2 transition-all ${getActiveClass('data')}`}
          onClick={() => scrollToSection('data')}
        >
          Data
        </Button>
      );
    }
    return (
      <Button
        asChild
        variant="ghost"
        className={`text-lg px-6 py-2 transition-all ${getActiveClass('data')}`}
      >
        <Link to={`/desa/${villageId}#data`}>Data</Link>
      </Button>
    );
  };

  const PublikasiButton = () => {
    if (scrollToSection) {
      return (
        <Button
          variant="ghost"
          className={`text-lg px-6 py-2 transition-all ${getActiveClass('publikasi')}`}
          onClick={() => scrollToSection('publikasi')}
        >
          Publikasi
        </Button>
      );
    }
    return (
      <Button
        asChild
        variant="ghost"
        className={`text-lg px-6 py-2 transition-all ${getActiveClass('publikasi')}`}
      >
        <Link to={`/desa/${villageId}#publikasi`}>Publikasi</Link>
      </Button>
    );
  };
  // Tombol Peta
  const PetaButton = () => {
    if (scrollToSection) {
      return (
        <Button
          variant="ghost"
          className={`text-lg px-6 py-2 transition-all ${getActiveClass('peta')}`}
          onClick={() => scrollToSection('peta')}
        >
          Peta
        </Button>
      );
    }
    return (
      <Button
        asChild
        variant="ghost"
        className={`text-lg px-6 py-2 transition-all ${getActiveClass('peta')}`}
      >
        <Link to={`/desa/${villageId}#peta`}>Peta</Link>
      </Button>
    );
  };

  // Tombol Dokumentasi
  const DokumentasiButton = () => {
    if (scrollToSection) {
      return (
        <Button
          variant="ghost"
          className={`text-lg px-6 py-2 transition-all ${getActiveClass('dokumentasi')}`}
          onClick={() => scrollToSection('dokumentasi')}
        >
          Dokumentasi
        </Button>
      );
    }
    return (
      <Button
        asChild
        variant="ghost"
        className={`text-lg px-6 py-2 transition-all ${getActiveClass('dokumentasi')}`}
      >
        <Link to={`/desa/${villageId}#dokumentasi`}>Dokumentasi</Link>
      </Button>
    );
  };


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

          {/* Menu Navigasi */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              onClick={scroll => window.scrollTo({ top: 0, behavior: 'smooth' })} // Scroll to top
              className={`text-lg px-6 py-2 transition-all ${
                activeSection === 'tentang' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white hover:text-[#FFF9AF] hover:bg-white/10'
              }`}
            >
              <Link to={`/desa/${villageId}`}>Desa</Link>
              
            </Button>
            <DataButton />
            <PublikasiButton />
            <PetaButton />
            <DokumentasiButton />
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
