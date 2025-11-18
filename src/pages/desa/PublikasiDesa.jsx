// src/pages/admin/PublikasiDesa.jsx

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Edit, Trash, Plus, Calendar as CalendarIcon, FileText,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight // Impor baru
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { dataApi } from '@/services/dataApi';

// Opsi untuk form select
const subjectOptions = ['Statistik Desa', 'Sosial', 'Ekonomi Lokal', 'Pemerintahan'];
const statusOptions = ['Rilis', 'Diarsipkan'];
// --------------------

const defaultFormState = {
  title: '',
  subject: subjectOptions[0],
  releaseDate: new Date(),
  status: statusOptions[0],
  file: null, 
  fileName: '',
  fileUrl: '',
};

export default function PublikasiDesa() {
  const { activeVillageId } = useAuth();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);
  const [editingId, setEditingId] = useState(null); 

  const selectedYear = useMemo(() => {
    return formState.releaseDate ? formState.releaseDate.getFullYear() : undefined;
  }, [formState.releaseDate]);

  const mapResponse = (items = []) =>
    items.map((pub) => ({
      id: pub.id,
      title: pub.title,
      subject: pub.description || 'Publikasi Desa',
      releaseDate: pub.published_at ? new Date(pub.published_at) : null,
      status: 'Rilis',
      fileName: pub.file_name,
      fileUrl: pub.download_url || pub.file_url,
    }));

  const loadPublications = async () => {
    if (!activeVillageId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await dataApi.listPublications(activeVillageId, { per_page: 50 });
      setPublications(mapResponse(result.items));
    } catch (err) {
      setError(err?.message || 'Gagal memuat publikasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVillageId]);

  // --- Handlers untuk Form ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormState((prev) => ({ ...prev, releaseDate: date }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormState((prev) => ({ 
        ...prev, 
        file: file, 
        fileName: file.name,
        fileUrl: URL.createObjectURL(file) 
      }));
    }
  };

  // --- Handlers untuk Dialog ---
  const handleOpenTambah = () => {
    setFormState(defaultFormState);
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (pub) => {
    setEditingId(pub.id);
    setFormState({
      ...pub,
      file: null, // Reset file input
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    // Revoke URL lokal agar tidak terjadi memory leak
    if (formState.fileUrl && formState.file) {
      URL.revokeObjectURL(formState.fileUrl);
    }
    setIsDialogOpen(false);
    setEditingId(null);
    setFormState(defaultFormState);
  };

  // --- Handler untuk Aksi ---
  const handleSubmit = async () => {
    if (!activeVillageId) {
      setError('Pilih desa aktif terlebih dahulu');
      return;
    }

    const payload = {
      title: formState.title,
      description: formState.subject,
      published_at: formState.releaseDate
        ? formState.releaseDate.toISOString().slice(0, 10)
        : null,
      file: formState.file,
    };

    try {
      if (editingId) {
        await dataApi.updatePublication(activeVillageId, editingId, payload);
      } else {
        await dataApi.uploadPublication(activeVillageId, payload);
      }
      await loadPublications();
      setIsDialogOpen(false);
      setEditingId(null);
      setFormState(defaultFormState);
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan publikasi');
    }
  };

  const handleDelete = async (id) => {
    if (!activeVillageId) {
      setError('Pilih desa aktif terlebih dahulu');
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus publikasi ini?')) {
      try {
        await dataApi.deletePublication(activeVillageId, id);
        setPublications(publications.filter((pub) => pub.id !== id));
      } catch (err) {
        setError(err?.message || 'Gagal menghapus publikasi');
      }
    }
  };

  return (
    <div className="p-8 space-y-6">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {/* --- Filter dan Tombol Tambah --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua Subjek" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Subjek</SelectItem>
              {subjectOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select defaultValue="2025">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleOpenTambah} className="bg-[#1C6EA4] hover:bg-[#154D71]">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Publikasi
        </Button>
      </div>

      {/* --- Tabel Publikasi --- */}
      <Card className="shadow-lg border-0">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Judul Publikasi</TableHead>
                <TableHead>Subjek</TableHead>
                <TableHead>Tanggal Rilis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Berkas</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications.map((pub, index) => (
                <TableRow key={pub.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{pub.title}</TableCell>
                  <TableCell>{pub.subject}</TableCell>
                  <TableCell>
                    {format(pub.releaseDate, 'dd LLL yyyy', { locale: id })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={pub.status === 'Rilis' ? 'default' : 'secondary'}>
                      {pub.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-sm text-gray-600 truncate max-w-[200px]">
                    <a
                      href={pub.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center hover:underline",
                        pub.fileUrl ? "text-blue-600 hover:text-blue-800" : "text-muted-foreground cursor-not-allowed"
                      )}
                      // Mencegah klik jika tidak ada URL
                      onClick={(e) => !pub.fileUrl && e.preventDefault()} 
                    >
                      <FileText className="h-4 w-4 inline-block mr-1 flex-shrink-0" />
                      <span className="truncate">{pub.fileName}</span>
                    </a>
                  </TableCell>
                  
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(pub)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(pub.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* --- Pagination --- */}
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium whitespace-nowrap">
              Baris per halaman
            </Label>
            <Select defaultValue="10">
              <SelectTrigger className="w-[80px]" id="rows-per-page">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm text-muted-foreground">
            {/* Logika pagination sederhana */}
            1-{publications.length} dari {publications.length} baris
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol-tombol ini dinonaktifkan karena kita belum membuat logika pagination penuh */}
          <Button variant="outline" size="icon" className="h-9 w-9" disabled>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Input
            type="text"
            defaultValue="1"
            className="w-12 h-9 text-center"
            readOnly
          />
          <span className="text-sm text-muted-foreground">dari 1</span>

          <Button variant="outline" size="icon" className="h-9 w-9" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" disabled>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* --- Dialog Form Tambah/Edit --- */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Publikasi' : 'Tambah Publikasi Baru'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Judul */}
            <div className="space-y-2">
              <Label htmlFor="title">Judul Publikasi</Label>
              <Input
                id="title"
                name="title"
                value={formState.title}
                onChange={handleFormChange}
              />
            </div>

            {/* Subjek */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subjek</Label>
              <Select
                name="subject"
                value={formState.subject}
                onValueChange={(value) => handleSelectChange('subject', value)}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Pilih subjek" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Tanggal Rilis */}
            <div className="space-y-2">
              <Label htmlFor="releaseDate">Tanggal Rilis</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formState.releaseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.releaseDate ? (
                      format(formState.releaseDate, 'dd LLL yyyy', { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formState.releaseDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={formState.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Berkas PDF */}
            <div className="space-y-2">
              <Label htmlFor="file">Berkas PDF</Label>
              {/* Tampilkan berkas saat ini atau pratinjau */}
              {(editingId || formState.fileUrl) && formState.fileName && (
                <div className="text-sm text-muted-foreground">
                  Berkas saat ini: 
                  <a 
                    href={formState.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline ml-1"
                  >
                    {formState.fileName}
                  </a>
                </div>
              )}
              <Input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleSubmit} className="bg-[#1C6EA4] hover:bg-[#154D71]">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
