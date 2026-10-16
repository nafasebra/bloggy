import { RouterProvider } from 'react-router';
import { router } from '@/app/router';
import { AuthProvider } from '@/features/auth/auth-provider';
import { Toaster } from '@repo/ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/app/query-client';
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
