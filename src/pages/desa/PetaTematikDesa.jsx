// src/pages/dashboard/PetaTematikDesa.jsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Map, Layers, Database, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { dataApi } from '@/services/dataApi';
import { useAuth } from '@/contexts/AuthContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function PetaTematikDesa() {
  const mapRef = useRef(null);
  const layerGroupRef = useRef(null);
  const { activeVillageId } = useAuth();

  const [geospatialData, setGeospatialData] = useState([]);
  const [layerData, setLayerData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  const palette = ['#FF0000', '#1C6EA4', '#22c55e', '#a16207', '#9333ea'];

  const loadData = async () => {
    if (!activeVillageId) return;
    setLoading(true);
    setError(null);
    try {
      const [geos, maps] = await Promise.all([
        dataApi.listGeospatial(activeVillageId),
        dataApi.listThematicMaps(activeVillageId),
      ]);
      setGeospatialData(geos || []);
      const derivedLayers =
        maps?.length > 0
          ? maps.map((map, idx) => ({
              id: map.id,
              name: map.theme_name,
              description: map.description,
              icon: map.icon,
              geoId: geos?.[0]?.id,
              color: palette[idx % palette.length],
              type: 'map',
            }))
          : (geos || []).map((geo, idx) => ({
              id: `layer-${geo.id}`,
              name: geo.name,
              geoId: geo.id,
              color: palette[idx % palette.length],
              type: 'geo',
            }));
      setLayerData(derivedLayers);
    } catch (err) {
      setError(err?.message || 'Gagal memuat peta tematik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVillageId]);

  useEffect(() => {
    if (!mapRef.current && document.getElementById('mapPreview')) {
      mapRef.current = L.map('mapPreview', {
        center: [-2.9739, 119.9045],
        zoom: 11,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    if (!mapRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    layerData.forEach((layer) => {
      const geoData = geospatialData.find((g) => g.id === layer.geoId);
      if (!geoData?.geometry) return;

      const geoLayer = L.geoJSON(geoData.geometry, {
        style: {
          color: layer.color,
          weight: 3,
          opacity: 1,
          fillOpacity: 0.3,
        },
        pointToLayer: (feature, latlng) =>
          L.circleMarker(latlng, {
            radius: 6,
            fillColor: layer.color,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          }),
      });

      layerGroupRef.current.addLayer(geoLayer);
    });
  }, [layerData, geospatialData]);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (type, id) => {
    if (!activeVillageId) {
      setError('Pilih desa aktif terlebih dahulu');
      return;
    }
    if (!window.confirm('Hapus data ini?')) return;

    try {
      if (type === 'geo') {
        await dataApi.deleteGeospatial(activeVillageId, id);
      } else if (type === 'layer') {
        const layer = layerData.find((l) => l.id === id);
        if (layer?.type === 'map') {
          await dataApi.deleteThematicMap(activeVillageId, layer.id);
        }
      }
      await loadData();
    } catch (err) {
      setError(err?.message || 'Gagal menghapus data');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!activeVillageId) {
      setError('Pilih desa aktif terlebih dahulu');
      return;
    }
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (modalType === 'addGeo' || modalType === 'editGeo') {
        let geometry = null;
        let properties = {};
        if (data.geometry) {
          try {
            geometry = JSON.parse(data.geometry);
          } catch {
            throw new Error('Format geometry harus JSON valid');
          }
        }
        if (data.properties) {
          try {
            properties = JSON.parse(data.properties);
          } catch {
            throw new Error('Format properties harus JSON valid');
          }
        }
        const payload = {
          name: data.name,
          type: data.type || 'Polygon',
          geometry,
          properties,
        };
        if (modalType === 'editGeo' && currentItem) {
          await dataApi.updateGeospatial(activeVillageId, currentItem.id, payload);
        } else {
          await dataApi.createGeospatial(activeVillageId, payload);
        }
      } else if (modalType === 'addLayer' || modalType === 'editLayer') {
        const payload = {
          theme_name: data.name,
          description: data.description || null,
          icon: data.icon || 'default',
        };
        if (modalType === 'editLayer' && currentItem?.type === 'map') {
          await dataApi.updateThematicMap(activeVillageId, currentItem.id, payload);
        } else {
          await dataApi.createThematicMap(activeVillageId, payload);
        }
      }
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan data');
    }
  };

  const renderModalContent = () => {
    let title = '';
    if (modalType === 'addGeo') title = 'Tambah Geospatial';
    if (modalType === 'editGeo') title = 'Edit Geospatial';
    if (modalType === 'addLayer') title = 'Tambah Layer Tematik';
    if (modalType === 'editLayer') title = 'Edit Layer Tematik';

    return (
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Form ini terhubung ke API geospatial/thematic map backend.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nama</Label>
            <Input name="name" defaultValue={currentItem?.name || ''} required />
          </div>
          {modalType?.includes('Geo') && (
            <>
              <div className="space-y-2">
                <Label>Geometry (GeoJSON)</Label>
                <Textarea
                  name="geometry"
                  className="font-mono text-xs"
                  rows={6}
                  defaultValue={
                    currentItem?.geometry ? JSON.stringify(currentItem.geometry, null, 2) : ''
                  }
                  placeholder='{"type":"Polygon","coordinates":[...]}'
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Tipe</Label>
                <Input name="type" defaultValue={currentItem?.type || 'Polygon'} />
              </div>
              <div className="space-y-2">
                <Label>Properties (opsional)</Label>
                <Textarea
                  name="properties"
                  className="font-mono text-xs"
                  rows={4}
                  defaultValue={
                    currentItem?.properties
                      ? JSON.stringify(currentItem.properties, null, 2)
                      : ''
                  }
                  placeholder='{"label":"Area A"}'
                />
              </div>
            </>
          )}
          {modalType?.includes('Layer') && (
            <>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Input name="description" defaultValue={currentItem?.description || ''} />
              </div>
              <div className="space-y-2">
                <Label>Ikon</Label>
                <Input name="icon" defaultValue={currentItem?.icon || 'default'} />
              </div>
            </>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {loading && <div className="text-sm text-gray-500">Memuat data peta...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <Tabs defaultValue="geospatial">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="geospatial" className="gap-2">
              <Database className="w-4 h-4" />
              Geospatial
            </TabsTrigger>
            <TabsTrigger value="layer" className="gap-2">
              <Layers className="w-4 h-4" />
              Layer
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button onClick={() => handleOpenModal('addGeo')}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Geospatial
            </Button>
            <Button variant="secondary" onClick={() => handleOpenModal('addLayer')}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Layer
            </Button>
          </div>
        </div>

        <TabsContent value="geospatial" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-[#1C6EA4]" />
                  Preview Peta
                </CardTitle>
                <CardDescription>Data GeoJSON dari API.</CardDescription>
              </CardHeader>
              <CardContent>
                <div id="mapPreview" className="h-[420px] rounded-lg overflow-hidden border" />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Data Geospatial</CardTitle>
                <CardDescription>Daftar data GeoJSON dari desa terpilih.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {geospatialData.map((geo) => (
                      <TableRow key={geo.id}>
                        <TableCell className="font-medium">{geo.name}</TableCell>
                        <TableCell>{geo.type}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleOpenModal('editGeo', geo)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete('geo', geo.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {geospatialData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-sm text-gray-500">
                          Belum ada data geospatial.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="layer" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Layer Tematik</CardTitle>
              <CardDescription>Layer berdasarkan peta tematik/geospatial.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Geo ID</TableHead>
                    <TableHead>Warna</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {layerData.map((layer) => (
                    <TableRow key={layer.id}>
                      <TableCell className="font-medium">{layer.name}</TableCell>
                      <TableCell>{layer.geoId}</TableCell>
                      <TableCell>
                        <span
                          className="inline-block w-5 h-5 rounded"
                          style={{ backgroundColor: layer.color }}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleOpenModal('editLayer', layer)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete('layer', layer.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {layerData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                        Belum ada layer tematik.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {renderModalContent()}
      </Dialog>
    </div>
  );
}
