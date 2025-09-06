import Link from "next/link";
import { notFound } from "next/navigation";
import UserPostCard from "@/components/pages/user/user-post-card";
import FollowButton from "@/components/pages/user/follow-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowerList from "@/components/pages/user/follower-list";
import FollowingList from "@/components/pages/user/following-list";

// Mock user data
const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    bio: "Tech enthusiast and web developer passionate about creating meaningful digital experiences. I love exploring new technologies and sharing my knowledge with the community. When I'm not coding, you can find me hiking in the mountains or reading sci-fi novels.",
    avatar: "SJ",
    location: "San Francisco, CA",
    website: "https://sarahjohnson.dev",
    twitter: "@sarahjohnson",
    postsCount: 24,
    followers: 1200,
    following: 350,
    category: "Technology",
    joinDate: "2023-03-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    bio: "Mindfulness coach helping people find balance in their busy lives through simple practices. I believe that everyone deserves to live a life of peace and purpose. My approach combines ancient wisdom with modern psychology.",
    avatar: "MC",
    location: "Portland, OR",
    website: "https://mindfulmichael.com",
    twitter: "@mindfulmichael",
    postsCount: 18,
    followers: 890,
    following: 120,
    category: "Lifestyle",
    joinDate: "2023-06-22",
  },
  {
    id: 3,
    name: "Emma Davis",
    bio: "Food blogger and sustainability advocate sharing recipes that are good for you and the planet. I believe that cooking should be both delicious and environmentally conscious. Join me on a journey to sustainable eating!",
    avatar: "ED",
    location: "Austin, TX",
    website: "https://sustainablekitchen.com",
    twitter: "@sustainableemma",
    postsCount: 32,
    followers: 2100,
    following: 450,
    category: "Food",
    joinDate: "2023-01-10",
  },
];

// Mock user posts
const userPosts = {
  1: [
    {
      id: 1,
      title: "The Future of Web Development in 2024",
      excerpt:
        "Exploring the latest trends and technologies that are shaping the future of web development...",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Technology",
      views: 1250,
      likes: 89,
    },
    {
      id: 5,
      title: "Building Scalable APIs with Node.js",
      excerpt:
        "A comprehensive guide to designing and implementing robust, scalable APIs...",
      date: "2024-01-11",
      readTime: "15 min read",
      category: "Technology",
      views: 890,
      likes: 67,
    },
    {
      id: 7,
      title: "React Performance Optimization Techniques",
      excerpt:
        "Learn the best practices for optimizing React applications for better performance...",
      date: "2024-01-08",
      readTime: "12 min read",
      category: "Technology",
      views: 1100,
      likes: 78,
    },
  ],
  2: [
    {
      id: 2,
      title: "Mindful Living: A Beginner's Guide",
      excerpt:
        "Discover simple practices to bring mindfulness into your daily routine...",
      date: "2024-01-14",
      readTime: "8 min read",
      category: "Lifestyle",
      views: 950,
      likes: 72,
    },
    {
      id: 8,
      title: "Morning Routines for Better Mental Health",
      excerpt: "Start your day right with these proven morning practices...",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "Lifestyle",
      views: 680,
      likes: 45,
    },
  ],
  3: [
    {
      id: 3,
      title: "Sustainable Cooking: Recipes for a Better Planet",
      excerpt:
        "Learn how to cook delicious meals while reducing your environmental impact...",
      date: "2024-01-13",
      readTime: "12 min read",
      category: "Food",
      views: 1400,
      likes: 95,
    },
    {
      id: 9,
      title: "Zero-Waste Kitchen: Tips and Tricks",
      excerpt:
        "Transform your kitchen into a zero-waste haven with these practical tips...",
      date: "2024-01-02",
      readTime: "10 min read",
      category: "Food",
      views: 1200,
      likes: 88,
    },
  ],
};

interface UserPageProps {
  params: {
    id: string;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const user = users.find((u) => u.id === parseInt(params.id));

  if (!user) {
    notFound();
  }

  const posts = userPosts[user.id as keyof typeof userPosts] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl font-bold">
                {user.avatar}
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {user.bio}
              </p>

              <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Joined{" "}
                    {new Date(user.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Website
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={`https://twitter.com/${user.twitter.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    {user.twitter}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center space-x-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.postsCount}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Posts
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.followers}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Followers
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.following}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Following
              </div>
            </div>
            {/* Follow/Following Button */}
            <FollowButton userId={"user"} initialFollowing={false} />
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="space-y-4 pt-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Posts by {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {posts.length} article{posts.length !== 1 ? "s" : ""}{" "}
                  published
                </p>
              </div>

              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <UserPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.name} hasn't published any articles yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="followers">
            <FollowerList />
          </TabsContent>
          <TabsContent value="following">
            <FollowingList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
