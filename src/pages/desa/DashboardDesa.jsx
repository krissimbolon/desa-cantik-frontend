import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  BarChartHorizontalBig,
  BookCopy,
  FileText,
  Map,
  Activity,
} from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';

// Color palette for category chart
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#14b8a6', '#6366f1', '#ef4444'];

export default function DashboardDesa() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getVillageDashboard();
        setDashboardData(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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

  const { village, summary, recentActivities, statisticsByCategory } =
    dashboardData || {};

  // Prepare chart data with colors
  const chartData =
    statisticsByCategory?.map((cat, idx) => ({
      name: cat.category,
      value: cat.count,
      fill: COLORS[idx % COLORS.length],
    })) || [];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Desa {village?.name || ''}
        </h1>
        <p className="text-gray-600 mt-1">
          Kode: {village?.code || '-'} | Profile completeness:{' '}
          {dashboardData?.profileCompleteness || 0}%
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Statistik</CardTitle>
            <BarChartHorizontalBig className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1C6EA4]">
              {summary?.totalStatistics || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.statisticsThisYear || 0} tahun ini
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Publikasi</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1C6EA4]">
              {summary?.totalPublications || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.publicationsThisYear || 0} tahun ini
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peta Tematik</CardTitle>
            <Map className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1C6EA4]">
              {summary?.thematicMaps || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.mapPoints || 0} titik peta
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Update Terakhir</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-gray-700">
              {summary?.lastUpdate
                ? new Date(summary.lastUpdate).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Belum ada'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Data terakhir</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Distribusi Kategori Statistik</CardTitle>
            <CardDescription>
              Jumlah indikator menurut kategori
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer
                config={{}}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                Belum ada data statistik
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Aktivitas Terkini</CardTitle>
            <CardDescription>10 aktivitas terakhir desa ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {(recentActivities || []).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {activity.timestamp
                      ? new Date(activity.timestamp).toLocaleString('id-ID', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </span>
                </div>
              ))}
              {(!recentActivities || recentActivities.length === 0) && (
                <p className="text-center text-gray-500 py-8">
                  Belum ada aktivitas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}