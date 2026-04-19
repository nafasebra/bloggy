import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import DashboardLayout from "./components/layout/DashboardLayout";
import { useAuth } from "@/contexts/auth-provider";
import RouteError from "./components/RouteError";

const LazyWrapper = lazy(() => import("./components/LazyWrapper"));

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PostsPage = lazy(() => import("./pages/post/PostsPage"));
const CreatePostPage = lazy(() => import("./pages/post/CreatePostPage"));
const EditPostPage = lazy(() => import("./pages/post/EditPostPage"));
const UsersPage = lazy(() => import("./pages/user/UsersPage"));
const CreateUserPage = lazy(() => import("./pages/user/CreateUserPage"));
const EditUserPage = lazy(() => import("./pages/user/EditUserPage"));
const CommentsPage = lazy(() => import("./pages/comment/CommentsPage"));

const WEB_LOGIN_URL =
  import.meta.env.VITE_WEB_URL || "http://localhost:3000";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !user._id) {
    window.location.href = `${WEB_LOGIN_URL}/auth/login`;
    return null;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
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
        path: "posts",
        element: (
          <LazyWrapper>
            <PostsPage />
          </LazyWrapper>
        ),
      },
      {
        path: "posts/create",
        element: (
          <LazyWrapper>
            <CreatePostPage />
          </LazyWrapper>
        ),
      },
      {
        path: "posts/edit/:id",
        element: (
          <LazyWrapper>
            <EditPostPage />
          </LazyWrapper>
        ),
      },
      {
        path: "users",
        element: (
          <LazyWrapper>
            <UsersPage />
          </LazyWrapper>
        ),
      },
      {
        path: "users/create",
        element: (
          <LazyWrapper>
            <CreateUserPage />
          </LazyWrapper>
        ),
      },
      {
        path: "users/edit/:id",
        element: (
          <LazyWrapper>
            <EditUserPage />
          </LazyWrapper>
        ),
      },
      {
        path: "comments",
        element: (
          <LazyWrapper>
            <CommentsPage />
          </LazyWrapper>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
