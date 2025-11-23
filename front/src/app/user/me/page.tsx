'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import UserPostCard from '@/components/pages/user/user-post-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LocateIcon, MoreVertical, XSquare } from 'lucide-react';
import { UserService } from '@/services/user.services';
import { PostService } from '@/services/post.services';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-provider';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export default function UserPage() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user, accessToken, logout } = useAuth();
  const router = useRouter();

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user-me'],
    queryFn: () => UserService.getCurrentUser(accessToken as string),
  });

  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['user-posts'],
    queryFn: () => PostService.getPostsByUserId(user?._id as string),
    enabled: !!accessToken,
  });

  const handleLogout = () => {
    logout(); // Clears auth state
    router.push('/'); // Redirect to home page
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Skeleton Avatar */}
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
              {/* Skeleton Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                <div className="flex space-x-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                </div>
              </div>
            </div>
            {/* Skeleton Stats */}
            <div className="flex flex-wrap items-center space-x-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mx-auto"></div>
              </div>
              <div className="text-center">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mx-auto"></div>
              </div>
              <div className="text-center">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Skeleton Posts Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3 mb-4"></div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    notFound();
  }

  const posts =
    postsData?.map((post) => ({
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
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to log in again to
              access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
                    <LocateIcon />
                    <span>{userData.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <LocateIcon />
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
            {/* <div className="text-center">
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
            </div> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'}>
                  <MoreVertical />
                  <span>Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={'/user/me/edit'}>Edit Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuLabel>
                  <Link href={'/auth/change-password'}>Change Password</Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowLogoutDialog(true)}>
                  Logout
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4 pt-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Posts by {userData.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {posts.length} article{posts.length !== 1 ? 's' : ''} published
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
                <XSquare />
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
        {/* <Tabs defaultValue="posts" className="w-full">
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
                    <XSquare />
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
        </Tabs> */}
      </div>
    </div>
  );
}
