'use client';

import { AuthProvider } from '@/features/auth/providers/auth-provider';
import { SocketProvider } from '@/features/notifications/providers/socket-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import Footer from '@/app/_components/footer';
import Navigation from '@/app/_components/navigation';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Toaster } from '@repo/ui/sonner';
import { TestFeatureBanner } from '@repo/feature-flags/react';
import http from '@repo/http-client/web';

const queryClient = new QueryClient();
const RATE_LIMIT_PATH = '/rate-limited';

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps) {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const isRateLimitedPage = pathname === RATE_LIMIT_PATH;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {!isRateLimitedPage && <TestFeatureBanner client={http} />}
        <AuthProvider>
          <SocketProvider>
            {!isRateLimitedPage && <Navigation />}
            <main>{children}</main>
          </SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
      {!isRateLimitedPage && <Footer />}
      <Toaster theme={resolvedTheme as 'light' | 'dark' | 'system'} />
    </>
  );
}

export default Wrapper;
