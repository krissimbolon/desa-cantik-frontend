// src/components/shared/DashboardHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logoDc from '@/assets/images/logo_dc.png';

// Ini komponen header/top-bar yang reusable untuk halaman dashboard
export default function DashboardHeader({ title, subtitle, userName, userInitial }) {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Sisi Kiri: Logo & Judul Halaman */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <div className="bg-[#1C6EA4] p-2 rounded-lg">
            <img src={logoDc} alt="Logo" className="h-8 w-8 object-contain" />
          </div>
        </Link>
        <div>
          <div className="text-gray-900 text-sm font-bold">{title}</div>
          <div className="text-gray-500 text-xs">{subtitle}</div>
        </div>
      </div>
      
      {/* Sisi Kanan: Profil Pengguna */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm text-gray-900">{userName}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
        <div className="h-10 w-10 rounded-full bg-[#1C6EA4] text-white flex items-center justify-center font-bold">
          <span>{userInitial}</span>
        </div>
      </div>
    </header>
  );
}