// src/pages/dashboard/UbahPasswordPerangkatDesa.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  CheckCircle,
  LockKeyhole,
  Lock,
  Save
} from 'lucide-react';

export default function UbahPasswordPerangkatDesa() {
  // State untuk form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State untuk UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
      
      // TODO: Panggil API update password perangkat desa (butuh password lama)
      console.log('API: Mengubah password DESA SENDIRI');
      console.log({ oldPassword, newPassword });

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
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Ubah Password</CardTitle>
          <CardDescription>
            Ubah password Anda secara berkala untuk menjaga keamanan akun.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            
            {/* Field Password Lama (SELALU TAMPIL) */}
            <div className="space-y-2">
              <Label htmlFor="oldPassword" className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-gray-600" />
                <span>Password Lama</span>
              </Label>
              <Input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            {/* Field Password Baru */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-600" />
                <span>Password Baru</span>
              </Label>
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
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-600" />
                <span>Konfirmasi Password Baru</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Garis Pemisah */}
            <Separator />

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
              {loading ? (
                'Menyimpan...' 
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}