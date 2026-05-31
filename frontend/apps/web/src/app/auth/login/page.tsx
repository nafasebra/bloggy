'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-provider';
import { AuthFormLayout } from '@/components/shared/auth-form-layout';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import axios from 'axios';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post(
        '/api/login',
        {
          username: data.username,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );

      const result = response.data;

      if (result.user) {
        const dashboardUrl =
          process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001';
        const { isNew, role, ...userProfile } = result.user;
        const isAdmin = role === 'admin';

        if (isAdmin) {
          window.location.replace(dashboardUrl);
          return;
        }

        setUser({ ...userProfile, role: role ?? 'user' });

        if (isNew) {
          router.push('/auth/setup');
        } else {
          const params = new URLSearchParams(window.location.search);
          const redirect = params.get('redirect');
          router.push(
            redirect?.startsWith('/') && !redirect.startsWith('//')
              ? redirect
              : '/'
          );
        }
      } else {
        toast.error(
          response.status + ' ' + response.statusText ||
            'The Username or Password is incorrect'
        );
      }
    } catch {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <AuthFormLayout title="Welcome Back" subtitle="Sign in to your account">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register('username')}
            />
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          <PasswordInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            registration={register('password')}
            error={errors.password?.message}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="text-center pt-4">
          <Link
            href="/auth/signup"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors duration-200"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
}
