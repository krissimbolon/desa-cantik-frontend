// src/pages/admin/DataStatistikDesa.jsx

import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash, Plus } from 'lucide-react';
import { dataApi } from '@/services/dataApi';
import { useAuth } from '@/contexts/AuthContext';

const statusOptions = ['Terverifikasi', 'Menunggu Validasi', 'Ditolak'];

const defaultFormState = {
  indicator_name: '',
  statistic_type_id: '',
  value: '',
  unit: '',
  year: new Date().getFullYear(),
  period: '',
  source: '',
  notes: '',
  status: statusOptions[0],
};

export default function DataStatistikDesa() {
  const { activeVillageId } = useAuth();
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);
  const [editingId, setEditingId] = useState(null);
  const [statisticTypes, setStatisticTypes] = useState([]);
  const [activeFilter, setActiveFilter] = useState({ type: 'all', year: null });

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, idx) => (current + 1) - idx);
  }, []);

  const mapStatistics = (result) =>
    (result.items || []).map((stat) => ({
      id: stat.id,
      indicator_name: stat.indicator_name,
      subject: stat.statistic_type?.category || stat.statistic_type?.name || 'Lainnya',
      value: stat.value,
      unit: stat.unit,
      year: stat.year,
      statistic_type_id: stat.statistic_type_id,
      period: stat.period,
      source: stat.source,
      notes: stat.notes,
      status: 'Terverifikasi',
      updated_at: stat.updated_at ? new Date(stat.updated_at) : null,
    }));

  const loadStatistics = async (filters = activeFilter) => {
    if (!activeVillageId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await dataApi.listStatistics(activeVillageId, {
        per_page: 50,
        statistic_type_id: filters.type !== 'all' ? filters.type : undefined,
        year: filters.year || undefined,
      });
      setStatistics(mapStatistics(result));
    } catch (err) {
      setError(err?.message || 'Gagal memuat data statistik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVillageId]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await dataApi.listStatisticTypes();
        setStatisticTypes(types);
        if (!formState.statistic_type_id && types[0]?.id) {
          setFormState((prev) => ({ ...prev, statistic_type_id: types[0].id }));
        }
      } catch {
        /* ignore */
      }
    };
    fetchTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Terverifikasi':
        return 'default';
      case 'Menunggu Validasi':
        return 'secondary';
      case 'Ditolak':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenTambah = () => {
    setFormState({
      ...defaultFormState,
      statistic_type_id: statisticTypes[0]?.id || '',
      year: new Date().getFullYear(),
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (stat) => {
    setEditingId(stat.id);
    setFormState({
      indicator_name: stat.indicator_name || '',
      statistic_type_id: stat.statistic_type_id || '',
      value: stat.value ?? '',
      unit: stat.unit || '',
      year: stat.year || new Date().getFullYear(),
      period: stat.period || '',
      source: stat.source || '',
      notes: stat.notes || '',
      status: stat.status || statusOptions[0],
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormState(defaultFormState);
  };

  const handleSubmit = async () => {
    if (!activeVillageId) {
      setError('Pilih desa aktif terlebih dahulu');
      return;
    }

    const payload = {
      indicator_name: formState.indicator_name,
      statistic_type_id: Number(formState.statistic_type_id),
      value: formState.value !== '' ? Number(formState.value) : null,
      unit: formState.unit || null,
      year: Number(formState.year),
      period: formState.period || null,
      source: formState.source || null,
      notes: formState.notes || null,
    };

    try {
      if (editingId) {
        await dataApi.updateStatistic(activeVillageId, editingId, payload);
      } else {
        await dataApi.createStatistic(activeVillageId, payload);
      }
      await loadStatistics();
      setIsDialogOpen(false);
      setEditingId(null);
      setFormState(defaultFormState);
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan data statistik');
    }
  };

  const handleDelete = async (id) => {
    if (!activeVillageId) {
      setError('Pilih desa aktif terlebih dahulu');
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus data statistik ini?')) {
      try {
        await dataApi.deleteStatistic(activeVillageId, id);
        setStatistics((prev) => prev.filter((stat) => stat.id !== id));
      } catch (err) {
        setError(err?.message || 'Gagal menghapus data statistik');
      }
    }
  };

  return (
    <div className="p-8 space-y-6">
      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-sm text-gray-500">Memuat data statistik...</div>}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua Subjek" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Subjek</SelectItem>
              {statisticTypes.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={activeFilter.year ? String(activeFilter.year) : 'all'}
            onValueChange={(val) => {
              const year = val === 'all' ? null : Number(val);
              const next = { ...activeFilter, year };
              setActiveFilter(next);
              loadStatistics(next);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => { setActiveFilter({ type: 'all', year: null }); loadStatistics({ type: 'all', year: null }); }}>
            Reset
          </Button>
        </div>
        <Button onClick={handleOpenTambah} className="bg-[#1C6EA4] hover:bg-[#154D71]">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Statistik
        </Button>
      </div>

      <Card className="shadow-lg border-0">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Indikator</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Tahun</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics.map((stat, index) => (
                <TableRow key={stat.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{stat.indicator_name}</TableCell>
                  <TableCell>{stat.subject}</TableCell>
                  <TableCell>{stat.year ?? '-'}</TableCell>
                  <TableCell>{stat.value ?? '-'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(stat.status)}>{stat.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(stat)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(stat.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {statistics.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                    Belum ada data statistik.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Data Statistik' : 'Tambah Data Statistik'}</DialogTitle>
            <DialogDescription>
              Lengkapi form berikut untuk {editingId ? 'memperbarui' : 'menambahkan'} data statistik.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Indikator</Label>
              <Input
                name="indicator_name"
                value={formState.indicator_name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipe Statistik</Label>
                <Select
                  value={String(formState.statistic_type_id)}
                  onValueChange={(val) => handleSelectChange('statistic_type_id', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {statisticTypes.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.name} ({type.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tahun</Label>
                <Select
                  value={String(formState.year)}
                  onValueChange={(val) => handleSelectChange('year', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nilai</Label>
                <Input
                  name="value"
                  type="number"
                  step="0.01"
                  value={formState.value}
                  onChange={handleFormChange}
                  placeholder="Masukkan nilai"
                />
              </div>
              <div className="space-y-2">
                <Label>Satuan</Label>
                <Input
                  name="unit"
                  value={formState.unit}
                  onChange={handleFormChange}
                  placeholder="contoh: orang, %"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Periode (opsional)</Label>
              <Input
                name="period"
                value={formState.period || ''}
                onChange={handleFormChange}
                placeholder="contoh: Q1, Jan, Semester 1"
              />
            </div>
            <div className="space-y-2">
              <Label>Sumber</Label>
              <Input
                name="source"
                value={formState.source || ''}
                onChange={handleFormChange}
                placeholder="contoh: Survei Rumah Tangga 2024"
              />
            </div>
            <div className="space-y-2">
              <Label>Catatan</Label>
              <Input
                name="notes"
                value={formState.notes || ''}
                onChange={handleFormChange}
                placeholder="Catatan tambahan"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
