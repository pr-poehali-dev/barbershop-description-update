import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';

interface AnalyticsData {
  timeline: Array<{
    date: string;
    completed: number;
    cancelled: number;
    active: number;
  }>;
  masters: Array<{
    name: string;
    total_bookings: number;
    completed: number;
  }>;
  timeDistribution: Array<{
    hour: number;
    count: number;
  }>;
  totals: {
    total: number;
    completed: number;
    cancelled: number;
    active: number;
  };
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://functions.poehali.dev/ee0e957d-84aa-4d51-bb50-8a4b684d41f4')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Ошибка загрузки данных</p>
      </div>
    );
  }

  const timelineData = data.timeline.map(item => ({
    date: new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
    Завершено: item.completed,
    Отменено: item.cancelled,
    Активно: item.active
  }));

  const timeData = data.timeDistribution.map(item => ({
    time: `${item.hour}:00`,
    Записи: item.count
  }));

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-primary text-primary-foreground py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Icon name="BarChart3" size={28} />
              Аналитика барбершопа
            </h1>
            <a href="/" className="text-sm hover:underline">
              ← Вернуться на сайт
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего записей</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.totals.total}</div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Icon name="TrendingUp" size={16} className="text-green-500" />
                <span>За всё время</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Завершено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{data.totals.completed}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {Math.round((data.totals.completed / data.totals.total) * 100)}% от общего числа
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Отменено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{data.totals.cancelled}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {Math.round((data.totals.cancelled / data.totals.total) * 100)}% от общего числа
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Активные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{data.totals.active}</div>
              <div className="text-sm text-muted-foreground mt-2">
                Ожидают визита
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Динамика записей</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Завершено" stroke="#16a34a" strokeWidth={2} />
                  <Line type="monotone" dataKey="Отменено" stroke="#dc2626" strokeWidth={2} />
                  <Line type="monotone" dataKey="Активно" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Загруженность по времени</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Записи" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Загруженность мастеров</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.masters.map((master, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Icon name="User" className="text-accent" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{master.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Завершено: {master.completed} из {master.total_bookings}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{master.total_bookings}</div>
                    <div className="text-sm text-muted-foreground">записей</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
