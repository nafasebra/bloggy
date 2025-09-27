'use client';

import { AuthProvider } from '@/contexts/auth-provider';
import React from 'react';
import Footer from './layout/footer';
import Navigation from './layout/navigation';
import { usePathname } from 'next/navigation';

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      <AuthProvider>
        {!isDashboard && <Navigation />}
        <main>{children}</main>
      </AuthProvider>
      <Footer />
    </>
  );
}

export default Wrapper;
