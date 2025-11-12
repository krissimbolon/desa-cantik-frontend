// src/components/shared/DashboardHeader.jsx
import React from 'react';

// Ini komponen header/top-bar
export default function DashboardHeader({ title, subtitle, userName, userInitial }) {
  return (
    <header className="h-28 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
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