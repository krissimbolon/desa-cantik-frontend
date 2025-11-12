// src/pages/admin/DashboardAdmin.jsx
import React from 'react';
import AdminSidebar from '@/components/shared/AdminSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';
import Footer from '@/components/shared/Footer';

// Data dummy 
const statsData = [
  { name: 'Jan', desa: 45, publikasi: 120 },
  { name: 'Feb', desa: 52, publikasi: 145 },
  { name: 'Mar', desa: 61, publikasi: 180 },
  { name: 'Apr', desa: 70, publikasi: 210 },
  { name: 'May', desa: 85, publikasi: 250 },
  { name: 'Jun', desa: 95, publikasi: 290 },
];

const recentActivities = [
  { id: 1, activity: 'Desa Suka Maju menambahkan publikasi baru', time: '5 menit yang lalu' },
  { id: 2, activity: 'Admin menambahkan perangkat desa baru di Desa Sejahtera', time: '15 menit yang lalu' },
  { id: 3, activity: 'Desa Makmur mengupdate data statistik', time: '1 jam yang lalu' },
];

export default function DashboardAdmin() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      

        {/* Konten Halaman */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
           
          </div>
        </main>
    
    </div>
  );
}