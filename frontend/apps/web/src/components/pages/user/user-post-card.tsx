import Link from 'next/link';
import { Eye, Heart } from 'lucide-react';
import { Badge } from '@repo/ui/badge';

interface UserPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  views: number;
  likes: number;
}

interface UserPostCardProps {
  post: UserPost;
}

export default function UserPostCard({ post }: UserPostCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="info">
            {post.category}
          </Badge>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {post.readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <Link href={`/post/${post.id}`}>{post.title}</Link>
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{post.likes}</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`/post/${post.id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
          >
            Read full article →
          </Link>
        </div>
      </div>
    </article>
  );
}
