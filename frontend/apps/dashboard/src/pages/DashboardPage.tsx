import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { FileText, Users, MessageSquare } from 'lucide-react';
import http from '@/lib/http';
import { useAuth } from '@/contexts/auth-provider';
import type { Post, User } from '@/types';

type StatKey = 'posts' | 'users' | 'comments';

const STAT_CONFIG: { key: StatKey; title: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'posts', title: 'Total Posts', icon: FileText },
  { key: 'users', title: 'Total Users', icon: Users },
  { key: 'comments', title: 'Comments', icon: MessageSquare },
];

export default function DashboardPage() {
  const { accessToken } = useAuth();
  const [counts, setCounts] = useState<Record<StatKey, number>>({
    posts: 0,
    users: 0,
    comments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const headers = accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : undefined;

        const [postsRes, usersRes] = await Promise.all([
          http.get<Post[]>('/posts', { headers }),
          http.get<User[]>('/users', { headers }),
        ]);

        const posts = Array.isArray(postsRes.data) ? postsRes.data : [];
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];

        // Compute total comments by summing comments for each post
        let totalComments = 0;
        if (posts.length) {
          const commentResponses = await Promise.all(
            posts.map((post) => http.get<unknown[]>(`/comments/${post._id}`))
          );
          totalComments = commentResponses.reduce(
            (sum, res) => sum + (Array.isArray(res.data) ? res.data.length : 0),
            0
          );
        }

        if (!cancelled) {
          setCounts({
            posts: posts.length,
            users: users.length,
            comments: totalComments,
          });
        }
      } catch {
        if (!cancelled) {
          setCounts({ posts: 0, users: 0, comments: 0 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the admin dashboard</p>
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
                <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                  {loading ? '—' : counts[key].toLocaleString()}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {loading ? 'Loading…' : 'Live total'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
