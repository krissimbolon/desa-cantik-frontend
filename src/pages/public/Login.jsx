// src/pages/public/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link dan useNavigate
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Lock, User, Eye, EyeOff } from 'lucide-react';
import logoDc from '@/assets/images/logo_dc.png'; // Import logo desa
import background from '@/assets/images/bg.jpg'; // Import gambar latar belakang

export default function Login() {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [villageUsername, setVillageUsername] = useState('');
  const [villagePassword, setVillagePassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showVillagePassword, setShowVillagePassword] = useState(false);
  
  const navigate = useNavigate(); // Hook untuk navigasi

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Di sini nanti logika login admin
    console.log("Admin login:", adminUsername, adminPassword);
    // navigasi setelah login
    navigate('/admin/dashboard'); 
  };

  const handleVillageLogin = (e) => {
    e.preventDefault();
    // Di sini nanti logika login perangkat desa
    console.log("Village login:", villageUsername, villagePassword);
    // navigasi setelah login
    navigate('/desa-dashboard/dashboard');
  };

  const handleBack = () => {
    navigate('/'); // Kembali ke Home menggunakan router
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute blur-sm opacity-90 inset-0">
          <img 
            src={background}
            alt="Latar belakang desa" 
            className="w-full h-full object-cover"
            onError={(e) => e.target.src = 'https://placehold.co/1920x600/1c6ea4/ffffff?text=Desa+Cantik'}
          />
          <div className="absolute inset-0 "></div>
        </div>

      {/* Back Button */}
      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-white hover:bg-white/20"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Kembali ke Home
      </Button>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-2xl relative z-10">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto p-4 rounded-2xl w-fit">
              <img src={logoDc} alt="Logo Desa Cantik" className="w-20 h-20 object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Desa Cantik
          </CardTitle>
          <CardDescription className="text-base">
            Sistem Informasi Desa Cinta Statistik
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Ganti defaultValue ke "village" */}
          <Tabs defaultValue="village" className="w-full">
            {/* Tukar urutan trigger */}
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="village" className="data-[state=active]:bg-[#33A1E0] data-[state=active]:text-white">
                Perangkat Desa
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-[#1C6EA4] data-[state=active]:text-white">
                Admin BPS
              </TabsTrigger>
            </TabsList>

            {/* Village Login (pindahkan ke atas) */}
            <TabsContent value="village">
              <form onSubmit={handleVillageLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="village-username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="village-username"
                      type="text"
                      placeholder="Masukkan username"
                      value={villageUsername}
                      onChange={(e) => setVillageUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="village-password"
                      type={showVillagePassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      value={villagePassword}
                      onChange={(e) => setVillagePassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowVillagePassword(!showVillagePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showVillagePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-gray-600">Ingat saya</span>
                  </label>
                  <Link to="/lupa-password" className="text-[#33A1E0] hover:underline">
                    Lupa password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#33A1E0] hover:bg-[#1C6EA4] text-white h-11"
                >
                  Login sebagai Perangkat Desa
                </Button>
              </form>
            </TabsContent>

            {/* Admin Login (pindahkan ke bawah) */}
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Masukkan username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="admin-password"
                      type={showAdminPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showAdminPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-gray-600">Ingat saya</span>
                  </label>
                  <Link to="/lupa-password" className="text-[#1C6EA4] hover:underline">
                    Lupa password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#1C6EA4] hover:bg-[#154D71] text-white h-11"
                >
                  Login sebagai Admin
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}