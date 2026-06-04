'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { Label } from '@repo/ui/label';
import {
  editProfileSchema,
  type EditProfileFormData,
} from '@/lib/schemas/edit-profile';
import { readFileAsDataUrl, resolveAvatarUrl } from '@/lib/avatar';
import { toast } from 'sonner';
import { useUpdateProfileMutation } from '@/hooks/mutation/use-update-profile';
import type { User } from '@/types/user';

type EditProfileDialogProps = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (user: User) => void;
};

export function EditProfileDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: EditProfileDialogProps) {
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    if (open && user) {
      reset({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        twitter: user.twitter || '',
        category: user.category || '',
      });
      setAvatarPreview(resolveAvatarUrl(user.avatar) || '');
      setAvatarFile(null);
    }
  }, [open, user, reset]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(await readFileAsDataUrl(file));
  };

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      const updatedUser = await updateProfile({
        userId: user._id,
        data,
        avatarFile,
      });
      onSuccess?.(updatedUser);
      onOpenChange(false);
    } catch {
      // Toast handled in mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your account information and profile photo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="size-20 rounded-full overflow-hidden border-2 border-border bg-muted">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    width={80}
                    height={80}
                    className="size-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="size-full flex items-center justify-center text-muted-foreground">
                    <Camera className="size-8" />
                  </div>
                )}
              </div>
              <label
                htmlFor="edit-profile-avatar"
                className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
              >
                <Camera className="size-4" />
              </label>
              <input
                id="edit-profile-avatar"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a profile photo (max 5MB). JPEG, PNG, GIF, or WebP.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-name">Full name</Label>
              <Input id="edit-name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input id="edit-username" {...register('username')} />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea id="edit-bio" rows={3} {...register('bio')} />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" {...register('location')} />
              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input id="edit-category" {...register('category')} />
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                type="url"
                placeholder="https://"
                {...register('website')}
              />
              {errors.website && (
                <p className="text-sm text-destructive">
                  {errors.website.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-twitter">Twitter</Label>
              <Input
                id="edit-twitter"
                placeholder="@username"
                {...register('twitter')}
              />
              {errors.twitter && (
                <p className="text-sm text-destructive">
                  {errors.twitter.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
