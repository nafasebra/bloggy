import type { Metadata } from 'next';
import Hero from '@/components/pages/home/hero';
import LatestPosts from '@/components/pages/home/latest-posts';
import AboutBlog from '@/components/pages/home/about-blog';
import LatestUsers from '@/components/pages/home/latest-users';

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
