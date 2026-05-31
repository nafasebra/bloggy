// src/pages/DashboardPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Skeleton } from '@repo/ui/skeleton';
import { FileText, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/auth-provider';
import { useDashboardStats } from '@/hooks/query';
import type { DashboardStats } from '@/types';

type StatKey = keyof DashboardStats;

const STAT_CONFIG: {
  key: StatKey;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'posts', title: 'Total Posts', icon: FileText },
  { key: 'users', title: 'Total Users', icon: Users },
  { key: 'comments', title: 'Comments', icon: MessageSquare },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: counts, isLoading, isError } = useDashboardStats(!!user?._id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the admin dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAT_CONFIG.map(({ key, title, icon: Icon }) => (
          <Card
            key={key}
            className="border-border bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-4">
                {isLoading ? (
                  <Skeleton className="h-9 w-24 rounded-md" />
                ) : isError ? (
                  <p className="text-xl font-semibold text-destructive">
                    Error
                  </p>
                ) : (
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    {counts?.[key].toLocaleString() || '0'}
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isLoading ? 'Calculating...' : 'Live total'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
