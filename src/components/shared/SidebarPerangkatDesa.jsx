// src/components/shared/SidebarPerangkatDesa.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, ChevronLeft } from 'lucide-react';
import { villageMenuItems } from '../../routes/config';

export default function SidebarPerangkatDesa({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();

  return (
    <aside
      className={`relative bg-white border-r border-gray-200 
        flex flex-col h-full transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}`}
    >

      {/* MENU — harus flex-1 agar bisa mendorong logout ke bawah */}
      <nav className="pt-6 px-3 flex-1 min-h-0 overflow-y-auto">
        <ul className="space-y-1">
          {villageMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={item.id}>
                <Button
                  asChild
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full flex justify-start items-center gap-3 ${
                    isActive
                      ? 'bg-[#1C6EA4] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Link to={item.path}>
                    <Icon className="h-5 w-5" />
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* LOGOUT — mt-auto akan bekerja karena parent adalah flex-col full height */}
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

      {/* COLLAPSE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-20 -right-3 z-10 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-all"
      >
        <ChevronLeft
          className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </button>
    </aside>
  );
}
