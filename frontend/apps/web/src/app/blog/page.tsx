import type { Metadata } from 'next';
import Link from 'next/link';
import SearchBar from '@/components/shared/search-bar';
import { PostCard } from '@/components/shared/post-card';
import { EmptyState } from '@/components/ui/empty-state';
import CategoryButtons from '@/components/pages/blog/category-buttons';
import { serverGet } from '@/lib/http';
import type { Post } from '@/types/post';
import { Plus, Search } from 'lucide-react';
import { Button } from '@repo/ui/button';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Discover stories, insights, and knowledge from our community of writers.',
  openGraph: {
    title: 'Blog | Bloggy',
    description:
      'Discover stories, insights, and knowledge from our community of writers.',
    url: '/blog',
  },
  twitter: {
    title: 'Blog | Bloggy',
    description:
      'Discover stories, insights, and knowledge from our community of writers.',
  },
};

async function getAllPosts(query: string) {
  try {
    if (query && query.trim()) {
      return await serverGet<Post[]>('/posts/search', { query: query.trim() });
    }
    return await serverGet<Post[]>('/posts');
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q: query = '', category: selectedCategory = '' } = await searchParams;
  let postData = await getAllPosts(query);

  if (selectedCategory) {
    postData = postData.filter(
      (post: Post) => post.category === selectedCategory
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-left space-y-5">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Discover stories, insights, and knowledge from our community of
              writers
            </p>
          </div>
          <Button asChild>
            <Link href="/blog/new" className="flex items-center gap-3">
              <Plus />
              Create New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <SearchBar />

            <CategoryButtons />
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {postData.length > 0 ? (
          <>
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {postData.length} article
                {postData.length !== 1 ? 's' : ''}
                {query && ` for "${query}"`}
                {selectedCategory && ` in ${selectedCategory}`}
                {(query || selectedCategory) && ' • '}
                {(query || selectedCategory) && (
                  <Link
                    href="/blog"
                    className="px-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Clear filters
                  </Link>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postData.map((post: Post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={<Search className="w-12 h-12 text-gray-400" />}
            title={
              query || selectedCategory
                ? 'No articles found'
                : 'No articles available'
            }
            description={
              query && selectedCategory
                ? `No articles found for "${query}" in ${selectedCategory} category.`
                : query
                  ? `No articles found for "${query}". Try different search terms.`
                  : selectedCategory
                    ? `No articles found in ${selectedCategory} category.`
                    : 'There are no articles to display yet. Be the first to create one!'
            }
            iconWrapperClassName="w-24 h-24"
            action={
              (query || selectedCategory) && (
                <Link
                  href="/blog"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Clear filters
                </Link>
              )
            }
          />
        )}
      </div>
    </div>
  );
}
