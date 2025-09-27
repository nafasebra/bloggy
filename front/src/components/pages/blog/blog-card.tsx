import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  authorId: number;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {post.readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link href={`/post/${post.id}`}>{post.title}</Link>
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
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
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {post.author.charAt(0)}
              </span>
            </div>
            <div>
              <Link
                href={`/user/${post.authorId}`}
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
            href={`/post/${post.id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm group-hover:translate-x-1 transition-transform"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
