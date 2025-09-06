import Link from "next/link";
import Hero from "@/components/pages/home/hero";
import LatestPosts from "@/components/pages/home/latest-posts";
import AboutBlog from "@/components/pages/about/about-blog";
import LatestUsers from "@/components/pages/home/latest-users";
import Footer from "@/components/layout/footer";

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
