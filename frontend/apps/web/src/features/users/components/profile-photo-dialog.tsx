'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog';
import { AvatarEditorDialog } from './avatar-editor-dialog';
import {
  AVATAR_ACCEPT,
  loadAvatarFile,
  validateAvatarFile,
} from '../lib/avatar';

interface ProfilePhotoDialogProps {
  src?: string;
  file?: File | null;
  onSave: (file: File) => Promise<void> | void;
  onRemove?: () => Promise<void> | void;
  onClose: () => void;
}

export function ProfilePhotoDialog({
  src,
  file,
  onSave,
  onRemove,
  onClose,
}: ProfilePhotoDialogProps) {
  const input = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [confirmRemove, setConfirmRemove] = useState(false);

  const editCurrent = async () => {
    setBusy(true);
    setError(undefined);
    try {
      setEditing(file || (await loadAvatarFile(src!)));
    } catch {
      setError('Could not open this photo. Try uploading it again.');
    } finally {
      setBusy(false);
    }
  };

  // Keep one active dialog so focus and Escape always belong to the visible step.
  if (editing) {
    return (
      <AvatarEditorDialog
        file={editing}
        onCancel={() => setEditing(null)}
        onSave={async (updated) => {
          await onSave(updated);
          onClose();
        }}
      />
    );
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Profile photo</DialogTitle>
          <DialogDescription>
            Edit your current photo, upload a new one, or remove it.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-72 items-center justify-center rounded-lg bg-muted/50 py-6">
          {src ? (
            <Image
              src={src}
              alt="Current profile photo"
              width={280}
              height={280}
              className="size-64 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <Camera
              className="size-20 text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept={AVATAR_ACCEPT}
          className="sr-only"
          aria-label="Upload a new profile photo"
          disabled={busy}
          onChange={(event) => {
            const selected = event.target.files?.[0];
            event.target.value = '';
            if (!selected) return;
            const message = validateAvatarFile(selected);
            setError(message);
            if (!message) setEditing(selected);
          }}
        />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {confirmRemove ? (
          <div className="space-y-3">
            <p>Remove your profile photo?</p>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setConfirmRemove(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError(undefined);
                  try {
                    await onRemove?.();
                    onClose();
                  } catch {
                    setError('Could not remove your photo. Please try again.');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? 'Removing...' : 'Remove photo'}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              disabled={!src || busy}
              onClick={editCurrent}
            >
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => input.current?.click()}
            >
              <Camera className="size-4" />
              Upload photo
            </Button>
            {onRemove && src && (
              <Button
                type="button"
                variant="ghost"
                className="ml-auto text-destructive"
                disabled={busy}
                onClick={() => setConfirmRemove(true)}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            )}
          </div>
        )}
        {busy && !confirmRemove && (
          <p role="status" className="text-sm text-muted-foreground">
            Opening photo...
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
