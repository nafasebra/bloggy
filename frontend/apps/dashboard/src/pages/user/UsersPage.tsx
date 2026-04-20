import { Link } from 'react-router';
import { ShieldPlus, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import { Skeleton } from '@repo/ui/skeleton';
import { useAuth } from '@/contexts/auth-provider';
import { useUsers, useDeleteUser, useUpdateUser } from '@/hooks/use-users';
import { toast } from 'sonner';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  
  const { data: users = [], isLoading } = useUsers(!!currentUser?._id);
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  const handlePromote = (userId: string) => {
    updateUser(
      { id: userId, data: { role: 'admin' } },
      { onSuccess: () => toast.success('User promoted to admin successfully') }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">Manage your dashboard users</p>
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
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No users found.</div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell className="font-medium">
                        <div className="text-foreground">{u.name}</div>
                        <div className="sm:hidden text-xs text-muted-foreground">{u.email}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === 'admin' ? 'destructive' : 'secondary'}>
                          {u.role ?? 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fa-IR') : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {u.role !== 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => handlePromote(u._id)}
                              className="text-primary hover:text-primary/80"
                            >
                              <ShieldPlus className="w-4 h-4 mr-1" /> Promote
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/users/edit/${u._id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleDelete(u._id)}
                          >
                            <Trash2 className="w-4 h-4" />
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
