import React from 'react';
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

const dataPerangkat = [
  { id: 1, nama: 'Adib', nik: '222312***', desa: 'Nonongan Selatan' },
  { id: 2, nama: 'Alif', nik: '222312***', desa: 'Nonongan Selatan' },
  { id: 3, nama: 'Alex', nik: '222312***', desa: 'Rinding Batu' },
  { id: 4, nama: 'Anggita', nik: '222312***', desa: 'Rinding Batu' },
];

const pageNumbers = [1, 2, 3, 'ellipsis', 8, 9, 10];

const PerangkatDesaAdmin = () => {
  const currentPage = 1;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Daftar Perangkat Desa
            </h2>
            <p className="text-sm text-slate-500">
              Kelola informasi perangkat desa secara terpusat
            </p>
          </div>
          <Button
            variant="outline"
            className="border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Tambah
          </Button>
        </header>

        <Card className="border-slate-200 shadow-lg">
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
              {dataPerangkat.map((perangkat) => (
                  <TableRow
                    key={perangkat.id}
                    className="border-slate-100 text-sm text-slate-700"
                  >
                    <TableCell className="text-slate-600">{perangkat.id}</TableCell>
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
    </div>
  );
};

export default PerangkatDesaAdmin;