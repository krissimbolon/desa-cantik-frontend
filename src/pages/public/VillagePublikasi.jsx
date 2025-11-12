// src/pages/public/VillagePublikasi.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import VillageDetailNavbar from '@/components/shared/VillageDetailNavbar';
import Footer from '@/components/shared/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

// Ini adalah halaman placeholder untuk PUBLIKASI
export default function VillagePublikasi() {
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
        activeSection="publikasi"
        villageId={id}
      />

      {/* Konten Halaman Publikasi */}
      <div className="flex-grow py-20 bg-gradient-to-b from-white to-gray-50">
       Konten Halaman publiaksi disini
      </div>

      <Footer scrollToVillages={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
}