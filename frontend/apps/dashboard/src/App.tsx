import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from '@repo/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/auth-provider';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPage from '@/pages/DashboardPage';
import PostsPage from '@/pages/PostsPage';
import CreatePostPage from '@/pages/CreatePostPage';
import EditPostPage from '@/pages/EditPostPage';
import UsersPage from '@/pages/UsersPage';
import CreateUserPage from '@/pages/CreateUserPage';
import EditUserPage from '@/pages/EditUserPage';
import CommentsPage from '@/pages/CommentsPage';

const WEB_LOGIN_URL =
  import.meta.env.VITE_WEB_URL || 'http://localhost:3000';

function LoginRedirectPage() {
  useEffect(() => {
    window.location.href = `${WEB_LOGIN_URL}/auth/login`;
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">
        Redirecting to login...
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!accessToken || (user && user.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRedirectPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="posts/create" element={<CreatePostPage />} />
        <Route path="posts/edit/:id" element={<EditPostPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/create" element={<CreateUserPage />} />
        <Route path="users/edit/:id" element={<EditUserPage />} />
        <Route path="comments" element={<CommentsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
