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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

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
          <Button
            variant="outline"
            className="border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-white"
          >
            Tambah
          </Button>
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
                      <Button
                        className={cn(
                          buttonVariants({ variant: 'default', size: 'sm' }),
                          'rounded-full bg-sky-200 text-slate-800 hover:bg-sky-300'
                        )}
                      >
                        Edit
                      </Button>
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