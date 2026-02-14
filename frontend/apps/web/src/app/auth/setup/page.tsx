'use client';

import { useForm } from 'react-hook-form';
import { Camera } from 'lucide-react';
import http from '@/lib/http';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-provider';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { Label } from '@repo/ui/label';

const setupSchema = z.object({
  bio: z.string().optional(),
  avatar: z.any().optional(),
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

  const { user, accessToken } = useAuth();

  const onSubmit = async (data: FormData) => {
    const { avatar, ...tempdata } = data;

    try {
      const response = await http.patch(`/users/${user?._id}`, tempdata, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data) {
        toast.success('Profile created successfully!');
        router.push(`/user/me`);
      } else {
        toast.error(
          `Failed with error: ${response.statusText} - ${response.status}`
        );
      }
    } catch (err) {
      toast.error('Failed to create profile. Please try again.');
    }
  };

  return (
    <div className="py-10 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-5">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Avatar Upload */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-6">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden">
                    <img
                      src="/placeholder-avatar.jpg"
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLElement;
                        const sibling =
                          target.nextElementSibling as HTMLElement;
                        target.style.display = 'none';
                        if (sibling) {
                          sibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <Camera className="w-12 h-12" />
                    </div>
                  </div>
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors duration-200"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register('avatar')}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Upload Your Photo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Choose a photo that represents you best
                </p>
              </div>
            </div>
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
