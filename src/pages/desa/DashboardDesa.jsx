// src/pages/desa/DashboardDesa.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// Data dummy
const visitorsData = [
  { bulan: 'Jan', pengunjung: 120 },
  { bulan: 'Feb', pengunjung: 145 },
  { bulan: 'Mar', pengunjung: 180 },
  { bulan: 'Apr', pengunjung: 210 },
  { bulan: 'May', pengunjung: 250 },
  { bulan: 'Jun', pengunjung: 290 },
];

const recentActivities = [
  { id: 1, activity: 'Publikasi baru ditambahkan: Profil Desa 2024', time: '2 jam yang lalu' },
  { id: 2, activity: 'Data statistik diperbarui', time: '5 jam yang lalu' },
  { id: 3, activity: 'Peta tematik di-upload', time: '1 hari yang lalu' },
];

export default function DashboardDesa() {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Layout Konten */}
      <div className="flex-1 flex flex-col overflow-hidden">
      

        {/* 4. Konten Halaman */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
          </div>
        </main>
        </div>
    </div>
  );
}