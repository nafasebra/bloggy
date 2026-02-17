import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import PostTable from '@/components/dashboard/PostTable';
import http from '@/lib/http';
import { useAuth } from '@/contexts/auth-provider';
import type { Post } from '@/types';
import { toast } from 'sonner';

export default function PostsPage() {
  const { accessToken } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    http
      .get<Post[]>('/posts', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => setPosts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    try {
      await http.delete(`/posts/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your blog posts</p>
        </div>
        <Button asChild className="w-full sm:w-auto" size="default">
          <Link to="/posts/create" className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Post
          </Link>
        </Button>
      </div>
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length ? (
            <PostTable posts={posts} onDelete={handleDelete} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No posts yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first post to get started.</p>
              <Button asChild className="mt-4" size="sm">
                <Link to="/posts/create">Create Post</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
