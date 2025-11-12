// src/pages/public/VillageDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, BarChart3, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { villageService } from '@/services/villageService';
import VillageDetailNavbar from '@/components/shared/VillageDetailNavbar';
import Footer from '@/components/shared/Footer';

export default function VillageDetail() {
  const [village, setVillage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('tentang'); 
  
  const { id } = useParams(); // <-- Mengambil :id dari URL

  useEffect(() => {
    const loadData = async () => {
      if (!id) return; 
      
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

  useEffect(() => {
    // memantau section yang ada di halaman ini
    const sections = ['tentang', 'peta', 'dokumentasi'];
    
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

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          Memuat ID...
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          Memuat data desa...
        </div>
      </div>
    );
  }

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

      <VillageDetailNavbar 
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        villageId={id} 
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

      {/* "Tentang Desa" */}
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

      {/* --- Section Peta  --- */}
      <section id="peta" className="py-20 bg-gray-50 scroll-mt-28">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#154D71] mb-4">Peta Tematik</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#33A1E0] to-[#1C6EA4] mx-auto rounded-full"></div>
          </div>
          {/* Div kosong/placeholder untuk peta  */}
          <div className="aspect-video bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl">Konten Peta Tematik akan dimuat di sini nanti.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. Section Dokumentasi --- */}
      <section id="dokumentasi" className="py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#154D71] mb-4">Dokumentasi</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#33A1E0] to-[#1C6EA4] mx-auto rounded-full"></div>
          </div>
          
          <div className="group w-full overflow-hidden">
            {/* - 'group' di atas akan mengontrol pause.
              - 'animate-marquee-slow' menjalankan animasi.
              - 'group-hover:[animation-play-state:paused]' akan mem-pause saat di-hover.
            */}
            <div className="flex animate-marquee-slow [animation-play-state:running] group-hover:[animation-play-state:paused]">
              {/* Duplikasi array gambar (...documentationImages, ...documentationImages) untuk loop tak terbatas */}
              {[...documentationImages, ...documentationImages].map((img, index) => (
                <div key={index} className="flex-shrink-0 w-full md:w-1/2 p-3">
                  <Card className="overflow-hidden group/item cursor-pointer shadow-lg hover:shadow-2xl transition-all border-0">
                    <div className="aspect-[3/2] bg-gray-200 overflow-hidden">
                      <img
                        src={img}
                        alt={`Dokumentasi ${index + 1}`}
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" // <-- Zoom saat hover di Card
                        onError={(e) => e.target.src = 'https://placehold.co/800x600/cccccc/ffffff?text=Gambar'}
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-600 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-[#33A1E0]" />
                        Dokumentasi { (index % documentationImages.length) + 1 } 
                      </p>
                    </CardContent>
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