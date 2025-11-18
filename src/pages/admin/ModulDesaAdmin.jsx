import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Save } from 'lucide-react';

const villages = [
  'Nonongan Selatan',
  'Rinding Batu',
  'Konoha',
  'Jatinegara',
];

const modules = [
  {
    id: 1,
    name: 'Demografi',
    description: 'Pendataan kondisi demografi.',
    visibility: 'show',
  },
  {
    id: 2,
    name: 'Pendidikan',
    description: 'Pendataan kondisi pendidikan.',
    visibility: 'hide',
  },
  {
    id: 3,
    name: 'Ekonomi',
    description: 'Pendataan kondisi ekonomi.',
    visibility: 'show',
  },
  {
    id: 4,
    name: 'Kesehatan',
    description: 'Pendataan kondisi kesehatan.',
    visibility: 'show',
  },
  {
    id: 5,
    name: 'Pertanian',
    description: 'Pendataan kondisi pertanian.',
    visibility: 'show',
  },
];

const StatusToggle = ({ value }) => (
  <div className="flex items-center gap-3">
    {['show', 'hide'].map((state) => (
      <button
        key={state}
        type="button"
        className={cn(
          'w-16 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold transition-all',
          state === value
            ? 'bg-slate-200 text-slate-900 shadow-sm'
            : 'bg-white text-slate-400'
        )}
      >
        {state === 'show' ? 'Tampil' : 'Tidak'}
      </button>
    ))}
  </div>
);

const ModulDesaAdmin = () => {
  const [selectedVillage, setSelectedVillage] = React.useState(villages[0]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">Pilih Desa</h2>
          <Select value={selectedVillage} onValueChange={setSelectedVillage}>
            <SelectTrigger className="h-12 rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {villages.map((village) => (
                <SelectItem key={village} value={village}>
                  {village}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Edit Modul Desa</h3>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-white"
            >
              Tambah
            </Button>
          </div>

          <Card className="rounded-2xl border-slate-200 shadow-lg">
            <CardHeader className="sr-only">
              <CardTitle>Edit Modul Desa</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-slate-200">
                    <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                      No
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-slate-500">
                      Nama Modul
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-slate-500">
                      Deskripsi
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                      Aksi
                    </TableHead>
                    <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow
                      key={module.id}
                      className={cn(
                        'text-sm',
                        module.id === 1 ? 'font-semibold text-slate-900' : 'text-slate-700'
                      )}
                    >
                      <TableCell className="text-center text-base font-semibold">
                        {module.id}
                      </TableCell>
                      <TableCell className="text-base font-semibold">
                        {module.name}
                      </TableCell>
                      <TableCell>{module.description}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          className={cn(
                            buttonVariants({ variant: 'default', size: 'sm' }),
                            'rounded-full bg-sky-200 text-slate-800 hover:bg-sky-300'
                          )}
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusToggle value={module.visibility} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-5">
              <Button className="flex items-center gap-2 rounded-full bg-emerald-200 px-8 text-emerald-900 hover:bg-emerald-300">
                <Save className="h-4 w-4" />
                Simpan
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ModulDesaAdmin;
