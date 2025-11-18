// src/pages/dashboard/PublikasiDesaAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  BookOpen, 
  MapPin, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FileText, 
  Download,
  Search
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_DESA_LIST = [
  { id: 'desa_sukamaju', name: 'Desa Suka Maju' },
  { id: 'desa_makmur', name: 'Desa Makmur Jaya' },
  { id: 'desa_rantepao', name: 'Desa Rantepao (Toraja Utara)' },
];

const MOCK_PUBLICATIONS = [
  { id: 'pub1', desaId: 'desa_sukamaju', title: 'Kecamatan Dalam Angka 2024', year: '2024', category: 'Laporan Statistik', file: 'kda_2024.pdf' },
  { id: 'pub2', desaId: 'desa_sukamaju', title: 'Profil Desa Suka Maju 2023', year: '2023', category: 'Profil Desa', file: 'profil_2023.pdf' },
  { id: 'pub3', desaId: 'desa_makmur', title: 'Statistik Pertanian 2024', year: '2024', category: 'Sektoral', file: 'tani_2024.pdf' },
];

export default function PublikasiDesaAdmin() {
  // State
  const [selectedDesa, setSelectedDesa] = useState(null);
  const [publications, setPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentItem, setCurrentItem] = useState(null);

  // Efek: Filter data saat desa dipilih
  useEffect(() => {
    if (selectedDesa) {
      // Simulasi fetch API berdasarkan desa
      const filtered = MOCK_PUBLICATIONS.filter(p => p.desaId === selectedDesa);
      setPublications(filtered);
    } else {
      setPublications([]);
    }
  }, [selectedDesa]);

  // Handler CRUD
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    // TODO: Panggil API Delete
    if (confirm('Apakah Anda yakin ingin menghapus publikasi ini?')) {
      setPublications(publications.filter(p => p.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (modalType === 'add') {
      // TODO: Panggil API Create
      const newPub = {
        id: `pub${Date.now()}`,
        desaId: selectedDesa,
        ...data,
        file: data.file.name // Simulasi nama file
      };
      setPublications([...publications, newPub]);
    } else {
      // TODO: Panggil API Update
      setPublications(publications.map(p => 
        p.id === currentItem.id ? { ...p, ...data, file: p.file } : p
      ));
    }
    setIsModalOpen(false);
  };

  // Filter pencarian lokal
  const filteredPublications = publications.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* 1. PILIH DESA (Wajib) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Pilih Desa
          </CardTitle>
          <CardDescription>
            Pilih desa untuk mengelola publikasi dan dokumen statistik mereka.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedDesa} value={selectedDesa || ''}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Pilih desa..." />
            </SelectTrigger>
            <SelectContent>
              {MOCK_DESA_LIST.map(desa => (
                <SelectItem key={desa.id} value={desa.id}>
                  {desa.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 2. KONTEN UTAMA (Hanya muncul jika desa dipilih) */}
      {selectedDesa && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Daftar Publikasi</CardTitle>
                <CardDescription>
                  Dokumen yang diterbitkan untuk {MOCK_DESA_LIST.find(d => d.id === selectedDesa)?.name}.
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenModal('add')}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Publikasi
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            
            {/* Search Bar */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Cari judul publikasi..." 
                className="pl-10 max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tabel Data */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Publikasi</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead className="w-[50px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPublications.length > 0 ? (
                    filteredPublications.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            {item.title}
                          </div>
                        </TableCell>
                        <TableCell>{item.year}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <FileText className="h-3 w-3" />
                            {item.file}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenModal('edit', item)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => alert(`Download ${item.file}`)}>
                                <Download className="mr-2 h-4 w-4" /> Unduh
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                        Belum ada publikasi untuk desa ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL ADD/EDIT */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleFormSubmit}>
            <DialogHeader>
              <DialogTitle>
                {modalType === 'add' ? 'Tambah Publikasi Baru' : 'Edit Publikasi'}
              </DialogTitle>
              <DialogDescription>
                Isi detail dokumen publikasi di bawah ini.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Judul Publikasi</Label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={currentItem?.title} 
                  placeholder="Contoh: Kecamatan Dalam Angka 2024" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="year">Tahun</Label>
                  <Input 
                    id="year" 
                    name="year" 
                    type="number"
                    defaultValue={currentItem?.year || new Date().getFullYear()} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select name="category" defaultValue={currentItem?.category || "Laporan Statistik"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laporan Statistik">Laporan Statistik</SelectItem>
                      <SelectItem value="Profil Desa">Profil Desa</SelectItem>
                      <SelectItem value="Infografis">Infografis</SelectItem>
                      <SelectItem value="Berita Resmi">Berita Resmi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi Singkat (Opsional)</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Penjelasan singkat tentang isi dokumen..." 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="file">Upload File (PDF)</Label>
                <Input 
                  id="file" 
                  name="file" 
                  type="file" 
                  accept=".pdf"
                  required={modalType === 'add'} 
                />
                {modalType === 'edit' && currentItem?.file && (
                  <p className="text-xs text-gray-500">File saat ini: {currentItem.file}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Batal</Button>
              </DialogClose>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}