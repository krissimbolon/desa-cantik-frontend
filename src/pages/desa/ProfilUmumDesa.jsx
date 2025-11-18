// src/pages/desa/ProfilUmumDesa.jsx

import { useState, useEffect } from 'react';
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
import { Edit, Save, Loader2 } from 'lucide-react';
import { villageProfileService } from '@/services/villageProfileService';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilUmumDesa() {
  const { user } = useAuth();
  const villageId = user?.village_id || user?.villageId;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formState, setFormState] = useState({
    description: '',
    vision: '',
    mission: [],
    area: '',
    population: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logoUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!villageId) {
        setError('Village ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await villageProfileService.getProfile(villageId);
        setProfile(data);
        setPreviewUrl(data.logoUrl || 'https://placehold.co/800x450/67e8f9/1C6EA4?text=Foto+Desa');
      } catch (err) {
        setError(err.message || 'Failed to load village profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [villageId]);

  const handleOpenEdit = () => {
    if (!profile) return;
    
    setFormState({
      description: profile.description || '',
      vision: profile.vision || '',
      mission: profile.mission || [],
      area: profile.area || '',
      population: profile.population || '',
      address: profile.address || '',
      phone: profile.phone || '',
      email: profile.email || '',
      website: profile.website || '',
      logoUrl: profile.logoUrl || '',
    });
    setPreviewUrl(profile.logoUrl || 'https://placehold.co/800x450/67e8f9/1C6EA4?text=Foto+Desa');
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      // Note: Backend currently doesn't support file upload for logo
      // If a file was selected, we'd need to upload it separately
      // For now, we just use the logoUrl field
      const updateData = {
        ...formState,
        logoUrl: previewUrl.startsWith('blob:') ? formState.logoUrl : previewUrl,
      };

      const updatedProfile = await villageProfileService.updateProfile(
        villageId,
        updateData
      );
      
      setProfile(updatedProfile);
      setIsDialogOpen(false);
    } catch (err) {
      alert(`Failed to update profile: ${err.message}`);
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Logo Image */}
      <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
        <img
          src={profile.logoUrl || 'https://placehold.co/800x450/67e8f9/1C6EA4?text=Foto+Desa'}
          alt="Village Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Content Cards */}
      <div className="grid gap-6">
        <Card className="shadow-lg border-t-4 border-[#1C6EA4]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Deskripsi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              {profile.description || 'Belum ada deskripsi'}
            </p>
          </CardContent>
        </Card>

        {profile.vision && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Visi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{profile.vision}</p>
            </CardContent>
          </Card>
        )}

        {profile.mission && profile.mission.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Misi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {profile.mission.map((item, idx) => (
                  <li key={idx} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.address && (
              <p className="text-gray-700">
                <span className="font-semibold">Alamat:</span> {profile.address}
              </p>
            )}
            {profile.phone && (
              <p className="text-gray-700">
                <span className="font-semibold">Telepon:</span> {profile.phone}
              </p>
            )}
            {profile.email && (
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {profile.email}
              </p>
            )}
            {profile.website && (
              <p className="text-gray-700">
                <span className="font-semibold">Website:</span>{' '}
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website}
                </a>
              </p>
            )}
          </CardContent>
        </Card>

        {(profile.area || profile.population) && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Statistik Desa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {profile.area && (
                <p className="text-gray-700">
                  <span className="font-semibold">Luas Wilayah:</span> {profile.area} km²
                </p>
              )}
              {profile.population && (
                <p className="text-gray-700">
                  <span className="font-semibold">Jumlah Penduduk:</span>{' '}
                  {profile.population.toLocaleString('id-ID')} jiwa
                </p>
              )}
              {profile.populationDensity && (
                <p className="text-gray-700">
                  <span className="font-semibold">Kepadatan Penduduk:</span>{' '}
                  {profile.populationDensity.toFixed(2)} jiwa/km²
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Button */}
      <div className="flex justify-end gap-4">
        <Button
          onClick={handleOpenEdit}
          className="bg-[#1C6EA4] hover:bg-[#154D71]"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Profil Umum Desa</DialogTitle>
            <DialogDescription>
              Perbarui informasi desa Anda. Klik simpan jika sudah selesai.
            </DialogDescription>
          </DialogHeader>
          
          {/* Form di dalam Dialog */}
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Logo URL Input */}
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={formState.logoUrl}
                onChange={handleTextChange}
                placeholder="https://example.com/logo.png"
              />
              {previewUrl && (
                <div className="w-full h-32 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">
                Note: File upload belum didukung. Masukkan URL gambar yang sudah dihosting.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleTextChange}
                rows={4}
                placeholder="Deskripsi desa..."
              />
            </div>

            {/* Vision */}
            <div className="space-y-2">
              <Label htmlFor="vision">Visi</Label>
              <Textarea
                id="vision"
                name="vision"
                value={formState.vision}
                onChange={handleTextChange}
                rows={3}
                placeholder="Visi desa..."
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                name="address"
                value={formState.address}
                onChange={handleTextChange}
                placeholder="Alamat lengkap desa"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                name="phone"
                value={formState.phone}
                onChange={handleTextChange}
                placeholder="+62 xxx xxx xxx"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleTextChange}
                placeholder="email@desa.id"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formState.website}
                onChange={handleTextChange}
                placeholder="https://desa.id"
              />
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label htmlFor="area">Luas Wilayah (km²)</Label>
              <Input
                id="area"
                name="area"
                type="number"
                step="0.01"
                value={formState.area}
                onChange={handleTextChange}
                placeholder="0.00"
              />
            </div>

            {/* Population */}
            <div className="space-y-2">
              <Label htmlFor="population">Jumlah Penduduk</Label>
              <Input
                id="population"
                name="population"
                type="number"
                value={formState.population}
                onChange={handleTextChange}
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={saving}>
                Batal
              </Button>
            </DialogClose>
            <Button
              onClick={handleSubmit}
              className="bg-[#1C6EA4] hover:bg-[#154D71]"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}