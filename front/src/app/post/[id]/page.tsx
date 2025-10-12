'use server';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommentSection from '@/components/pages/blog/comment-section';
import { ChevronLeft } from 'lucide-react';
import http from '@/lib/http';
import { Post } from '@/types';
import MarkdownPreview from '@/components/shared/markdown-preview';
import { getReadTime } from '@/lib/utils';
import { Eye, Heart } from 'lucide-react';
import LikeButton from '@/components/pages/blog/like-button';

interface PostPageProps {
  params: {
    id: string;
  };
}

async function getPostById(id: string) {
  try {
    const response = await http.get<Post>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.log('Failed to fetch post');
  }
}

async function getPostViewCountByIP(postId: string) {
  try {
    const response = await http.post(`/posts/${postId}/view`);
    return response.data;
  } catch (error) {
    console.log('Failed to fetch post view count by IP:', error);
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const [post, postViewCount] = await Promise.all([
    getPostById(params.id),
    getPostViewCountByIP(params.id),
  ]);

  console.log(postViewCount);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <ChevronLeft />
              Back to Blog
            </Link>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getReadTime(post.content)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {post.excerpt}
          </p>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                {post.authorName
                  ? post.authorName.charAt(0)
                  : post.authorId.charAt(0)}
              </span>
            </div>
            <div>
              <Link
                href={`/user/${post.authorId}`}
                className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                {post.authorName ? post.authorName : post.authorId}
              </Link>
              <p className="text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <MarkdownPreview content={post.content} />

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Tags:
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* View and Like Counts */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="w-full flex items-center justify-between gap-5">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Eye />
                <span>{post.views || 0}</span>
              </span>
              <LikeButton postId={post._id} />
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <CommentSection postId={post._id} />
      </div>
    </div>
  );
}
