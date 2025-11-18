// src/pages/public/Home.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, TrendingUp, ArrowRight, BarChart3 } from 'lucide-react';
import { villageService } from '@/services/villageService';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import logoDc from '@/assets/images/logo_dc.png';
import logoDesa from '@/assets/images/logo_desa.png';
import background from '@/assets/images/bg.jpg';
    
export default function Home() {
  const villagesRef = useRef(null);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efek ini akan mengambil data saat komponen dimuat
  useEffect(() => {
    const loadVillages = async () => {
      try {
        const data = await villageService.getAllVillages();
        setVillages(data);
      } catch (error) {
        console.error('Error loading villages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVillages();
  }, []);

  const scrollToVillages = () => {
    villagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar scrollToVillages={scrollToVillages} />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={background}
            alt="Latar belakang desa" 
            className="w-full h-full object-cover"
            onError={(e) => e.target.src = 'https://placehold.co/1920x600/1c6ea4/ffffff?text=Desa+Cantik'}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-white"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="w-64 h-64  rounded-3xl shadow-2xl p-12 hover:scale-105 transition-transform flex items-center justify-center">
                                <img src={logoDc} alt="Logo Desa Cantik" className="w-30 h-30 object-contain" />   
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl text-white mb-6" style={{ textShadow: '2px 4px 8px rgba(0,0,0,0.5)' }}>
              Sistem Informasi <span className="text-[#FFF9AF]">Desa Cantik</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Platform Terpadu untuk Pengelolaan Data dan Statistik Desa
            </p>
            <Button
              onClick={scrollToVillages}
              size="lg"
              className="bg-[#33A1E0] hover:bg-[#1C6EA4] text-white text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              Jelajahi Desa Binaan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tentang Desa Cantik Section */}
      <section className="relative w-screen h-screen overflow-hidden">
        <div className="absolute top-[-50%] left-1/2 transform -translate-x-1/2 w-[200%] h-[200%] bg-gradient-to-br from-[#4BADE4] via-[#33A1E0] to-[#1C6EA4] rounded-full"></div>
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl text-white mb-4" style={{ textShadow: 'rgba(0,0,0,0.2) 2px 4px 8px' }}>
                Tentang <span className="text-[#FFF9AF]">Desa Cantik</span>
              </h2>
              <div className="w-32 h-1 bg-[#FFF9AF] mx-auto rounded-full"></div>
            </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="relative">
            <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={logoDesa}
                alt="Tentang Desa Cantik" 
                className="w-full h-full object-contain"
                onError={(e) => e.target.src = 'https://placehold.co/800x600/4BADE4/ffffff?text=Tentang+Kami'}
              />
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 text-white space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <p className="text-lg leading-relaxed mb-6">
              Berdasarkan UU No. 17 Tahun 1997 Tentang Statistik, BPS menjadi <span className="text-[#FFF9AF]">leading sector</span> dalam pembinaan 
              statistik sektoral sebagai pengembangan Sistem Statistik Nasional (SSN) dan mendukung pembangunan.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              <span className="text-[#FFF9AF]">Desa Cinta Statistik (Desa Cantik)</span> merupakan program yang bertujuan untuk meningkatkan literasi, 
              kesadaran, dan peran aktif perangkat desa/kelurahan dan masyarakat dalam penyelenggaraan kegiatan 
              statistik.
            </p>
            <Button
              asChild
              className="bg-[#FFF9AF] hover:bg-[#FFE680] text-[#154D71] px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
            >
              <Link to="/tentang">Pelajari Lebih Lanjut <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      <section ref={villagesRef} className="py-20 bg-gradient-to-b from-white to-gray-50 scroll-mt-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl text-[#154D71] mb-4">
              Desa Binaan <span className="text-[#33A1E0]">BPS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Daftar desa yang telah bergabung dalam program Desa Cinta Statistik
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#33A1E0] to-[#1C6EA4] mx-auto mt-4 rounded-full"></div>
          </div>

          {loading && (
            <div className="text-center py-12 text-gray-600">Memuat desa binaan...</div>
          )}

          {!loading && (
            <div className="max-w-5xl mx-auto space-y-6">
              {villages.map((village, index) => (
                <Card 
                  key={village.id} 
                  className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 group"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                        <img
                          src={village.image}
                          alt={village.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="md:w-3/5 p-6 flex flex-col justify-between">
                        <div className="space-y-4">
                          <h3 className="text-2xl text-[#154D71]">{village.name}</h3>
                          <div className="flex flex-wrap gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[#33A1E0]" />
                              <span className="text-sm">{village.district}, {village.regency}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-[#33A1E0]" />
                              <span className="text-sm">{village.population.toLocaleString('id-ID')} jiwa</span>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {village.name} adalah desa yang terletak di {village.district}, {village.regency}. 
                            Desa ini merupakan bagian dari program Desa Cinta Statistik.
                          </p>
                        </div>
                        <div className="mt-6">
                          <Button
                            asChild
                            className="bg-gradient-to-r from-[#33A1E0] to-[#1C6EA4] hover:from-[#1C6EA4] hover:to-[#154D71] text-white px-8 py-2 rounded-full shadow-md hover:shadow-lg transition-all group"
                          >
                            <Link to={`/desa/${village.id}`}>
                              Lihat Detail
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer scrollToVillages={scrollToVillages} />
    </div>
  );
}