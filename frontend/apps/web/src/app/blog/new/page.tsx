'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PostService } from '@/services/post.services';
import { useAuth } from '@/contexts/auth-provider';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { MarkdownPreview } from '@repo/ui/markdown-preview';

const MarkdownEditor = dynamic(
  () => import('@repo/ui/markdown-editor').then((m) => ({ default: m.MarkdownEditor })),
  { ssr: false }
);
import { getReadTime } from '@/lib/utils';
import { categories } from '@/data';
import { toast } from 'sonner';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { Label } from '@repo/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';

const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .max(500, 'Excerpt must be less than 500 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .min(50, 'Content must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
});

type BlogPostForm = z.infer<typeof createPostSchema>;

export default function NewBlogPost() {
  const [isPreview, setIsPreview] = useState(false);

  const { accessToken, user } = useAuth();
  const router = useRouter();

  const form = useForm<BlogPostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
    },
  });

  const handleSubmit = async (data: BlogPostForm) => {
    if (!user) {
      toast.error('You must be logged in to create a post');
      return;
    }

    try {
      const postData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        tags: data.tags
          ? data.tags
              .split(',')
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag)
          : [],
        authorId: user._id,
        authorName: user.name,
        createdAt: new Date().toISOString(),
      };

      await PostService.createPost(postData, accessToken);

      toast.success('Post created successfully!');
      router.push('/blog');
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Post
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Share your thoughts and ideas with the community
              </p>
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <ArrowLeft />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <Tabs value={isPreview ? 'preview' : 'write'} onValueChange={(v) => setIsPreview(v === 'preview')}>
            <TabsList className="w-full justify-start rounded-none border-b border-gray-200 dark:border-gray-700 bg-transparent p-0 h-auto">
              <TabsTrigger value="write" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:shadow-none">
                Write
              </TabsTrigger>
              <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:shadow-none">
                Preview
              </TabsTrigger>
            </TabsList>

          <TabsContent value="write" className="mt-0">
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="p-6 space-y-6"
            >
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="Enter your post title..."
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  rows={3}
                  {...form.register('excerpt')}
                  placeholder="Write a brief summary of your post..."
                />
                {form.formState.errors.excerpt && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {form.formState.errors.excerpt.message}
                  </p>
                )}
              </div>

              {/* Category and Read Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value || ''} onValueChange={field.onChange}>
                        <SelectTrigger id="category" className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: string) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.category && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Read Time (minutes)</Label>
                  <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                    {getReadTime(form.watch('content'))} min
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  {...form.register('tags')}
                  placeholder="Enter tags separated by commas..."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Separate tags with commas (e.g., "Web Development, AI,
                  Frameworks")
                </p>
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content * (Markdown supported)</Label>
                <Controller
                  name="content"
                  control={form.control}
                    render={({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
                      <MarkdownEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Write your blog post content here using Markdown..."
                      />
                    )}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {form.formState.errors.content.message}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {form.watch('content')?.length || 0} characters
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ~{Math.ceil((form.watch('content')?.length || 0) / 5)} words
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsPreview(true)}
                >
                  Preview
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? 'Publishing...'
                    : 'Publish Post'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <div className="p-6">
              <div className="mb-8">
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
                  <div className="flex flex-wrap gap-2 mb-6">
                    {form
                      .watch('tags')!
                      .split(',')
                      .map((tag: string, index: number) => (
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

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsPreview(false)}
                >
                  Back to Edit
                </Button>
              </div>
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
