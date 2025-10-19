'use client';

import { AuthProvider } from '@/contexts/auth-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import Footer from './layout/footer';
import Navigation from './layout/navigation';
import { usePathname } from 'next/navigation';
import { Toaster } from './ui/sonner';

const queryClient = new QueryClient();

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {!isDashboard && <Navigation />}
          <main>{children}</main>
        </AuthProvider>
      </QueryClientProvider>
      <Footer />
    </>
  );
}

export default Wrapper;
