import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash } from 'lucide-react';

interface PostTableProps {
  posts: Post[];
  onDelete?: (id: string) => void;
}

export default function PostTable({ posts, onDelete }: PostTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId && onDelete) onDelete(deleteId);
    setDeleteId(null);
    setOpen(false);
  };

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead className="hidden md:table-cell">Author</TableHead>
            <TableHead className="hidden lg:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post._id}>
              <TableCell className="font-medium">
                <div>
                  <div className="line-clamp-2">{post.title}</div>
                  <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{post.authorName}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {new Date(post.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link to={`/posts/edit/${post._id}`}>
                    <Button variant="outline" size="sm">
                      <Edit />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(post._id)}>
                    <Trash />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
