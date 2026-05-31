'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'sonner';
import http from '@/lib/http';
import { AuthFormLayout } from '@/components/shared/auth-form-layout';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@repo/ui/button';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    const tempData = {
      old_password: data.oldPassword,
      new_password: data.password,
    };

    try {
      await http.post('/auth/change-password', tempData);

      toast.success('Password changed successfully!');
      router.push('/user/me');
    } catch {
      toast.error('Change failed. Please try again.');
    }
  };

  return (
    <AuthFormLayout
      title="Change your password"
      subtitle="Enter your old password and new password"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <PasswordInput
            id="oldPassword"
            label="Old Password"
            placeholder="Enter your old password"
            registration={register('oldPassword')}
            error={errors.oldPassword?.message}
          />
          <PasswordInput
            id="password"
            label="New Password"
            placeholder="Enter your new password"
            registration={register('password')}
            error={errors.password?.message}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Changing...' : 'Change Password'}
        </Button>

        <div className="text-center pt-4">
          <Link
            href="/user/me"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors duration-200"
          >
            Back to profile
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
}
