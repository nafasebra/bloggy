import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/table';
import { Button } from '@repo/ui/button';
import { CircleX, MessageSquare, Trash } from 'lucide-react';
import { useAuth } from '@/contexts/auth-provider';
import { useDeleteComment } from '@/hooks/mutations/delete-comment'; 
import { useComments } from '@/hooks/queries/all-comments'; 

export default function CommentsPage() {
  const { user } = useAuth();
  
  const { data: comments = [], isLoading } = useComments(!!user?._id);
  const { mutate: deleteComment, isPending: isDeleting, variables: deletingId } = useDeleteComment();

  const handleDelete = (id: string) => {
    if (!user?._id) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this comment?'
    );
    if (!confirmed) return;

    deleteComment(id);
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
          {isLoading ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-55">Comment</TableHead>
                    <TableHead className="hidden sm:table-cell">Post</TableHead>
                    <TableHead className="hidden md:table-cell">Author</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 5 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CircleX size={30} />
              <p className="text-muted-foreground">
                No comments found across your posts.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-55">Comment</TableHead>
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
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button>Accept</Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={isDeleting && deletingId === comment._id}
                          onClick={() => handleDelete(comment._id)}
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          {isDeleting && deletingId === comment._id ? 'Deleting...' : 'Delete'}
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
