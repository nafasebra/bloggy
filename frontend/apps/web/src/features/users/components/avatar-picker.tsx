'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  AVATAR_ACCEPT,
  resolveAvatarUrl,
  validateAvatarFile,
} from '../lib/avatar';

interface AvatarPickerProps {
  file: File | null;
  onChange: (file: File | null) => void;
  src?: string;
  disabled?: boolean;
}

export function AvatarPicker({
  file,
  onChange,
  src,
  disabled,
}: AvatarPickerProps) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>();
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const image = preview || resolveAvatarUrl(src);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="size-32 overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm">
        {image ? (
          <Image
            src={image}
            alt="Profile photo preview"
            width={128}
            height={128}
            className="size-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Camera className="size-10" aria-hidden="true" />
          </div>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept={AVATAR_ACCEPT}
        aria-label="Choose profile photo"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const selected = event.target.files?.[0];
          event.target.value = '';
          if (!selected) return;
          const message = validateAvatarFile(selected);
          setError(message);
          if (!message) onChange(selected);
        }}
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => input.current?.click()}
      >
        {file || src ? 'Change photo' : 'Choose photo'}
      </Button>
      {file && (
        <Button
          type="button"
          variant="ghost"
          disabled={disabled}
          onClick={() => {
            onChange(null);
            setError(undefined);
          }}
        >
          Cancel selection
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        JPEG, PNG, GIF, or WebP. Maximum 5MB.
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
