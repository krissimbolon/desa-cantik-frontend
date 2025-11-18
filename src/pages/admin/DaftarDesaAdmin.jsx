import React, { useState } from 'react';
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
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
import { Save, XCircle } from 'lucide-react';

const villages = [
  { id: 1, name: 'Nonongan Selatan', visibility: 'show' },
  { id: 2, name: 'Rinding Batu', visibility: 'show' },
  { id: 3, name: 'Konoha', visibility: 'show' },
  { id: 4, name: 'Jatinegara', visibility: 'show' },
];

const VisibilityToggle = ({ value }) => (
  <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
    {['show', 'hide'].map((state) => (
      <button
        key={state}
        type="button"
        className={cn(
          'px-4 py-1 text-xs font-semibold rounded-full transition-colors',
          state === value
            ? 'bg-sky-200 text-slate-900 shadow-sm'
            : 'text-slate-400'
        )}
      >
        {state === 'show' ? 'Tampil' : 'Sembunyi'}
      </button>
    ))}
  </div>
);

const pageNumbers = [1, 2, 3, 'ellipsis', 8, 9, 10];

const DaftarDesaAdmin = () => {
  const currentPage = 1;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Daftar Desa</h2>
          </div>
          <VillageDialog mode="add" />
        </header>

        <Card className="rounded-[1.5rem] border-slate-200 shadow-lg">
          <CardHeader className="sr-only">
            <CardTitle>Daftar Desa</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-slate-200">
                  <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                    No
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-slate-500">
                    Nama Desa
                  </TableHead>
                  <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                    Visibilitas
                  </TableHead>
                  <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                    Ubah
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {villages.map((village) => (
                  <TableRow
                    key={village.id}
                    className={cn(
                      'text-sm',
                      village.id === 1
                        ? 'bg-sky-100/80 font-semibold text-slate-900'
                        : 'text-slate-700'
                    )}
                  >
                    <TableCell className="text-center text-base font-semibold">
                      {village.id}
                    </TableCell>
                    <TableCell className="text-base font-semibold">
                      {village.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <VisibilityToggle value={village.visibility} />
                    </TableCell>
                    <TableCell className="text-center">
                      <VillageDialog mode="edit" village={village} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-white/70 px-6 py-5">
            <Button
              variant="ghost"
              disabled
              className="rounded-full border border-slate-200 bg-slate-100 text-slate-400 shadow-none hover:bg-slate-100"
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
                        className={cn(
                          'rounded-full px-3',
                          number === currentPage
                            ? 'border border-slate-300 bg-slate-200 text-slate-900'
                            : 'text-slate-500'
                        )}
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              </PaginationContent>
            </Pagination>
            <Button
              variant="ghost"
              className="rounded-full border border-slate-200 bg-slate-100 text-slate-600 shadow-none hover:bg-slate-100"
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DaftarDesaAdmin;

const VillageDialog = ({ mode, village }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(village?.name || '');

  React.useEffect(() => {
    if (open && village) {
      setName(village.name);
    } else if (open && mode === 'add') {
      setName('');
    }
  }, [open, village, mode]);

  const title = mode === 'add' ? 'Tambah Daftar Desa' : 'Edit Daftar Desa';

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect with API
    setOpen(false);
  };

  const trigger =
    mode === 'add' ? (
      <Button
        variant="outline"
        className="border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-white"
      >
        Tambah
      </Button>
    ) : (
      <Button
        className={cn(
          buttonVariants({ variant: 'default', size: 'sm' }),
          'rounded-full bg-sky-200 text-slate-800 hover:bg-sky-300'
        )}
      >
        Edit
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl border border-slate-200 bg-white">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold text-slate-800">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <Label className="text-sm font-semibold text-slate-700">
              Nama Desa
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-slate-300 focus-visible:ring-slate-300"
              placeholder="Masukkan nama desa"
              required
            />
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