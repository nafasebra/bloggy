'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/pages/home/search-bar';
import BlogCard from '@/components/pages/blog/blog-card';

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: 'The Future of Web Development in 2024',
    excerpt:
      'Exploring the latest trends and technologies that are shaping the future of web development, from AI-powered tools to new frameworks and methodologies.',
    author: 'Sarah Johnson',
    authorId: 1,
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Technology',
    tags: ['Web Development', 'AI', 'Frameworks'],
  },
  {
    id: 2,
    title: "Mindful Living: A Beginner's Guide",
    excerpt:
      'Discover simple practices to bring mindfulness into your daily routine and improve your well-being through meditation and conscious living.',
    author: 'Michael Chen',
    authorId: 2,
    date: '2024-01-14',
    readTime: '8 min read',
    category: 'Lifestyle',
    tags: ['Mindfulness', 'Meditation', 'Wellness'],
  },
  {
    id: 3,
    title: 'Sustainable Cooking: Recipes for a Better Planet',
    excerpt:
      'Learn how to cook delicious meals while reducing your environmental impact. From farm-to-table recipes to zero-waste cooking techniques.',
    author: 'Emma Davis',
    authorId: 3,
    date: '2024-01-13',
    readTime: '12 min read',
    category: 'Food',
    tags: ['Sustainability', 'Cooking', 'Environment'],
  },
  {
    id: 4,
    title: 'The Art of Travel Photography',
    excerpt:
      'Master the techniques of capturing stunning travel photos that tell stories and preserve memories of your adventures around the world.',
    author: 'Alex Rodriguez',
    authorId: 4,
    date: '2024-01-12',
    readTime: '10 min read',
    category: 'Travel',
    tags: ['Photography', 'Travel', 'Art'],
  },
  {
    id: 5,
    title: 'Building Scalable APIs with Node.js',
    excerpt:
      'A comprehensive guide to designing and implementing robust, scalable APIs using Node.js and modern development practices.',
    author: 'David Kim',
    authorId: 5,
    date: '2024-01-11',
    readTime: '15 min read',
    category: 'Technology',
    tags: ['Node.js', 'API', 'Backend'],
  },
  {
    id: 6,
    title: 'Digital Nomad Lifestyle: Tips and Tricks',
    excerpt:
      'Everything you need to know about working remotely while traveling the world, from productivity tips to finding the best coworking spaces.',
    author: 'Lisa Wang',
    authorId: 6,
    date: '2024-01-10',
    readTime: '9 min read',
    category: 'Lifestyle',
    tags: ['Digital Nomad', 'Remote Work', 'Travel'],
  },
];

const categories = [
  'All',
  'Technology',
  'Lifestyle',
  'Food',
  'Travel',
  'Health',
  'Business',
  'Creative',
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Post
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search title, tag or authors..."
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredPosts.length > 0 ? (
          <>
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredPosts.length} of {blogPosts.length} articles
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search terms or browse all categories
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
