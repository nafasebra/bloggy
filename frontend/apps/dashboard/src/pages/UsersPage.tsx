import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ShieldPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import http from '@/lib/http';
import { useAuth } from '@/contexts/auth-provider';
import type { User } from '@/types';
import { toast } from 'sonner';

export default function UsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoteId, setPromoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    http
      .get<User[]>('/users', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleDelete = async (id: string) => {
    if (!accessToken) return;

    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      await http.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handlePromote = async (user: User) => {
    if (!accessToken) return;

    setPromoteId(user._id);
    try {
      await http.patch(
        `/users/${user._id}`,
        { role: 'admin' },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: 'admin' } : u))
      );
      toast.success('User promoted to admin');
    } catch {
      toast.error('Failed to promote user');
    } finally {
      setPromoteId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">Manage your users</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/users/create">Create User</Link>
        </Button>
      </div>
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-5 w-32 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><div className="h-5 w-40 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-5 w-14 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><div className="h-5 w-20 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell className="text-right"><div className="h-8 w-24 ml-auto bg-muted rounded animate-pulse" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="text-foreground">{user.name}</div>
                          <div className="sm:hidden text-xs text-muted-foreground mt-1">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === 'admin' ? 'destructive' : 'secondary'}
                        >
                          {user.role ?? 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {/* If backend exposes createdAt or joinedAt, you can swap this field */}
                        {'createdAt' in user && user.createdAt
                          ? new Date((user as any).createdAt).toLocaleDateString()
                          : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 flex-wrap">
                          {user.role !== 'admin' && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={promoteId === user._id}
                              onClick={() => handlePromote(user)}
                              title="Promote to admin"
                              className="text-primary hover:text-primary/90"
                            >
                              <ShieldPlus className="w-4 h-4 mr-1" />
                              Promote
                            </Button>
                          )}
                          <Button type="button" variant="ghost" size="sm" asChild>
                            <Link to={`/users/edit/${user._id}`}>Edit</Link>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
