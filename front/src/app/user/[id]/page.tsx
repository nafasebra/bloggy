'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import UserPostCard from '@/components/pages/user/user-post-card';
import FollowButton from '@/components/pages/user/follow-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FollowerList from '@/components/pages/user/follower-list';
import FollowingList from '@/components/pages/user/following-list';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { UserService } from '@/services/user.services';
import { PostService } from '@/services/post.services';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-provider';
import { useParams } from 'next/navigation';

export default function UserPage() {
  const { accessToken } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: () => UserService.getUserById(id),
    enabled: !!accessToken,
  });

  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['user-posts', id],
    queryFn: () => PostService.getPostsByUserId(id),
    enabled: !!accessToken,
  });

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    notFound();
  }

  const posts = postsData?.map((post) => ({
    id: post._id,
    title: post.title,
    excerpt: post.excerpt,
    date: post.createdAt,
    readTime: '5 min read', // placeholder
    category: post.category,
    views: post.views || 0,
    likes: post.likes || 0,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl font-bold">
                {userData.avatar || userData.name.charAt(0)}
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {userData.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {userData.bio || 'No bio available.'}
              </p>

              <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                {userData.location && (
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
                    <span>{userData.location}</span>
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
                    Joined{' '}
                    {new Date(userData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {userData.website && (
                  <a
                    href={userData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Website
                  </a>
                )}
                {userData.twitter && (
                  <a
                    href={`https://twitter.com/${userData.twitter.replace(
                      '@',
                      ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    {userData.twitter}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center space-x-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.postIds?.length || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Posts
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.followers || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Followers
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.following || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Following
              </div>
            </div>
            {/* Follow/Following Button */}
            <FollowButton userId={userData._id} initialFollowing={false} />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={'ghost'}>
                  <MoreVertical />
                  <span>Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <Link href={'/auth/change-password'}>Change Password</Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  Posts by {userData.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {posts.length} article{posts.length !== 1 ? 's' : ''}{' '}
                  published
                </p>
              </div>

              {isLoadingPosts ? (
                <div>Loading posts...</div>
              ) : posts.length > 0 ? (
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
                    {userData.name} hasn't published any articles yet.
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
