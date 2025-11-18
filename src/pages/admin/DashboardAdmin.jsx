// src/pages/admin/DashboardAdmin.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
  BarChart3,
  Users,
  FileText,
  Map,
  Activity,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

export default function DashboardAdmin() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        const data = await dashboardService.getAdminDashboard();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
        console.error('Dashboard error:', err);
      } finally {
        if (isInitial) {
          setLoading(false);
        }
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard(true);
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-slate-200">
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-b-blue-600" />
            <p className="text-gray-600">Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => loadDashboard(true)}
            >
              Coba lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { summary, recentActivities, villagesStatistics, monthlyActivities } =
    dashboardData || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Dashboard Admin BPS
              </h1>
              <p className="text-gray-600 mt-1">
                Overview sistem informasi statistik desa
              </p>
            </div>
            <Button
              variant="outline"
              className="border-slate-200"
              onClick={() => loadDashboard(false)}
              disabled={refreshing}
            >
              <RotateCcw
                className={`h-4 w-4 ${
                  refreshing ? 'animate-spin text-blue-600' : ''
                }`}
              />
              {refreshing ? 'Menyegarkan...' : 'Muat ulang'}
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Desa
                </CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary?.totalVillages || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {summary?.activeVillages || 0} aktif, {summary?.inactiveVillages || 0} non-aktif
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pengguna
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {summary?.activeUsers || 0} pengguna aktif
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Statistik
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary?.totalStatistics || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Data statistik desa
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Publikasi
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary?.totalPublications || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary?.totalThematicMaps || 0} peta tematik
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Villages Statistics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik Desa</CardTitle>
              <CardDescription>
                Top 10 desa berdasarkan jumlah statistik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Desa</TableHead>
                    <TableHead className="text-right">Statistik</TableHead>
                    <TableHead className="text-right">Publikasi</TableHead>
                    <TableHead className="text-right">Update Terakhir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(villagesStatistics || []).map((village, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {village.villageName}
                      </TableCell>
                      <TableCell className="text-right">
                        {village.statisticsCount}
                      </TableCell>
                      <TableCell className="text-right">
                        {village.publicationsCount}
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {village.lastUpdated
                          ? new Date(village.lastUpdated).toLocaleDateString('id-ID')
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!villagesStatistics || villagesStatistics.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Aktivitas Terkini
              </CardTitle>
              <CardDescription>10 aktivitas terakhir dalam sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(recentActivities || []).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {activity.timestamp
                        ? new Date(activity.timestamp).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </span>
                  </div>
                ))}
                {(!recentActivities || recentActivities.length === 0) && (
                  <p className="text-center text-gray-500 py-4">
                    Belum ada aktivitas
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Activities Chart */}
          {monthlyActivities && monthlyActivities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Aktivitas Bulanan
                </CardTitle>
                <CardDescription>
                  Statistik dan publikasi 6 bulan terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bulan</TableHead>
                      <TableHead className="text-right">Statistik Baru</TableHead>
                      <TableHead className="text-right">Statistik Update</TableHead>
                      <TableHead className="text-right">Publikasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyActivities.map((month, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{month.month}</TableCell>
                        <TableCell className="text-right">
                          {month.statisticsCreated}
                        </TableCell>
                        <TableCell className="text-right">
                          {month.statisticsUpdated}
                        </TableCell>
                        <TableCell className="text-right">
                          {month.publicationsUploaded}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}