'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@repo/ui/input';
import { Button } from '@repo/ui/button';

export default function SearchBar({}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentQuery = searchParams.get('q') || '';
  const [value, setValue] = useState(currentQuery);

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value && value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="relative">
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search articles by title..."
          className="pl-9 pr-9"
          leftIcon={<Search className="h-5 w-5" />}
        />
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-0 top-1/2 -translate-y-1/2 size-8"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </Button>
        ) : null}
      </div>
    </form>
  );
}
