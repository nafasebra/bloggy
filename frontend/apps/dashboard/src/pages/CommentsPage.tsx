import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table';
import { Button } from '@repo/ui/button';
import { MessageSquare, Trash } from 'lucide-react';
import http from '@/lib/http';
import { useAuth } from '@/contexts/auth-provider';
import type { Post, Comment } from '@/types';
import { toast } from 'sonner';

type CommentRow = Comment & { postTitle: string };

export default function CommentsPage() {
  const { accessToken } = useAuth();
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${accessToken}` };
        const postsRes = await http.get<Post[]>('/posts', { headers });
        const posts = Array.isArray(postsRes.data) ? postsRes.data : [];

        if (!posts.length) {
          if (!cancelled) {
            setComments([]);
          }
          return;
        }

        const commentResponses = await Promise.all(
          posts.map((post) => http.get<Comment[]>(`/comments/${post._id}`))
        );

        const rows: CommentRow[] = [];
        posts.forEach((post, index) => {
          const postComments = Array.isArray(commentResponses[index].data)
            ? commentResponses[index].data
            : [];
          postComments.forEach((comment) => {
            rows.push({
              ...comment,
              postTitle: post.title,
            });
          });
        });

        rows.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (!cancelled) {
          setComments(rows);
        }
      } catch {
        if (!cancelled) {
          setComments([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const handleDelete = async (id: string) => {
    if (!accessToken) return;

    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await http.delete(`/comments/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Comments
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage comments across posts
          </p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            All Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Comment</TableHead>
                    <TableHead className="hidden sm:table-cell">Post</TableHead>
                    <TableHead className="hidden md:table-cell">Author</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-8 w-20 ml-auto bg-muted rounded animate-pulse" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                No comments found across your posts.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Comment</TableHead>
                    <TableHead className="hidden sm:table-cell">Post</TableHead>
                    <TableHead className="hidden md:table-cell">Author</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment._id}>
                      <TableCell>
                        <div className="max-w-md text-sm text-foreground line-clamp-2">
                          {comment.content}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {comment.postTitle}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {comment.authorName}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={deletingId === comment._id}
                          onClick={() => handleDelete(comment._id)}
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

