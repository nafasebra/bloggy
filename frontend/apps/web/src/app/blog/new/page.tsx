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
import MarkdownEditor from '@/components/shared/markdown-editor';
import MarkdownPreview from '@/components/shared/markdown-preview';
import { getReadTime } from '@/lib/utils';
import { categories } from '@/data';
import { toast } from 'sonner';

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
          {/* Form Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setIsPreview(false)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  !isPreview
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Write
              </button>
              <button
                onClick={() => setIsPreview(true)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isPreview
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {!isPreview ? (
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="p-6 space-y-6"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  {...form.register('title')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  {...form.register('excerpt')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Category *
                  </label>
                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <select
                        id="category"
                        {...field}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category: string) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {form.formState.errors.category && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Read Time (minutes)
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {getReadTime(form.watch('content'))}
                    min
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  {...form.register('tags')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter tags separated by commas..."
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Separate tags with commas (e.g., "Web Development, AI,
                  Frameworks")
                </p>
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Content * (Markdown supported)
                </label>
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
                <button
                  type="button"
                  onClick={() => setIsPreview(true)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {form.formState.isSubmitting
                    ? 'Publishing...'
                    : 'Publish Post'}
                </button>
              </div>
            </form>
          ) : (
            /* Preview Mode */
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
                <button
                  onClick={() => setIsPreview(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Back to Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
