'use client';

import { useForm } from 'react-hook-form';
import { Camera } from 'lucide-react';
import http from '@/lib/http';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-provider';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { Label } from '@repo/ui/label';

const editProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  email: z.string().email('Please enter a valid email').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.any().optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
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
  category: z.string().max(50, 'Category must be less than 50 characters').optional(),
});

type FormData = z.infer<typeof editProfileSchema>;

export default function EditUserPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id || !accessToken) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await http.get(`/users/${user._id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data) {
          const userData = response.data;
          setValue('name', userData.name || '');
          setValue('username', userData.username || '');
          setValue('email', userData.email || '');
          setValue('bio', userData.bio || '');
          setValue('location', userData.location || '');
          setValue('website', userData.website || '');
          setValue('twitter', userData.twitter || '');
          setValue('category', userData.category || '');
          setAvatarPreview(userData.avatar || '');
        }
      } catch (err) {
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?._id, accessToken, router, setValue]);

  const onSubmit = async (data: FormData) => {
    const { avatar, ...updateData } = data;

    try {
      const response = await http.patch(`/users/${user?._id}`, updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data) {
        toast.success('Profile updated successfully!');
        router.push(`/user/me`);
      } else {
        toast.error(`Failed to update profile`);
      }
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="py-10 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

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
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const sibling = target.nextElementSibling as HTMLElement;
                          if (sibling) {
                            sibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400"
                      style={{ display: avatarPreview ? 'none' : 'flex' }}
                    >
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAvatarPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Update Your Photo
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
                Edit Your Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Update your account information
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

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

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Updating Profile...' : 'Update Profile'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
