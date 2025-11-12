// src/layouts/DashboardLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // <-- 1. Impor Outlet dan useLocation
import AdminSidebar from '@/components/shared/AdminSidebar';
import VillageSidebar from '@/components/shared/VillageSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';
import Footer from '@/components/shared/Footer';

// Layout ini akan membungkus SEMUA halaman internal
export default function DashboardLayout() {
  const location = useLocation();

  // 2. Cek role berdasarkan URL
  const isAdmin = location.pathname.startsWith('/admin');
  const role = isAdmin ? 'admin' : 'desa';
  
  // Tentukan menu dan info user berdasarkan role
  const title = isAdmin ? 'Admin BPS' : 'Desa Suka Maju';
  const subtitle = 'Desa Cantik';
  const userName = isAdmin ? 'Administrator' : 'Perangkat Desa';
  const userInitial = isAdmin ? 'A' : 'D';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 3. Render Sidebar yang sesuai */}
      {isAdmin ? <AdminSidebar /> : <VillageSidebar />}

      {/* 4. Konten Halaman */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Atas */}
        <DashboardHeader 
          title={title} 
          subtitle={subtitle} 
          userName={userName} 
          userInitial={userInitial} 
        />

        {/* 5. Render Halaman (Anak Rute) */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet /> {/* <-- Di sinilah halaman (cth: DashboardAdmin) akan muncul */}
        </main>
        
        <Footer scrollToVillages={() => {}} />
      </div>
    </div>
  );
}