import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';
import http from '@/lib/http';
import { useAuth } from '@/contexts/auth-provider';
import type { User } from '@/types';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user'], {
    required_error: 'Role is required',
  }),
  // Optional: leave blank to keep current password
  password: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      role: 'user',
      password: '',
    },
  });

  useEffect(() => {
    if (!id || !accessToken) {
      return;
    }

    http
      .get<User>(`/users/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const user = res.data;
        form.reset({
          name: user.name,
          username: user.username,
          email: user.email,
          role: (user.role as 'admin' | 'user') ?? 'user',
          password: '',
        });
      })
      .catch(() => {
        toast.error('Failed to load user');
        navigate('/users');
      });
  }, [id, accessToken, form, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!accessToken || !id) {
      return;
    }

    try {
      const payload: Partial<FormData> = {
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
      };

      if (data.password && data.password.trim().length > 0) {
        payload.password = data.password;
      }

      await http.patch(`/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      toast.success('User updated successfully');
      navigate('/users');
    } catch {
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Edit User
        </h1>
        <p className="text-muted-foreground mt-1">
          Update user information.
        </p>
      </div>
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Full name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  {...form.register('username')}
                  placeholder="username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="user@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Role *</Label>
                <Select
                  value={form.watch('role')}
                  onValueChange={(value) =>
                    form.setValue('role', value as FormData['role'])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.role && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.role.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">New password (optional)</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...form.register('password')}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                Update User
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/users')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

