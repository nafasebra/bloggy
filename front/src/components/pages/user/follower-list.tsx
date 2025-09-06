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
    users?: User[];
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
    <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Followers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mockUsers.map((user) => (
                <div
                    key={user.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                                {user.avatar}
                            </span>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            <Link
                                href={`/user/${user.id}`}
                                className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                                {user.name}
                            </Link>
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {user.bio}
                    </p>
                </div>
            ))}
        </div>
    </div>
);

export default FollowerList;