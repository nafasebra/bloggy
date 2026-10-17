'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@repo/ui/button';
import type { User } from '../types';
import { resolveAvatarUrl } from '../lib/avatar';
import { useProfilePhotoMutation } from '../hooks/use-profile-photo';
import { ProfilePhotoDialog } from './profile-photo-dialog';

export function ProfilePhotoButton({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const mutation = useProfilePhotoMutation(user._id);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Camera className="size-4" />
        Edit profile photo
      </Button>
      {open && (
        <ProfilePhotoDialog
          src={resolveAvatarUrl(user.avatar)}
          onClose={() => setOpen(false)}
          onSave={async (file) => {
            await mutation.mutateAsync(file);
          }}
          onRemove={async () => {
            await mutation.mutateAsync(null);
          }}
        />
      )}
    </>
  );
}
