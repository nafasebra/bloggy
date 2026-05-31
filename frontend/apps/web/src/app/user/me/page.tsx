'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu';
import { Button } from '@repo/ui/button';
import { MoreVertical, XSquare } from 'lucide-react';
import { useAuth } from '@/contexts/auth-provider';
import { useCurrentUserQuery, useUserMePostsQuery } from '@/hooks/query';
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
} from '@repo/ui/alert-dialog';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import FollowerList from '@/components/pages/user/follower-list';
import FollowingList from '@/components/pages/user/following-list';
import { UserProfileHeader } from '@/components/pages/user/user-profile-header';
import { UserStatsBar } from '@/components/pages/user/user-stats-bar';
import { UserProfileSkeleton } from '@/components/ui/skeletons/user-profile-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PostCard, mapPostsForProfile } from '@/components/shared/post-card';

export default function UserPage() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const { data: userData, isLoading: isLoadingUser } = useCurrentUserQuery();
  const { data: postsData, isLoading: isLoadingPosts } = useUserMePostsQuery(
    user?._id
  );

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoadingUser) {
    return <UserProfileSkeleton />;
  }

  if (!userData) {
    notFound();
  }

  const posts = mapPostsForProfile(postsData || []);

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

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <UserProfileHeader user={userData} />
          <UserStatsBar
            postsCount={userData.postIds?.length || 0}
            followersCount={userData.followers || 0}
            followingCount={userData.following || 0}
            actions={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <MoreVertical />
                    <span>Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/user/me/edit">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuLabel>
                    <Link href="/auth/change-password">Change Password</Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowLogoutDialog(true)}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="space-y-4 pt-6">
              {isLoadingPosts ? (
                <div>Loading posts...</div>
              ) : posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} variant="profile" post={post} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<XSquare className="w-8 h-8 text-gray-400" />}
                  title="No posts yet"
                  description={`${userData.name} hasn't published any articles yet.`}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="followers">
            <FollowerList userId={userData._id} />
          </TabsContent>
          <TabsContent value="following">
            <FollowingList userId={userData._id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
