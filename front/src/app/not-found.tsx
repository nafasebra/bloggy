'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Search, BookOpen, Users } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <section className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 select-none">
              404
            </h1>
            
            {/* Floating Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-bounce delay-100">
                <BookOpen className="w-8 h-8 text-blue-500 dark:text-blue-400 opacity-70" />
              </div>
            </div>
            <div className="absolute top-1/4 left-1/4 animate-pulse delay-300">
              <Search className="w-6 h-6 text-purple-500 dark:text-purple-400 opacity-60" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-bounce delay-500">
              <Users className="w-7 h-7 text-indigo-500 dark:text-indigo-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center sm:items-center">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
