// src/pages/dashboard/PetaTematikAdmin.jsx
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 
import { useAuth } from '@/contexts/AuthContext'; 

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
// --- IMPOR KEMBALI SELECT (DROPDOWN) ---
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Map, 
  Layers, 
  Database, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Info,
  MapPin // Ikon MapPin
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_DESA_LIST = [
  { id: '1', name: 'Desa Nonongan Selatan' },
  { id: '2', name: 'Desa Rinding Batu' },
  { id: '3', name: 'Desa Konoha' },
];

const MOCK_GEOSPATIAL = [
  { id: 'geo001', desaId: '1', name: 'Batas Wilayah Nonongan', type: 'Polygon', source: 'data_desa_a.geojson' },
  { id: 'geo002', desaId: '1', name: 'Titik Sekolah Nonongan', type: 'Point', source: 'data_sekolah.geojson' },
  { id: 'geo003', desaId: '2', name: 'Sungai Rinding Batu', type: 'LineString', source: 'data_sungai.geojson' },
];

const MOCK_LAYERS = [
  { id: 'layer01', desaId: '1', name: 'Kepadatan Penduduk', geoId: 'geo001', color: '#FF0000' },
  { id: 'layer02', desaId: '1', name: 'Fasilitas Pendidikan', geoId: 'geo002', color: '#0000FF' },
];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function PetaTematikAdmin() {
  const mapRef = useRef(null); 
  const layerGroupRef = useRef(null); 

  // --- PERUBAHAN: Ambil setActiveVillageId ---
  const { activeVillageId, setActiveVillageId } = useAuth();
  const selectedDesa = activeVillageId; 

  const initialGeo = MOCK_GEOSPATIAL.filter(g => g.desaId === selectedDesa);
  const initialLayers = MOCK_LAYERS.filter(l => l.desaId === selectedDesa);

  const [geospatialData, setGeospatialData] = useState(initialGeo);
  const [layerData, setLayerData] = useState(initialLayers);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [currentItem, setCurrentItem] = useState(null); 

  // Efek: Update data lokal saat Global Filter berubah
  useEffect(() => {
    if (selectedDesa) {
      setGeospatialData(MOCK_GEOSPATIAL.filter(g => g.desaId === selectedDesa));
      setLayerData(MOCK_LAYERS.filter(l => l.desaId === selectedDesa));
    } else {
      setGeospatialData([]);
      setLayerData([]);
    }
  }, [selectedDesa]);

  // Inisialisasi Peta (Cleanup)
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Render Peta saat desa dipilih
  useEffect(() => {
    // Jangan render peta jika tidak ada desa yang dipilih
    // TAPI: Karena dropdown ada di sini, kita biarkan komponen tetap me-render UI utama
    if (!selectedDesa) {
      if (layerGroupRef.current) layerGroupRef.current.clearLayers();
      return;
    }
    
    if (!mapRef.current && document.getElementById('mapPreview')) {
      mapRef.current = L.map('mapPreview', { 
        center: [-2.9739, 119.9045], 
        zoom: 11,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    if (!mapRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    const layerPromises = layerData.map(layer => {
      const geoData = geospatialData.find(g => g.id === layer.geoId);
      if (geoData) {
        return fetch(`/${geoData.source}`) 
          .then(res => res.ok ? res.json() : null)
          .then(jsonData => {
            if (!jsonData) return null;
            return L.geoJSON(jsonData, {
              style: () => ({
                color: layer.color,
                weight: 3,
                opacity: 1,
                fillOpacity: 0.3
              }),
              pointToLayer: (feature, latlng) => {
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
          })
          .catch(err => {
            console.error('Load layer failed:', err);
            return null;
          });
      }
      return Promise.resolve(null);
    });

    Promise.all(layerPromises).then(loadedLayers => {
      loadedLayers.forEach(layer => {
        if (layer) layerGroupRef.current.addLayer(layer);
      });
    });

  }, [selectedDesa, layerData, geospatialData]); 

  // --- CRUD Handlers ---
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (type, id) => {
    if (type === 'geo') setGeospatialData(geospatialData.filter(item => item.id !== id));
    else setLayerData(layerData.filter(item => item.id !== id));
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const newData = { ...data, desaId: selectedDesa };

    if (modalType === 'addGeo') {
      setGeospatialData([...geospatialData, { id: `geo${Date.now()}`, ...newData }]);
    } else if (modalType === 'editGeo') {
      setGeospatialData(geospatialData.map(item => item.id === currentItem.id ? { ...item, ...newData } : item));
    } else if (modalType === 'addLayer') {
      setLayerData([...layerData, { id: `layer${Date.now()}`, ...newData }]);
    } else if (modalType === 'editLayer') {
      setLayerData(layerData.map(item => item.id === currentItem.id ? { ...item, ...newData } : item));
    }
    setIsModalOpen(false); 
  };

  const renderModalContent = () => {
    let title = '';
    let content = null;
    
    if (modalType?.includes('Geo')) {
      title = modalType === 'addGeo' ? 'Tambah Data Geospatial' : 'Edit Data Geospatial';
      content = (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Data</Label>
            <Input name="name" defaultValue={currentItem?.name} required />
          </div>
          <div className="space-y-2">
            <Label>Tipe</Label>
            <Input name="type" defaultValue={currentItem?.type} placeholder="Polygon, Point, Line" required />
          </div>
          <div className="space-y-2">
            <Label>Sumber (File di /public)</Label>
            <Input name="source" defaultValue={currentItem?.source} required />
          </div>
        </div>
      );
    } else {
      title = modalType === 'addLayer' ? 'Tambah Layer Peta' : 'Edit Layer Peta';
      content = (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Layer</Label>
            <Input name="name" defaultValue={currentItem?.name} required />
          </div>
          <div className="space-y-2">
            <Label>Data Geo ID</Label>
            <Input name="geoId" defaultValue={currentItem?.geoId} placeholder="Pilih ID Geo" required />
          </div>
          <div className="space-y-2">
            <Label>Warna (HEX)</Label>
            <Input name="color" defaultValue={currentItem?.color} placeholder="#FF0000" required />
          </div>
        </div>
      );
    }

    return (
      <DialogContent>
        <form onSubmit={handleFormSubmit}>
          <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
          <div className="py-4">{content}</div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    );
  };

  const currentDesaName = MOCK_DESA_LIST.find(d => d.id === selectedDesa)?.name || 'Pilih Desa';

  return (
    <div className="space-y-6 w-full">
      
      {/* --- HEADER & FILTER SEJAJAR --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Bagian Kiri: Judul & Deskripsi */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
             Peta Tematik
             {selectedDesa && <span className="text-gray-500 font-normal hidden sm:inline"> | {currentDesaName}</span>}
          </h2>
          <p className="text-sm text-muted-foreground">
            Kelola data geospatial dan layer peta untuk desa terpilih.
          </p>
        </div>

        {/* Bagian Kanan: Filter Dropdown */}
        <div className="w-full sm:w-auto min-w-[200px]">
          <Select 
            value={selectedDesa || ""} 
            onValueChange={(val) => setActiveVillageId(val)} // Update Global Context
          >
            <SelectTrigger className="w-full bg-white shadow-sm">
              <SelectValue placeholder="Pilih Desa..." />
            </SelectTrigger>
            <SelectContent align="end">
              {MOCK_DESA_LIST.map((desa) => (
                <SelectItem key={desa.id} value={desa.id}>
                  {desa.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KONTEN UTAMA - Hanya Tampil Jika Desa Dipilih */}
      {!selectedDesa ? (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-slate-50 rounded-xl border border-dashed">
          <div className="p-4 bg-white rounded-full shadow-sm mb-3">
            <MapPin className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Belum Ada Desa Dipilih</h3>
          <p className="text-slate-500 max-w-sm text-center mt-1">
            Silakan pilih desa pada menu dropdown di atas untuk mulai mengelola data peta.
          </p>
        </div>
      ) : (
        <>
          {/* 1. Manajemen Data (CRUD) */}
          <Tabs defaultValue="geospatial" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="geospatial"><Database className="mr-2 h-4 w-4"/> Data Geospatial</TabsTrigger>
              <TabsTrigger value="layer"><Layers className="mr-2 h-4 w-4"/> Layer Peta Tematik</TabsTrigger>
            </TabsList>
            
            {/* TAB 1: DATA GEO */}
            <TabsContent value="geospatial">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Data Geospatial</CardTitle>
                    <CardDescription>Sumber data mentah (GeoJSON).</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => handleOpenModal('addGeo')}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Data</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Sumber</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {geospatialData.length > 0 ? geospatialData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.source}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4"/></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenModal('editGeo', item)}><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete('geo', item.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4"/> Hapus</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={4} className="text-center h-24 text-gray-500">Belum ada data.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: LAYER */}
            <TabsContent value="layer">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Layer Peta</CardTitle>
                    <CardDescription>Layer visualisasi di atas peta.</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => handleOpenModal('addLayer')}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Layer</TableHead>
                        <TableHead>Geo ID</TableHead>
                        <TableHead>Warna</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {layerData.length > 0 ? layerData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.geoId}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: item.color }} />
                              {item.color}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4"/></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenModal('editLayer', item)}><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete('layer', item.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4"/> Hapus</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={4} className="text-center h-24 text-gray-500">Belum ada layer.</TableCell></TableRow>
                      )}
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
                Preview Peta: {currentDesaName}
              </CardTitle>
              <CardDescription>
                Preview berdasarkan data di atas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div id="mapPreview" className="h-[400px] w-full rounded-md z-0" />
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {renderModalContent()}
      </Dialog>
    </div>
  );
}