"use server"

import Link from "next/link";
import http from "@/lib/http";

// Mock data for latest users
const mockLatestUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    bio: "Tech enthusiast and web developer passionate about creating meaningful digital experiences.",
    avatar: "SJ",
    postsCount: 24,
    followers: 1200,
    category: "Technology",
  },
  {
    id: 2,
    name: "Michael Chen",
    bio: "Mindfulness coach helping people find balance in their busy lives through simple practices.",
    avatar: "MC",
    postsCount: 18,
    followers: 890,
    category: "Lifestyle",
  },
  {
    id: 3,
    name: "Emma Davis",
    bio: "Food blogger and sustainability advocate sharing recipes that are good for you and the planet.",
    avatar: "ED",
    postsCount: 32,
    followers: 2100,
    category: "Food",
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    bio: "Travel photographer capturing the world's most beautiful moments and sharing stories from the road.",
    avatar: "AR",
    postsCount: 15,
    followers: 750,
    category: "Travel",
  },
];

async function getLatestUsers() {
  try {
    const response = await http.get(`/users`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch latest users");
  }
}

export default async function LatestUsers() {
  const latestUsers = await getLatestUsers();

  console.log(latestUsers);

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Writers
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover talented authors sharing their unique perspectives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockLatestUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-lg font-bold">
                  {user.avatar}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                <Link
                  href={`/user/${user.id}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {user.name}
                </Link>
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {user.bio}
              </p>

              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user.postsCount} posts
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user.followers} followers
                </span>
              </div>

              <span className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                {user.category}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Discover More Writers
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
