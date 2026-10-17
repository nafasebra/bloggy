import { RouterProvider } from 'react-router';
import { router } from '@/app/router';
import { AuthProvider } from '@/features/auth/auth-provider';
import { Toaster } from '@repo/ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/app/query-client';
import { TestFeatureBanner } from '@repo/feature-flags/react';
import http from '@repo/http-client/dashboard';
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TestFeatureBanner client={http} />
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
