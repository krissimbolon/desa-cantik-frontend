// src/pages/public/VillageDetail.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { 
  MapPin, Users, FileText, Layers, CalendarDays, 
  ArrowRight, ListFilter, Landmark, HeartPulse, Briefcase, Download, 
  ChevronLeft, ChevronRight, Eye 
} from 'lucide-react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Services
import { villageService } from '@/services/villageService';
import { geoService } from '@/services/geoService'; // <-- KONEK KE BACKEND (MOCK)

import VillageDetailNavbar from '@/components/shared/VillageDetailNavbar';
import Footer from '@/components/shared/Footer';

// --- Data Dummy Publikasi & Statistik (Tetap Mock dulu karena Backend belum ready) ---
const dummyPublications = [
  { id: 1, title: 'Statistik Pelabuhan Perikanan 2024', date: '2025-11-07', year: '2025', month: '11', description: 'Data statistik terkini pelabuhan perikanan.', imageUrl: 'https://placehold.co/300x400/BFDBFE/1E3A8A?text=Cover+1' },
  { id: 2, title: 'Statistik Pendaratan Ikan Tradisional 2024', date: '2025-11-07', year: '2025', month: '11', description: 'Data pendaratan ikan nelayan tradisional.', imageUrl: 'https://placehold.co/300x400/A5F3FC/0E7490?text=Cover+2' },
  { id: 3, title: 'Benchmark Indeks Konstruksi 2023', date: '2025-10-31', year: '2025', month: '10', description: 'Analisis indeks harga konstruksi.', imageUrl: 'https://placehold.co/300x400/FDE68A/B45309?text=Cover+3' },
  { id: 4, title: 'Cerita Data Statistik Indonesia', date: '2025-10-31', year: '2025', month: '10', description: 'Kajian pendidikan dan pekerjaan pemuda.', imageUrl: 'https://placehold.co/300x400/D1FAE5/065F46?text=Cover+4' },
  { id: 5, title: 'Statistik Impor Bulanan', date: '2024-10-31', year: '2024', month: '10', description: 'Laporan bulanan data impor.', imageUrl: 'https://placehold.co/300x400/FECACA/991B1B?text=Cover+5' },
  { id: 6, title: 'Direktori Industri Manufaktur', date: '2024-09-30', year: '2024', month: '9', description: 'Direktori perusahaan industri manufaktur.', imageUrl: 'https://placehold.co/300x400/E9D5FF/5B21B6?text=Cover+6' }
];

