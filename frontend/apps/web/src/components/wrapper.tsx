'use client';

import { AuthProvider } from '@/contexts/auth-provider';
import { SocketProvider } from '@/contexts/socket-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import Footer from './layout/footer';
import Navigation from './layout/navigation';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider>
            {!isDashboard && <Navigation />}
            <main>{children}</main>
          </SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Footer />
      <Toaster />
    </>
  );
}

export default Wrapper;
