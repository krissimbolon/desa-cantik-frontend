// src/pages/dashboard/PetaTematikDesa.jsx
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import CSS Leaflet

import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Map, 
  Layers, 
  Database, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2 
} from 'lucide-react';

// --- MOCK DATA (Ganti dengan API) ---
// TODO: Data ini harus di-fetch dari API (hanya untuk desa ini)
const MOCK_GEOSPATIAL = [
  { id: 'geo001', name: 'Batas Wilayah Desa A', type: 'Polygon', source: 'data_desa_a.geojson' },
  { id: 'geo002', name: 'Titik Lokasi Sekolah', type: 'Point', source: 'data_sekolah.geojson' },
  { id: 'geo003', name: 'Jaringan Sungai', type: 'LineString', source: 'data_sungai.geojson' },
];

const MOCK_LAYERS = [
  { id: 'layer01', name: 'Peta Kepadatan Penduduk', geoId: 'geo001', color: '#FF0000' }, // Merah
  { id: 'layer02', name: 'Peta Fasilitas Pendidikan', geoId: 'geo002', color: '#0000FF' }, // Biru
];
// --- Akhir Mock Data ---

// Fix icon default Leaflet (penting!)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function PetaTematikDesa() { // <-- Nama Komponen Diubah
  const mapRef = useRef(null); // Ref untuk map instance
  const layerGroupRef = useRef(null); // Ref untuk menampung semua layer GeoJSON

  // TODO: Fetch data ini dari API
  const [geospatialData, setGeospatialData] = useState(MOCK_GEOSPATIAL);
  const [layerData, setLayerData] = useState(MOCK_LAYERS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'addGeo', 'editGeo', 'addLayer', 'editLayer'
  const [currentItem, setCurrentItem] = useState(null); // Data untuk diedit

  // --- PERBAIKAN BUG LEAFLET ---
  // 1. useEffect Pertama HANYA untuk Cleanup
  useEffect(() => {
    // Cleanup map saat komponen unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // [] dependency agar hanya run sekali

  // 2. useEffect Kedua untuk Inisialisasi Peta dan Memuat Data
  useEffect(() => {
    // --- SOLUSI BUG ---
    // Inisialisasi Peta JIKA BELUM ADA (karena div #mapPreview sekarang ada)
    if (!mapRef.current && document.getElementById('mapPreview')) {
      mapRef.current = L.map('mapPreview', {
        center: [-2.9739, 119.9045], // Koordinat Toraja Utara
        zoom: 11, // Zoom lebih dekat
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }
    // --- AKHIR SOLUSI ---

    // Jangan lakukan apa-apa jika peta atau layer group belum siap
    if (!mapRef.current || !layerGroupRef.current) return;

    // 1. Bersihkan semua layer lama
    layerGroupRef.current.clearLayers();

    // 2. Buat daftar promise untuk semua layer yang akan di-fetch
    const layerPromises = layerData.map(layer => {
      // Cari data geospatial yang sesuai
      const geoData = geospatialData.find(g => g.id === layer.geoId);
      
      if (geoData) {
        // Fetch file GeoJSON dari folder /public
        return fetch(`/${geoData.source}`) // (Contoh: fetch /data_desa_a.geojson)
          .then(response => {
            if (!response.ok) {
              throw new Error(`File ${geoData.source} tidak ditemukan.`);
            }
            return response.json();
          })
          .then(jsonData => {
            // Buat layer GeoJSON dan beri style
            const geoJsonLayer = L.geoJSON(jsonData, {
              style: (feature) => ({
                color: layer.color, // Gunakan warna dari MOCK_LAYERS
                weight: 3,
                opacity: 1,
                fillOpacity: 0.3
              }),
              pointToLayer: (feature, latlng) => {
                // Style kustom untuk titik (Point)
                return L.circleMarker(latlng, {
                  radius: 6,
                  fillColor: layer.color,
                  color: "#000",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8
                });
              }
            });
            return geoJsonLayer;
          })
          .catch(error => {
            console.error('Gagal memuat layer:', error);
            return null; // Kembalikan null jika gagal
          });
      }
      return Promise.resolve(null);
    });

    // 3. Setelah semua promise selesai
    Promise.all(layerPromises).then(loadedLayers => {
      loadedLayers.forEach(layer => {
        if (layer) {
          // Tambahkan layer yang berhasil dimuat ke layer group
          layerGroupRef.current.addLayer(layer);
        }
      });
    });

  }, [layerData, geospatialData]); // Jalankan ulang jika data atau layer berubah


  // 3. Fungsi CRUD (Simulasi)
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item); // null jika 'add', berisi data jika 'edit'
    setIsModalOpen(true);
  };

  const handleDelete = (type, id) => {
    // TODO: Panggil API Delete
    if (type === 'geo') {
      setGeospatialData(geospatialData.filter(item => item.id !== id));
      console.log('Delete Geospatial:', id);
    } else if (type === 'layer') {
      setLayerData(layerData.filter(item => item.id !== id));
      console.log('Delete Layer:', id);
    }
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // TODO: Panggil API Create/Update
    console.log('Form Submit:', modalType, data);
    
    // Logika CRUD (Simulasi)
    if (modalType === 'addGeo') {
      setGeospatialData([...geospatialData, { id: `geo${Date.now()}`, ...data }]);
    } else if (modalType === 'editGeo') {
      setGeospatialData(geospatialData.map(item => item.id === currentItem.id ? { ...item, ...data } : item));
    } else if (modalType === 'addLayer') {
      setLayerData([...layerData, { id: `layer${Date.now()}`, ...data }]);
    } else if (modalType === 'editLayer') {
      setLayerData(layerData.map(item => item.id === currentItem.id ? { ...item, ...data } : item));
    }
    
    setIsModalOpen(false); // Tutup modal
  };

  // 4. Render Komponen Modal (Dinamis)
  const renderModalContent = () => {
    let title = '';
    let content = null;
    
    if (modalType === 'addGeo' || modalType === 'editGeo') {
      title = modalType === 'addGeo' ? 'Tambah Data Geospatial' : 'Edit Data Geospatial';
      content = (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Data</Label>
            <Input id="name" name="name" defaultValue={currentItem?.name} placeholder="Contoh: Batas Wilayah Desa" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipe</Label>
            <Input id="type" name="type" defaultValue={currentItem?.type} placeholder="Contoh: Polygon, Point" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Sumber (Nama File di /public)</Label>
            <Input id="source" name="source" defaultValue={currentItem?.source} placeholder="Contoh: data.geojson" required />
          </div>
        </div>
      );
    } else if (modalType === 'addLayer' || modalType === 'editLayer') {
      title = modalType === 'addLayer' ? 'Tambah Layer Peta' : 'Edit Layer Peta';
      content = (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Layer</Label>
            <Input id="name" name="name" defaultValue={currentItem?.name} placeholder="Contoh: Peta Kepadatan Penduduk" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="geoId">Data Geospatial</Label>
            {/* TODO: Ganti Input ini jadi <Select> dari MOCK_GEOSPATIAL */}
            <Input id="geoId" name="geoId" defaultValue={currentItem?.geoId} placeholder="Pilih ID Geospatial" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Warna (HEX)</Label>
            <Input id="color" name="color" defaultValue={currentItem?.color} placeholder="Contoh: #FF0000" required />
          </div>
        </div>
      );
    }

    return (
      <DialogContent>
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {content}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    );
  };


  return (
    <div className="space-y-6">
      
      {/* 1. Manajemen Data (CRUD) - DIPINDAH KE ATAS */}
      <Tabs defaultValue="geospatial" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="geospatial">
            <Database className="mr-2 h-4 w-4" />
            Data Geospatial
          </TabsTrigger>
          <TabsTrigger value="layer">
            <Layers className="mr-2 h-4 w-4" />
            Layer Peta Tematik
          </TabsTrigger>
        </TabsList>
        
        {/* TAB 1: DATA GEOSPATIAL */}
        <TabsContent value="geospatial">
          <Card>
            <CardHeader>
              <CardTitle>Tabel Data Geospatial</CardTitle>
              <CardDescription>
                Kelola sumber data mentah (file GeoJSON) untuk peta.
              </CardDescription>
              <Button size="sm" className="w-fit" onClick={() => handleOpenModal('addGeo')}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Data Geo
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Data</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Sumber</TableHead>
                    <TableHead className="w-[50px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {geospatialData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.source}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenModal('editGeo', item)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete('geo', item.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: LAYER PETA TEMATIK */}
        <TabsContent value="layer">
          <Card>
            <CardHeader>
              <CardTitle>Tabel Layer Peta Tematik</CardTitle>
              <CardDescription>
                Kelola layer yang akan ditampilkan di peta (menggunakan Data Geospatial).
              </CardDescription>
              <Button size="sm" className="w-fit" onClick={() => handleOpenModal('addLayer')}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Layer
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Layer</TableHead>
                    <TableHead>Data Geo ID</TableHead>
                    <TableHead>Warna</TableHead>
                    <TableHead className="w-[50px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {layerData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.geoId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 w-4 rounded-full border" 
                            style={{ backgroundColor: item.color }} 
                          />
                          {item.color}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenModal('editLayer', item)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete('layer', item.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 2. Preview Peta - DIPINDAH KE BAWAH */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Preview Peta Tematik
          </CardTitle>
          <CardDescription>
            Preview peta otomatis dimuat berdasarkan data dan layer yang ada di tabel atas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Ini adalah div target untuk Leaflet */}
          <div id="mapPreview" className="h-[400px] w-full rounded-md" />
        </CardContent>
      </Card>


      {/* Modal Universal untuk CRUD */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {renderModalContent()}
      </Dialog>
    </div>
  );
}