// src/components/shared/VillageDetailNavbar.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logoDc from '@/assets/images/logo_dc.png';

export default function VillageDetailNavbar({ activeSection, scrollToSection }) {
  const { id: villageId } = useParams();

  const getActiveClass = (section) =>
    activeSection === section
      ? 'bg-white/20 text-white'
      : 'text-white hover:text-[#FFF9AF] hover:bg-white/10';

  const renderButton = (label, section) => {
    const content = (
      <Button
        variant="ghost"
        className={`text-sm px-4 py-1.5 transition-all ${getActiveClass(section)}`}
        onClick={
          scrollToSection ? () => scrollToSection(section) : undefined
        }
      >
        {label}
      </Button>
    );

    if (!scrollToSection) {
      return (
        <Link to={`/desa/${villageId}#${section}`}>
          {content}
        </Link>
      );
    }
    return content;
  };

  return (
    <nav className="bg-gradient-to-r from-[#1C6EA4] to-[#154D71] sticky top-0 z-[9999]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-full shadow w-14 h-14 flex items-center justify-center hover:scale-105 transition-transform">
              <img src={logoDc} alt="Logo Desa Cantik" className="w-8 h-8 object-contain" />
            </div>
            <div className="hidden md:block leading-tight">
              <h1 className="text-white text-base">Desa Cantik</h1>
              <p className="text-[#FFF9AF] text-xs">Cinta Statistik</p>
            </div>
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-1.5">
            <Button
              asChild
              variant="ghost"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`text-sm px-4 py-1.5 transition-all ${
                activeSection === 'tentang'
                  ? 'bg-white/20 text-white'
                  : 'text-white hover:text-[#FFF9AF] hover:bg-white/10'
              }`}
            >
              <Link to={`/desa/${villageId}`}>Desa</Link>
            </Button>

            {renderButton('Data', 'data')}
            {renderButton('Publikasi', 'publikasi')}
            {renderButton('Peta', 'peta')}
            {renderButton('Dokumentasi', 'dokumentasi')}

            <Button
              asChild
              className="bg-[#FFF9AF] hover:bg-[#FFE680] text-[#154D71] text-sm px-5 py-1.5 ml-2 shadow"
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>

        </div>
      </div>
    </nav>
  );
}
