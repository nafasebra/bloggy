import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import DashboardLayout from '@/app/layout/DashboardLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import RouteError from '@/shared/components/RouteError';

const LazyWrapper = lazy(() => import('@/shared/components/LazyWrapper'));

const DashboardPage = lazy(
  () => import('@/features/overview/pages/DashboardPage')
);
const PostsPage = lazy(() => import('@/features/posts/pages/PostsPage'));
const CreatePostPage = lazy(
  () => import('@/features/posts/pages/CreatePostPage')
);
const EditPostPage = lazy(() => import('@/features/posts/pages/EditPostPage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const CreateUserPage = lazy(
  () => import('@/features/users/pages/CreateUserPage')
);
const EditUserPage = lazy(() => import('@/features/users/pages/EditUserPage'));
const CommentsPage = lazy(
  () => import('@/features/comments/pages/CommentsPage')
);
const RateLimitedPage = lazy(() => import('@/shared/pages/RateLimitedPage'));

export const router = createBrowserRouter([
  {
    path: '/rate-limited',
    element: (
      <LazyWrapper>
        <RateLimitedPage />
      </LazyWrapper>
    ),
  },
  {
    path: '/',
    errorElement: <RouteError />,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <DashboardPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'posts',
        element: (
          <LazyWrapper>
            <PostsPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'posts/create',
        element: (
          <LazyWrapper>
            <CreatePostPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'posts/edit/:id',
        element: (
          <LazyWrapper>
            <EditPostPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <LazyWrapper>
            <UsersPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'users/create',
        element: (
          <LazyWrapper>
            <CreateUserPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'users/edit/:id',
        element: (
          <LazyWrapper>
            <EditUserPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'comments',
        element: (
          <LazyWrapper>
            <CommentsPage />
          </LazyWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
