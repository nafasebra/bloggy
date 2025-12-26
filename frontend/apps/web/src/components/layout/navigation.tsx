'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { Button } from '../ui/button';
import ThemeButton from '../shared/theme-button';
import NotificationButton from '../shared/notification-button';
import { Menu, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth-provider';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { accessToken, user } = useAuth();

  const changeMenuState = useCallback((state: boolean) => {
    setIsMenuOpen(state);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Bloggy
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {accessToken && <NotificationButton />}
          <ThemeButton />
          <div className="flex items-center gap-4">
            {!accessToken && (
              <>
                <Link href="/auth/login">
                  <Button>Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant={'outline'}>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          {!accessToken ? (
            <div className="md:hidden flex">
              <Sheet open={isMenuOpen} onOpenChange={changeMenuState}>
                <SheetTrigger asChild>
                  <Button variant={'outline'}>
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
                >
                  <SheetHeader className="pb-4">
                    <SheetTitle className="text-left text-lg font-semibold text-gray-900 dark:text-white">
                      Bloggy
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="px-4 flex flex-col gap-3 mt-4 space-y-3 pt-4">
                    <Link href="/auth/login">
                      <Button
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <Link href={`/user/me`}>
              <Button>
                <User />
                <span className="hidden md:flex">My Account</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
