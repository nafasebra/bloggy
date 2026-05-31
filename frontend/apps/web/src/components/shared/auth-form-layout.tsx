import type { ReactNode } from 'react';

interface AuthFormLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthFormLayout({
  title,
  subtitle,
  children,
}: AuthFormLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-8 py-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              {title}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mt-2 text-sm">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
