import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Button } from '@repo/ui/button';

export default function RateLimitedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-8 py-10 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Clock className="size-7" aria-hidden />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Too many requests
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          You have sent too many requests in a short time. Please wait about a
          minute before using the site again.
        </p>

        <Button asChild className="mt-8">
          <Link href="/">Back to Bloggy</Link>
        </Button>
      </div>
    </div>
  );
}
