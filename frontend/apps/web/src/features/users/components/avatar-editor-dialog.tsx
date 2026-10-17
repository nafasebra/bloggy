'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@repo/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import {
  applyAvatarFilter,
  avatarFilters,
  type AvatarFilter,
} from '../lib/avatar-filters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog';
import { exportAvatarCrop, getAvatarCrop } from '../lib/crop-avatar';

interface AvatarEditorDialogProps {
  file: File;
  onSave: (file: File) => Promise<void> | void;
  onCancel: () => void;
}

export function AvatarEditorDialog({
  file,
  onSave,
  onCancel,
}: AvatarEditorDialogProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement>();
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(0.5);
  const [y, setY] = useState(0.5);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<AvatarFilter>('none');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const photo = new window.Image();
    let active = true;
    photo.onload = () => {
      if (active) setImage(photo);
    };
    photo.onerror = () => {
      if (active)
        setError(
          'This photo could not be opened. Please choose another image.'
        );
    };
    photo.src = url;
    return () => {
      active = false;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!image || !context) return;
    const crop = getAvatarCrop(
      image.naturalWidth,
      image.naturalHeight,
      zoom,
      x,
      y
    );
    context.clearRect(0, 0, 512, 512);
    context.drawImage(
      image,
      crop.x,
      crop.y,
      crop.size,
      crop.size,
      0,
      0,
      512,
      512
    );
    if (filter !== 'none') {
      const pixels = context.getImageData(0, 0, 512, 512);
      applyAvatarFilter(pixels.data, filter);
      context.putImageData(pixels, 0, 0);
    }
  }, [image, zoom, x, y, filter]);

  const save = async () => {
    if (!canvas.current || !image) return;
    setSaving(true);
    setError(undefined);
    try {
      const cropped = await exportAvatarCrop(canvas.current, file.name);
      await onSave(cropped);
    } catch {
      setError('Could not save this photo. Please try again.');
      setSaving(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !saving) onCancel();
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit your photo</DialogTitle>
          <DialogDescription>
            Crop your photo and choose a filter. Your profile photo will appear
            round.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mx-auto aspect-square w-full max-w-64 overflow-hidden rounded-lg bg-muted">
          <canvas
            ref={canvas}
            width={512}
            height={512}
            aria-label="Edited profile photo preview"
            className="block size-full"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/80 shadow-[0_0_0_40px_rgba(0,0,0,0.35)]"
          />
        </div>
        {!image && !error && (
          <p role="status" className="text-sm text-muted-foreground">
            Loading photo...
          </p>
        )}
        <Tabs defaultValue="crop">
          <TabsList
            className="grid w-full grid-cols-2"
            aria-label="Photo editing options"
          >
            <TabsTrigger value="crop">Crop</TabsTrigger>
            <TabsTrigger value="filter">Filter</TabsTrigger>
          </TabsList>
          <TabsContent value="crop" className="space-y-4">
            {[
              { label: 'Zoom', value: zoom, min: 1, max: 3, change: setZoom },
              {
                label: 'Horizontal position',
                value: x,
                min: 0,
                max: 1,
                change: setX,
              },
              {
                label: 'Vertical position',
                value: y,
                min: 0,
                max: 1,
                change: setY,
              },
            ].map(({ label, value, min, max, change }) => (
              <label key={label} className="grid gap-2 text-sm">
                {label}
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={0.01}
                  value={value}
                  disabled={!image || saving}
                  onChange={(event) => change(Number(event.target.value))}
                  className="w-full accent-primary"
                />
              </label>
            ))}
          </TabsContent>
          <TabsContent value="filter">
            <fieldset
              disabled={!image || saving}
              className="grid grid-cols-2 gap-2"
            >
              <legend className="sr-only">Photo filter</legend>
              {avatarFilters.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-3 text-sm has-checked:border-primary has-checked:bg-muted"
                >
                  <input
                    type="radio"
                    name="avatar-filter"
                    value={key}
                    checked={filter === key}
                    onChange={() => setFilter(key)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </fieldset>
          </TabsContent>
        </Tabs>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="button" disabled={!image || saving} onClick={save}>
            {saving ? 'Saving...' : 'Save photo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
