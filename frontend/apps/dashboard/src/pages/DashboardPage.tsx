import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { FileText, Users, MessageSquare, TrendingUp } from 'lucide-react';

const stats = [
  { title: 'Total Posts', value: '42', icon: FileText, trend: '+12%', trendUp: true },
  { title: 'Total Users', value: '128', icon: Users, trend: '+23%', trendUp: true },
  { title: 'Comments', value: '256', icon: MessageSquare, trend: '+8%', trendUp: true },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the admin dashboard</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-4">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">{stat.value}</p>
                  <Badge variant={stat.trendUp ? 'default' : 'secondary'} className="gap-1 shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">vs last month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
