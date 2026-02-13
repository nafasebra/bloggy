'use client';

import { AuthProvider } from '@/contexts/auth-provider';
import { SocketProvider } from '@/contexts/socket-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import Footer from './layout/footer';
import Navigation from './layout/navigation';
import { useTheme } from 'next-themes';
import { Toaster } from '@repo/ui/sonner';

const queryClient = new QueryClient();

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps) {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider>
            <Navigation />
            <main>{children}</main>
          </SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Footer />
      <Toaster theme={resolvedTheme as 'light' | 'dark' | 'system'} />
    </>
  );
}

export default Wrapper;
