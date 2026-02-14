import Link from 'next/link';
import React from 'react';
import { Badge } from '@repo/ui/badge';

export interface BlogPost {
  id: string | number;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: string;
  authorId: string | number;
  date: string | Date;
}

interface BlogCardProps {
  post: BlogPost;
  postUrlPrefix?: string;
  authorUrlPrefix?: string;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  postUrlPrefix = '/post',
  authorUrlPrefix = '/user',
  className = '',
}) => {
  return (
    <article
      className={`bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-600 ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="info">
            {post.category}
          </Badge>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {post.readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          <Link
            href={`${postUrlPrefix}/${post.id}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {post.author.charAt(0)}
              </span>
            </div>
            <div>
              <Link
                href={`${authorUrlPrefix}/${post.authorId}`}
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                {post.author}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <Link
            href={`${postUrlPrefix}/${post.id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
