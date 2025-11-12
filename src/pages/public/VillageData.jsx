// src/pages/public/VillageData.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import VillageDetailNavbar from '@/components/shared/VillageDetailNavbar';
import Footer from '@/components/shared/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

// Ini adalah halaman placeholder untuk DATA
export default function VillageData() {
  const { id } = useParams(); // Ambil ID desa dari URL

  // --- 1. GUARD CLAUSE ---
  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          Memuat...
        </div>
      </div>
    );
  }

  // 2. 'id' sudah ada
  return (
    <div className="min-h-screen bg-white flex flex-col">

      <VillageDetailNavbar 
        activeSection="data"
        villageId={id}
      />

      {/* Konten Halaman Data */}
      <div className="flex-grow py-20 bg-gradient-to-b from-white to-gray-50">
        disini nanti konten data desa
      </div>

      <Footer scrollToVillages={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
}