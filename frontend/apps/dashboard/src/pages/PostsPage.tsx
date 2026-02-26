import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table';
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
          {loading ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="hidden md:table-cell">Author</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-5 max-w-[240px] bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell className="hidden md:table-cell"><div className="h-5 w-24 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><div className="h-5 w-20 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell className="text-right"><div className="h-8 w-16 ml-auto bg-muted rounded animate-pulse" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : posts.length ? (
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