const monthOptions = [
  { value: 'all', label: 'Semua Bulan' },
  { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
  { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
];

const yearOptions = ['All', '2025', '2024', '2023'];

const allTables = {
  rt_rw: { title: 'Jumlah RT/RW', source: 'Kantor Lembang', data: { headers: ['Tahun', 'RT', 'RW'], rows: [[2024, 10, 3], [2025, 11, 3]] } },
  aparatur: { title: 'Jumlah Aparatur', source: 'Kantor Lembang', data: { headers: ['Jabatan', 'Jumlah'], rows: [['Kepala Desa', 1], ['Sekdes', 1]] } },
  distribusi: { title: 'Penduduk', source: 'Kantor Lembang', data: { headers: ['Indikator', 'Nilai'], rows: [['Laki-laki', 800], ['Perempuan', 780]] } },
};

const subjectGroups = [
  { id: 'wilayah', name: 'Wilayah & Pemerintahan', icon: Landmark, tables: [{ id: 'rt_rw', title: 'RT/RW' }, { id: 'aparatur', title: 'Aparatur' }] },
  { id: 'penduduk', name: 'Kependudukan', icon: Users, tables: [{ id: 'distribusi', title: 'Distribusi Penduduk' }] },
];

export default function VillageDetail() {
  const { id } = useParams();
  const [village, setVillage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('tentang');

  // --- STATE PETA DARI SERVICE ---
  const [mapData, setMapData] = useState([]); 
  // State untuk kontrol lokal user (user bisa hide/show layer yang sudah diizinkan admin)
  const [localLayerVisibility, setLocalLayerVisibility] = useState({});

  // --- State Publikasi ---
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  // --- State Statistik ---
  const [activeSubjectId, setActiveSubjectId] = useState('wilayah');
  const [activeTableId, setActiveTableId] = useState('rt_rw');

  // 1. Load Data Desa
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await villageService.getVillageById(id);
        setVillage(data || { 
          name: 'Desa Contoh', 
          district: 'Kecamatan Contoh', 
          regency: 'Kabupaten Contoh',
          population: 1500,
          area: 10,
          image: 'https://placehold.co/800x600?text=Desa+Image' 
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // 2. LOAD PETA DARI GEO SERVICE
  useEffect(() => {
    const loadMapData = async () => {
      if (!id) return;
      try {
        // Ambil data layer dan geometri dari "Backend"
        const layers = await geoService.getLayersByVillage(id);
        const geos = await geoService.getGeospatialByVillage(id);

        // Gabungkan data
        const combinedData = layers.map(layer => {
          const geo = geos.find(g => g.id === parseInt(layer.geoId));
          return { ...layer, geometry: geo?.geometry };
        }).filter(item => item.geometry); // Hanya tampilkan yang punya data geometri

        setMapData(combinedData);

        // Inisialisasi visibilitas lokal berdasarkan settingan Admin
        const initialVisibility = {};
        combinedData.forEach(layer => {
          // Jika admin set true, user lihat true. Jika admin false, user lihat false.
          initialVisibility[layer.id] = layer.isVisible; 
        });
        setLocalLayerVisibility(initialVisibility);

      } catch (err) {
        console.error("Gagal memuat peta:", err);
      }
    };
    loadMapData();
  }, [id]);

  // 3. Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['tentang', 'data', 'publikasi', 'peta', 'dokumentasi'];
      const scrollPosition = window.scrollY + 150;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveSection(sectionId);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Logic Filter Publikasi
  const filteredPublications = useMemo(() => {
    return dummyPublications.filter(pub => {
      const matchYear = selectedYear === 'All' || pub.year === selectedYear;
      const matchMonth = selectedMonth === 'all' || pub.month === selectedMonth;
      return matchYear && matchMonth;
    });
  }, [selectedYear, selectedMonth]);

  const totalPages = Math.ceil(filteredPublications.length / ITEMS_PER_PAGE);
  const currentPublications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPublications.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPublications, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [selectedYear, selectedMonth]);

  // Logic Statistik
  const currentSubject = subjectGroups.find(s => s.id === activeSubjectId) || subjectGroups[0];
  const currentTable = allTables[activeTableId] || allTables[currentSubject.tables[0].id] || { title: 'Data tidak tersedia', source: '-', data: { headers: [], rows: [] } };

  const handleSubjectChange = (val) => {
    setActiveSubjectId(val);
    const subj = subjectGroups.find(s => s.id === val);
    if (subj && subj.tables.length > 0) setActiveTableId(subj.tables[0].id);
  };

  const handleDownloadCSV = () => {
    alert("Fitur download CSV akan mengunduh data: " + currentTable.title);
  };

  // Logic Toggle Layer Lokal (User Publik)
  const handleLocalLayerToggle = (layerId) => {
    setLocalLayerVisibility(prev => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Memuat...</div>;
  if (!village) return <div className="h-screen flex items-center justify-center">Desa tidak ditemukan.</div>;

  const documentationImages = [
    village.image,
    'https://placehold.co/800x600/67e8f9/ffffff?text=Kegiatan+1',
    'https://placehold.co/800x600/fde047/ffffff?text=Kegiatan+2',
    'https://placehold.co/800x600/a3e635/ffffff?text=Kegiatan+3',
    'https://placehold.co/800x600/fca5a5/ffffff?text=Kegiatan+4',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* CSS untuk Marquee */}
      <style>
        {`
          @keyframes marquee-slow {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); } 
          }
          .animate-marquee-slow {
            animation: marquee-slow 30s linear infinite; 
          }
        `}
      </style>

      <VillageDetailNavbar activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#4BADE4] via-[#33A1E0] to-[#1C6EA4] text-white py-20">
        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-4 inline-block">Profil Desa</span>
          <h1 className="text-5xl font-bold mb-4">{village.name}</h1>
          <div className="flex justify-center gap-6 text-lg">
            <div className="flex items-center gap-2"><MapPin className="h-5 w-5"/> {village.district}</div>
            <div className="flex items-center gap-2"><Users className="h-5 w-5"/> {village.population} Jiwa</div>
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="py-16 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img src={village.image} alt={village.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#154D71] mb-6">Tentang Desa</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {village.name} adalah desa potensial di {village.district}. Memiliki luas wilayah {village.area} km² dengan kepadatan penduduk yang merata.
            </p>
          </div>
        </div>
      </section>

      {/* DATA STATISTIK */}
      <section id="data" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#154D71]">Data Statistik</h2>
            <div className="w-20 h-1 bg-[#33A1E0] mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
             <Label className="mb-2 block">Pilih Kategori Data</Label>
             <Select value={activeSubjectId} onValueChange={handleSubjectChange}>
                <SelectTrigger className="w-full md:w-[300px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {subjectGroups.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
             </Select>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
             <div className="w-full md:w-1/4 space-y-2">
                {currentSubject.tables.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTableId(t.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      activeTableId === t.id ? "bg-[#1C6EA4] text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {t.title}
                  </button>
                ))}
             </div>
             <div className="w-full md:w-3/4">
               <Card className="border-0 shadow-md">
                 <CardHeader className="bg-gray-50 border-b pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg text-[#154D71]">{currentTable.title}</CardTitle>
                      <Button size="sm" variant="outline" onClick={handleDownloadCSV}><Download className="w-4 h-4 mr-2"/> CSV</Button>
                    </div>
                 </CardHeader>
                 <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {currentTable.data.headers.map((h, i) => <TableHead key={i} className="font-bold">{h}</TableHead>)}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentTable.data.rows.map((row, i) => (
                          <TableRow key={i}>
                            {row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </CardContent>
                 <CardFooter className="bg-gray-50 text-xs text-gray-500 py-3">
                    Sumber: {currentTable.source}
                 </CardFooter>
               </Card>
             </div>
          </div>
        </div>
      </section>

      {/* PUBLIKASI */}
      <section id="publikasi" className="py-16 container mx-auto px-6">
         <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#154D71]">Publikasi Desa</h2>
            <div className="w-20 h-1 bg-[#33A1E0] mx-auto mt-2 rounded-full"></div>
         </div>
         
         <div className="bg-gray-50 p-6 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-48">
               <Label className="mb-2 block">Tahun</Label>
               <Select value={selectedYear} onValueChange={setSelectedYear}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                    {yearOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                 </SelectContent>
               </Select>
            </div>
            <div className="w-full md:w-48">
               <Label className="mb-2 block">Bulan</Label>
               <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                    {monthOptions.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                 </SelectContent>
               </Select>
            </div>
            <div className="text-sm text-gray-500 pb-2 ml-auto">
              Menampilkan {currentPublications.length} dari {filteredPublications.length} dokumen
            </div>
         </div>

         {currentPublications.length > 0 ? (
           <div className="grid md:grid-cols-2 gap-6 mb-8">
              {currentPublications.map(pub => (
                <Card key={pub.id} className="flex overflow-hidden hover:shadow-lg transition-shadow border-0 bg-gray-50">
                  <div className="w-32 bg-gray-200 shrink-0">
                    <img src={pub.imageUrl} alt={pub.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex flex-col justify-between w-full">
                    <div>
                      <h3 className="font-bold text-[#154D71] line-clamp-2 mb-2">{pub.title}</h3>
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> {pub.date}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{pub.description}</p>
                    </div>
                    <Button size="sm" variant="link" className="px-0 text-[#33A1E0] self-start mt-2">
                      Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1"/>
                    </Button>
                  </div>
                </Card>
              ))}
           </div>
         ) : (
           <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">Tidak ada publikasi ditemukan.</div>
         )}

         {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={currentPage === i + 1} 
                      onClick={() => setCurrentPage(i + 1)}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
         )}
      </section>

      {/* PETA TEMATIK (TERKONEKSI) */}
      <section id="peta" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
             <h2 className="text-3xl font-bold text-[#154D71]">Peta Tematik</h2>
             <div className="w-20 h-1 bg-[#33A1E0] mx-auto mt-2 rounded-full"></div>
             <p className="mt-4 text-gray-600">Visualisasi data geospasial wilayah {village.name}.</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Kontrol Layer (Interaktif untuk Publik) */}
            <Card className="lg:col-span-1 h-fit shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5 text-[#154D71]"/> Layer Peta</CardTitle>
                <CardDescription>Centang layer untuk ditampilkan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mapData.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Belum ada data peta dari admin.</p>
                ) : (
                  mapData.map(layer => (
                    <div key={layer.id} className="flex items-center space-x-3 border p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox 
                        id={`pub-layer-${layer.id}`} 
                        checked={localLayerVisibility[layer.id] ?? false} // Default ambil dari state local
                        onCheckedChange={() => handleLocalLayerToggle(layer.id)}
                        // Jika admin set hidden (isVisible=false di backend), checkbox ini tetap bisa di-toggle user 
                        // TAPI initial statenya tadi sudah kita ambil dari admin.
                      />
                      <div className="grid gap-1.5 leading-none cursor-pointer">
                         <label 
                            htmlFor={`pub-layer-${layer.id}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                         >
                            {layer.name}
                         </label>
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }}></div>
                            <span className="text-xs text-muted-foreground">{layer.color}</span>
                         </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Map Container */}
            <Card className="lg:col-span-3 overflow-hidden h-[500px] z-0 shadow-lg border-0">
               <MapContainer center={[-2.9739, 119.9045]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mapData.map(layer => (
                   // Render HANYA jika localVisibility bernilai true
                   localLayerVisibility[layer.id] && layer.geometry && (
                    <GeoJSON 
                      key={layer.id} 
                      data={layer.geometry} 
                      style={{ color: layer.color, fillColor: layer.color, weight: 2, fillOpacity: 0.4 }} 
                      onEachFeature={(feature, l) => {
                        l.bindPopup(`
                          <div class="text-sm">
                            <p class="font-bold mb-1">${layer.name}</p>
                            <p>Tipe: ${layer.geometry.type}</p>
                          </div>
                        `);
                      }} 
                    />
                   )
                ))}
              </MapContainer>
            </Card>
          </div>
        </div>
      </section>

      {/* DOKUMENTASI (MARQUEE STYLE - KEMBALI KE AWAL) */}
      <section id="dokumentasi" className="py-16 container mx-auto px-6">
        <div className="text-center mb-10">
           <h2 className="text-3xl font-bold text-[#154D71]">Dokumentasi</h2>
           <div className="w-20 h-1 bg-[#33A1E0] mx-auto mt-2 rounded-full"></div>
        </div>
        
        <div className="group w-full overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="flex animate-marquee-slow [animation-play-state:running] group-hover:[animation-play-state:paused]">
            {/* Duplikasi array untuk efek infinite loop yang mulus */}
            {[...documentationImages, ...documentationImages].map((img, index) => (
              <div key={index} className="flex-shrink-0 w-full md:w-1/3 p-2">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group/item cursor-pointer">
                  <img
                    src={img}
                    alt={`Dokumentasi ${index + 1}`}
                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-colors flex items-center justify-center">
                     <Eye className="text-white opacity-0 group-hover/item:opacity-100 transition-opacity w-8 h-8 drop-shadow-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}