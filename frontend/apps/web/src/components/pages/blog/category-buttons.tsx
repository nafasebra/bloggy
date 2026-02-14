'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { categories } from '@/data';
import { Button } from '@repo/ui/button';

const CategoryButtons: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get('category');

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategory === category) {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          type="button"
          variant={selectedCategory === category ? 'default' : 'secondary'}
          size="sm"
          onClick={() => handleCategoryClick(category)}
          className={
            selectedCategory === category
              ? 'rounded-full'
              : 'rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryButtons;
