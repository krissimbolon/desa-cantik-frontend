// src/pages/dashboard/PetaTematikAdmin.jsx
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import CSS Leaflet
import { dataApi } from '@/services/dataApi';
import { villageService } from '@/services/villageService';

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Impor baru untuk Dropdown
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  MapPin, // Ikon baru
  Map, 
  Layers, 
  Database, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2 
} from 'lucide-react';

// Fix icon default Leaflet (penting!)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function PetaTematikAdmin() {
  const mapRef = useRef(null); // Ref untuk map instance
  const layerGroupRef = useRef(null); // Ref untuk menampung semua layer GeoJSON

  // --- STATE ---
  const [villages, setVillages] = useState([]);
  const [loadingVillages, setLoadingVillages] = useState(true);
  const [selectedDesa, setSelectedDesa] = useState(null); 
  const [geospatialData, setGeospatialData] = useState([]);
  const [layerData, setLayerData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [currentItem, setCurrentItem] = useState(null);

  // Fetch villages on mount
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const data = await villageService.getAllVillages();
        setVillages(data || []);
      } catch (err) {
        console.error('Failed to fetch villages:', err);
      } finally {
        setLoadingVillages(false);
      }
    };
    fetchVillages();
  }, []);

  // Fetch geospatial data and thematic maps when village is selected
  useEffect(() => {
    if (!selectedDesa) {
      setGeospatialData([]);
      setLayerData([]);
      return;
    }

    const fetchVillageData = async () => {
      setLoadingData(true);
      try {
        const [geoData, mapsData] = await Promise.all([
          dataApi.listGeospatial(selectedDesa),
          dataApi.listThematicMaps(selectedDesa),
        ]);
        setGeospatialData(geoData || []);
        setLayerData(mapsData || []);
      } catch (err) {
        console.error('Failed to fetch village data:', err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchVillageData();
  }, [selectedDesa]); 

  // --- PERBAIKAN 1: useEffect Pertama HANYA untuk Cleanup ---
  useEffect(() => {
    // Logika inisialisasi peta dipindahkan dari sini
    
    // Cleanup map saat komponen unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // [] dependency agar hanya run sekali

  // --- PERBAIKAN 2: Inisialisasi Peta dipindah ke useEffect Kedua ---
  useEffect(() => {
    
    // Jika desa belum dipilih, bersihkan peta (jika ada) & keluar
    if (!selectedDesa) {
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
      }
      return;
    }
    
    // --- SOLUSI ---
    // Inisialisasi Peta JIKA BELUM ADA (karena div #mapPreview sekarang ada)
    if (!mapRef.current && document.getElementById('mapPreview')) {
      mapRef.current = L.map('mapPreview', { // <-- Pindahkan ke sini
        center: [-2.9739, 119.9045], 
        zoom: 11,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }
    // --- AKHIR SOLUSI ---

    // Jangan lakukan apa-apa jika peta belum siap (misal div belum ada)
    if (!mapRef.current || !layerGroupRef.current) return;

    // TODO: Di sini harusnya kamu fetch data geo & layer berdasarkan selectedDesa
    // ...

    // 1. Bersihkan semua layer lama
    layerGroupRef.current.clearLayers();

    // 2. Render thematic maps layers
    const layerPromises = layerData.map(layer => {
      // Backend returns geo_data as GeoJSON directly
      if (layer.geo_data) {
        try {
          const geoJsonLayer = L.geoJSON(layer.geo_data, {
            style: (feature) => ({
              color: layer.color || '#FF0000',
              weight: 3,
              opacity: 1,
              fillOpacity: 0.3
            }),
            pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 6,
                fillColor: layer.color || '#FF0000',
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
              });
            }
          });
          return Promise.resolve(geoJsonLayer);
        } catch (error) {
          console.error('Failed to render layer:', error);
          return Promise.resolve(null);
        }
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

  }, [selectedDesa, layerData, geospatialData]); // Jalankan ulang jika desa atau data berubah


  // 3. Fungsi CRUD (Simulasi)
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item); // null jika 'add', berisi data jika 'edit'
    setIsModalOpen(true);
  };

  const handleDelete = async (type, id) => {
    if (!selectedDesa) return;
    
    try {
      if (type === 'geo') {
        await dataApi.deleteGeospatial(selectedDesa, id);
        setGeospatialData(geospatialData.filter(item => item.id !== id));
      } else if (type === 'layer') {
        await dataApi.deleteThematicMap(selectedDesa, id);
        setLayerData(layerData.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Gagal menghapus data: ' + error.message);
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDesa) return;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
      if (modalType === 'addGeo') {
        const newGeo = await dataApi.createGeospatial(selectedDesa, data);
        setGeospatialData([...geospatialData, newGeo]);
      } else if (modalType === 'editGeo') {
        const updated = await dataApi.updateGeospatial(selectedDesa, currentItem.id, data);
        setGeospatialData(geospatialData.map(item => item.id === currentItem.id ? updated : item));
      } else if (modalType === 'addLayer') {
        const newLayer = await dataApi.createThematicMap(selectedDesa, data);
        setLayerData([...layerData, newLayer]);
      } else if (modalType === 'editLayer') {
        const updated = await dataApi.updateThematicMap(selectedDesa, currentItem.id, data);
        setLayerData(layerData.map(item => item.id === currentItem.id ? updated : item));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Form submit failed:', error);
      alert('Gagal menyimpan data: ' + error.message);
    }
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
            <Select name="geospatial_data_id" defaultValue={currentItem?.geospatial_data_id?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Data Geospatial" />
              </SelectTrigger>
              <SelectContent>
                {geospatialData.map(geo => (
                  <SelectItem key={geo.id} value={geo.id.toString()}>
                    {geo.name} ({geo.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      
      {/* --- KARTU BARU: PILIH DESA --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Pilih Desa
          </CardTitle>
          <CardDescription>
            Pilih desa yang data peta tematiknya ingin Anda kelola.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedDesa} value={selectedDesa || ''}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Pilih desa..." />
            </SelectTrigger>
            <SelectContent>
              {loadingVillages ? (
                <SelectItem value="loading" disabled>Memuat desa...</SelectItem>
              ) : (
                villages.map(desa => (
                  <SelectItem key={desa.id} value={desa.id.toString()}>
                    {desa.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* --- KONTEN BARU: HANYA TAMPIL JIKA DESA DIPILIH --- */}
      {selectedDesa && (
        <>
          {/* 1. Manajemen Data (CRUD) */}
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
          
          {/* 2. Preview Peta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Preview Peta: {villages.find(d => d.id === parseInt(selectedDesa))?.name || 'Loading...'}
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
        </>
      )}

      {/* Modal Universal untuk CRUD */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {renderModalContent()}
      </Dialog>
    </div>
  );
}