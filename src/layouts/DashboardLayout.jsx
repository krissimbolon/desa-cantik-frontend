// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import VillageSidebar from '@/components/shared/VillageSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';
import Footer from '@/components/shared/Footer';

export default function DashboardLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAdmin = location.pathname.startsWith('/admin');

  const title = isAdmin ? 'Admin BPS' : 'Desa Suka Maju';
  const subtitle = 'Desa Cantik';
  const userName = isAdmin ? 'Administrator' : 'Perangkat Desa';
  const userInitial = isAdmin ? 'A' : 'D';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* HEADER */}
      <DashboardHeader
        title={title}
        subtitle={subtitle}
        userName={userName}
        userInitial={userInitial}
      />

      {/* MIDDLE SECTION */}
      <div className="flex flex-1 min-h-screen">

        {/* SIDEBAR */}
        <div
          className="bg-white border-r transition-all duration-300 flex flex-col"
          style={{
            width: isCollapsed ? '4rem' : '16rem',
            flexShrink: 0
          }}
        >
          {isAdmin ? (
            <AdminSidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          ) : (
            <VillageSidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col min-h-screen">
          <main >
            <Outlet />
          </main>
        </div>

      </div>

      {/* FOOTER */}
      <Footer scrollToVillages={() => {}} />

    </div>
  );
}
