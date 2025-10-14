'use client';

import { Post } from '@/types';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Delete, Edit, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PostTableProps {
  posts: Post[];
}

function PostTable({ posts }: PostTableProps) {
  const [deletePostId, setDeletePostId] = React.useState<string | null>(null);
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = React.useState(false);

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      {deletePostId && (
        <AlertDialog open={isDialogDeleteOpen} onOpenChange={setIsDialogDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                post from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

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
          {posts.map((post: Post) => (
            <TableRow key={post._id}>
              <TableCell className="font-medium">
                <div>
                  <div className="line-clamp-2">{post.title}</div>
                  <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {post.authorName}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {new Date(post.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeletePostId(post._id);
                      setIsDialogDeleteOpen(true);
                    }}
                  >
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

export default PostTable;
