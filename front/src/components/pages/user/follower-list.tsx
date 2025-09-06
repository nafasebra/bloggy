import React from "react";
import Link from "next/link";

type User = {
    id: string;
    avatar: string;
    name: string;
    bio: string;
    postsCount: number;
    followers: number;
    category: string;
};

type FollowerListProps = {
    users: User[];
};

const mockUsers: User[] = [
    {
        id: "1",
        avatar: "🧑",
        name: "Alice Johnson",
        bio: "Frontend developer and coffee enthusiast.",
        postsCount: 34,
        followers: 120,
        category: "Tech",
    },
    {
        id: "2",
        avatar: "👨‍💻",
        name: "Bob Smith",
        bio: "Full-stack engineer. Loves open source.",
        postsCount: 56,
        followers: 210,
        category: "Programming",
    },
    {
        id: "3",
        avatar: "👩‍🎨",
        name: "Carol Lee",
        bio: "Designer and illustrator. Sharing creative ideas.",
        postsCount: 22,
        followers: 98,
        category: "Design",
    },
    {
        id: "4",
        avatar: "🧑‍🚀",
        name: "David Kim",
        bio: "Space enthusiast and science communicator.",
        postsCount: 15,
        followers: 75,
        category: "Science",
    },
    {
        id: "5",
        avatar: "👩‍🍳",
        name: "Eva Brown",
        bio: "Food blogger. Recipes and reviews.",
        postsCount: 40,
        followers: 180,
        category: "Food",
    },
];

const FollowerList: React.FC<FollowerListProps> = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">
            Followers
        </h2>
        <div className="flex flex-col gap-6">
            {mockUsers.map((user) => (
                <div
                    key={user.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-lg font-bold">
                            {user.avatar}
                        </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        <Link
                            href={`/user/${user.id}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {user.name}
                        </Link>
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {user.bio}
                    </p>

                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.postsCount} posts
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.followers} followers
                        </span>
                    </div>

                    <span className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                        {user.category}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

export default FollowerList;