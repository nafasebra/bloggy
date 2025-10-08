'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import {categories} from '@/data';

const CategoryButtons: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedCategory = searchParams.get('category');

    const handleCategoryClick = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedCategory === category) {
            // If clicking the same category, remove the filter
            params.delete('category');
        } else {
            // Set the new category filter
            params.set('category', category);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryButtons;
