import Link from 'next/link';
import Hero from '@/components/Hero';
import LatestPosts from '@/components/LatestPosts';
import AboutBlog from '@/components/AboutBlog';
import LatestUsers from '@/components/LatestUsers';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <LatestPosts />
      <AboutBlog />
      <LatestUsers />
      <Footer />
    </div>
  );
}
