'use server';

import Link from 'next/link';
import SearchBar from '@/components/pages/home/search-bar';
import BlogCard from '@/components/pages/blog/blog-card';
import CategoryButtons from '@/components/pages/blog/category-buttons';
import http from '@/lib/http';
import { Plus, Search } from 'lucide-react';

async function getAllPosts(query: string) {
  try {
    let response;
    if (query && query.trim()) {
      // Use search endpoint when there's a query
      response = await http.get(`/posts/search`, {
        params: {
          query: query.trim(),
        },
      });
    } else {
      // Use regular posts endpoint when no query
      response = await http.get(`/posts`);
    }
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { q: string; category: string };
}) {
  const query = searchParams.q;
  const selectedCategory = searchParams.category;
  let postData = await getAllPosts(query);

  // Filter by category if selected
  if (selectedCategory) {
    postData = postData.filter((post: any) => post.category === selectedCategory);
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
          <div>
            <Link
              href="/blog/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus />
              Create New Post
            </Link>
          </div>
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
                <Link
                  href="/blog"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Clear filters
                </Link>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postData.map((post: any) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {query || selectedCategory ? 'No articles found' : 'No articles available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {query && selectedCategory
                ? `No articles found for "${query}" in ${selectedCategory} category.`
                : query
                ? `No articles found for "${query}". Try different search terms.`
                : selectedCategory
                ? `No articles found in ${selectedCategory} category.`
                : 'There are no articles to display yet. Be the first to create one!'}
            </p>
            {(query || selectedCategory) && (
              <Link
                href="/blog"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Clear filters
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
