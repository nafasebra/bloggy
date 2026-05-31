'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { AuthFormLayout } from '@/components/shared/auth-form-layout';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';

const forgetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

export default function ForgetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    try {
      const response = await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Password reset link sent to your email!');
      } else {
        toast.error('Failed to send reset email');
      }
    } catch {
      toast.error('Request failed. Please try again.');
    }
  };

  return (
    <AuthFormLayout
      title="Forgot your password?"
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </Button>

        <div className="text-center pt-4">
          <Link
            href="/auth/login"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors duration-200"
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
}
