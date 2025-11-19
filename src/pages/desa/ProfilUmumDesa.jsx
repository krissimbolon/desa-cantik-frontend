import { useState, useEffect, useCallback } from 'react';
// Gunakan alias @ sesuai konfigurasi vite.config.js
import { useAuth } from '@/contexts/AuthContext';
import { villageProfileService } from '@/services/villageProfileService';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit, Save } from 'lucide-react';

export default function ProfilUmumDesa() {
  // Ambil activeVillageId langsung dari context
  const { user, activeVillageId } = useAuth(); 
  
  const villageId = activeVillageId;

  const [profile, setProfile] = useState({
    name: '',
    description: '',
    imageUrl: '' 
  });

  // State untuk Form Edit
  const [formState, setFormState] = useState({
    name: '',
    description: '',
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fungsi load data dipisahkan agar bisa dipanggil ulang setelah edit
  const loadProfile = useCallback(async () => {
    if (!villageId) {
      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      // Tambahkan timestamp agar browser tidak cache request ini (opsional tapi aman)
      const data = await villageProfileService.getProfile(villageId);
      
      const villageData = data.data || data; 

      const currentProfile = {
          name: villageData.name || '',
          description: villageData.description || '', 
          // Gunakan null jika string kosong agar mudah dicek di JSX
          imageUrl: villageData.logo_url || villageData.image_url || null
      };
      setProfile(currentProfile);
      
      // Update juga form state agar sinkron saat dialog dibuka pertama kali
      setFormState({
          name: villageData.name || '',
          description: villageData.description || ''
      });

    } catch (err) {
      console.error("Gagal memuat profil:", err);
    } finally {
      setIsFetching(false);
    }
  }, [villageId]);

  // 1. LOAD DATA PROFIL SAAT MOUNT ATAU ID BERUBAH
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // 2. BUKA DIALOG EDIT
  const handleOpenEdit = () => {
    // Selalu reset form state ke data profile terbaru saat dialog dibuka
    setFormState({
      name: profile.name,
      description: profile.description,
    });
    setPreviewUrl(profile.imageUrl || '');
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  // 3. HANDLER INPUT TEKS
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // 4. HANDLER INPUT FILE GAMBAR
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  // 5. SUBMIT KE BACKEND
  const handleSubmit = async () => {
    if (!villageId) {
        alert("Error: ID Desa tidak ditemukan. Pastikan Anda sudah login.");
        return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('description', formState.description);
      
      // Backend Laravel butuh _method: PUT jika mengirim file via POST
      formData.append('_method', 'PUT');

      if (selectedFile) {
        formData.append('logo', selectedFile); 
      }

      // Kirim ke Backend
      const response = await villageProfileService.updateProfile(villageId, formData);
      
      // OPTION A: Update state lokal langsung dari response (Cepat)
      const updatedData = response.data || response;
      setProfile({
        name: updatedData.name || formState.name,
        description: updatedData.description || formState.description,
        imageUrl: updatedData.logo_url || updatedData.image_url || previewUrl 
      });

      // OPTION B: Fetch ulang data dari server untuk memastikan sinkronisasi (Lebih aman)
      // await loadProfile(); 

      setIsDialogOpen(false);
      alert("Profil berhasil diperbarui!");

    } catch (error) {
      console.error("Gagal update:", error);
      alert("Gagal memperbarui profil. " + (error.message || "Terjadi kesalahan."));
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilan Loading Awal
  if (isFetching) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Memuat data profil...</div>;
  }

  // RENDER ERROR JIKA VILLAGE ID TETAP NULL
  if (!villageId) {
     return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 p-8">
            <div className="text-red-500 text-5xl">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800">Data Desa Tidak Ditemukan</h2>
            <p className="text-gray-600 text-center max-w-md">
              Akun Anda (<strong>{user?.name || 'User'}</strong>) tidak terhubung dengan data desa manapun.
              <br/>
              <span className="text-xs text-gray-400 mt-2 block">Active Village ID: null</span>
            </p>
            <Button onClick={() => window.location.href = '/login'} variant="outline">
               Login Kembali
            </Button>
        </div>
     );
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Tampilan Gambar Utama */}
      <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center relative group">
        {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://placehold.co/800x450?text=Gagal+Muat+Gambar';
              }}
            />
        ) : (
            <div className="text-center text-gray-500">
                <p>Tidak ada foto profil</p>
            </div>
        )}
      </div>

      {/* Kartu Konten */}
      <Card className="shadow-lg border-t-4 border-[#1C6EA4]">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-gray-900">
            {profile.name || 'Nama Desa Belum Diatur'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile.description ? (
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {profile.description}
            </p>
          ) : (
            <p className="text-gray-400 italic">Belum ada deskripsi desa.</p>
          )}
        </CardContent>
      </Card>

      {/* Tombol Edit */}
      <div className="flex justify-end gap-4">
        <Button onClick={handleOpenEdit} className="bg-[#1C6EA4] hover:bg-[#154D71]" disabled={isLoading}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profil
        </Button>
      </div>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Profil Umum Desa</DialogTitle>
            <DialogDescription>
              Perbarui informasi desa Anda di bawah ini.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Preview Gambar di Form */}
            <div className="space-y-2">
              <Label>Pratinjau Foto</Label>
              <div className="w-full h-40 rounded-md overflow-hidden bg-gray-100 border flex items-center justify-center">
                {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Pratinjau"
                      className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">Belum ada gambar</span>
                )}
              </div>
            </div>

            {/* Input File */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageFile" className="text-right">Ganti Foto</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="col-span-3 cursor-pointer"
              />
            </div>

            {/* Input Nama */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nama Desa</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleTextChange}
                className="col-span-3"
              />
            </div>
            
            {/* Input Deskripsi */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleTextChange}
                className="col-span-3"
                rows={8}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>Batal</Button>
            </DialogClose>
            <Button onClick={handleSubmit} className="bg-[#1C6EA4] hover:bg-[#154D71]" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}