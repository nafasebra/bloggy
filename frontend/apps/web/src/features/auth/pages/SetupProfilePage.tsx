'use client';

import { useState } from 'react';
import { AvatarPicker } from '@/features/users/components/avatar-picker';
import { useUpdateProfileMutation } from '@/features/users/hooks/use-update-profile';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { Label } from '@repo/ui/label';

const setupSchema = z.object({
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
  twitter: z
    .string()
    .regex(/^@?[A-Za-z0-9_]{1,15}$/, 'Please enter a valid Twitter username')
    .or(z.literal(''))
    .optional(),
  category: z.string().optional(),
});

type FormData = z.infer<typeof setupSchema>;

export default function CreateUserPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(setupSchema),
  });

  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { mutateAsync: updateProfile } = useUpdateProfileMutation();

  const onSubmit = async (data: FormData) => {
    if (!user?._id) {
      toast.error('Please sign in before setting up your profile.');
      return;
    }
    try {
      await updateProfile({ userId: user._id, data, avatarFile });
      router.push('/user/me');
    } catch {
      // The shared profile mutation displays upload/save errors.
    }
  };

  return (
    <div className="py-10 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-5">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-8 flex items-center justify-center">
            <AvatarPicker
              file={avatarFile}
              onChange={setAvatarFile}
              src={user?.avatar}
              disabled={isSubmitting}
            />
          </div>

          {/* Right Column - Form */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Create Your Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Set up your account information
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    placeholder="Tell us about yourself"
                    {...register('bio')}
                  />
                  {errors.bio && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.bio.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Your location"
                      {...register('location')}
                    />
                    {errors.location && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      type="text"
                      placeholder="e.g., Technology"
                      {...register('category')}
                    />
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://"
                    {...register('website')}
                  />
                  {errors.website && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter Account</Label>
                  <Input
                    id="twitter"
                    type="text"
                    placeholder="@username"
                    {...register('twitter')}
                  />
                  {errors.twitter && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.twitter.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
