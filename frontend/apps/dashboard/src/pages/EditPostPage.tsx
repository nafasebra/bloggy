import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
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

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const [activeTab, setActiveTab] = useState('write');
  const [loading, setLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', excerpt: '', content: '', category: '', tags: '' },
  });

  useEffect(() => {
    if (!id || !accessToken) {
      setLoading(false);
      return;
    }
    http
      .get(`/posts/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        const post = res.data;
        form.reset({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        });
      })
      .catch(() => toast.error('Failed to load post'))
      .finally(() => setLoading(false));
  }, [id, accessToken, form]);

  const onSubmit = async (data: FormData) => {
    if (!accessToken || !user || !id) return;
    try {
      const postData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
        authorId: user._id,
        authorName: user.name,
        updatedAt: new Date().toISOString(),
      };
      await http.patch(`/posts/${id}`, postData, { headers: { Authorization: `Bearer ${accessToken}` } });
      toast.success('Post updated!');
      navigate('/posts');
    } catch {
      toast.error('Failed to update post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground mt-1">Update your blog post</p>
      </div>
      <Card className="border-border shadow-sm">
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
                  {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea id="excerpt" {...form.register('excerpt')} rows={3} placeholder="Brief summary..." />
                  {form.formState.errors.excerpt && <p className="text-sm text-destructive">{form.formState.errors.excerpt.message}</p>}
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
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" {...form.register('tags')} placeholder="Comma-separated..." />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Content *</Label>
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field }) => <MarkdownEditor value={field.value} onChange={field.onChange} />}
                  />
                  {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={form.formState.isSubmitting}>Update Post</Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/posts')}>Cancel</Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="preview">
              <MarkdownPreview content={form.watch('content') || ''} />
              <div className="flex gap-3 pt-6 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setActiveTab('write')}>Back to Edit</Button>
                <Button type="button" onClick={form.handleSubmit(onSubmit)}>Update Post</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
