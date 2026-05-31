import Link from 'next/link';
import { Badge } from '@repo/ui/badge';
import { UserAvatar } from '@/components/ui/user-avatar';
import { PostEngagementStats } from '@/components/ui/post-engagement-stats';
import type { Post, BlogPost, UserPost } from '@/types/post';

export type PostCardVariant = 'feed' | 'home' | 'profile';

type PostCardProps =
  | { variant?: 'feed'; post: Post }
  | {
      variant: 'home';
      post: BlogPost;
      postUrlPrefix?: string;
      authorUrlPrefix?: string;
    }
  | { variant: 'profile'; post: UserPost };

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function PostCard(props: PostCardProps) {
  if (props.variant === 'profile') {
    const { post } = props;
    return (
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="info">{post.category}</Badge>
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
            <PostEngagementStats views={post.views} likes={post.likes} />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.date)}
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

  if (props.variant === 'home') {
    const { post, postUrlPrefix = '/post', authorUrlPrefix = '/user' } = props;

    return (
      <article className="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-600">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="info">{post.category}</Badge>
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
              <UserAvatar name={post.author} size="sm" />
              <div>
                <Link
                  href={`${authorUrlPrefix}/${post.authorId}`}
                  className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {post.author}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(post.date)}
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
  }

  const { post } = props;
  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="info">{post.category}</Badge>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link href={`/post/${post._id}`}>{post.title}</Link>
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-gray-400">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserAvatar name={post.authorName || post.authorId} size="sm" />
            <div>
              <Link
                href={`/user/${post.authorId}`}
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {post.authorName || post.authorId}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <Link
            href={`/post/${post._id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm group-hover:translate-x-1 transition-transform"
          >
            Read more →
          </Link>
        </div>
        <div className="pt-5 mt-5 border-t border-gray-200 dark:border-gray-700">
          <PostEngagementStats views={post.views} likes={post.likes} />
        </div>
      </div>
    </article>
  );
}

export function mapPostsForProfile(posts: Post[]): UserPost[] {
  return posts.map((post) => ({
    id: post._id,
    title: post.title,
    excerpt: post.excerpt,
    date: post.createdAt,
    readTime: '5 min read',
    category: post.category,
    views: post.views || 0,
    likes: post.likes || 0,
  }));
}
