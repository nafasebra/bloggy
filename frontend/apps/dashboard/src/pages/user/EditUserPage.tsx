import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { useAuth } from '@/contexts/auth-provider';
import { useUser, useUpdateUser } from '@/hooks/use-users';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user'], {
    required_error: 'Role is required',
  }),
  password: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { data: userToEdit, isLoading } = useUser(id);
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', username: '', email: '', role: 'user', password: '' },
  });

  useEffect(() => {
    if (userToEdit) {
      form.reset({
        name: userToEdit.name,
        username: userToEdit.username,
        email: userToEdit.email,
        role: (userToEdit.role as 'admin' | 'user') ?? 'user',
        password: '', 
      });
    }
  }, [userToEdit, form]);

  const onSubmit = async (data: FormData) => {
    if (!currentUser || !id) return;

    const payload: Partial<FormData> = {
      name: data.name,
      username: data.username,
      email: data.email,
      role: data.role,
    };

    if (data.password && data.password.trim() !== '') {
      payload.password = data.password;
    }

    try {
      await updateUser({ id, data: payload });
      toast.success('User updated successfully');
      navigate('/users');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">Loading user data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground">Update user information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...form.register('username')} />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register('email')} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password (Optional)</Label>
              <Input id="password" type="password" placeholder="Leave blank to keep current password" {...form.register('password')} />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="pt-4 flex gap-4">
              <Button type="submit" disabled={isUpdating || form.formState.isSubmitting}>
                {isUpdating ? 'Updating...' : 'Update User'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
