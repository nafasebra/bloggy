'use client';

import { notFound } from 'next/navigation';
import FollowButton from '@/components/pages/user/follow-button';
import { XSquare } from 'lucide-react';
import { useAuth } from '@/contexts/auth-provider';
import { useParams } from 'next/navigation';
import {
  useUserQuery,
  useUserPostsQuery,
  useFollowerCountQuery,
  useFollowingCountQuery,
} from '@/hooks/query';
import { UserProfileHeader } from '@/components/pages/user/user-profile-header';
import { UserStatsBar } from '@/components/pages/user/user-stats-bar';
import { UserProfileSkeleton } from '@/components/ui/skeletons/user-profile-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PostCard, mapPostsForProfile } from '@/components/shared/post-card';

export default function UserPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data: userData, isLoading: isLoadingUser } = useUserQuery(id);
  const { data: postsData, isLoading: isLoadingPosts } = useUserPostsQuery(
    id,
    !!user?._id
  );
  const { data: followerCountData } = useFollowerCountQuery(id);
  const { data: followingCountData } = useFollowingCountQuery(id);

  if (isLoadingUser) {
    return <UserProfileSkeleton />;
  }

  if (!userData) {
    notFound();
  }

  const posts = mapPostsForProfile(postsData || []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <UserProfileHeader user={userData} />
          <UserStatsBar
            postsCount={userData.postIds?.length || 0}
            followersCount={followerCountData?.count || 0}
            followingCount={followingCountData?.count || 0}
            actions={
              <FollowButton userId={userData._id} initialFollowing={false} />
            }
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
      </div>
    </div>
  );
}
