import Hero from "@/components/pages/home/hero";
import LatestPosts from "@/components/pages/home/latest-posts";
import AboutBlog from "@/components/pages/about/about-blog";
import LatestUsers from "@/components/pages/home/latest-users";

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
