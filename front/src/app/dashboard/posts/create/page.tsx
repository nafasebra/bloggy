'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-provider';
import { categories } from '@/data';
import http from '@/lib/http';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

export default function CreatePostPage() {
  const router = useRouter();
  const { accessToken } = useAuth();

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
    },
  });

  const getCurrentUser = async () => {
    try {
      const response = await http.get('/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  const onSubmit = async (data: CreatePostForm) => {
    if (!accessToken) {
      alert('You must be logged in to create a post');
      return;
    }

    try {
      const authorId = (await getCurrentUser())?._id;

      const postData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        authorId,
        createdAt: new Date().toISOString(),
      };

      const response = await http.post('/posts', postData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.status === 201) {
        router.push('/dashboard/posts');
      } else {
        throw new Error("Failed to create post: " + response.status + " - " + response.statusText);
      }
    } catch (error) {
      console.log('Error creating post:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className='space-y-3'>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Post
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Write a new blog post
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Enter post title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                {...form.register('excerpt')}
                placeholder="Write a brief summary of your post..."
                rows={3}
              />
              {form.formState.errors.excerpt && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.excerpt.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category *</Label>
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.category && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                {...form.register('tags')}
                placeholder="Enter tags separated by commas..."
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Separate tags with commas (e.g., "Web Development, AI, Frameworks")
              </p>
            </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                {...form.register('content')}
                placeholder="Write your post content here..."
                rows={10}
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.content.message}
                </p>
              )}
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {form.watch('content')?.length || 0} characters
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ~
                  {Math.ceil((form.watch('content')?.length || 0) / 5)} words
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
