import { Clock } from 'lucide-react';
import { Button } from '@repo/ui/button';

const WEB_URL = import.meta.env.VITE_WEB_URL || 'http://localhost:3000';

export default function RateLimitedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border bg-card px-8 py-10 text-center shadow-lg">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Clock className="size-7" aria-hidden />
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          Too many requests
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You have sent too many requests in a short time. Please wait about a
          minute before using the site again.
        </p>

        <Button asChild className="mt-8">
          <a href={WEB_URL}>Back to website</a>
        </Button>
      </div>
    </div>
  );
}
