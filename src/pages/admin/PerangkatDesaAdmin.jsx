// src/pages/dashboard/PerangkatDesaAdmin.jsx
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, XCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- MOCK DATA ---
const dataPerangkat = [
  { id: 1, nama: 'Adib', nik: '222312***', desa: 'Nonongan Selatan' },
  { id: 2, nama: 'Alif', nik: '222312***', desa: 'Nonongan Selatan' },
  { id: 3, nama: 'Alex', nik: '222312***', desa: 'Rinding Batu' },
  { id: 4, nama: 'Anggita', nik: '222312***', desa: 'Rinding Batu' },
];

const pageNumbers = [1, 2, 3, 'ellipsis', 8, 9, 10];

const PerangkatDesaAdmin = () => {
  const currentPage = 1;
  
  // Ambil daftar desa unik untuk opsi di Dialog Tambah
  const villageOptions = useMemo(
    () => Array.from(new Set(dataPerangkat.map((item) => item.desa))),
    []
  );

  return (
    <div className="w-full space-y-6">
      
      {/* HEADER TANPA FILTER */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Daftar Perangkat Desa
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Rekapitulasi seluruh perangkat desa yang terdaftar dalam sistem.
          </p>
        </div>
        
        {/* Tombol Tambah langsung muncul */}
        <AddPerangkatDialog villageOptions={villageOptions} />
      </header>

      {/* TABEL FULL (Semua Data) */}
      <Card className="border-slate-200 shadow-lg w-full">
        <CardHeader className="sr-only">
          <CardTitle>Daftar Perangkat Desa</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-slate-100">
                <TableHead className="w-16 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  No
                </TableHead>
                <TableHead className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Nama
                </TableHead>
                <TableHead className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  NIK
                </TableHead>
                <TableHead className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Desa
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataPerangkat.map((perangkat, index) => (
                <TableRow
                  key={perangkat.id}
                  className="border-slate-100 text-sm text-slate-700"
                >
                  <TableCell className="text-slate-600">{index + 1}</TableCell>
                  <TableCell className="font-medium">{perangkat.nama}</TableCell>
                  <TableCell>{perangkat.nik}</TableCell>
                  <TableCell>{perangkat.desa}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button
            variant="outline"
            disabled
            className="border-slate-200 bg-slate-100 text-slate-400 shadow-none hover:bg-slate-100"
          >
            Previous
          </Button>
          <Pagination className="mx-0">
            <PaginationContent>
              {pageNumbers.map((number, index) =>
                number === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="text-slate-500" />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={number}>
                    <PaginationLink
                      href="#"
                      isActive={number === currentPage}
                      size="default"
                      className={
                        number === currentPage
                          ? 'border border-slate-200 bg-slate-200 text-slate-800'
                          : 'text-slate-500'
                      }
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
            </PaginationContent>
          </Pagination>
          <Button
            variant="outline"
            className="border-slate-200 bg-slate-100 text-slate-600 shadow-none hover:bg-slate-100"
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PerangkatDesaAdmin;

// Dialog Tambah dengan Pilihan Desa Manual
const AddPerangkatDialog = ({ villageOptions }) => {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    nama: '',
    nik: '',
    desa: '', // User harus memilih desa
  });

  const handleChange = (e) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data Tersimpan:', formValues);
    setOpen(false);
    setFormValues({ nama: '', nik: '', desa: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1C6EA4] hover:bg-[#165a86] text-white shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Tambah
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl border border-slate-200 bg-white">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold text-slate-800">
            Tambah Perangkat Desa
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <Label className="text-sm font-semibold text-slate-700">Nama</Label>
            <Input
              name="nama"
              value={formValues.nama}
              onChange={handleChange}
              className="rounded-xl border-slate-300 focus-visible:ring-slate-300"
              placeholder="Masukkan nama perangkat"
              required
            />
          </div>
          <div className="grid gap-1">
            <Label className="text-sm font-semibold text-slate-700">NIK</Label>
            <Input
              name="nik"
              value={formValues.nik}
              onChange={handleChange}
              className="rounded-xl border-slate-300 focus-visible:ring-slate-300"
              placeholder="Masukkan NIK"
              required
            />
          </div>
          <div className="grid gap-1">
            <Label className="text-sm font-semibold text-slate-700">Desa</Label>
            <select
              name="desa"
              value={formValues.desa}
              onChange={handleChange}
              className={cn(
                'rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 w-full'
              )}
              required
            >
              <option value="" disabled>Pilih Desa...</option>
              {villageOptions.map((village) => (
                <option key={village} value={village}>
                  {village}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="submit"
              className="flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-emerald-200 text-emerald-900 hover:bg-emerald-300"
            >
              <Save className="h-4 w-4" />
              Simpan
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex min-w-[120px] items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-200"
            >
              <XCircle className="h-4 w-4" />
              Kembali
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};