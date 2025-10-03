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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your blog posts
          </p>
        </div>
        <Link href="/dashboard/posts/create">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post: Post) => (
                <TableRow key={post._id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.authorId}</TableCell>
                  {/* <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'Published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {post.status}
                    </span>
                  </TableCell> */}
                  <TableCell>{post.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
