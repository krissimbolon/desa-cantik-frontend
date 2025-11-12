// src/pages/public/VillageDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// 1. Impor MapContainer dan komponen Leaflet
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { MapPin, Users, BarChart3, Image as ImageIcon, FileText, Layers } from 'lucide-react';
// 2. Impor komponen Filter
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { villageService } from '@/services/villageService';
import VillageDetailNavbar from '@/components/shared/VillageDetailNavbar';
import Footer from '@/components/shared/Footer';

// --- 3. Data Dummy GeoJSON (kita ambil dari PetaTematik.jsx) ---
const dataLayer1 = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature", "properties": { "name": "Zona Kepadatan Tinggi", "value": 3000 },
      "geometry": { "type": "Polygon", "coordinates": [[[-6.200, 106.800], [-6.200, 106.810], [-6.210, 106.810], [-6.210, 106.800], [-6.200, 106.800]]] }
    }
  ]
};
const dataLayer2 = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature", "properties": { "name": "Zona Kepadatan Rendah", "value": 500 },
      "geometry": { "type": "Polygon", "coordinates": [[[-6.220, 106.820], [-6.220, 106.830], [-6.230, 106.830], [-6.230, 106.820], [-6.220, 106.820]]] }
    }
  ]
};
const styleLayer1 = { fillColor: "red", color: "#FF0000", weight: 2, opacity: 1, fillOpacity: 0.5 };
const styleLayer2 = { fillColor: "green", color: "#008000", weight: 2, opacity: 1, fillOpacity: 0.5 };
const layerOptions = [
  { id: 'kepadatan', label: 'Kepadatan Penduduk', data: dataLayer1, style: styleLayer1 },
  { id: 'lahan', label: 'Penggunaan Lahan', data: dataLayer2, style: styleLayer2 },
];
// -----------------------------------------------------------------


