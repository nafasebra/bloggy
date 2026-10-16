import type { Metadata } from 'next';
import Hero from '@/features/home/components/hero';
import LatestPosts from '@/features/home/components/latest-posts';
import AboutBlog from '@/features/home/components/about-blog';
import LatestUsers from '@/features/home/components/latest-users';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to Bloggy – discover inspiring stories, insightful articles, and connect with a community of passionate writers.',
  openGraph: {
    title: 'Bloggy - Modern Blog Platform',
    description:
      'Welcome to Bloggy – discover inspiring stories, insightful articles, and connect with a community of passionate writers.',
    url: '/',
  },
  twitter: {
    title: 'Bloggy - Modern Blog Platform',
    description:
      'Welcome to Bloggy – discover inspiring stories, insightful articles, and connect with a community of passionate writers.',
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <LatestPosts />
      <AboutBlog />
      <LatestUsers />
    </>
  );
}
