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
import MarkdownEditor from '@/components/shared/markdown-editor';
import MarkdownPreview from '@/components/shared/markdown-preview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [activeTab, setActiveTab] = useState('write');

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
  };

  const onSubmit = async (data: CreatePostForm) => {
    if (!accessToken) {
      alert('You must be logged in to create a post');
      return;
    }

    try {
      const authorId = (await getCurrentUser())?._id;

      const postData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map((tag) => tag.trim()) : [],
        authorId,
        createdAt: new Date().toISOString(),
      };

      const response = await http.post('/posts', postData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 201) {
        router.push('/dashboard/posts');
      } else {
        throw new Error(
          'Failed to create post: ' +
            response.status +
            ' - ' +
            response.statusText
        );
      }
    } catch (error) {
      console.log('Error creating post:', error);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Create New Post
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Write a new blog post
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="write">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
              >
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Controller
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
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
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Separate tags with commas (e.g., "Web Development, AI,
                      Frameworks")
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="content">Content * (Markdown supported)</Label>
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                      <MarkdownEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Write your blog post content here using Markdown..."
                      />
                    )}
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
                      ~{Math.ceil((form.watch('content')?.length || 0) / 5)}{' '}
                      words
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    type="submit"
                    disabled={
                      form.formState.isSubmitting || !form.formState.isValid
                    }
                    className="w-full sm:w-auto"
                  >
                    {form.formState.isSubmitting ? 'Creating...' : 'Create Post'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {form.watch('title') || 'Your Post Title'}
                  </h1>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <span>{form.watch('category') || 'Category'}</span>
                    <span>•</span>
                    <span>
                      {form.watch('content')
                        ? Math.ceil(
                            form.watch('content')!.trim().split(/\s+/).length /
                              200
                          )
                        : 0}{' '}
                      min read
                    </span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>

                  {form.watch('excerpt') && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        {form.watch('excerpt')}
                      </p>
                    </div>
                  )}

                  {form.watch('tags') && form.watch('tags')!.trim() && (
                    <div className="flex flex-wrap gap-2">
                      {form
                        .watch('tags')!
                        .split(',')
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <MarkdownPreview content={form.watch('content') || ''} />

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('write')}
                  >
                    Back to Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={
                      form.formState.isSubmitting || !form.formState.isValid
                    }
                  >
                    {form.formState.isSubmitting ? 'Creating...' : 'Create Post'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