export default function VillageDetail() {
  const [village, setVillage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('tentang'); 
  const { id } = useParams(); 

  // --- 4. State untuk Peta ---
  const [activeLayerId, setActiveLayerId] = useState('kepadatan');
  const [layerVisibility, setLayerVisibility] = useState({
    kepadatan: true,
    lahan: true,
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id || id === "undefined") return; 
      try {
        setLoading(true);
        const villageData = await villageService.getVillageById(id);
        if (villageData) {
          setVillage(villageData);
        } else {
          console.error("Desa tidak ditemukan");
        }
      } catch (error) {
        console.error('Error loading village data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]); 

  // 5. Update scroll-spy untuk memantau SEMUA section
  useEffect(() => {
    const sections = ['tentang', 'data', 'publikasi', 'peta', 'dokumentasi'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; 
      let currentSection = 'tentang'; 
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = sectionId;
            break; 
          }
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); 

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -120; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // --- 6. Handler untuk Peta ---
  const handleLayerChange = (layerId) => setActiveLayerId(layerId);
  const handleVisibilityChange = (layerId) => {
    setLayerVisibility(prev => ({ ...prev, [layerId]: !prev[layerId] }));
  };
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`<b>${feature.properties.name}</b><br>Nilai: ${feature.properties.value}`);
    }
  };
  // ------------------------------

  // Guard clause untuk 'id'
  if (!id || id === "undefined") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          Memuat ID...
        </div>
      </div>
    );
  }
  
  // Guard clause untuk 'loading'
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          Memuat data desa...
        </div>
      </div>
    );
  }

  // Guard clause untuk 'village'
  if (!village) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Desa tidak ditemukan</p>
          <Button asChild className="mt-4 bg-[#1C6EA4]">
            <Link to="/">Kembali</Link>
          </Button>
        </div>
      </div>
    );
  }

  const documentationImages = [
    village.image,
    'https://placehold.co/800x600/67e8f9/ffffff?text=Dokumentasi+1',
    'https://placehold.co/800x600/fde047/ffffff?text=Dokumentasi+2',
    'https://placehold.co/800x600/a3e635/ffffff?text=Dokumentasi+3',
  ];

  return (
    <div className="min-h-screen bg-white">
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

      {/* 7. Panggil Navbar (tanpa villageId) */}
      <VillageDetailNavbar 
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#4BADE4] via-[#33A1E0] to-[#1C6EA4] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center pt-8"> 
              <span className="bg-white/20 text-white px-6 py-2 text-lg mb-4 backdrop-blur-sm rounded-full inline-block">
                Profil Desa
              </span>
              <h1 className="text-5xl mb-6 mt-4" style={{ textShadow: 'rgba(0,0,0,0.25) 2px 4px 8px' }}>
                {village.name}
              </h1>
              <div className="flex items-center justify-center gap-8 text-lg flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <MapPin className="h-5 w-5" />
                  <span>{village.district}, {village.regency}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Users className="h-5 w-5" />
                  <span>{village.population.toLocaleString('id-ID')} jiwa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section "Tentang Desa" */}
      <section id="tentang" className="py-20 bg-gradient-to-b from-white to-gray-50 scroll-mt-28">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl text-[#154D71] mb-4">Tentang Desa</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#33A1E0] to-[#1C6EA4] mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#33A1E0]/20 to-[#1C6EA4]/20 rounded-3xl blur-2xl"></div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={village.image}
                    alt={village.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-[#1C6EA4] to-[#33A1E0] text-white">
                    <CardTitle className="text-2xl">{village.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {village.name} merupakan salah satu desa yang terletak di {village.district}, {village.regency}. 
                      Desa ini juga memiliki julukan sebagai Desa Wisata. {village.name} berjarak sekitar 5 (lima) 
                      kilometer dari Kota Kabupaten.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-[#33A1E0] to-[#4BADE4] text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      Penduduk
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed text-gray-700">
                      Jumlah penduduk {village.name} mencapai <span className="text-[#1C6EA4]">{village.population.toLocaleString('id-ID')} jiwa</span> dengan 
                      kepadatan {Math.round(village.population / village.area)} jiwa/km².
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 8. Tambahkan Section "Data" (Placeholder) --- */}
      <section id="data" className="py-20 bg-gray-50 scroll-mt-28">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#154D71] mb-4">Data Statistik</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#33A1E0] to-[#1C6EA4] mx-auto rounded-full"></div>
          </div>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-10 text-center text-gray-500">
              <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              Konten data statistik lengkap akan dimuat di halaman ini.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* --- 9. Tambahkan Section "Publikasi" (Placeholder) --- */}
      <section id="publikasi" className="py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#154D71] mb-4">Publikasi</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#33A1E0] to-[#1C6EA4] mx-auto rounded-full"></div>
          </div>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-10 text-center text-gray-500">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              Konten daftar publikasi akan dimuat di halaman ini.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* --- 10. ISI Section "Peta" --- */}
      <section id="peta" className="py-20 bg-gray-50 scroll-mt-28">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#154D71] mb-4">Peta Tematik</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#33A1E0] to-[#1C6EA4] mx-auto rounded-full"></div>
          </div>
          
          {/* Filter Card */}
          <Card className="mb-6 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Filter Peta
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 items-center">
              <div className="space-y-2">
                <Label>Pilih Layer Utama</Label>
                {/* Kode ini sekarang aman karena 'activeLayerId' sudah ada */}
                <Select value={activeLayerId} onValueChange={handleLayerChange}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Pilih layer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {layerOptions.map(opt => (
                      <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 pt-6">
                <Label>Visibilitas Layer</Label>
                <div className="flex gap-4">
                  {layerOptions.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`check-detail-${opt.id}`}
                        checked={layerVisibility[opt.id]} // <-- Kode ini sekarang aman
                        onCheckedChange={() => handleVisibilityChange(opt.id)}
                      />
                      <Label
                        htmlFor={`check-detail-${opt.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Peta Card */}
          <Card className="overflow-hidden shadow-lg border-0">
            <CardContent className="p-0">
              {/* Kita harus cek !loading DULU sebelum render MapContainer */}
              {!loading && (
                <MapContainer 
                  center={[-3.05, 119.93]} // <-- Ganti ke koordinat Toraja Utara
                  zoom={12} 
                  scrollWheelZoom={true} 
                  style={{ height: '600px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {layerVisibility.kepadatan && (
                    <GeoJSON 
                      data={dataLayer1} 
                      style={styleLayer1} 
                      onEachFeature={onEachFeature}
                    />
                  )}
                  {layerVisibility.lahan && (
                    <GeoJSON 
                      data={dataLayer2} 
                      style={styleLayer2} 
                      onEachFeature={onEachFeature}
                    />
                  )}
                </MapContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* --- Section "Dokumentasi" (tetap sama) --- */}
      <section id="dokumentasi" className="py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#154D71] mb-4">Dokumentasi</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#33A1E0] to-[#1C6EA4] mx-auto rounded-full"></div>
          </div>
          
          <div className="group w-full overflow-hidden">
            <div className="flex animate-marquee-slow [animation-play-state:running] group-hover:[animation-play-state:paused]">
              {[...documentationImages, ...documentationImages].map((img, index) => (
                <div key={index} className="flex-shrink-0 w-full md:w-1/2 p-3">
                  <Card className="overflow-hidden group/item cursor-pointer shadow-lg hover:shadow-2xl transition-all border-0">
                    <div className="aspect-[3/2] bg-gray-200 overflow-hidden">
                      <img
                        src={img}
                        alt={`Dokumentasi ${index + 1}`}
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                        onError={(e) => e.target.src = 'https://placehold.co/800x600/cccccc/ffffff?text=Gambar'}
                      />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer scrollToVillages={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
}