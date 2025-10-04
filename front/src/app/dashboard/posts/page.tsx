"use server"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import http from '@/lib/http';
import { Post } from '@/types';

// Mock data - replace with actual API call
const posts = [
  {
    id: 1,
    title: 'Getting Started with Next.js',
    author: 'John Doe',
    status: 'Published',
    createdAt: '2023-09-01',
  },
  {
    id: 2,
    title: 'Building Modern UIs with React',
    author: 'Jane Smith',
    status: 'Draft',
    createdAt: '2023-09-05',
  },
  {
    id: 3,
    title: 'TypeScript Best Practices',
    author: 'Bob Johnson',
    status: 'Published',
    createdAt: '2023-09-10',
  },
];

async function getPosts() {
  try {
    const response = await http.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Posts
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
            Manage your blog posts
          </p>
        </div>
        <Link href="/dashboard/posts/create">
          <Button className="w-full sm:w-auto">Create New Post</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {
            posts.length ? (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
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
                        <TableCell className="hidden md:table-cell">{post.authorId}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm sm:text-base">
                No posts yet. Create your first post to get started!
              </p>
            )
          }
        </CardContent>
      </Card>
    </div>
  );
}
