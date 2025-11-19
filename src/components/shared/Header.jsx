// src/components/shared/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logoDc from '@/assets/images/logo_dc.png';

export default function Header({ title, subtitle, userName, userInitial, userRole }) {
  return (
    <header className="h-20 bg-[#1C6EA4] border-b border-gray-200 flex items-center justify-between px-6 transition-all">
      
      {/* Sisi Kiri: Logo & Judul Halaman (Nama Desa/Admin) */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <img src={logoDc} alt="Logo" className="h-8 w-8 object-contain" />
          </div>
        </Link>
        <div>
          <div className="text-white text-sm font-bold">{title}</div>
          <div className="text-gray-300 text-xs">{subtitle}</div>
        </div>
      </div>
      
      {/* Sisi Kanan: Profil Pengguna */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm text-white font-medium">{userName}</div>
          {/* Gunakan userRole jika ada, jika tidak gunakan subtitle */}
          <div className="text-xs text-gray-300">{userRole || subtitle}</div>
        </div>
        <div className="h-10 w-10 rounded-full bg-white text-[#1C6EA4] flex items-center justify-center font-bold shadow-sm ring-2 ring-white/30">
          <span>{userInitial}</span>
        </div>
      </div>
    </header>
  );
}