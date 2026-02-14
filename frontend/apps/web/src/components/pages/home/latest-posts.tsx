'use server';

import Link from 'next/link';
import http from '@/lib/http';
import BlogCard from '@/components/shared/blog-card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@repo/ui/button';

// Mock data for latest posts
const mockLatestPosts = [
  {
    id: 1,
    title: 'The Future of Web Development in 2024',
    excerpt:
      'Exploring the latest trends and technologies that are shaping the future of web development...',
    author: 'Sarah Johnson',
    authorId: 1,
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Technology',
  },
  {
    id: 2,
    title: "Mindful Living: A Beginner's Guide",
    excerpt:
      'Discover simple practices to bring mindfulness into your daily routine and improve your well-being...',
    author: 'Michael Chen',
    authorId: 2,
    date: '2024-01-14',
    readTime: '8 min read',
    category: 'Lifestyle',
  },
  {
    id: 3,
    title: 'Sustainable Cooking: Recipes for a Better Planet',
    excerpt:
      'Learn how to cook delicious meals while reducing your environmental impact...',
    author: 'Emma Davis',
    authorId: 3,
    date: '2024-01-13',
    readTime: '12 min read',
    category: 'Food',
  },
];

async function getLatestPosts() {
  try {
    const response = await http.get(`/posts`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch latest posts');
  }
}

export default async function LatestPosts() {
  // const latestPosts = await getLatestPosts();

  // console.log(latestPosts);

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover the most recent articles from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockLatestPosts.map((post: any) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/blog" className="inline-flex items-center">
              View All Posts
              <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
