'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { AuthFormLayout } from '@/components/shared/auth-form-layout';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import axios from 'axios';

const signupSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type signupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: signupFormData) => {
    try {
      const response = await axios.post(
        '/api/register',
        {
          ...data,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        toast.success('Account created successfully! Please log in.');
        router.push('/auth/login');
      } else {
        toast.error(
          response.status + ' ' + response.statusText ||
            'The username or email is already taken'
        );
      }
    } catch {
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <AuthFormLayout title="Create Account" subtitle="Sign up for a new account">
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

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
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
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </Button>

        <div className="text-center pt-4">
          <Link
            href="/auth/login"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors duration-200"
          >
            Do you have an account? Log in
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
}
