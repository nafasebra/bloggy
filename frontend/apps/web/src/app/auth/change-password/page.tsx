'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-provider';
import http from '@/lib/http';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { user, accessToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    const tempData = {
      userId: user?._id,
      old_password: data.oldPassword,
      new_password: data.password,
    };

    try {
      await http.post('/auth/change-password', tempData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success('Password changed successfully!');
      router.push('/user/' + user?._id);
    } catch (err) {
      toast.error('Change failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-8 py-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              Change your password
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mt-2 text-sm">
              Enter your old password and new password
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">Old Password</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="Enter your old password"
                    className="pr-10"
                    {...register('oldPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 size-9"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    aria-label={showOldPassword ? 'Hide password' : 'Show password'}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {errors.oldPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    className="pr-10"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 size-9"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </Button>

            <div className="text-center pt-4">
              <Link
                href="/user/1"
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors duration-200"
              >
                Back to profile
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
