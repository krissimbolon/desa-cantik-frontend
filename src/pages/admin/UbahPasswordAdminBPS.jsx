// src/pages/dashboard/UbahPasswordAdminBPS.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';

// TODO: Ganti ini dengan data fetch dari API
const MOCK_DESA_LIST = [
  { id: 'desa_sukamaju', name: 'Perangkat Desa Suka Maju' },
  { id: 'desa_makmur', name: 'Perangkat Desa Makmur Jaya' },
];

export default function UbahPasswordAdminBPS() {
  const [targetUser, setTargetUser] = useState('self'); // 'self' or desa.id
  
  // State untuk form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State untuk UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Tentukan apakah field "Password Lama" perlu ditampilkan
  // HANYA tampil jika admin mengubah password-nya sendiri
  const showOldPassword = targetUser === 'self';

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validasi 1: Konfirmasi password harus sama
    if (newPassword !== confirmPassword) {
      setError('Password Baru dan Konfirmasi Password tidak cocok.');
      setLoading(false);
      return;
    }

    // Validasi 2: Password baru tidak boleh kosong
    if (!newPassword) {
      setError('Password Baru tidak boleh kosong.');
      setLoading(false);
      return;
    }

    // Simulasi API Call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (targetUser === 'self') {
        // TODO: Panggil API update password admin (butuh password lama)
        console.log('API: Mengubah password ADMIN SENDIRI');
        console.log({ oldPassword, newPassword });
      } else {
        // TODO: Panggil API reset password perangkat desa (tidak butuh password lama)
        console.log(`API: Mereset password PERANGKAT DESA (ID: ${targetUser})`);
        console.log({ newPassword });
      }

      setSuccess('Password berhasil diperbarui.');
      // Kosongkan form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (apiError) {
      setError('Gagal memperbarui password. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Ubah Password (Admin)</CardTitle>
          <CardDescription>
            Anda dapat mengubah password akun Anda atau mereset password akun Perangkat Desa.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            {/* Opsi Target (HANYA UNTUK ADMIN) */}
            <div className="space-y-2">
              <Label htmlFor="targetUser">Ubah Password Untuk Akun</Label>
              <Select value={targetUser} onValueChange={setTargetUser}>
                <SelectTrigger id="targetUser">
                  <SelectValue placeholder="Pilih target pengguna..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Saya (Administrator)</SelectItem>
                  {/* TODO: Fetch list desa dari API */}
                  {MOCK_DESA_LIST.map(desa => (
                    <SelectItem key={desa.id} value={desa.id}>
                      {desa.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field Password Lama (HANYA JIKA UBAH 'SELF') */}
            {showOldPassword && (
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Password Lama</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Field Password Baru */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Field Konfirmasi Password Baru */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Feedback (Error/Success) */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="success">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}