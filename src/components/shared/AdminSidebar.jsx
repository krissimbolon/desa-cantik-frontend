// src/components/shared/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, LogOut, ChevronLeft } from 'lucide-react';
import logoDc from '@/assets/images/logo_dc.png';
import { adminMenuItems } from '../../routes/config'; // Impor menu dari config

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // Hook untuk tahu kita di URL mana

  return (
    <>
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo Header */}
        <div className="h-28 border-b border-gray-200 flex items-center justify-between px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="bg-[#1C6EA4] p-2 rounded-lg">
                <img src={logoDc} alt="Logo" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <div className="text-gray-900 text-sm font-bold">Admin BPS</div>
                <div className="text-gray-500 text-xs">Desa Cantik</div>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="bg-[#1C6EA4] p-2 rounded-lg mx-auto">
              <img src={logoDc} alt="Logo" className="h-8 w-8 object-contain" />
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              // Cek apakah URL saat ini dimulai dengan path menu
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.id}>
                  <Button
                    asChild
                    variant={isActive ? 'default' : 'ghost'} // Ganti style jika aktif
                    className={`w-full flex justify-start items-center gap-3 ${
                      isActive
                        ? 'bg-[#1C6EA4] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Link to={item.path}>
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.label}</span>}
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-3">
          <Button
            asChild
            variant="outline"
            className={`w-full ${isCollapsed ? 'px-0' : ''}`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <Link to="/login">
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </Link>
          </Button>
        </div>

        {/* Tombol Collapse */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-20 -right-3 z-10 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-all"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>
    </>
  );
}