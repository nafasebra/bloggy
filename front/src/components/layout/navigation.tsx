"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import ThemeButton from "../shared/theme-button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // TODO: Implement user authentication logic

  const changeMenuState = useCallback((state: boolean) => {
    setIsMenuOpen(state);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <ThemeButton />
              {!isLoggedIn ? (
                <>
                  <Button onClick={() => setIsLoggedIn(true)}>Login</Button>
                  <Link href="/auth/signup">
                    <Button variant={"outline"}>Sign Up</Button>
                  </Link>
                </>
              ) : (
                <Link
                  href="/user/1"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  My Account
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeButton />
            <Sheet open={isMenuOpen} onOpenChange={changeMenuState}>
              <SheetTrigger asChild>
                <Button variant={"outline"}>
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
                <nav className="px-4 flex flex-col gap-3 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                        pathname === item.href
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="flex flex-col space-y-3 pt-4">
                    {!isLoggedIn ? (
                      <>
                        <Button
                          onClick={() => {
                            setIsLoggedIn(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full"
                        >
                          Login
                        </Button>
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Button variant="outline" className="w-full">
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href="/user/1" onClick={() => setIsMenuOpen(false)}>
                        <Button>My Account</Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
