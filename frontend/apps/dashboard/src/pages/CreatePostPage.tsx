import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { Label } from '@repo/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import { useAuth } from '@/contexts/auth-provider';
import { categories } from '@/data';
import http from '@/lib/http';
import { MarkdownEditor } from '@repo/ui/markdown-editor';
import { MarkdownPreview } from '@repo/ui/markdown-preview';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const [activeTab, setActiveTab] = useState('write');

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', excerpt: '', content: '', category: '', tags: '' },
  });

  const onSubmit = async (data: FormData) => {
    if (!accessToken || !user) {
      toast.error('You must be logged in to create a post');
      return;
    }
    try {
      const postData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
        authorId: user._id,
        authorName: user.name,
        createdAt: new Date().toISOString(),
      };
      await http.post('/posts', postData, { headers: { Authorization: `Bearer ${accessToken}` } });
      toast.success('Post created successfully!');
      navigate('/posts');
    } catch {
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Write a new blog post</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" {...form.register('title')} placeholder="Enter post title" />
                  {form.formState.errors.title && <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea id="excerpt" {...form.register('excerpt')} placeholder="Brief summary..." rows={3} />
                  {form.formState.errors.excerpt && <p className="text-sm text-red-600">{form.formState.errors.excerpt.message}</p>}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Category *</Label>
                    <Controller
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.category && <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" {...form.register('tags')} placeholder="Comma-separated tags..." />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Content * (Markdown)</Label>
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field }) => <MarkdownEditor value={field.value} onChange={field.onChange} placeholder="Write content..." />}
                  />
                  {form.formState.errors.content && <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>}
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={form.formState.isSubmitting}>Create Post</Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/posts')}>Cancel</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="preview">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">{form.watch('title') || 'Your Post Title'}</h1>
                <p className="text-sm text-gray-500">{form.watch('category')} · {form.watch('content') ? Math.ceil(form.watch('content')!.trim().split(/\s+/).length / 200) : 0} min read</p>
                {form.watch('excerpt') && <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"><p className="italic">{form.watch('excerpt')}</p></div>}
                <MarkdownPreview content={form.watch('content') || ''} />
                <div className="flex gap-3 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('write')}>Back to Edit</Button>
                  <Button type="button" onClick={form.handleSubmit(onSubmit)}>Create Post</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
