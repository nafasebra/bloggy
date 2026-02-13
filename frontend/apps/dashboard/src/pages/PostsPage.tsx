import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  if (loading) return <div className="text-center py-8">Loading posts...</div>;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Posts</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">Manage your blog posts</p>
        </div>
        <Link to="/posts/create">
          <Button className="w-full sm:w-auto">Create New Post</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length ? (
            <PostTable posts={posts} onDelete={handleDelete} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No posts yet. Create your first post to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
