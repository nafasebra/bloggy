'use server';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import http from '@/lib/http';
import { Post } from '@/types';
import PostTable from '@/components/dashboard/post-table';

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
          {posts.length ? (
            <PostTable posts={posts} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm sm:text-base">
              No posts yet. Create your first post to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
